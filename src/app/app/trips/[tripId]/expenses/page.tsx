import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { getBalancesForTrip, listExpensesForTrip, listTripMembersForPicker } from "@/lib/expenses/queries";
import { isTripMember } from "@/lib/invites/permissions";
import { listReceiptsForExpenses } from "@/lib/receipts/queries";
import { listSettlementsForTrip } from "@/lib/settlements/queries";

import ExpensesClient from "./ExpensesClient";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [trip] = await db
    .select({ id: trips.id, name: trips.name })
    .from(trips)
    .where(eq(trips.id, tripId))
    .limit(1);
  if (!trip) notFound();

  const canView = await isTripMember(user.id, trip.id);
  if (!canView) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view expenses.
        </p>
      </div>
    );
  }

  const [members, expenseRows, balanceView, pastSettlements] = await Promise.all([
    listTripMembersForPicker(trip.id),
    listExpensesForTrip(user.id, trip.id),
    getBalancesForTrip(user.id, trip.id),
    listSettlementsForTrip(user.id, trip.id),
  ]);

  // Attach the first receipt per expense (UI displays one receipt per row; MVP).
  const receiptRows = await listReceiptsForExpenses(expenseRows.map((e) => e.id));
  const receiptByExpense = new Map<string, { blobUrl: string; mimeType: string }>();
  for (const r of receiptRows) {
    if (!receiptByExpense.has(r.expenseId)) {
      receiptByExpense.set(r.expenseId, { blobUrl: r.blobUrl, mimeType: r.mimeType });
    }
  }

  // balanceView is null only for non-members; canView guard above ensures it's always set here.
  const balances = balanceView?.balances ?? [];
  const rawTransfers = balanceView?.transfers ?? [];

  const nameById = new Map(balances.map((b) => [b.userId, b.name]));
  const transfers = rawTransfers.map((t) => ({
    fromUserId: t.fromUserId,
    fromName: nameById.get(t.fromUserId) ?? "?",
    toUserId: t.toUserId,
    toName: nameById.get(t.toUserId) ?? "?",
    amountCents: t.amountCents,
  }));

  const allSettled = balances.every((b) => Math.abs(b.netCents) < 1);
  const hasExpenses = balances.some((b) => b.totalPaidCents > 0 || b.totalOwedCents > 0);

  const pastSettlementsView = pastSettlements.map((s) => ({
    id: s.id,
    fromName: s.fromName,
    toName: s.toName,
    amountCents: s.amountCents,
    currency: s.currency,
    settledAt: s.settledAt.toISOString(),
    note: s.note,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/app"
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Back to trips
        </Link>
      </div>
      <h1
        className="text-3xl font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Expenses
      </h1>
      <p className="text-sm text-gray-400 mb-8">Trip: {trip.name}</p>

      <ExpensesClient
        tripId={trip.id}
        currentUserId={user.id}
        members={members.map((m) => ({ userId: m.userId, name: m.name }))}
        expenses={expenseRows.map((e) => ({
          ...e,
          receipt: receiptByExpense.get(e.id) ?? null,
        }))}
        balances={balances}
        transfers={transfers}
        pastSettlements={pastSettlementsView}
        allSettled={allSettled}
        hasExpenses={hasExpenses}
      />
    </div>
  );
}
