import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { expenseSplits, expenses, tripMembers } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";

import { computeEqualSplit } from "./split";

export type CreateExpenseInput = {
  amountCents: number;
  description: string;
  payerId: string;
  participantIds: string[];
  category?: string;
  paidAt?: Date;
};

export type CreatedExpense = {
  id: string;
  tripId: string;
};

/**
 * Create an expense and its equal-split rows.
 *
 * Rules (beta):
 *   - creator must be a trip member
 *   - payer must be a trip member
 *   - every participant must be a trip member
 *   - amount is positive integer cents; description 1–200 chars
 *   - split is equal with remainder assigned to first participants (see split.ts)
 *
 * neon-http has no transactions; insert expense first, then splits. On split
 * insert failure, delete the expense (compensating rollback).
 */
export async function createExpenseForTrip(
  userId: string,
  tripId: string,
  input: CreateExpenseInput
): Promise<CreatedExpense> {
  const { amountCents, description, payerId, participantIds } = input;
  const desc = description.trim();

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Amount must be a positive integer in cents.");
  }
  if (desc.length < 1 || desc.length > 200) {
    throw new Error("Description must be 1–200 characters.");
  }
  if (participantIds.length === 0) {
    throw new Error("At least one participant is required.");
  }

  // Creator membership gate.
  const creatorIsMember = await isTripMember(userId, tripId);
  if (!creatorIsMember) {
    throw new Error("Only trip members can add expenses.");
  }

  // Confirm payer + all participants are members of this trip. One query.
  const needed = Array.from(new Set<string>([payerId, ...participantIds]));
  const memberRows = await db
    .select({ userId: tripMembers.userId })
    .from(tripMembers)
    .where(eq(tripMembers.tripId, tripId));
  const memberSet = new Set(memberRows.map((r) => r.userId));
  for (const uid of needed) {
    if (!memberSet.has(uid)) {
      throw new Error("Payer and all participants must be trip members.");
    }
  }

  const splits = computeEqualSplit(amountCents, participantIds);

  const [expense] = await db
    .insert(expenses)
    .values({
      tripId,
      payerId,
      createdBy: userId,
      amountCents,
      description: desc,
      category: input.category ?? "general",
      paidAt: input.paidAt ?? new Date(),
    })
    .returning({ id: expenses.id, tripId: expenses.tripId });

  try {
    await db.insert(expenseSplits).values(
      splits.map((s) => ({
        expenseId: expense.id,
        userId: s.userId,
        amountCents: s.amountCents,
      }))
    );
  } catch (err) {
    await db.delete(expenses).where(eq(expenses.id, expense.id));
    throw err;
  }

  return expense;
}

export { computeEqualSplit };
