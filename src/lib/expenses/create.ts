import { and, eq, inArray, isNull } from "drizzle-orm";

import { emit } from "@/lib/analytics/events";
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

  // Pre-insert snapshot for analytics: count of prior expenses and distinct
  // contributing members (payer ∪ split users). Used to detect two funnel
  // events without double-firing. Wrapped in try/catch so a DB hiccup on the
  // read can't block the main write.
  let priorExpenseCount = 0;
  const priorContributors = new Set<string>();
  try {
    const priorExpenses = await db
      .select({ id: expenses.id, payerId: expenses.payerId })
      .from(expenses)
      .where(and(eq(expenses.tripId, tripId), isNull(expenses.deletedAt)));
    priorExpenseCount = priorExpenses.length;
    for (const e of priorExpenses) priorContributors.add(e.payerId);
    if (priorExpenses.length > 0) {
      const priorSplitRows = await db
        .select({ userId: expenseSplits.userId })
        .from(expenseSplits)
        .where(inArray(expenseSplits.expenseId, priorExpenses.map((e) => e.id)));
      for (const s of priorSplitRows) priorContributors.add(s.userId);
    }
  } catch {
    // Snapshot failure is non-blocking; we simply don't emit the threshold event.
  }

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

  // Analytics: emit funnel events. Failures are swallowed — the expense is
  // already durable in the DB; PostHog can't be allowed to break writes.
  try {
    // first_expense_logged: emit if this trip had zero prior expenses.
    if (priorExpenseCount === 0) {
      emit({
        type: "first_expense_logged",
        userId,
        tripId,
        expenseId: expense.id,
      });
    }
    // two_member_expense_threshold: distinct contributor set grows with this
    // insert's payer + participant split users. If it crosses from <2 to ≥2
    // distinct contributors, the trip just cleared the moat threshold.
    const newContributors = new Set(priorContributors);
    newContributors.add(payerId);
    for (const pid of participantIds) newContributors.add(pid);
    if (priorContributors.size < 2 && newContributors.size >= 2) {
      emit({ type: "two_member_expense_threshold", tripId });
    }
  } catch {
    // swallow
  }

  return expense;
}

export { computeEqualSplit };
