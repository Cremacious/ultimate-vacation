import Link from "next/link";

const stageCards = [
  {
    title: "Preplanning",
    detail: "Destination, dates, transport, travelers, and the things nobody remembers to ask soon enough.",
  },
  {
    title: "Itinerary",
    detail: "Events, meetup points, restaurant plans, and a shared trip calendar that can survive group opinions.",
  },
  {
    title: "Packing",
    detail: "Personal and shared lists with suggestion hooks for destination, weather, and traveler needs.",
  },
  {
    title: "Travel Day",
    detail: "Checklist-driven execution for the actual day people need help staying on track.",
  },
];

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">
              Workspace Placeholder
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              The trip command center starts here.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              This shell gives us the first authenticated-app destination to
              build into next. Each stage is intentionally explained so future
              backend and UX work has a clear home.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/12"
          >
            Back to landing page
          </Link>
        </div>

        <section className="grid gap-5 py-10 md:grid-cols-2 xl:grid-cols-4">
          {stageCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-white/12 bg-white/6 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.3)] backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
                Stage {index + 1}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                {card.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                {card.detail}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2.2rem] border border-white/12 bg-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">
              Planned Modules
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/6 p-4">
                <h3 className="text-lg font-medium">Invite code flow</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Paid organizer owns the trip. Friends join the workspace with
                  a code.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/6 p-4">
                <h3 className="text-lg font-medium">Polls and voting</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Pick what to do next without turning the vacation into a group
                  chat war.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/6 p-4">
                <h3 className="text-lg font-medium">Expense tracking</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Budget, split expenses, and settle up with less math and less
                  resentment.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/6 p-4">
                <h3 className="text-lg font-medium">Offline readiness</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Critical schedule and checklist data should remain accessible
                  when service gets sketchy.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-amber-200/20 bg-gradient-to-b from-amber-200/12 to-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-100/70">
              Premium Boundary
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
              Monetization hooks are planned early, not bolted on later.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              The product should feel generous on free, but the most powerful
              collaboration, travel-day guidance, and expense tooling will live
              behind premium.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
