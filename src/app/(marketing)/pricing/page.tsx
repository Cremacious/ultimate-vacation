import Link from "next/link";

export default function PricingPage() {
  const freeFeatures = [
    "1 active trip",
    "Up to 3 saved trips",
    "Full itinerary builder",
    "Preplanning and polls",
    "Expense tracking and splitting",
    "Packing lists",
    "Wishlist and notes",
    "Trip vault",
    "Smart packing suggestions",
    "Group memory tools",
    "All destination reference tools",
    "Weather, jet lag, unit converter",
    "Countdown widget",
    "Trip memory vault",
  ];

  const premiumFeatures = [
    "Everything in free",
    "No ads. Ever.",
    "Offline mode (itinerary, packing, travel day)",
    "Receipt scanning with AI",
    "Currency converter",
    "Smart suggestions (vibe and destination aware)",
    "Advanced travel day templates",
    "Trip export",
    "Trip duplication",
    "Offline phrasebook and confirmation vault",
  ];

  return (
    <div className="relative px-6 py-20 overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 400, height: 400, top: "-10%", right: "-8%", background: "#00A8CC", opacity: 0.1 }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 280, height: 280, bottom: "5%", left: "-6%", background: "#FFD600", opacity: 0.12 }}
      />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-16">
          <h1
            className="text-5xl font-semibold text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Simple pricing.
          </h1>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">
            Free gets you going. Five dollars gets you everything. Forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Free */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-fredoka)" }}>$0</span>
                <span className="text-gray-400 font-medium mb-1.5">/ forever</span>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-1">Ad-supported.</p>
            </div>

            <Link
              href="/signup"
              className="block w-full text-center font-bold py-3.5 rounded-full border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-gray-50 transition-colors mb-8"
            >
              Start free
            </Link>

            <ul className="space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium text-[#1A1A1A]">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: "#00A8CC22", color: "#00A8CC" }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div
            className="bg-[#1A1A1A] rounded-3xl p-8"
            style={{ boxShadow: "0 8px 40px #00A8CC25" }}
          >
            <div className="mb-6">
              <p className="text-sm font-bold text-[#00A8CC] uppercase tracking-widest mb-2">Premium</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>$5</span>
                <span className="text-gray-400 font-medium mb-1.5">/ one time</span>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-1">Once. Never again.</p>
            </div>

            <Link
              href="/signup"
              className="block w-full text-center font-bold py-3.5 rounded-full bg-[#FFD600] text-[#1A1A1A] hover:opacity-90 transition-opacity mb-8"
              style={{ boxShadow: "0 3px 0 #c9a900" }}
            >
              Sign up and unlock
            </Link>

            <ul className="space-y-2.5">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium text-white">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: "#00A8CC30", color: "#00A8CC" }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-8">
          One payment. No renewals. No receipts. The trip is already stressful enough.
        </p>
      </div>
    </div>
  );
}
