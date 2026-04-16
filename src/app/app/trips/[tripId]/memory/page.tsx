export default async function MemoryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return (
    <div className="px-6 py-8 max-w-3xl">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Memory
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Trip stats, highlights, and the post-trip wrap-up. Relive it.
      </p>
      <div className="bg-white rounded-3xl border border-gray-100 text-center py-16">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4"
          style={{ border: "2px dashed #FF2D8B" }}
        />
        <p className="text-sm font-semibold text-gray-400">Memory coming soon.</p>
      </div>
    </div>
  );
}
