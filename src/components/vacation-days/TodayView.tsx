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

function formatDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  let cur = Date.UTC(sy, sm - 1, sd);
  const endMs = Date.UTC(ey, em - 1, ed);
  while (cur <= endMs) {
    dates.push(new Date(cur).toISOString().slice(0, 10));
    cur += 86_400_000;
  }
  return dates;
}

interface TodayViewProps {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  selectedDate: string;
  dayNumber: number;
  totalDays: number;
  isToday: boolean;
  tripStatus: "active" | "ended";
  events: ItineraryEventRow[];
}

export function TodayViewContent({
  tripId,
  tripName,
  startDate,
  endDate,
  selectedDate,
  dayNumber,
  totalDays,
  isToday,
  tripStatus,
  events,
}: TodayViewProps) {
  const allDays = generateDateRange(startDate, endDate);
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#404040" }}>
      <style>{`
        .vacation-days-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          flex: 1;
        }
        @media (min-width: 1024px) {
          .vacation-days-grid {
            grid-template-columns: 280px 1fr;
          }
        }
      `}</style>

      {/* ── Sticky header ────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 border-b border-[#3a3a3a]"
        style={{ backgroundColor: "#282828" }}
      >
        <div className="px-6 py-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-0.5">
            {tripStatus === "ended" ? "Trip archive" : `Day ${dayNumber} of ${totalDays}`}
          </p>
          <h1
            className="text-2xl font-semibold text-white leading-none"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {tripName}
          </h1>
        </div>
      </div>

      {/* ── Two-panel grid ───────────────────────────────────────────── */}
      <div className="vacation-days-grid flex-1">
        {/* Left: Day list */}
        <div
          className="border-r border-[#3a3a3a] overflow-y-auto"
          style={{ backgroundColor: "#2e2e2e", maxHeight: "calc(100vh - 80px)" }}
        >
          <div className="p-3 space-y-1">
            {allDays.map((date, i) => {
              const isSelected = date === selectedDate;
              const isT = date === todayStr;
              const dayNum = i + 1;
              return (
                <Link
                  key={date}
                  href={`?date=${date}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: isSelected ? "#FFD60022" : "transparent",
                    border: isSelected ? "1px solid #FFD60055" : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: isSelected ? "#FFD600" : isT ? "#FFD60033" : "#3a3a3a",
                      color: isSelected ? "#0a0a0a" : isT ? "#FFD600" : "#9ca3af",
                    }}
                  >
                    {dayNum}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: isSelected ? "#FFD600" : "white" }}
                    >
                      {formatDayLabel(date)}
                    </p>
                    {isT && (
                      <p className="text-xs text-[#00C96B] font-semibold">Today</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Day detail */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
          {/* Day header */}
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
              Day {dayNumber} · {formatDayLabel(selectedDate)}
              {isToday ? " · Today" : ""}
            </p>
            <h2
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {isToday ? "Today" : formatDayLabel(selectedDate)}
            </h2>
            {tripStatus === "ended" && (
              <p className="text-xs text-gray-400 mt-1">Viewing trip archive</p>
            )}
          </div>

          {/* Schedule */}
          <section aria-label="Schedule" className="mb-6">
            <h3
              className="text-base font-semibold text-white mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Schedule
            </h3>
            {events.length === 0 ? (
              <div
                className="rounded-2xl border border-[#3a3a3a] px-6 py-8 text-center"
                style={{ backgroundColor: "#2e2e2e" }}
              >
                <p className="text-sm text-white/50 mb-2">Nothing scheduled for this day.</p>
                {tripStatus === "active" && (
                  <Link
                    href={`/app/trips/${tripId}/itinerary?date=${selectedDate}`}
                    className="text-xs font-semibold text-[#00E5FF] hover:opacity-80 transition-opacity"
                  >
                    Add to itinerary →
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {events.map((ev) => {
                  const color = CATEGORY_COLORS[ev.category] ?? "#9CA3AF";
                  return (
                    <div
                      key={ev.id}
                      className="flex items-stretch rounded-xl overflow-hidden border border-[#3a3a3a]"
                      style={{ backgroundColor: "#2e2e2e" }}
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

          {/* Quick actions */}
          {tripStatus === "active" && (
            <section aria-label="Quick actions">
              <div className="flex gap-3">
                <Link
                  href={`/app/trips/${tripId}/expenses`}
                  className="flex-1 rounded-2xl border border-[#3a3a3a] px-4 py-3 text-center hover:border-[#FFD600]/30 transition-colors"
                  style={{ backgroundColor: "#2e2e2e" }}
                >
                  <p className="text-sm font-semibold text-white">Log expense</p>
                  <p className="text-xs text-gray-400 mt-0.5">Track what you spent</p>
                </Link>
                <Link
                  href={`/app/trips/${tripId}/itinerary?date=${selectedDate}`}
                  className="flex-1 rounded-2xl border border-[#3a3a3a] px-4 py-3 text-center hover:border-[#FFD600]/30 transition-colors"
                  style={{ backgroundColor: "#2e2e2e" }}
                >
                  <p className="text-sm font-semibold text-white">Full itinerary</p>
                  <p className="text-xs text-gray-400 mt-0.5">Edit today&apos;s events</p>
                </Link>
              </div>
            </section>
          )}

          {tripStatus === "ended" && (
            <section aria-label="Trip ended actions">
              <div className="flex gap-3">
                <Link
                  href={`/app/trips/${tripId}/expenses`}
                  className="flex-1 rounded-2xl border border-[#3a3a3a] px-4 py-3 text-center hover:border-[#00C96B]/30 transition-colors"
                  style={{ backgroundColor: "#2e2e2e" }}
                >
                  <p className="text-sm font-semibold text-white">Settle expenses</p>
                  <p className="text-xs text-gray-400 mt-0.5">Wrap up the financials</p>
                </Link>
                <Link
                  href={`/app/trips/${tripId}/itinerary?date=${selectedDate}`}
                  className="flex-1 rounded-2xl border border-[#3a3a3a] px-4 py-3 text-center hover:border-[#FFD600]/30 transition-colors"
                  style={{ backgroundColor: "#2e2e2e" }}
                >
                  <p className="text-sm font-semibold text-white">View itinerary</p>
                  <p className="text-xs text-gray-400 mt-0.5">Browse trip memories</p>
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
