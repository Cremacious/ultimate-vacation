/**
 * Chunk 3 proof — authenticated trip creation + ownership membership.
 *
 * Flow:
 *   1. sign up a fresh user
 *   2. call createTripForUser() with valid input
 *   3. assert the trips row exists and is owned by that user
 *   4. assert the trip_members row exists with role = 'organizer'
 *   5. assert listTripsForUser returns the trip
 *   6. assert slug is unique + URL-safe
 *   7. negative case: name too short → rejected
 *   8. cleanup: delete trip (members cascade), then user
 *
 * Run with: `npm run trips:verify`
 */
import "dotenv/config";

import { and, eq } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { tripMembers, trips, users } from "../src/lib/db/schema";
import { createTripForUser } from "../src/lib/trips/create";
import { listTripsForUser } from "../src/lib/trips/queries";

const EMAIL = `trips-${Date.now()}@tripwave.test`;
const PASSWORD = "verify-password-123";
const NAME = "Trips Bot";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function main() {
  console.log(`\n→ Verifying Chunk 3 against ${process.env.DATABASE_URL?.split("@")[1]}`);
  console.log(`→ Test user: ${EMAIL}\n`);

  assert(process.env.DATABASE_URL, "DATABASE_URL is set");
  assert(process.env.BETTER_AUTH_SECRET, "BETTER_AUTH_SECRET is set");

  // --- create user ---
  const signUp = await auth.api.signUpEmail({
    body: { email: EMAIL, password: PASSWORD, name: NAME },
    asResponse: true,
  });
  assert(signUp.ok, "sign up fresh user");

  const [userRow] = await db.select().from(users).where(eq(users.email, EMAIL)).limit(1);
  assert(userRow?.id, "user row exists in db");

  // --- create a trip ---
  const tripInput = {
    name: "Japan Spring 2027",
    startDate: "2027-04-01",
    endDate: "2027-04-15",
  };
  const created = await createTripForUser(userRow.id, tripInput);
  assert(created.id, `createTripForUser returned id ${created.id}`);
  assert(/^japan-spring-2027-[a-f0-9]{6}$/.test(created.slug), `slug is URL-safe + suffixed (${created.slug})`);

  // --- assert trip row ---
  const [tripRow] = await db.select().from(trips).where(eq(trips.id, created.id)).limit(1);
  assert(tripRow, "trip row persisted");
  assert(tripRow.ownerId === userRow.id, "trip ownerId = creator");
  assert(tripRow.name === tripInput.name, "trip name persisted");
  assert(tripRow.lifecycle === "active", `trip lifecycle defaults to active (${tripRow.lifecycle})`);
  assert(tripRow.ballColor === "#7C5CFF", "trip ball color defaulted");
  assert(tripRow.displayCurrency === "USD", "trip display currency defaulted");
  assert(String(tripRow.startDate) === tripInput.startDate, "start date persisted");
  assert(String(tripRow.endDate) === tripInput.endDate, "end date persisted");

  // --- assert membership row ---
  const [memberRow] = await db
    .select()
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, created.id), eq(tripMembers.userId, userRow.id)))
    .limit(1);
  assert(memberRow, "trip_members row for creator exists");
  assert(memberRow.role === "organizer", `creator role is organizer (${memberRow.role})`);

  // --- list query returns the trip ---
  const listed = await listTripsForUser(userRow.id);
  assert(listed.length === 1 && listed[0].id === created.id, "listTripsForUser returns the new trip");
  assert(listed[0].role === "organizer", "listed role = organizer");

  // --- negative case: name too short ---
  let rejected = false;
  try {
    await createTripForUser(userRow.id, { name: "x" });
  } catch {
    rejected = true;
  }
  assert(rejected, "createTripForUser rejects name < 2 chars");

  // --- cleanup ---
  // trips.ownerId is ON DELETE RESTRICT; delete the trip (members cascade) first,
  // then the user.
  await db.delete(trips).where(eq(trips.id, created.id));
  await db.delete(users).where(eq(users.id, userRow.id));
  console.log(`\n✓ cleanup: deleted trip + ${EMAIL}`);
  console.log("\n✅ Chunk 3 verified end-to-end.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ verify-trips failed:", err);
  process.exit(1);
});
