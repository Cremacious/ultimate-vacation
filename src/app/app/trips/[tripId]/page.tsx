import { CalendarBlank, Receipt, Backpack, ChartBar } from "@phosphor-icons/react/dist/ssr";

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

  const actions = [
    { label: "Add itinerary item",  href: `/app/trips/${tripId}/itinerary`, color: "#00A8CC", icon: <CalendarBlank size={16} weight="fill" /> },
    { label: "Log an expense",      href: `/app/trips/${tripId}/expenses`,  color: "#00C96B", icon: <Receipt       size={16} weight="fill" /> },
    { label: "Check packing list",  href: `/app/trips/${tripId}/packing`,   color: "#FFD600", icon: <Backpack      size={16} weight="fill" /> },
    { label: "View polls",          href: `/app/trips/${tripId}/polls`,     color: "#FF2D8B", icon: <ChartBar      size={16} weight="fill" /> },
  ];

  return (
    <div>
      {/* Page header -- full-width dark band */}
      <div
        className="border-b px-6 py-8"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <h1
          className="text-4xl font-semibold text-white mb-1"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {trip.name}
        </h1>
        <p className="text-sm font-medium text-white">
          {trip.destination}
        </p>
      </div>

      {/* Page body -- sits on light #F5F7FA background */}
      <div className="px-6 py-8 max-w-3xl">

        {/* Stats row -- dark cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Days away",   value: trip.daysUntil,       color: trip.color },
            { label: "Trip length", value: "14 days",            color: "#00A8CC" },
            { label: "Travelers",   value: trip.memberCount,     color: "#FFD600" },
            { label: "Planned",     value: `${trip.fillPct}%`,   color: "#00C96B" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
            >
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-fredoka)", color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium mt-0.5 text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick actions -- lighter dark cards with colored icon circles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="group rounded-2xl p-4 border transition-all flex items-center gap-3 hover:brightness-110"
              style={{ backgroundColor: "#444444", borderColor: "#525252" }}
            >
              {/* Colored icon circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: action.color }}
              >
                <span className="text-white">{action.icon}</span>
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-[#00A8CC] transition-colors">
                {action.label}
              </span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
