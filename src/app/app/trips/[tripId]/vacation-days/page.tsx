import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips, tripMembers } from "@/lib/db/schema";
import { listEventsForDate } from "@/lib/itinerary/queries";
import { TodayViewContent } from "@/components/vacation-days/TodayView";

type DayInfo = {
  dayNumber: number;
  totalDays: number;
  todayStr: string;
  tomorrowStr: string;
  isLastDay: boolean;
  daysUntilStart: number;
  tripStatus: "not_started" | "active" | "ended";
};

function computeDayInfo(startDate: string | null, endDate: string | null): DayInfo | null {
  if (!startDate || !endDate) return null;
  const todayStr = new Date().toISOString().slice(0, 10);
  const parseUTC = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const startMs = parseUTC(startDate);
  const endMs = parseUTC(endDate);
  const todayMs = parseUTC(todayStr);
  const dayNumber = Math.floor((todayMs - startMs) / 86_400_000) + 1;
  const totalDays = Math.floor((endMs - startMs) / 86_400_000) + 1;
  const daysUntilStart = Math.ceil((startMs - todayMs) / 86_400_000);
  const tomorrowStr = new Date(todayMs + 86_400_000).toISOString().slice(0, 10);
  const tripStatus: DayInfo["tripStatus"] =
    todayMs < startMs ? "not_started" : todayMs > endMs ? "ended" : "active";
  return {
    dayNumber,
    totalDays,
    todayStr,
    tomorrowStr,
    isLastDay: dayNumber === totalDays,
    daysUntilStart,
    tripStatus,
  };
}

export default async function VacationDaysPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
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

  const dayInfo = computeDayInfo(trip.startDate, trip.endDate);

  // No dates → prompt to set up
  if (!dayInfo) {
    return (
      <div className="px-6 py-8 max-w-xl">
        <p
          className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1"
        >
          Today
        </p>
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
          <p className="text-sm text-white/50 mb-3">
            Add trip dates to see your daily view.
          </p>
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

  // Trip hasn't started yet
  if (dayInfo.tripStatus === "not_started") {
    return (
      <div className="px-6 py-8 max-w-xl">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
          Today
        </p>
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
          <p className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: "var(--font-fredoka)" }}>
            {dayInfo.daysUntilStart === 1
              ? "Tomorrow!"
              : `${dayInfo.daysUntilStart} days to go`}
          </p>
          <p className="text-sm text-white/50">
            Your trip starts on {trip.startDate}.
          </p>
          <p className="text-xs text-white/30 mt-2">
            Come back on the day you depart to see your daily view.
          </p>
        </div>
      </div>
    );
  }

  // Trip has ended
  if (dayInfo.tripStatus === "ended") {
    return (
      <div className="px-6 py-8 max-w-xl">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
          Today
        </p>
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
          <p className="text-sm font-semibold text-white mb-1">Trip complete</p>
          <p className="text-sm text-white/50 mb-3">
            This trip ended on {trip.endDate}.
          </p>
          <Link
            href={`/app/trips/${tripId}/expenses`}
            className="text-sm font-semibold text-[#00C96B] hover:opacity-80 transition-opacity"
          >
            Settle up expenses →
          </Link>
        </div>
      </div>
    );
  }

  // Active trip — parallel fetch today + tomorrow events
  const [todayEvents, tomorrowEvents] = await Promise.all([
    listEventsForDate(tripId, dayInfo.todayStr),
    dayInfo.isLastDay ? Promise.resolve([]) : listEventsForDate(tripId, dayInfo.tomorrowStr),
  ]);

  return (
    <TodayViewContent
      tripId={tripId}
      tripName={trip.name}
      dayInfo={dayInfo}
      todayEvents={todayEvents}
      tomorrowEvents={tomorrowEvents}
    />
  );
}
