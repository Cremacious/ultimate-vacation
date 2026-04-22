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

// ─── Sub-components (server-renderable) ───────────────────────────────────────

function NextUpHero({ trip }: { trip: TripListItem }) {
  const label = countdownLabel(trip);
  return (
    <Link
      href={`/app/trips/${trip.id}`}
      aria-label={`${trip.name}, ${label}`}
      className="block mx-4 sm:mx-6 rounded-2xl border border-[#2A2B45] px-6 py-8 hover:brightness-110 transition"
      style={{ backgroundColor: "#15162A", boxShadow: `0 0 32px ${trip.ballColor}30` }}
    >
      <div className="flex items-center gap-6">
        <TripBall color={trip.ballColor} fillPct={0} size={72} glow />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-0.5">
            Next up
          </p>
          <h2
            className="text-3xl font-semibold text-white leading-tight line-clamp-2"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {trip.name}
          </h2>
          <p className="text-sm font-semibold mt-1" style={{ color: trip.ballColor }}>
            {label}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PlanNextPrompt() {
  return (
    <div
      className="mx-4 sm:mx-6 rounded-2xl border border-[#2A2B45] px-6 py-8"
      style={{ backgroundColor: "#15162A" }}
    >
      <h2
        className="text-2xl font-semibold text-white mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Ready for another one?
      </h2>
      <p className="text-sm text-white/60 mb-4">
        Your past trips are wrapped. Start planning your next one.
      </p>
      <Link
        href="/app/trips/new"
        className="inline-block font-bold rounded-full px-5 py-2.5 text-sm hover:brightness-110 transition"
        style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
      >
        Start new trip
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-20 px-6 text-center gap-4">
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#00E5FF]/40" />
      <div>
        <h2
          className="text-xl font-semibold text-white mb-1"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Every great trip starts with a name.
        </h2>
        <p className="text-sm text-white/50">Start planning your first adventure.</p>
      </div>
      <Link
        href="/app/trips/new"
        className="font-bold rounded-full px-6 py-3 text-sm hover:brightness-110 transition"
        style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
      >
        Create a trip
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

  return (
    <div style={{ backgroundColor: "#0A0A12", minHeight: "100vh" }}>
      <TimeGreeting firstName={firstName} tripCount={userTrips.length} nextDays={nextDays} />

      {userTrips.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-6">
            {hero ? <NextUpHero trip={hero} /> : <PlanNextPrompt />}
          </div>

          <div className="px-4 sm:px-6 pb-10">
            <HomeTripList
              trips={userTrips.map((t) => ({
                id: t.id,
                name: t.name,
                startDate: t.startDate,
                endDate: t.endDate,
                ballColor: t.ballColor,
                lifecycle: t.lifecycle,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
