import Link from "next/link";

// Placeholder trip data -- replace with real DB query
const mockTrips = [
  { id: "trip-1", name: "Japan Spring 2025", fillPct: 72, color: "#FF2D8B", daysUntil: 42 },
  { id: "trip-2", name: "Weekend in Austin", fillPct: 28, color: "#FFD600", daysUntil: 8 },
  { id: "trip-3", name: "Family Beach Week", fillPct: 5, color: "#00A8CC", daysUntil: 130 },
];

function TripCard({ trip }: { trip: typeof mockTrips[0] }) {
  const deg = (trip.fillPct / 100) * 360;

  const countdownText = () => {
    if (trip.daysUntil === 0) return "Today!";
    if (trip.daysUntil === 1) return "Tomorrow";
    if (trip.daysUntil < 0) return "In progress";
    return `${trip.daysUntil} days away`;
  };

  const urgency = trip.daysUntil <= 7 && trip.daysUntil >= 0;

  return (
    <Link href={`/app/trips/${trip.id}`}>
      <div
        className="bg-white rounded-3xl p-5 border hover:shadow-md transition-all flex items-center gap-5 group relative overflow-hidden"
        style={{ borderColor: `${trip.color}30` }}
      >
        {/* Left color accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ backgroundColor: trip.color }}
        />

        {/* Ball */}
        <div
          className="rounded-full flex-shrink-0 relative ml-2"
          style={{
            width: 52,
            height: 52,
            background:
              trip.fillPct < 2
                ? "transparent"
                : `conic-gradient(${trip.color} ${deg}deg, #E5E7EB ${deg}deg)`,
            border: trip.fillPct < 2 ? `2px dashed ${trip.color}` : "none",
            boxShadow: trip.fillPct > 70 ? `0 0 16px ${trip.color}40` : undefined,
          }}
        >
          {trip.fillPct > 0 && trip.fillPct < 100 && (
            <div className="absolute rounded-full bg-white" style={{ inset: "15%" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1A1A1A] truncate group-hover:text-[#00A8CC] transition-colors">
            {trip.name}
          </h3>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: urgency ? trip.color : "#9CA3AF" }}
          >
            {countdownText()}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-fredoka)", color: trip.color }}
          >
            {trip.fillPct}%
          </span>
          <p className="text-xs text-gray-400 font-medium">planned</p>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const nextTrip = mockTrips.find((t) => t.daysUntil >= 0) ?? mockTrips[0];
  const nextDeg = (nextTrip.fillPct / 100) * 360;

  return (
    <div>
      {/* Colorful hero strip */}
      <div
        className="px-6 py-10 relative overflow-hidden"
        style={{ background: "#1A1A1A" }}
      >
        {/* Background blobs */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{ width: 300, height: 300, top: "-40%", right: "-5%", background: nextTrip.color, opacity: 0.2 }}
        />
        <div className="max-w-2xl mx-auto relative flex items-center gap-6">
          {/* Next trip ball */}
          <div
            className="rounded-full flex-shrink-0 relative animate-wave-pulse"
            style={{
              width: 64,
              height: 64,
              background: `conic-gradient(${nextTrip.color} ${nextDeg}deg, #333 ${nextDeg}deg)`,
              boxShadow: `0 0 24px ${nextTrip.color}50`,
            }}
          >
            <div className="absolute rounded-full" style={{ inset: "15%", background: "#1A1A1A" }} />
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">Next up</p>
            <h2
              className="text-2xl font-semibold text-white leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {nextTrip.name}
            </h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: nextTrip.color }}>
              {nextTrip.daysUntil === 0
                ? "Today!"
                : nextTrip.daysUntil === 1
                ? "Tomorrow"
                : `${nextTrip.daysUntil} days away`}{" "}
              -- {nextTrip.fillPct}% planned
            </p>
          </div>
        </div>
      </div>

      {/* Trip list */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Your trips
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {mockTrips.length} of 3 saved slots used.
            </p>
          </div>

          <Link
            href="/app/trips/new"
            className="bg-[#00A8CC] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#0096b8] transition-colors text-sm"
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
            <p className="text-gray-400 font-medium text-sm mb-6">
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
