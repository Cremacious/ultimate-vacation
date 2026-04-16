import Link from "next/link";

export default function NewTripPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href="/app"
          className="text-sm font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors"
        >
          Back to trips
        </Link>
      </div>

      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        New trip.
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Give it a name and we will handle the rest.
      </p>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Trip name</label>
          <input
            type="text"
            placeholder="e.g. Japan Spring 2025"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Destination (optional)</label>
          <input
            type="text"
            placeholder="e.g. Tokyo, Japan"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Start date</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">End date</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors mt-2"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          Create trip
        </button>
      </form>
    </div>
  );
}
