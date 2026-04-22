import { and, eq, isNull, sql } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { expenses, tripMembers, users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/session";
import { getTripById } from "@/lib/trips/queries";
import { buildRightNowRows, getTripPulse } from "@/lib/trips/pulse";

import OverviewIdentity from "./OverviewIdentity";
import OverviewRightNow from "./OverviewRightNow";

function daysUntilDate(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function tripPhaseLabel(
  lifecycle: string,
  startDate: string | null,
  endDate: string | null,
): string {
  if (lifecycle === "vaulted") return "Settled";
  const daysUntil = daysUntilDate(startDate);
  const daysUntilEnd = daysUntilDate(endDate);
  if (daysUntil === null) return "Planning";
  if (daysUntil > 0) return "Planning";
  if (daysUntilEnd !== null && daysUntilEnd >= 0) return "In Progress";
  return "Completed";
}

function countdownCopy(daysUntil: number | null): { number: string; label: string } {
  if (daysUntil === null) return { number: "—", label: "No dates set" };
  if (daysUntil > 0) {
    return {
      number: String(daysUntil),
      label: daysUntil === 1 ? "Day away" : "Days away",
    };
  }
  if (daysUntil === 0) return { number: "🎉", label: "Trip day" };
  return { number: String(Math.abs(daysUntil)), label: "Days ago" };
}

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const daysUntil = daysUntilDate(trip.startDate);
  const isVaulted = trip.lifecycle === "vaulted";

  const [memberRows, expenseCountRow, pulse] = await Promise.all([
    db
      .select({ userId: tripMembers.userId, name: users.name, role: tripMembers.role })
      .from(tripMembers)
      .innerJoin(users, eq(tripMembers.userId, users.id))
      .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt))),
    db
      .select({ n: sql<string>`count(*)` })
      .from(expenses)
      .where(and(eq(expenses.tripId, tripId), isNull(expenses.deletedAt))),
    getTripPulse(tripId, user.id, {
      includeNextEvent: daysUntil !== null && daysUntil <= 14,
      isVaulted,
    }),
  ]);

  const isOrganizer = memberRows.some(
    (m) => m.userId === user.id && m.role === "organizer",
  );
  const hasExpenses = Number(expenseCountRow[0]?.n ?? 0) > 0;
  const isSolo = memberRows.length === 1 && isOrganizer;

  const base = `/app/trips/${tripId}`;
  const phase = tripPhaseLabel(trip.lifecycle, trip.startDate, trip.endDate);
  const countdown = countdownCopy(daysUntil);

  const rightNowRows = buildRightNowRows(pulse, {
    base,
    displayCurrency: trip.displayCurrency,
    isOrganizer,
    isSolo,
    hasExpenses,
    hasStartDate: Boolean(trip.startDate),
    isVaulted,
  });

  return (
    <>
      <OverviewIdentity
        tripName={trip.name}
        phase={phase}
        ballColor={trip.ballColor}
        startDate={trip.startDate}
        endDate={trip.endDate}
        countdownNumber={countdown.number}
        countdownLabel={countdown.label}
        members={memberRows}
      />
      <div className="p-3 md:p-6">
        <OverviewRightNow rows={rightNowRows} />
      </div>
    </>
  );
}
