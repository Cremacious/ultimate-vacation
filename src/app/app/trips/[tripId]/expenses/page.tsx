export default async function ExpensesPage({
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
        Expenses
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Log costs, split the bill, settle up. No spreadsheet needed.
      </p>
      <div className="bg-white rounded-3xl border border-gray-100 text-center py-16">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4"
          style={{ border: "2px dashed #00C96B" }}
        />
        <p className="text-sm font-semibold text-gray-400">Expenses coming soon.</p>
      </div>
    </div>
  );
}
