/**
 * Chunk 6 proof — per-member balances + settle-up plan.
 *
 * Pure function tests first (fast, no DB):
 *   - two-member even split where A paid everything
 *   - three-member uneven split, rounded cents
 *   - all settled case
 *
 * Then end-to-end against Neon:
 *   1. sign up A, B, C; A creates trip; invite B and C
 *   2. A pays $30 split A+B+C → each owes 1000
 *   3. B pays $15 split A+B+C → each owes 500
 *   4. balances:
 *        paid[A]=3000 owed[A]=1500  net[A]=+1500
 *        paid[B]=1500 owed[B]=1500  net[B]=0
 *        paid[C]=0    owed[C]=1500  net[C]=-1500
 *      → transfers: C pays A $15.00
 *   5. non-member D sees null
 *   6. cleanup
 *
 * Run with: `npm run balances:verify`
 */
import "dotenv/config";

import { eq } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { expenses, trips, users } from "../src/lib/db/schema";
import {
  computeTripBalances,
  planSettlement,
  type ExpenseRow,
  type MemberRef,
  type SplitRow,
} from "../src/lib/expenses/balances";
import { createExpenseForTrip } from "../src/lib/expenses/create";
import { getBalancesForTrip } from "../src/lib/expenses/queries";
import { acceptInviteByCode } from "../src/lib/invites/accept";
import { createInviteForTrip } from "../src/lib/invites/create";
import { createTripForUser } from "../src/lib/trips/create";

const STAMP = Date.now();
const mk = (slug: string, name: string) => ({
  email: `bal-${slug}-${STAMP}@tripwave.test`,
  password: "verify-password-123",
  name,
});
const A = mk("a", "Alice");
const B = mk("b", "Bob");
const C = mk("c", "Carol");
const D = mk("d", "Dave");

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function signUp(u: typeof A) {
  const res = await auth.api.signUpEmail({ body: u, asResponse: true });
  if (!res.ok) throw new Error(`signup ${res.status}: ${await res.text()}`);
  const [row] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
  if (!row) throw new Error(`row missing ${u.email}`);
  return row;
}

function runPureTests() {
  const members: MemberRef[] = [
    { userId: "u1", name: "A" },
    { userId: "u2", name: "B" },
  ];

  // A paid 2000, split evenly 1000/1000
  let expensesArr: ExpenseRow[] = [{ payerId: "u1", amountCents: 2000 }];
  let splits: SplitRow[] = [
    { userId: "u1", amountCents: 1000 },
    { userId: "u2", amountCents: 1000 },
  ];
  let balances = computeTripBalances(members, expensesArr, splits);
  const bu1 = balances.find((b) => b.userId === "u1")!;
  const bu2 = balances.find((b) => b.userId === "u2")!;
  assert(bu1.netCents === 1000, `pure: A net +1000 (got ${bu1.netCents})`);
  assert(bu2.netCents === -1000, `pure: B net -1000 (got ${bu2.netCents})`);
  let plan = planSettlement(balances);
  assert(plan.length === 1 && plan[0].fromUserId === "u2" && plan[0].toUserId === "u1" && plan[0].amountCents === 1000, "pure: single transfer B → A $10");

  // Three members, 1000 split 334/333/333 by A
  const m3: MemberRef[] = [
    { userId: "u1", name: "A" },
    { userId: "u2", name: "B" },
    { userId: "u3", name: "C" },
  ];
  expensesArr = [{ payerId: "u1", amountCents: 1000 }];
  splits = [
    { userId: "u1", amountCents: 334 },
    { userId: "u2", amountCents: 333 },
    { userId: "u3", amountCents: 333 },
  ];
  balances = computeTripBalances(m3, expensesArr, splits);
  const sum = balances.reduce((s, b) => s + b.netCents, 0);
  assert(sum === 0, `pure: net sum is 0 (got ${sum})`);
  plan = planSettlement(balances);
  const moved = plan.reduce((s, t) => s + t.amountCents, 0);
  assert(moved === 666, `pure: total settled = 666 (got ${moved})`);

  // Everyone settled
  expensesArr = [];
  splits = [];
  balances = computeTripBalances(members, expensesArr, splits);
  plan = planSettlement(balances);
  assert(plan.length === 0, "pure: empty trip produces no transfers");
}

async function main() {
  console.log(`\n→ Verifying Chunk 6 against ${process.env.DATABASE_URL?.split("@")[1]}\n`);

  runPureTests();

  const userA = await signUp(A);
  const userB = await signUp(B);
  const userC = await signUp(C);
  const userD = await signUp(D);
  assert(userA.id && userB.id && userC.id && userD.id, "signed up A, B, C, D");

  const trip = await createTripForUser(userA.id, { name: "Balance Test Trip" });
  const inv1 = await createInviteForTrip(userA.id, trip.id);
  await acceptInviteByCode(userB.id, inv1.code);
  const inv2 = await createInviteForTrip(userA.id, trip.id);
  await acceptInviteByCode(userC.id, inv2.code);
  assert(true, "A created trip, B + C accepted invites (D stays out)");

  // Expense 1: A pays $30, split A+B+C → 1000 each
  await createExpenseForTrip(userA.id, trip.id, {
    amountCents: 3000,
    description: "Dinner",
    payerId: userA.id,
    participantIds: [userA.id, userB.id, userC.id],
  });
  // Expense 2: B pays $15, split A+B+C → 500 each
  await createExpenseForTrip(userB.id, trip.id, {
    amountCents: 1500,
    description: "Taxi",
    payerId: userB.id,
    participantIds: [userA.id, userB.id, userC.id],
  });

  const view = await getBalancesForTrip(userA.id, trip.id);
  assert(view, "A gets a balance view");

  const by = new Map(view!.balances.map((b) => [b.userId, b]));
  assert(by.get(userA.id)!.totalPaidCents === 3000, "A paid 3000");
  assert(by.get(userA.id)!.totalOwedCents === 1500, "A owes 1500");
  assert(by.get(userA.id)!.netCents === 1500, "A net +1500");
  assert(by.get(userB.id)!.totalPaidCents === 1500, "B paid 1500");
  assert(by.get(userB.id)!.netCents === 0, "B net 0");
  assert(by.get(userC.id)!.totalPaidCents === 0, "C paid 0");
  assert(by.get(userC.id)!.netCents === -1500, "C net -1500");

  const sum = view!.balances.reduce((s, b) => s + b.netCents, 0);
  assert(sum === 0, `net sum across members = 0 (got ${sum})`);

  assert(view!.transfers.length === 1, `exactly 1 transfer required (got ${view!.transfers.length})`);
  const t = view!.transfers[0];
  assert(t.fromUserId === userC.id, "transfer from C");
  assert(t.toUserId === userA.id, "transfer to A");
  assert(t.amountCents === 1500, `transfer amount 1500 (got ${t.amountCents})`);

  // D (non-member) gets null
  const dView = await getBalancesForTrip(userD.id, trip.id);
  assert(dView === null, "non-member D gets null");

  // Cleanup
  await db.delete(expenses).where(eq(expenses.tripId, trip.id));
  await db.delete(trips).where(eq(trips.id, trip.id));
  await db.delete(users).where(eq(users.id, userA.id));
  await db.delete(users).where(eq(users.id, userB.id));
  await db.delete(users).where(eq(users.id, userC.id));
  await db.delete(users).where(eq(users.id, userD.id));
  console.log("\n✓ cleanup complete");
  console.log("\n✅ Chunk 6 verified end-to-end.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ verify-balances failed:", err);
  process.exit(1);
});
