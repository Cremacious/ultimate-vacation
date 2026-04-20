import Link from "next/link";

import { requireUser } from "@/lib/auth/session";
import { listTripsForUser, type TripListItem } from "@/lib/trips/queries";

// Fill percent is a future derived metric (Chunk 6+). For beta it is 0 for
// every newly-created trip — the ball just outlines until planning data lands.
const BETA_FILL_PCT = 0;
const CARD_BG = "#2e2e2e";
const CARD_ARC = "#3a3a3a";
const CARD_BORDER = "#3a3a3a";
const HERO_BG = "#282828";
const HERO_ARC = "#3a3a3a";

function daysUntil(startDate: string | null): number | null {
  if (!startDate) return null;
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function countdownLabel(startDate: string | null): string {
  const d = daysUntil(startDate);
  if (d === null) return "Dates TBD";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 0) return "In progress";
  return `${d} days away`;
}

function TripCard({ trip }: { trip: TripListItem }) {
  const fillPct = BETA_FILL_PCT;
  const deg = (fillPct / 100) * 360;
  const d = daysUntil(trip.startDate);
  const urgency = d !== null && d >= 0 && d <= 7;

  return (
    <Link href={`/app/trips/${trip.id}`}>
      <div
        className="group relative overflow-hidden rounded-3xl p-5 border transition-all flex items-center gap-5 hover:brightness-110"
        style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ backgroundColor: trip.ballColor }}
        />

        <div
          className="rounded-full flex-shrink-0 relative ml-2"
          style={{
            width: 52,
            height: 52,
            background:
              fillPct < 2
                ? "transparent"
                : `conic-gradient(${trip.ballColor} ${deg}deg, ${CARD_ARC} ${deg}deg)`,
            border: fillPct < 2 ? `2px dashed ${trip.ballColor}` : "none",
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate group-hover:text-[#00A8CC] transition-colors">
            {trip.name}
          </h3>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: urgency ? trip.ballColor : "white" }}
          >
            {countdownLabel(trip.startDate)}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-fredoka)", color: trip.ballColor }}
          >
            {fillPct}%
          </span>
          <p className="text-xs font-medium text-white">planned</p>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div
        className="w-20 h-20 rounded-full mx-auto mb-6"
        style={{ border: "2px dashed #00A8CC" }}
      />
      <h2
        className="text-xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        No trips yet.
      </h2>
      <p className="text-sm font-medium mb-6 text-[#1A1A1A] opacity-60">
        Start planning your first adventure.
      </p>
      <Link
        href="/app/trips/new"
        className="bg-[#00A8CC] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0096b8] transition-colors"
        style={{ boxShadow: "0 3px 0 #007a99" }}
      >
        Create a trip
      </Link>
    </div>
  );
}

function Hero({ nextTrip }: { nextTrip: TripListItem }) {
  const fillPct = BETA_FILL_PCT;
  const deg = (fillPct / 100) * 360;
  return (
    <div
      className="relative overflow-hidden border-b"
      style={{ backgroundColor: HERO_BG, borderColor: "#333333" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "12%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${nextTrip.ballColor}20 0%, transparent 65%)`,
        }}
      />
      <div className="max-w-2xl mx-auto relative flex items-center gap-6 px-6 py-10">
        <div className="relative flex-shrink-0">
          <div
            className="rounded-full relative animate-wave-pulse"
            style={{
              width: 72,
              height: 72,
              background: `conic-gradient(${nextTrip.ballColor} ${deg}deg, ${HERO_ARC} ${deg}deg)`,
              boxShadow: `0 0 28px ${nextTrip.ballColor}50`,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{ inset: "15%", backgroundColor: HERO_BG }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5 text-white opacity-50">
            Next up
          </p>
          <h2
            className="text-3xl font-semibold text-white leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {nextTrip.name}
          </h2>
          <p className="text-sm font-semibold mt-1" style={{ color: nextTrip.ballColor }}>
            {countdownLabel(nextTrip.startDate)} · {fillPct}% planned
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const userTrips = await listTripsForUser(user.id);

  const upcoming = userTrips
    .filter((t) => {
      const d = daysUntil(t.startDate);
      return d === null ? false : d >= 0;
    })
    .sort((a, b) => (daysUntil(a.startDate) ?? 0) - (daysUntil(b.startDate) ?? 0));
  const nextTrip = upcoming[0] ?? userTrips[0];

  return (
    <div>
      {nextTrip && <Hero nextTrip={nextTrip} />}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Your trips
            </h1>
            <p className="text-xs font-medium mt-0.5 text-[#1A1A1A] opacity-50">
              {userTrips.length} of 3 slots used
            </p>
          </div>
          <Link
            href="/app/trips/new"
            className="bg-[#00A8CC] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#0096b8] transition-colors text-sm flex-shrink-0"
            style={{ boxShadow: "0 3px 0 #007a99" }}
          >
            New trip
          </Link>
        </div>

        {userTrips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {userTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
