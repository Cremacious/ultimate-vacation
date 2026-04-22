import Link from "next/link";

import type { ItineraryEventRow } from "@/lib/itinerary/queries";

const CATEGORY_COLORS: Record<string, string> = {
  activity: "#FFD600",
  meal: "#FFD600",
  reservation: "#00A8CC",
  flight: "#FF2D8B",
  transport: "#FF2D8B",
  note: "#9CA3AF",
  other: "#9CA3AF",
};

function formatEventTime(startTime: string | null): string {
  if (!startTime) return "All day";
  const [h, m] = startTime.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

interface DayInfo {
  dayNumber: number;
  totalDays: number;
  todayStr: string;
  tomorrowStr: string;
  isLastDay: boolean;
}

interface TodayViewProps {
  tripName: string;
  dayInfo: DayInfo;
  todayEvents: ItineraryEventRow[];
  tomorrowEvents: ItineraryEventRow[];
}

function DayContextHeader({ tripName, dayInfo }: { tripName: string; dayInfo: DayInfo }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
        Day {dayInfo.dayNumber} of {dayInfo.totalDays}
      </p>
      <h1
        className="text-3xl font-semibold text-white leading-tight"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Today
      </h1>
      <p className="text-sm text-white/50 mt-1">{tripName}</p>
    </div>
  );
}

function TodaySchedule({ events, todayStr }: { events: ItineraryEventRow[]; todayStr: string }) {
  return (
    <section aria-label="Today's schedule" className="mb-6">
      <h2
        className="text-lg font-semibold text-white mb-3"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Schedule
      </h2>
      {events.length === 0 ? (
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm text-white/50">Nothing scheduled for today.</p>
          <Link
            href={`../itinerary?date=${todayStr}`}
            className="text-xs text-[#00E5FF]/60 mt-2 inline-block hover:text-[#00E5FF] transition-colors"
          >
            Add to itinerary →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((ev) => {
            const color = CATEGORY_COLORS[ev.category] ?? "#9CA3AF";
            return (
              <div
                key={ev.id}
                className="flex items-stretch rounded-xl overflow-hidden border border-[#2A2B45]"
                style={{ backgroundColor: "#1C1D35" }}
              >
                <div className="w-[3px] flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                    <p className="text-xs text-white/40 flex-shrink-0 tabular-nums">
                      {formatEventTime(ev.startTime)}
                    </p>
                  </div>
                  {ev.location && (
                    <p className="text-xs text-white/40 mt-0.5 truncate">{ev.location}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function QuickActions({ tripId, todayStr }: { tripId: string; todayStr: string }) {
  return (
    <section aria-label="Quick actions" className="mb-6">
      <div className="flex gap-3">
        <Link
          href={`/app/trips/${tripId}/expenses`}
          className="flex-1 rounded-2xl border border-[#2A2B45] px-4 py-3 text-center hover:border-[#00E5FF]/30 transition-colors"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm font-semibold text-white">Log expense</p>
          <p className="text-xs text-white/40 mt-0.5">Track what you spent</p>
        </Link>
        <Link
          href={`/app/trips/${tripId}/itinerary?date=${todayStr}`}
          className="flex-1 rounded-2xl border border-[#2A2B45] px-4 py-3 text-center hover:border-[#00E5FF]/30 transition-colors"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm font-semibold text-white">Full itinerary</p>
          <p className="text-xs text-white/40 mt-0.5">Edit today's events</p>
        </Link>
      </div>
    </section>
  );
}

function TomorrowPeek({
  isLastDay,
  tomorrowEvents,
  tripId,
}: {
  isLastDay: boolean;
  tomorrowEvents: ItineraryEventRow[];
  tripId: string;
}) {
  if (isLastDay) {
    return (
      <section aria-label="Tomorrow" className="mb-6">
        <h2
          className="text-lg font-semibold text-white mb-3"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Last day
        </h2>
        <div
          className="rounded-2xl border border-[#FF2D8B]/30 px-6 py-5"
          style={{ backgroundColor: "#1C1D35" }}
        >
          <p className="text-sm font-semibold text-white mb-1">Trip ends tomorrow</p>
          <p className="text-xs text-white/50 mb-3">
            Make sure expenses are logged before you settle up.
          </p>
          <Link
            href={`/app/trips/${tripId}/expenses`}
            className="text-xs font-semibold text-[#FF2D8B] hover:opacity-80 transition-opacity"
          >
            Go to expenses →
          </Link>
        </div>
      </section>
    );
  }

  if (tomorrowEvents.length === 0) return null;

  const first = tomorrowEvents[0];
  const rest = tomorrowEvents.length - 1;

  return (
    <section aria-label="Tomorrow peek" className="mb-6">
      <h2
        className="text-lg font-semibold text-white mb-3"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Tomorrow
      </h2>
      <div
        className="rounded-2xl border border-[#2A2B45] px-4 py-4"
        style={{ backgroundColor: "#15162A" }}
      >
        <p className="text-sm font-semibold text-white truncate">{first.title}</p>
        {rest > 0 && (
          <p className="text-xs text-white/40 mt-1">
            and {rest} more event{rest !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </section>
  );
}

export function TodayViewContent({
  tripId,
  tripName,
  dayInfo,
  todayEvents,
  tomorrowEvents,
}: TodayViewProps & { tripId: string }) {
  return (
    <div className="px-6 py-8 max-w-xl">
      <DayContextHeader tripName={tripName} dayInfo={dayInfo} />
      <TodaySchedule events={todayEvents} todayStr={dayInfo.todayStr} />
      <QuickActions tripId={tripId} todayStr={dayInfo.todayStr} />
      <TomorrowPeek
        isLastDay={dayInfo.isLastDay}
        tomorrowEvents={tomorrowEvents}
        tripId={tripId}
      />
    </div>
  );
}
