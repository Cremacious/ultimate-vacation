// Placeholder trip overview -- replace with real data fetching
export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const trip = {
    id: tripId,
    name: "Japan Spring 2025",
    destination: "Tokyo, Japan",
    startDate: "2025-04-01",
    endDate: "2025-04-14",
    fillPct: 72,
    color: "#FF2D8B",
    daysUntil: 42,
    memberCount: 4,
  };

  return (
    <div className="px-6 py-8 max-w-3xl">
      {/* Trip header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-semibold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {trip.name}
        </h1>
        <p className="text-sm font-medium text-gray-400">
          {trip.destination}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Days away",   value: trip.daysUntil,          color: trip.color },
          { label: "Trip length", value: "14 days",               color: "#00A8CC" },
          { label: "Travelers",   value: trip.memberCount,        color: "#FFD600" },
          { label: "Planned",     value: `${trip.fillPct}%`,      color: "#00C96B" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 border border-gray-100 bg-white"
          >
            <p
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-fredoka)", color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs font-medium mt-0.5 text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Add itinerary item",  href: `/app/trips/${tripId}/itinerary`, color: "#00A8CC" },
          { label: "Log an expense",      href: `/app/trips/${tripId}/expenses`,  color: "#00C96B" },
          { label: "Check packing list",  href: `/app/trips/${tripId}/packing`,   color: "#FFD600" },
          { label: "View polls",          href: `/app/trips/${tripId}/polls`,     color: "#FF2D8B" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="group rounded-2xl p-4 border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: action.color }}
            />
            <span className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#00A8CC] transition-colors">
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
