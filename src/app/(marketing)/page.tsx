import Link from "next/link";

export default function LandingPage() {
  const ballStates = [
    { pct: 8, color: "#00A8CC", label: "Just created" },
    { pct: 35, color: "#FFD600", label: "Taking shape" },
    { pct: 68, color: "#FF2D8B", label: "Getting close" },
    { pct: 95, color: "#00A8CC", label: "Ready to go" },
  ];

  const features = [
    {
      tag: "Preplanning",
      tagColor: "#00A8CC",
      title: "Cover everything before you leave.",
      desc: "Flights, hotels, documents, dietary notes, group availability. The wizard handles it.",
    },
    {
      tag: "Travel Day",
      tagColor: "#FF2D8B",
      title: "Game day has a playbook.",
      desc: "Everyone knows where to be, what each person is responsible for. Nobody forgets their passport.",
    },
    {
      tag: "Itinerary",
      tagColor: "#FFD600",
      title: "Everyone builds the plan together.",
      desc: "Add activities, vote on options, log expenses, and promote wishlist ideas to real plans.",
    },
    {
      tag: "Expenses",
      tagColor: "#00C96B",
      title: "Every dollar tracked. Every debt settled.",
      desc: "Split bills, log receipts, track budgets from day 0. No awkward texts at the end.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative px-6 py-28 overflow-hidden text-center">
        {/* Background blobs */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "-20%",
            right: "-15%",
            background: "#00A8CC",
            opacity: 0.18,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 440,
            height: 440,
            bottom: "-15%",
            left: "-12%",
            background: "#FF2D8B",
            opacity: 0.14,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 120,
            height: 120,
            top: "30%",
            left: "8%",
            background: "#FFD600",
            opacity: 0.25,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 60,
            height: 60,
            bottom: "20%",
            right: "12%",
            background: "#00C96B",
            opacity: 0.22,
          }}
        />

        {/* Hero ball */}
        <div className="relative flex justify-center mb-10">
          <div className="animate-wave-pulse relative">
            <div
              className="rounded-full relative"
              style={{
                width: 120,
                height: 120,
                background: "conic-gradient(#00A8CC 260deg, #E5E7EB 260deg)",
                boxShadow: "0 0 60px #00A8CC40",
              }}
            >
              <div className="absolute rounded-full bg-white" style={{ inset: "15%" }} />
            </div>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <h1
            className="text-6xl md:text-7xl font-semibold text-[#1A1A1A] leading-tight mb-3"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Plan the trip.
            <br />
            <span className="text-[#00A8CC]">Not the group chat.</span>
          </h1>
          <p className="text-base text-gray-400 font-medium mb-3">
            Get everyone on the same wave.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/signup"
              className="bg-[#00A8CC] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0096b8] transition-colors text-center"
              style={{ boxShadow: "0 4px 0 #007a99" }}
            >
              Start planning free
            </Link>
            <Link
              href="/pricing"
              className="bg-white text-[#1A1A1A] font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors border border-gray-200 text-center"
            >
              See pricing
            </Link>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-4">
            Free forever. Members by invite. No surprises.
          </p>
        </div>
      </section>

      {/* Chaos stats -- dark section */}
      <section className="bg-[#1A1A1A] px-6 py-20 text-center">
        <h2
          className="leading-tight mb-6"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <span className="block text-[#FFD600]">17 group chats.</span>
          <span className="block text-[#FF2D8B]">4 spreadsheets.</span>
          <span className="block text-white">3 people who still don't know the plan.</span>
        </h2>
        <p className="text-white/85 font-medium max-w-md mx-auto text-sm leading-relaxed">
          Group trip planning is chaos. TripWave is the one place that keeps everyone organized from the first idea to the last expense.
        </p>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-semibold text-[#1A1A1A] text-center mb-12"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Every stage of the trip. One place.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                  style={{ backgroundColor: `${f.tagColor}18`, color: f.tagColor }}
                >
                  {f.tag}
                </span>
                <h3 className="font-bold text-[#1A1A1A] mb-1.5 leading-snug">{f.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ball showcase */}
      <section className="bg-[#F8F8FA] px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-semibold text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Meet your trip.
          </h2>
          <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto leading-relaxed">
            Every trip gets a ball. It fills up, changes color, and basically guilt-trips you until the plan is done. Hit 100% and it&#39;s party time. Color it however you want.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {ballStates.map((b) => {
              const deg = (b.pct / 100) * 360;
              return (
                <div key={b.label} className="flex flex-col items-center gap-3">
                  <div
                    className="rounded-full relative"
                    style={{
                      width: 80,
                      height: 80,
                      background:
                        b.pct < 2
                          ? "transparent"
                          : `conic-gradient(${b.color} ${deg}deg, #E5E7EB ${deg}deg)`,
                      border: b.pct < 2 ? `2px dashed ${b.color}` : "none",
                      boxShadow: b.pct > 70 ? `0 0 24px ${b.color}40` : undefined,
                    }}
                  >
                    {b.pct > 0 && b.pct < 100 && (
                      <div className="absolute rounded-full bg-[#F8F8FA]" style={{ inset: "15%" }} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-400">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Memory teaser -- dark section */}
      <section className="bg-[#1A1A1A] px-6 py-20 text-center">
        <h2
          className="text-4xl font-semibold text-white mb-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Every trip tells a story.
        </h2>
        <p className="text-white/75 font-medium mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          At the end, TripWave shows you everything: who came, what you spent, what you did, and the moments that made it. Yours to keep.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-[#FFD600] text-[#1A1A1A] font-bold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          style={{ boxShadow: "0 4px 0 #c9a900" }}
        >
          Plan your first trip free
        </Link>
      </section>
    </>
  );
}
