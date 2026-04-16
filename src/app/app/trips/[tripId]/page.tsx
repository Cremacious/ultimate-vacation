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
        <p className="text-gray-400 font-medium text-sm">{trip.destination}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Days away", value: trip.daysUntil },
          { label: "Trip length", value: "14 days" },
          { label: "Travelers", value: trip.memberCount },
          { label: "Planned", value: `${trip.fillPct}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <p
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Add itinerary item", href: `/app/trips/${tripId}/itinerary`, color: "#00A8CC" },
          { label: "Log an expense", href: `/app/trips/${tripId}/expenses`, color: "#00C96B" },
          { label: "Check packing list", href: `/app/trips/${tripId}/packing`, color: "#FFD600" },
          { label: "View polls", href: `/app/trips/${tripId}/polls`, color: "#FFD600" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#00A8CC]/30 hover:shadow-sm transition-all flex items-center gap-3 group"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
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
