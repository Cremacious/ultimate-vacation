import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips, tripMembers } from "@/lib/db/schema";
import { listEventsForDate } from "@/lib/itinerary/queries";
import { TodayViewContent } from "@/components/vacation-days/TodayView";

function parseUTC(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function clampDate(date: string, start: string, end: string): string {
  const ms = parseUTC(date);
  if (ms < parseUTC(start)) return start;
  if (ms > parseUTC(end)) return end;
  return date;
}

export default async function VacationDaysPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const [{ tripId }, { date: dateParam }] = await Promise.all([params, searchParams]);
  const user = await requireUser();

  const [[trip], [member]] = await Promise.all([
    db
      .select({
        id: trips.id,
        name: trips.name,
        startDate: trips.startDate,
        endDate: trips.endDate,
      })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1),
    db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(
        and(
          eq(tripMembers.userId, user.id),
          eq(tripMembers.tripId, tripId),
          isNull(tripMembers.deletedAt),
        ),
      )
      .limit(1),
  ]);

  if (!trip) notFound();
  if (!member) notFound();

  const { startDate, endDate } = trip;

  // No trip dates yet → prompt
  if (!startDate || !endDate) {
    return (
      <div className="px-6 py-8 max-w-xl">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">Today</p>
        <h1
          className="text-3xl font-semibold text-white mb-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {trip.name}
        </h1>
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm text-white/50 mb-3">Add trip dates to see your daily view.</p>
          <Link
            href={`/app/trips/${tripId}/setup`}
            className="text-sm font-semibold text-[#00E5FF] hover:opacity-80 transition-opacity"
          >
            Go to Setup →
          </Link>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const startMs = parseUTC(startDate);
  const endMs = parseUTC(endDate);
  const todayMs = parseUTC(todayStr);

  const tripStatus: "not_started" | "active" | "ended" =
    todayMs < startMs ? "not_started" : todayMs > endMs ? "ended" : "active";

  const daysUntilStart = Math.ceil((startMs - todayMs) / 86_400_000);
  const totalDays = Math.floor((endMs - startMs) / 86_400_000) + 1;

  // Trip hasn't started yet → countdown + day list preview
  if (tripStatus === "not_started") {
    return (
      <div className="px-6 py-8 max-w-xl">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">Today</p>
        <h1
          className="text-3xl font-semibold text-white mb-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {trip.name}
        </h1>
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p
            className="text-2xl font-semibold text-white mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {daysUntilStart === 1 ? "Tomorrow!" : `${daysUntilStart} days to go`}
          </p>
          <p className="text-sm text-white/50">Your trip starts on {startDate}.</p>
          <p className="text-xs text-white/30 mt-2">
            {totalDays} day{totalDays !== 1 ? "s" : ""} planned.
          </p>
        </div>
      </div>
    );
  }

  // Active or ended → two-panel day browser
  const defaultDate = tripStatus === "active" ? todayStr : endDate;
  const selectedDate = dateParam ? clampDate(dateParam, startDate, endDate) : defaultDate;

  const dayNumber = Math.floor((parseUTC(selectedDate) - startMs) / 86_400_000) + 1;
  const isToday = selectedDate === todayStr;

  const events = await listEventsForDate(tripId, selectedDate);

  return (
    <TodayViewContent
      tripId={tripId}
      tripName={trip.name}
      startDate={startDate}
      endDate={endDate}
      selectedDate={selectedDate}
      dayNumber={dayNumber}
      totalDays={totalDays}
      isToday={isToday}
      tripStatus={tripStatus}
      events={events}
    />
  );
}
