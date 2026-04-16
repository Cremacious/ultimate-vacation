export default async function WishlistPage({
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
        Wishlist
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Everyone adds ideas. The best ones make it into the itinerary.
      </p>
      <div className="bg-white rounded-3xl border border-gray-100 text-center py-16">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4"
          style={{ border: "2px dashed #00A8CC" }}
        />
        <p className="text-sm font-semibold text-gray-400">Wishlist coming soon.</p>
      </div>
    </div>
  );
}
