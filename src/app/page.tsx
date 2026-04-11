import Link from "next/link";

const phases = [
  {
    name: "Preplanning",
    description:
      "Ask the smart questions early so the trip stops being vibes-only and starts being real.",
  },
  {
    name: "Itinerary",
    description:
      "Turn ideas into actual plans with events, meetups, reservations, and enough structure to avoid chaos.",
  },
  {
    name: "Packing",
    description:
      "Build shared and personal lists with suggestions based on destination, weather, and traveler quirks.",
  },
  {
    name: "Travel Day",
    description:
      "Guide everyone step by step from wake-up to arrival with checkoffs that keep the day on rails.",
  },
];

const premiumFeatures = [
  "Offline-ready trip schedule",
  "Group voting and activity polls",
  "Expense splitting and settle-up flows",
  "Smart destination-aware suggestions",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),rgba(255,255,255,0)_36%),linear-gradient(180deg,#f8f5ef_0%,#dbe7f4_42%,#f4efe7_100%)] text-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.92),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(113,160,196,0.25),transparent_26%),radial-gradient(circle_at_50%_75%,rgba(246,179,98,0.2),transparent_28%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-600">
              Ultimate Vacation
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              The travel planner for people who are done babysitting the group
              chat.
            </p>
          </div>
          <Link
            href="/workspace"
            className="rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-[0_12px_40px_rgba(31,41,55,0.08)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open Workspace
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-16">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/70 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 backdrop-blur-xl">
              Web-first planning with premium upgrades later
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
              Plan the trip. Wrangle the group. Stop forgetting the dumb stuff.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              A sassy vacation planner that guides travelers from preplanning
              to packing, travel-day checklists, itinerary coordination, and
              group expenses without turning the whole trip into admin work.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start the product shell
              </Link>
              <Link
                href="/workspace"
                className="rounded-full border border-slate-300/80 bg-white/65 px-6 py-3 text-sm font-medium text-slate-800 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
              >
                Open workspace preview
              </Link>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {phases.map((phase, index) => (
                <article
                  key={phase.name}
                  className="rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    transform: `perspective(1200px) rotateX(${index % 2 === 0 ? "2deg" : "-1deg"}) rotateY(${index % 2 === 0 ? "-3deg" : "2deg"})`,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Stage {index + 1}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    {phase.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {phase.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="absolute -right-2 top-28 h-28 w-28 rounded-full bg-sky-200/80 blur-3xl" />

            <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 p-6 shadow-[0_30px_90px_rgba(30,41,59,0.12)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Trip Snapshot
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    Tulum escape
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  12 days out
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-[1.6rem] bg-slate-950 px-5 py-4 text-white shadow-[0_20px_50px_rgba(15,23,42,0.28)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Today&apos;s nudge
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    Somebody still needs to confirm airport pickup. Yes, we are
                    looking at Devin.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-white/70 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Travel day flow
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                      <li>06:30 Wake up and get moving</li>
                      <li>07:10 Bags in the car</li>
                      <li>08:00 Grandma stop window built in</li>
                      <li>10:25 Airport snack diplomacy</li>
                    </ul>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/70 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Premium tease
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                      {premiumFeatures.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="grid gap-8 border-t border-white/60 py-8 text-sm text-slate-700 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Product Angle
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7">
              The strongest differentiator is travel-day execution: not just
              planning the vacation, but helping people actually get out the
              door on time with everything they need.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Build Plan
            </p>
            <p className="mt-3 text-base leading-7">
              Start with a stable web product, shape the data model around trips
              and phases, then layer in invites, paywalls, expenses, and
              offline-ready access.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
