import Link from "next/link";

const perks = [
  "Run the itinerary without babysitting the group chat",
  "Keep travel day moving with checklists and timing",
  "Track what matters before somebody forgets it",
];

export default function SignupPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(160deg,#eef2f8_0%,#e2e9f3_52%,#f4f6fa_100%)] text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,95,162,0.16),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(76,208,255,0.18),transparent_28%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-600">
            Ultimate Vacation
          </p>
          <Link
            href="/"
            className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
          >
            Back home
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.85fr] lg:gap-8">
          <section className="rounded-[2rem] border border-slate-700/70 bg-[#1a2130] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="mb-10 flex items-start justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-200/70">
                  Color Pop Mode
                </p>
                <h1 className="mt-5 max-w-2xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl">
                  Look hot.
                  <br />
                  Travel organized.
                </h1>
              </div>
              <div className="relative hidden h-36 w-36 shrink-0 lg:block">
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-pink-400" />
                <div className="absolute right-10 top-10 h-14 w-14 rounded-full bg-cyan-300" />
                <div className="absolute right-2 top-20 h-8 w-8 rounded-full bg-yellow-300" />
              </div>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              A smarter planner for the itinerary, the packing list, the
              travel-day scramble, and the friend who absolutely forgot
              something.
            </p>

            <div className="mt-10 max-w-xl rounded-[1.6rem] border border-slate-600 bg-slate-800 px-6 pb-8 pt-6 shadow-[0_10px_0_0_#16202c,0_28px_60px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                Trip Snapshot
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                New York long weekend
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Reservations locked. Budget behaving. Jordan still has not
                packed.
              </p>
            </div>

            <ul className="mt-10 space-y-4">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 text-base text-slate-100"
                >
                  <span className="h-3 w-3 rounded-full bg-yellow-300" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-base text-slate-200">
              You bring the vibe. We bring the receipts, reminders, and
              timeline.
            </p>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-50 px-8 pb-8 pt-7 text-slate-950 shadow-[0_12px_0_0_#e7eef4,0_28px_70px_rgba(15,23,42,0.1)]">
            <div className="inline-flex rounded-full border border-pink-200 bg-pink-100/80 px-4 pb-3 pt-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-700 shadow-[0_6px_0_0_#efc8d9]">
              Free To Start
            </div>

            <h2 className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-balance">
              Sign up and be the capable friend.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              The glamorous project manager of the group.
            </p>

            <form className="mt-8 space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Full name
                </span>
                <input
                  type="text"
                  placeholder="Taylor Sunshine"
                  className="w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 pb-4 pt-3 text-base text-slate-900 shadow-[0_8px_0_0_#edf2f6] outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@tripboss.com"
                  className="w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 pb-4 pt-3 text-base text-slate-900 shadow-[0_8px_0_0_#edf2f6] outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Password
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 pb-4 pt-3 text-base text-slate-900 shadow-[0_8px_0_0_#edf2f6] outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-[1.25rem] border border-cyan-400 bg-cyan-400 px-5 pb-5 pt-4 text-base font-semibold text-slate-950 shadow-[0_10px_0_0_#2489ae] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Create account
              </button>

              <button
                type="button"
                className="w-full rounded-[1.1rem] border border-slate-200 bg-white px-5 pb-4 pt-3 text-base font-semibold text-slate-800 shadow-[0_8px_0_0_#edf2f6] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Continue with Google
              </button>
            </form>

            <p className="mt-8 text-sm leading-6 text-slate-500">
              Cute UI. Serious anti-chaos policy. Nobody is missing the train
              on your watch.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
