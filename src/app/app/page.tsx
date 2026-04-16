import Link from "next/link";

// Placeholder trip data -- replace with real DB query
const mockTrips = [
  { id: "trip-1", name: "Japan Spring 2025", fillPct: 72, color: "#FF2D8B", daysUntil: 42 },
  { id: "trip-2", name: "Weekend in Austin",  fillPct: 28, color: "#FFD600", daysUntil: 8 },
  { id: "trip-3", name: "Family Beach Week",  fillPct: 5,  color: "#00A8CC", daysUntil: 130 },
];

// Trip card bg -- ball donut cutout must match
const CARD_BG = "#2e2e2e";
const CARD_ARC = "#3a3a3a";
const CARD_BORDER = "#3a3a3a";

function TripCard({ trip }: { trip: typeof mockTrips[0] }) {
  const deg = (trip.fillPct / 100) * 360;
  const urgency = trip.daysUntil <= 7 && trip.daysUntil >= 0;

  const countdownText = () => {
    if (trip.daysUntil === 0) return "Today";
    if (trip.daysUntil === 1) return "Tomorrow";
    if (trip.daysUntil < 0) return "In progress";
    return `${trip.daysUntil} days away`;
  };

  return (
    <Link href={`/app/trips/${trip.id}`}>
      <div
        className="group relative overflow-hidden rounded-3xl p-5 border transition-all flex items-center gap-5 hover:brightness-110"
        style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
      >
        {/* Left color accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ backgroundColor: trip.color }}
        />

        {/* Trip ball -- cutout matches card bg */}
        <div
          className="rounded-full flex-shrink-0 relative ml-2"
          style={{
            width: 52,
            height: 52,
            background:
              trip.fillPct < 2
                ? "transparent"
                : `conic-gradient(${trip.color} ${deg}deg, ${CARD_ARC} ${deg}deg)`,
            border: trip.fillPct < 2 ? `2px dashed ${trip.color}` : "none",
            boxShadow: trip.fillPct > 70 ? `0 0 16px ${trip.color}40` : undefined,
          }}
        >
          {trip.fillPct > 0 && trip.fillPct < 100 && (
            <div
              className="absolute rounded-full"
              style={{ inset: "15%", backgroundColor: CARD_BG }}
            />
          )}
        </div>

        {/* Trip info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate group-hover:text-[#00A8CC] transition-colors">
            {trip.name}
          </h3>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: urgency ? trip.color : "white" }}
          >
            {countdownText()}
          </p>
        </div>

        {/* Fill percentage */}
        <div className="text-right flex-shrink-0">
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-fredoka)", color: trip.color }}
          >
            {trip.fillPct}%
          </span>
          <p className="text-xs font-medium text-white">planned</p>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const nextTrip = mockTrips.find((t) => t.daysUntil >= 0) ?? mockTrips[0];
  const nextDeg = (nextTrip.fillPct / 100) * 360;
  const HERO_BG = "#282828";
  const HERO_ARC = "#3a3a3a";

  const nextCountdown = () => {
    if (nextTrip.daysUntil === 0) return "Today";
    if (nextTrip.daysUntil === 1) return "Tomorrow";
    return `${nextTrip.daysUntil} days away`;
  };

  return (
    <div>
      {/* Hero strip -- dark header band */}
      <div
        className="relative overflow-hidden border-b"
        style={{ backgroundColor: HERO_BG, borderColor: "#333333" }}
      >
        {/* Color wash glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: "50%",
            left: "12%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${nextTrip.color}20 0%, transparent 65%)`,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 280,
            height: 280,
            top: "-50%",
            right: "-5%",
            background: nextTrip.color,
            opacity: 0.08,
            filter: "blur(48px)",
          }}
        />

        <div className="max-w-2xl mx-auto relative flex items-center gap-6 px-6 py-10">
          {/* Glowing trip ball -- cutout matches hero bg */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: -10,
                background: `radial-gradient(circle, ${nextTrip.color}28 0%, transparent 70%)`,
              }}
            />
            <div
              className="rounded-full relative animate-wave-pulse"
              style={{
                width: 72,
                height: 72,
                background: `conic-gradient(${nextTrip.color} ${nextDeg}deg, ${HERO_ARC} ${nextDeg}deg)`,
                boxShadow: `0 0 28px ${nextTrip.color}50`,
              }}
            >
              <div
                className="absolute rounded-full"
                style={{ inset: "15%", backgroundColor: HERO_BG }}
              />
            </div>
          </div>

          {/* Trip info */}
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
            <p className="text-sm font-semibold mt-1" style={{ color: nextTrip.color }}>
              {nextCountdown()} · {nextTrip.fillPct}% planned
            </p>
          </div>
        </div>
      </div>

      {/* Trip list -- sits on light #F5F7FA page background */}
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
              {mockTrips.length} of 3 slots used
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

        {mockTrips.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            {mockTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
