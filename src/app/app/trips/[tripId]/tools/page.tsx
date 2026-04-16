const toolCategories = [
  {
    title: "Planning",
    color: "#00A8CC",
    tools: [
      { key: "weather", label: "Weather forecast", premium: false },
      { key: "packing-calc", label: "Packing calculator", premium: false },
      { key: "group-availability", label: "Group availability", premium: false },
      { key: "doc-checklist", label: "Document checklist", premium: false },
      { key: "jetlag", label: "Jet lag advisor", premium: false },
      { key: "shopping-list", label: "Shopping list", premium: false },
    ],
  },
  {
    title: "Destination",
    color: "#FFD600",
    tools: [
      { key: "phrasebook", label: "Phrasebook", premium: false },
      { key: "tipping", label: "Tipping guide", premium: false },
      { key: "voltage", label: "Voltage and plugs", premium: false },
      { key: "driving", label: "Driving rules", premium: false },
      { key: "emergency", label: "Emergency contacts", premium: false },
      { key: "allergy-card", label: "Allergy card", premium: false },
      { key: "unit-converter", label: "Unit converter", premium: false },
      { key: "currency", label: "Currency converter", premium: true },
    ],
  },
  {
    title: "On the trip",
    color: "#FF2D8B",
    tools: [
      { key: "bill-splitter", label: "Bill splitter", premium: false },
      { key: "meetup", label: "Meetup point", premium: false },
      { key: "quick-vote", label: "Quick vote", premium: false },
      { key: "departure-brief", label: "Departure brief", premium: false },
    ],
  },
  {
    title: "Accessibility",
    color: "#00C96B",
    tools: [
      { key: "accessibility-planner", label: "Accessibility planner", premium: false },
      { key: "medication-reminder", label: "Medication reminder", premium: false },
      { key: "kids-mode", label: "Kids mode", premium: false },
    ],
  },
];

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return (
    <div className="px-6 py-8 max-w-3xl">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Tools
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Everything you need before, during, and after the trip.
      </p>

      <div className="space-y-8">
        {toolCategories.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {cat.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cat.tools.map((tool) => (
                <a
                  key={tool.key}
                  href={`/app/trips/${tripId}/tools/${tool.key}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#00A8CC]/30 hover:shadow-sm transition-all group relative"
                >
                  {tool.premium && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold text-[#FF2D8B] bg-[#FF2D8B]/10 px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                  <div
                    className="w-2 h-2 rounded-full mb-2"
                    style={{ backgroundColor: cat.color }}
                  />
                  <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#00A8CC] transition-colors leading-snug">
                    {tool.label}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
