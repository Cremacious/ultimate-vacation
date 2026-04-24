import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { listTripsForUser, type TripListItem } from "@/lib/trips/queries";
import TimeGreeting from "@/components/TimeGreeting";
import TripBall from "@/components/TripBall";
import HomeTripList from "@/components/HomeTripList";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function countdownLabel(trip: TripListItem): string {
  const start = daysUntil(trip.startDate);
  const end = daysUntil(trip.endDate);
  if (start === null && end === null) return "Dates TBD";
  if (start !== null && start > 1) return `${start} days away`;
  if (start === 1) return "Tomorrow";
  if (start === 0) return "Today";
  if (end !== null && end >= 0) return "In progress";
  return "Completed";
}

function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  const s = new Date(`${start}T00:00:00Z`);
  const e = end ? new Date(`${end}T00:00:00Z`) : null;
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = s.toLocaleDateString("en-US", opts);
  const endStr = e ? e.toLocaleDateString("en-US", opts) : null;
  return endStr ? `${startStr} → ${endStr}` : startStr;
}

function nextUpTrip(trips: TripListItem[]): TripListItem | null {
  const upcoming = trips
    .filter((t) => { const d = daysUntil(t.startDate); return d !== null && d >= 0; })
    .sort((a, b) => (daysUntil(a.startDate) ?? 0) - (daysUntil(b.startDate) ?? 0));
  if (upcoming.length > 0) return upcoming[0];
  return (
    trips.find((t) => {
      const s = daysUntil(t.startDate);
      const e = daysUntil(t.endDate);
      return s !== null && s < 0 && (e === null || e >= 0);
    }) ?? null
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection({ trip }: { trip: TripListItem }) {
  const label = countdownLabel(trip);
  const dateRange = formatDateRange(trip.startDate, trip.endDate);

  return (
    <Link
      href={`/app/trips/${trip.id}`}
      aria-label={`${trip.name}, ${label}`}
      className="flex flex-col gap-5 rounded-t-2xl p-6 transition hover:brightness-110"
    >
      <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF8C00" }}>Next up</p>

      <div className="flex items-center gap-6">
        <TripBall color={trip.ballColor} fillPct={0} size={88} glow />
        <div className="min-w-0">
          <h2
            className="line-clamp-2 text-4xl font-semibold leading-tight text-white"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {trip.name}
          </h2>
          {dateRange && (
            <p className="mt-2 text-base text-white/80">{dateRange}</p>
          )}
        </div>
      </div>

      <div
        className="self-start rounded-full px-5 py-2 text-sm font-bold text-white"
        style={{ backgroundColor: trip.ballColor }}
      >
        {label}
      </div>
    </Link>
  );
}

function PlanNextPromptSection() {
  return (
    <div className="flex flex-col gap-4 rounded-t-2xl p-6">
      <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF8C00" }}>Next up</p>
      <div className="flex flex-col justify-center py-4">
        <h2
          className="mb-2 text-2xl font-semibold text-white"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Where to next?
        </h2>
        <p className="mb-5 text-sm text-white/80">
          All caught up on past trips. Time to start something new.
        </p>
        <Link
          href="/app/trips/new"
          className="self-start rounded-full px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
          style={{ backgroundColor: "#00A8CC", color: "#171717", boxShadow: "0 3px 0 #007a99", fontFamily: "var(--font-fredoka)" }}
        >
          Plan a trip
        </Link>
      </div>
    </div>
  );
}

// ─── Right-column stat tiles ───────────────────────────────────────────────────

function DaysAwayTile({ hero, nextDays }: { hero: TripListItem; nextDays: number | null }) {
  const display =
    nextDays === null ? "—" :
    nextDays === 0 ? "Today" :
    nextDays < 0 ? "Now" :
    nextDays;
  const sub = formatDateRange(hero.startDate, hero.endDate) ?? "Dates TBD";

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#3A3A3A] px-3 py-2 text-center"
      style={{ backgroundColor: "#2E2E2E" }}
    >
      <p className="mb-2 text-xs font-black uppercase tracking-widest text-white/80">Days away</p>
      <p
        className="font-semibold leading-none"
        style={{
          fontFamily: "var(--font-fredoka)",
          color: hero.ballColor,
          fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
        }}
      >
        {display}
      </p>
      <p className="mt-2 text-sm text-white/80">{sub}</p>
    </div>
  );
}

function TripStatTile({ count }: { count: number }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-between rounded-2xl border border-[#3A3A3A] px-3 py-2 text-center"
      style={{ backgroundColor: "#2E2E2E" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-white/80">Your trips</p>
        <p
          className="font-semibold leading-none text-[#00A8CC]"
          style={{
            fontFamily: "var(--font-fredoka)",
            fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
          }}
        >
          {count}
        </p>
        <p className="mt-2 text-sm text-white/80">
          {count === 1 ? "trip so far" : "trips so far"}
        </p>
      </div>
      <Link
        href="/app/trips/new"
        className="w-full flex items-center justify-center rounded-full py-2.5 text-sm font-bold transition hover:brightness-110 mb-2"
        style={{ backgroundColor: "#00A8CC", color: "#171717", boxShadow: "0 3px 0 #007a99" }}
      >
        + New trip
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const user = await requireUser();
  const userTrips = await listTripsForUser(user.id);

  if (userTrips.length === 0) redirect("/app/trips/new");

  const firstName = (user.name ?? "").split(" ")[0] || "there";
  const hero = nextUpTrip(userTrips);
  const nextDays = hero ? daysUntil(hero.startDate) : null;

  const tripItems = userTrips.map((t) => ({
    id: t.id,
    name: t.name,
    startDate: t.startDate,
    endDate: t.endDate,
    ballColor: t.ballColor,
    lifecycle: t.lifecycle,
  }));

  return (
    <div style={{ backgroundColor: "#404040", minHeight: "100vh" }} className="px-4 pb-10 sm:px-6">
      <TimeGreeting firstName={firstName} tripCount={userTrips.length} nextDays={nextDays} />

      {/* Bento grid: left card (hero + trip list) + right column (2 stat tiles) */}
      <div className="mt-2 grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        {/* Left card — grows with content */}
        <div
          className="lg:col-span-2 flex flex-col rounded-2xl border border-[#3A3A3A]"
          style={{ backgroundColor: "#2E2E2E" }}
        >
          {hero ? <HeroSection trip={hero} /> : <PlanNextPromptSection />}
          <div className="mx-6 border-t border-[#3A3A3A]" />
          <div className="flex-1 p-6">
            <HomeTripList trips={tripItems} />
          </div>
        </div>

        {/* Right column — sticky, fixed viewport height, tiles split it equally */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-32rem)]">
          {hero && <DaysAwayTile hero={hero} nextDays={nextDays} />}
          <TripStatTile count={userTrips.length} />
        </div>
      </div>
    </div>
  );
}
