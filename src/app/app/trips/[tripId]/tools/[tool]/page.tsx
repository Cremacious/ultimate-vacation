export default async function ToolPage({
  params,
}: {
  params: Promise<{ tripId: string; tool: string }>;
}) {
  const { tripId, tool } = await params;

  const toolLabel = tool
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <a
          href={`/app/trips/${tripId}/tools`}
          className="text-sm font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors"
        >
          Back to tools
        </a>
      </div>
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {toolLabel}
      </h1>
      <div className="bg-white rounded-3xl border border-gray-100 text-center py-16 mt-6">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4"
          style={{ border: "2px dashed #00A8CC" }}
        />
        <p className="text-sm font-semibold text-gray-400">{toolLabel} coming soon.</p>
      </div>
    </div>
  );
}
