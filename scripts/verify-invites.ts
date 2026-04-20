/**
 * Chunk 4 proof — invite creation + acceptance, with permission + lifecycle checks.
 *
 * Flow:
 *   1. sign up organizer (A) and invitee (B) and bystander (C)
 *   2. A creates trip → A becomes organizer
 *   3. A creates invite for trip   [permission OK]
 *   4. C tries to create invite → rejected (non-organizer)
 *   5. B accepts invite → trip_members row (role=member), usedCount bumped
 *   6. B accepts same invite again → alreadyMember: true, no duplicate row
 *   7. revoke invite → B accept attempt fails
 *   8. bad code → fails
 *   9. cleanup: delete trip (cascades invites + members), delete all 3 users
 *
 * Run with: `npm run invites:verify`
 */
import "dotenv/config";

import { and, eq } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { invites, tripMembers, trips, users } from "../src/lib/db/schema";
import { acceptInviteByCode, InviteError } from "../src/lib/invites/accept";
import { createInviteForTrip } from "../src/lib/invites/create";
import { createTripForUser } from "../src/lib/trips/create";

const STAMP = Date.now();
const A = { email: `inviter-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Organizer A" };
const B = { email: `invitee-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Invitee B" };
const C = { email: `bystander-${STAMP}@tripwave.test`, password: "verify-password-123", name: "Bystander C" };

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function signUp(u: typeof A) {
  await auth.api.signUpEmail({ body: u, asResponse: true });
  const [row] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
  if (!row) throw new Error(`sign up failed for ${u.email}`);
  return row;
}

async function main() {
  console.log(`\n→ Verifying Chunk 4 against ${process.env.DATABASE_URL?.split("@")[1]}\n`);

  assert(process.env.DATABASE_URL, "DATABASE_URL is set");
  assert(process.env.BETTER_AUTH_SECRET, "BETTER_AUTH_SECRET is set");

  const userA = await signUp(A);
  const userB = await signUp(B);
  const userC = await signUp(C);
  assert(userA.id && userB.id && userC.id, "signed up A, B, C");

  // A creates trip
  const trip = await createTripForUser(userA.id, { name: "Invite Test Trip" });
  assert(trip.id, `A created trip ${trip.id}`);

  // A creates invite
  const invite = await createInviteForTrip(userA.id, trip.id);
  assert(invite.code.length === 10 && /^[a-f0-9]+$/.test(invite.code), `invite code is 10 hex chars (${invite.code})`);

  // C (non-member) cannot create invite
  let cRejected = false;
  try {
    await createInviteForTrip(userC.id, trip.id);
  } catch {
    cRejected = true;
  }
  assert(cRejected, "non-organizer C rejected from creating invite");

  // B accepts
  const acceptResult = await acceptInviteByCode(userB.id, invite.code);
  assert(acceptResult.alreadyMember === false, "B accept: not already member");
  assert(acceptResult.tripId === trip.id, "accept returns correct tripId");

  const [bMember] = await db
    .select()
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, trip.id), eq(tripMembers.userId, userB.id)))
    .limit(1);
  assert(bMember, "trip_members row exists for B");
  assert(bMember.role === "member", `B role = member (${bMember.role})`);

  const [inviteRow1] = await db.select().from(invites).where(eq(invites.id, invite.id)).limit(1);
  assert(inviteRow1.usedCount === 1, `usedCount incremented to 1 (got ${inviteRow1.usedCount})`);

  // B accepts again → alreadyMember, no dup row
  const acceptResult2 = await acceptInviteByCode(userB.id, invite.code);
  assert(acceptResult2.alreadyMember === true, "second accept: alreadyMember=true");

  const dupRows = await db
    .select()
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, trip.id), eq(tripMembers.userId, userB.id)));
  assert(dupRows.length === 1, `exactly one membership row for B (got ${dupRows.length})`);

  // Bad code
  let badRejected: InviteError | null = null;
  try {
    await acceptInviteByCode(userC.id, "deadbeef00");
  } catch (e) {
    if (e instanceof InviteError) badRejected = e;
  }
  assert(badRejected?.code === "not_found", "unknown code rejected with not_found");

  // Revoke → accept fails
  await db.update(invites).set({ revokedAt: new Date() }).where(eq(invites.id, invite.id));
  let revokedRejected: InviteError | null = null;
  try {
    await acceptInviteByCode(userC.id, invite.code);
  } catch (e) {
    if (e instanceof InviteError) revokedRejected = e;
  }
  assert(revokedRejected?.code === "revoked", "revoked invite rejected with revoked");

  // Cleanup: ownerId is RESTRICT, so delete trip first (cascades invites + members), then users
  await db.delete(trips).where(eq(trips.id, trip.id));
  await db.delete(users).where(eq(users.id, userA.id));
  await db.delete(users).where(eq(users.id, userB.id));
  await db.delete(users).where(eq(users.id, userC.id));
  console.log(`\n✓ cleanup complete`);
  console.log("\n✅ Chunk 4 verified end-to-end.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ verify-invites failed:", err);
  process.exit(1);
});
