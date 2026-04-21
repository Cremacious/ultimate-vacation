/**
 * User-account deletion service.
 *
 * Per 2026-04-21 architecture grill Q11 + STATE_MODEL.md edge cases:
 *   - trips.owner_id is ON DELETE RESTRICT (safety net preserved in migration 0001).
 *   - Before touching the user row, transfer or soft-delete their owned trips.
 *   - Transfer target: earliest-joined non-owner member by trip_members.joinedAt asc.
 *     (STATE_MODEL.md describes the tie-breaker as "alphabetical by join date"; we
 *     interpret as earliest joinedAt timestamp.)
 *   - If no other members, soft-delete the trip (trips.deletedAt = now). A 30-day
 *     hard-delete cron is post-launch (STATE_MODEL.md edge case); for v1 the
 *     soft-deleted row lingers.
 *
 * User row handling: the users table has many RESTRICT FKs pointing at it
 * (invites.createdBy, expenses.payerId, expense_splits.userId, etc.). Hard-
 * deleting the user row is therefore not possible without orphaning contributions.
 * Instead we soft-delete the user (set users.deletedAt) and hard-delete sessions
 * + accounts so the user cannot log in. Contribution attribution is preserved;
 * app-level display filters hide the deleted user from UI surfaces.
 *
 * Transaction boundary: neon-http does not support multi-statement transactions.
 * We execute in sequence, ordered so that a mid-failure leaves the DB in a
 * recoverable state (trip transfers first, then user-side cleanup).
 */

import { and, asc, eq, isNull, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { accounts, sessions, tripMembers, trips, users } from "@/lib/db/schema";

export type DeleteUserAccountResult = {
  transferredTripCount: number;
  softDeletedTripCount: number;
};

export async function deleteUserAccount(userId: string): Promise<DeleteUserAccountResult> {
  // Step 1: find all trips this user owns that are not already soft-deleted.
  const ownedTrips = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.ownerId, userId), isNull(trips.deletedAt)));

  let transferredTripCount = 0;
  let softDeletedTripCount = 0;

  // Step 2: for each owned trip, transfer to successor or soft-delete.
  for (const trip of ownedTrips) {
    const [successor] = await db
      .select({ userId: tripMembers.userId })
      .from(tripMembers)
      .where(
        and(
          eq(tripMembers.tripId, trip.id),
          ne(tripMembers.userId, userId),
          isNull(tripMembers.deletedAt)
        )
      )
      .orderBy(asc(tripMembers.joinedAt))
      .limit(1);

    const now = new Date();

    if (successor) {
      // Transfer ownership; promote successor to organizer.
      await db
        .update(trips)
        .set({ ownerId: successor.userId, updatedAt: now })
        .where(eq(trips.id, trip.id));
      await db
        .update(tripMembers)
        .set({ role: "organizer", updatedAt: now })
        .where(
          and(
            eq(tripMembers.tripId, trip.id),
            eq(tripMembers.userId, successor.userId)
          )
        );
      transferredTripCount += 1;
    } else {
      // No non-owner members — soft-delete the trip. Its trip_members rows
      // (including this user's organizer row) will be cascade-cleaned by
      // a post-launch retention cron if/when added.
      await db
        .update(trips)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(trips.id, trip.id));
      softDeletedTripCount += 1;
    }
  }

  // Step 3: invalidate login — hard-delete sessions + accounts (Better Auth
  // cascade targets). Password hash lives in `accounts`; removing it closes
  // the door.
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.delete(accounts).where(eq(accounts.userId, userId));

  // Step 4: soft-delete the user row. Preserves FK references from
  // expenses / splits / invites / itinerary / settlements / receipts so
  // attribution is intact for remaining trip members.
  const now = new Date();
  await db.update(users).set({ deletedAt: now, updatedAt: now }).where(eq(users.id, userId));

  return { transferredTripCount, softDeletedTripCount };
}
