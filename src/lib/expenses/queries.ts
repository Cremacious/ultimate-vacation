import { and, desc, eq, isNull, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { expenseSplits, expenses, tripMembers, users } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";

export type ExpenseListItem = {
  id: string;
  amountCents: number;
  description: string;
  category: string;
  paidAt: Date;
  payerId: string;
  payerName: string;
  participantCount: number;
};

export async function listTripMembersForPicker(tripId: string) {
  return db
    .select({
      userId: tripMembers.userId,
      name: users.name,
      role: tripMembers.role,
    })
    .from(tripMembers)
    .innerJoin(users, eq(users.id, tripMembers.userId))
    .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt)))
    .orderBy(users.name);
}

/**
 * Expenses for a trip, newest first. Enforces membership — non-members get [].
 * Caller is responsible for checking the result vs. UI expectations (404 vs empty).
 */
export async function listExpensesForTrip(
  userId: string,
  tripId: string
): Promise<ExpenseListItem[]> {
  const member = await isTripMember(userId, tripId);
  if (!member) return [];

  const rows = await db
    .select({
      id: expenses.id,
      amountCents: expenses.amountCents,
      description: expenses.description,
      category: expenses.category,
      paidAt: expenses.paidAt,
      payerId: expenses.payerId,
      payerName: users.name,
    })
    .from(expenses)
    .innerJoin(users, eq(users.id, expenses.payerId))
    .where(and(eq(expenses.tripId, tripId), isNull(expenses.deletedAt)))
    .orderBy(desc(expenses.paidAt));

  if (rows.length === 0) return [];

  const splitCounts = await db
    .select({ expenseId: expenseSplits.expenseId, userId: expenseSplits.userId })
    .from(expenseSplits)
    .where(inArray(expenseSplits.expenseId, rows.map((r) => r.id)));

  const counts = new Map<string, number>();
  for (const s of splitCounts) {
    counts.set(s.expenseId, (counts.get(s.expenseId) ?? 0) + 1);
  }

  return rows.map((r) => ({ ...r, participantCount: counts.get(r.id) ?? 0 }));
}
