import Link from "next/link";

export default function PremiumPage() {
  const perks = [
    "No ads across the whole app",
    "Receipt scanning with OCR",
    "Offline mode",
    "Currency converter",
    "Smart packing suggestions",
    "Trip duplication",
    "Priority support",
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/app/account"
          className="text-sm font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors"
        >
          Back to account
        </Link>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl p-8" style={{ boxShadow: "0 8px 32px #00A8CC20" }}>
        <p className="text-sm font-bold text-[#00A8CC] uppercase tracking-widest mb-2">TripWave Premium</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-5xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>$5</span>
          <span className="text-gray-400 font-medium mb-1.5">/ one time</span>
        </div>
        <p className="text-sm text-gray-400 font-medium mb-8">Pay once, own it forever. No subscriptions.</p>

        <ul className="space-y-3 mb-8">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-sm font-medium text-white">
              <span className="w-5 h-5 rounded-full bg-[#00A8CC]/20 text-[#00A8CC] flex items-center justify-center text-xs font-bold flex-shrink-0">
                ✓
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <button
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          Unlock Premium -- $5
        </button>

        <p className="text-center text-xs text-gray-500 font-medium mt-4">
          One-time payment. Secure checkout.
        </p>
      </div>
    </div>
  );
}
