/**
 * Settlement read path.
 *
 * Used by:
 *   - getBalancesForTrip (to feed computeBalance with the settlement ledger)
 *   - the settle-up UI (to render the "Past settlements" history list)
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db";
import { settlements, users } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";

export type SettlementListItem = {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amountCents: number;
  currency: string;
  settledAt: Date;
  note: string | null;
};

/**
 * List settlements for a trip, newest first. Excludes soft-deleted rows.
 * Non-members get [].
 */
export async function listSettlementsForTrip(
  userId: string,
  tripId: string
): Promise<SettlementListItem[]> {
  const member = await isTripMember(userId, tripId);
  if (!member) return [];

  const fromUser = alias(users, "from_user");
  const toUser = alias(users, "to_user");

  return db
    .select({
      id: settlements.id,
      fromUserId: settlements.fromUserId,
      fromName: fromUser.name,
      toUserId: settlements.toUserId,
      toName: toUser.name,
      amountCents: settlements.amountCents,
      currency: settlements.currency,
      settledAt: settlements.settledAt,
      note: settlements.note,
    })
    .from(settlements)
    .innerJoin(fromUser, eq(fromUser.id, settlements.fromUserId))
    .innerJoin(toUser, eq(toUser.id, settlements.toUserId))
    .where(and(eq(settlements.tripId, tripId), isNull(settlements.deletedAt)))
    .orderBy(desc(settlements.settledAt));
}

export type SettlementRowForBalance = {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
};

/**
 * Lightweight fetch of settlement rows for balance computation. No joins.
 * Used by getBalancesForTrip which already gates membership.
 */
export async function listSettlementRowsForBalance(
  tripId: string
): Promise<SettlementRowForBalance[]> {
  return db
    .select({
      fromUserId: settlements.fromUserId,
      toUserId: settlements.toUserId,
      amountCents: settlements.amountCents,
    })
    .from(settlements)
    .where(and(eq(settlements.tripId, tripId), isNull(settlements.deletedAt)));
}
