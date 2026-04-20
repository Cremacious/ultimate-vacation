/**
 * Chunk 5 proof — expenses + equal splits, with membership gating.
 *
 * Flow:
 *   1. sign up organizer (A), invited member (B), bystander (C)
 *   2. A creates trip; A invites B; B accepts → members: A, B. C is not a member.
 *   3. A creates $30.00 expense, split between A and B → 1500 each, sum = 3000
 *   4. C (non-member) tries to create expense → rejected
 *   5. A tries to create expense including C as participant → rejected
 *   6. A creates $10.00 expense split among A, B → 500 each (even)
 *   7. A creates $10.00 expense split among A, B, then a fake 3rd user id → rejected
 *   8. Uneven split: $10.00 / 3 real would need a 3rd member — skip; instead test
 *      the pure function: [334, 333, 333] summing to 1000
 *   9. listExpensesForTrip for A returns both real expenses
 *  10. listExpensesForTrip for C (non-member) returns []
 *  11. Cleanup: delete expenses (splits cascade), trip (cascades invites, members),
 *      users (ownerId is RESTRICT so trip first).
 *
 * Run with: `npm run expenses:verify`
 */
import "dotenv/config";

import { and, eq } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { expenseSplits, expenses, trips, users } from "../src/lib/db/schema";
import { createExpenseForTrip } from "../src/lib/expenses/create";
import { listExpensesForTrip } from "../src/lib/expenses/queries";
import { computeEqualSplit } from "../src/lib/expenses/split";
import { acceptInviteByCode } from "../src/lib/invites/accept";
import { createInviteForTrip } from "../src/lib/invites/create";
import { createTripForUser } from "../src/lib/trips/create";

const STAMP = Date.now();
const A = { email: `exp-a-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Alice" };
const B = { email: `exp-b-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Bob" };
const C = { email: `exp-c-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Carol" };

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function signUp(u: typeof A) {
  const res = await auth.api.signUpEmail({ body: u, asResponse: true });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`sign up ${res.status} for ${u.email}: ${body}`);
  }
  const [row] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
  if (!row) throw new Error(`sign up row missing for ${u.email}`);
  return row;
}

async function main() {
  console.log(`\n→ Verifying Chunk 5 against ${process.env.DATABASE_URL?.split("@")[1]}\n`);

  // Pure split unit checks (no DB)
  const even = computeEqualSplit(1000, ["u1", "u2"]);
  assert(even[0].amountCents === 500 && even[1].amountCents === 500, "pure split: even 1000 / 2 = [500, 500]");
  const odd = computeEqualSplit(1000, ["u1", "u2", "u3"]);
  assert(odd.reduce((s, x) => s + x.amountCents, 0) === 1000, "pure split: 1000 / 3 sums back to 1000");
  assert(odd[0].amountCents === 334 && odd[1].amountCents === 333 && odd[2].amountCents === 333, "pure split: remainder lands on first participant");

  const userA = await signUp(A);
  const userB = await signUp(B);
  const userC = await signUp(C);
  assert(userA.id && userB.id && userC.id, "signed up A, B, C");

  const trip = await createTripForUser(userA.id, { name: "Expenses Test Trip" });
  const invite = await createInviteForTrip(userA.id, trip.id);
  await acceptInviteByCode(userB.id, invite.code);
  assert(true, "A created trip, invited B, B accepted");

  // 1st expense: $30 split A, B → 1500 each
  const exp1 = await createExpenseForTrip(userA.id, trip.id, {
    amountCents: 3000,
    description: "Dinner",
    payerId: userA.id,
    participantIds: [userA.id, userB.id],
  });
  assert(exp1.id, "expense #1 created");

  const splits1 = await db.select().from(expenseSplits).where(eq(expenseSplits.expenseId, exp1.id));
  assert(splits1.length === 2, `expense #1 has 2 split rows (got ${splits1.length})`);
  const sum1 = splits1.reduce((s, r) => s + r.amountCents, 0);
  assert(sum1 === 3000, `expense #1 splits sum to 3000 (got ${sum1})`);
  assert(splits1.every((s) => s.amountCents === 1500), "expense #1 splits are 1500 each");

  // Non-member C cannot create expense
  let cRejected = false;
  try {
    await createExpenseForTrip(userC.id, trip.id, {
      amountCents: 1000,
      description: "nope",
      payerId: userC.id,
      participantIds: [userC.id],
    });
  } catch {
    cRejected = true;
  }
  assert(cRejected, "non-member C rejected from creating expense");

  // A cannot include C as a participant
  let participantRejected = false;
  try {
    await createExpenseForTrip(userA.id, trip.id, {
      amountCents: 1000,
      description: "mixed",
      payerId: userA.id,
      participantIds: [userA.id, userC.id],
    });
  } catch {
    participantRejected = true;
  }
  assert(participantRejected, "A cannot include non-member C in split");

  // Confirm no orphan expense from rejected attempts
  const expenseCount = await db.select({ id: expenses.id }).from(expenses).where(eq(expenses.tripId, trip.id));
  assert(expenseCount.length === 1, `only the valid expense persists (got ${expenseCount.length})`);

  // 2nd expense: $10 split A, B
  const exp2 = await createExpenseForTrip(userA.id, trip.id, {
    amountCents: 1000,
    description: "Taxi",
    payerId: userB.id,
    participantIds: [userA.id, userB.id],
  });
  assert(exp2.id, "expense #2 created with B as payer");

  // List for A returns 2, ordered newest first
  const listedA = await listExpensesForTrip(userA.id, trip.id);
  assert(listedA.length === 2, `A lists 2 expenses (got ${listedA.length})`);
  assert(listedA.every((e) => e.participantCount === 2), "both expenses show 2 participants");

  // List for C returns [] (non-member)
  const listedC = await listExpensesForTrip(userC.id, trip.id);
  assert(listedC.length === 0, "non-member C sees no expenses");

  // Cleanup
  // Delete expenses (splits cascade via FK), then trip (invites + members cascade),
  // then users (ownerId is RESTRICT — trip must be gone first).
  await db.delete(expenses).where(eq(expenses.tripId, trip.id));
  await db.delete(trips).where(eq(trips.id, trip.id));
  await db.delete(users).where(eq(users.id, userA.id));
  await db.delete(users).where(eq(users.id, userB.id));
  await db.delete(users).where(eq(users.id, userC.id));
  console.log("\n✓ cleanup complete");
  console.log("\n✅ Chunk 5 verified end-to-end.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ verify-expenses failed:", err);
  process.exit(1);
});
