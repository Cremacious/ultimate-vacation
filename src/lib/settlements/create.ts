/**
 * Settlement creation service — inserts a row in the `settlements` ledger.
 *
 * Per 2026-04-21 architecture grill Q5: per-pair soft-settlement ledger.
 * Append-only with soft-delete. Edits = new settlement row (no updates).
 * Multiple settlements between the same pair are legitimate.
 *
 * Trust model (launch): any trip member can record a settlement between any
 * other two trip members. Simpler than gating to from/to user only, matches
 * Splitwise precedent. Can tighten post-launch if abuse observed.
 */

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { settlements, tripMembers, trips, users } from "@/lib/db/schema";
import { emitNotificationBulk } from "@/lib/notifications/emit";

export type CreateSettlementInput = {
  tripId: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  /** ISO 4217; defaults to trip's display_currency if absent. */
  currency?: string;
  note?: string;
};

export type CreatedSettlement = {
  id: string;
  tripId: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  currency: string;
  settledAt: Date;
};

export async function createSettlement(
  userId: string,
  input: CreateSettlementInput
): Promise<CreatedSettlement> {
  const { tripId, fromUserId, toUserId, amountCents } = input;

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Amount must be a positive integer in cents.");
  }
  if (fromUserId === toUserId) {
    throw new Error("Settlement from-user and to-user must differ.");
  }

  // Caller must be a member of the trip.
  const [callerMember] = await db
    .select({ id: tripMembers.id })
    .from(tripMembers)
    .where(
      and(
        eq(tripMembers.tripId, tripId),
        eq(tripMembers.userId, userId),
        isNull(tripMembers.deletedAt)
      )
    )
    .limit(1);
  if (!callerMember) {
    throw new Error("Only trip members can record settlements.");
  }

  // From/to users must both be members of the trip.
  const memberRows = await db
    .select({ userId: tripMembers.userId })
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt)));
  const memberSet = new Set(memberRows.map((r) => r.userId));
  if (!memberSet.has(fromUserId) || !memberSet.has(toUserId)) {
    throw new Error("Settlement parties must both be trip members.");
  }

  // Resolve currency: caller-supplied or the trip's display_currency.
  let currency = input.currency;
  if (!currency) {
    const [trip] = await db
      .select({ displayCurrency: trips.displayCurrency })
      .from(trips)
      .where(eq(trips.id, tripId))
      .limit(1);
    if (!trip) throw new Error("Trip not found.");
    currency = trip.displayCurrency;
  }

  const settledAt = new Date();
  const [row] = await db
    .insert(settlements)
    .values({
      tripId,
      fromUserId,
      toUserId,
      amountCents,
      currency,
      settledAt,
      note: input.note ?? null,
    })
    .returning({
      id: settlements.id,
      tripId: settlements.tripId,
      fromUserId: settlements.fromUserId,
      toUserId: settlements.toUserId,
      amountCents: settlements.amountCents,
      currency: settlements.currency,
      settledAt: settlements.settledAt,
    });

  // Notify the creditor that a payment has been recorded. Best-effort.
  try {
    const [fromUser] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, fromUserId))
      .limit(1);
    if (fromUser) {
      await emitNotificationBulk([{
        userId: toUserId,
        tripId,
        type: "settlement_recorded",
        payload: {
          fromUserName: fromUser.name,
          amountCents,
          currency: row.currency,
        },
      }]);
    }
  } catch {
    // swallow — notifications are non-critical
  }

  return row;
}
