import Link from "next/link";
import {
  MapPin, Lightning, ArrowRight, CheckCircle, Star,
  CalendarBlank, Receipt, Backpack, ChartBar,
  Airplane, ForkKnife, Binoculars,
} from "@phosphor-icons/react/dist/ssr";

const trip = {
  name: "Japan Spring 2025",
  startDate: "Apr 1, 2025",
  endDate: "Apr 15, 2025",
  daysUntil: 42,
  memberCount: 4,
  fillPct: 72,
  ballColor: "#FF2D8B",
  phase: "Planning",
  destinations: [
    { city: "Tokyo", country: "Japan", color: "#FF2D8B" },
    { city: "Kyoto", country: "Japan", color: "#FFD600" },
    { city: "Osaka", country: "Japan", color: "#00C96B" },
  ],
};

const MEMBERS = [
  { name: "Chris",  color: "#FF2D8B" },
  { name: "Sarah",  color: "#00A8CC" },
  { name: "Mike",   color: "#FFD600" },
  { name: "Jordan", color: "#00C96B" },
];

const ACTIVITY = [
  { who: "Sarah",  action: "voted yes on",     subject: "teamLab Planets",  time: "2h ago",     color: "#FF2D8B" },
  { who: "Mike",   action: "proposed",          subject: "Ramen at Ichiran", time: "4h ago",     color: "#00A8CC" },
  { who: "You",    action: "added to Must Dos", subject: "Tsukiji Market",   time: "Yesterday",  color: "#FFD600" },
  { who: "Sarah",  action: "joined the trip",   subject: "",                 time: "2 days ago", color: "#00C96B" },
];

const MUST_DOS = [
  { title: "Tsukiji Fish Market",   who: "You",   scheduled: false },
  { title: "teamLab Planets",       who: "Mike",  scheduled: false },
  { title: "Fushimi Inari Shrine",  who: "Sarah", scheduled: true  },
];

const COMING_UP = [
  { date: "Day 1 · Apr 1", title: "Arrive at Narita Airport", color: "#FF8C00", Icon: Airplane   },
  { date: "Day 2 · Apr 2", title: "Shinjuku walking tour",    color: "#FF2D8B", Icon: Binoculars },
  { date: "Day 3 · Apr 3", title: "Tsukiji Outer Market",     color: "#FFD600", Icon: ForkKnife  },
];

const QUICK_ACTIONS = [
  { label: "Add to itinerary", href: "itinerary", color: "#00A8CC", shadow: "#0087a3", Icon: CalendarBlank },
  { label: "Log an expense",   href: "expenses",  color: "#00C96B", shadow: "#00944f", Icon: Receipt       },
  { label: "Check packing",    href: "packing",   color: "#FFD600", shadow: "#c9aa00", Icon: Backpack      },
  { label: "View polls",       href: "polls",     color: "#A855F7", shadow: "#7c3aed", Icon: ChartBar      },
];

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const base = `/app/trips/${tripId}`;
  const unscheduledCount = MUST_DOS.filter((m) => !m.scheduled).length;

  return (
    <>
      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .og-hero     { grid-column: 1 / 3; }
        .og-activity { grid-column: 1 / 3; }
        .og-mustdos  { grid-column: 1 / 3; }
        .og-upcoming { grid-column: 1 / 3; }
        .og-actions  { grid-column: 1 / 3; }

        @media (min-width: 768px) {
          .overview-grid  { grid-template-columns: 2fr 1fr 1fr; }
          .og-hero        { grid-column: 1;     grid-row: 1 / 3; }
          .og-countdown   { grid-column: 2;     grid-row: 1;     }
          .og-members     { grid-column: 3;     grid-row: 1;     }
          .og-progress    { grid-column: 2;     grid-row: 2;     }
          .og-nextaction  { grid-column: 3;     grid-row: 2;     }
          .og-activity    { grid-column: 1 / 3; grid-row: 3;     }
          .og-mustdos     { grid-column: 3;     grid-row: 3;     }
          .og-upcoming    { grid-column: 1 / 4; grid-row: 4;     }
          .og-actions     { grid-column: 1 / 4; grid-row: 5;     }
        }

        .action-btn {
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .action-btn:hover  { transform: translateY(2px); }
        .action-btn:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div
        className="border-b flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-7 md:py-6"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div>
          <h1
            className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {trip.name}
          </h1>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {trip.phase} · {trip.daysUntil} days away
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-black text-[#1a1a1a]"
          style={{ backgroundColor: trip.ballColor }}
        >
          {trip.phase}
        </div>
      </div>

      {/* ── Bento grid ───────────────────────────────────────────────── */}
      <div className="p-3 md:p-6">
        <div className="overview-grid">

          {/* ── HERO ─────────────────────────────────────────────────── */}
          <div
            className="og-hero rounded-[20px] border flex flex-col justify-end relative overflow-hidden p-5 md:p-7"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", minHeight: "200px" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 15% 65%, ${trip.ballColor}26 0%, transparent 60%)` }}
            />
            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[3px] text-white/30 mb-1">Your Trip</div>
              <div
                className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-3"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {trip.name}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                {trip.destinations.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <MapPin size={11} weight="fill" style={{ color: d.color }} />
                    <span className="text-sm font-bold text-white/70">{d.city}, {d.country}</span>
                  </div>
                ))}
              </div>
              <div
                className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
                style={{ backgroundColor: "rgba(0,168,204,0.10)", border: "1px solid rgba(0,168,204,0.22)" }}
              >
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Depart</div>
                  <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                    {trip.startDate}
                  </div>
                </div>
                <div className="text-white/25 text-sm">→</div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Return</div>
                  <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                    {trip.endDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COUNTDOWN ────────────────────────────────────────────── */}
          <div
            className="og-countdown rounded-[20px] flex flex-col items-center justify-center text-center p-5"
            style={{ backgroundColor: trip.ballColor }}
          >
            <div
              className="font-semibold text-[#1a1a1a] leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
            >
              {trip.daysUntil}
            </div>
            <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">Days Away</div>
          </div>

          {/* ── MEMBERS ──────────────────────────────────────────────── */}
          <div
            className="og-members rounded-[20px] flex flex-col items-center justify-center text-center gap-3 p-5"
            style={{ backgroundColor: "#FFD600" }}
          >
            <div
              className="font-semibold text-[#1a1a1a] leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              {trip.memberCount}
            </div>
            <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50">Travelers</div>
            <div className="flex gap-1.5">
              {MEMBERS.map((m) => (
                <div
                  key={m.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-[#1a1a1a]"
                  style={{ backgroundColor: m.color, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                  title={m.name}
                >
                  {m.name[0]}
                </div>
              ))}
            </div>
          </div>

          {/* ── PLANNING PROGRESS ────────────────────────────────────── */}
          <div
            className="og-progress rounded-[20px] border p-5 flex flex-col justify-center"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-2">Planned</div>
            <div
              className="font-semibold text-[#00C96B] leading-none mb-3"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(30px, 4vw, 52px)" }}
            >
              {trip.fillPct}%
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "#1e1e1e" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${trip.fillPct}%`, backgroundColor: "#00C96B" }}
              />
            </div>
            <Link
              href={`${base}/preplanning`}
              className="text-[11px] font-black text-[#00A8CC] hover:underline flex items-center gap-1"
            >
              Continue planning <ArrowRight size={10} weight="bold" />
            </Link>
          </div>

          {/* ── NEXT BEST ACTION ─────────────────────────────────────── */}
          <div
            className="og-nextaction rounded-[20px] border p-5 flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-3">Next Step</div>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "rgba(0,168,204,0.15)" }}
            >
              <Lightning size={20} weight="fill" style={{ color: "#00A8CC" }} />
            </div>
            <div className="text-sm font-bold text-white leading-snug mb-1">Add your flight details</div>
            <div className="text-[11px] text-white/40 font-semibold mb-3">Preplanning → Transport</div>
            <Link
              href={`${base}/preplanning`}
              className="flex items-center gap-1 text-[11px] font-black text-[#00A8CC] hover:underline"
            >
              Go there <ArrowRight size={10} weight="bold" />
            </Link>
          </div>

          {/* ── ACTIVITY FEED ────────────────────────────────────────── */}
          <div
            className="og-activity rounded-[20px] border p-5"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-4">Recent Activity</div>
            <div className="flex flex-col gap-3">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black text-[#1a1a1a]"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.who[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-white">{item.who}</span>
                    <span className="text-sm text-white/50"> {item.action}</span>
                    {item.subject && (
                      <span className="text-sm font-bold text-white"> {item.subject}</span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-white/30 flex-shrink-0 whitespace-nowrap">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MUST DOS ─────────────────────────────────────────────── */}
          <div
            className="og-mustdos rounded-[20px] border p-5"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35">Must Dos</div>
              {unscheduledCount > 0 && (
                <div
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(255,45,139,0.15)", color: "#FF2D8B" }}
                >
                  {unscheduledCount} unscheduled
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {MUST_DOS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {item.scheduled
                      ? <CheckCircle size={15} weight="fill" style={{ color: "#00C96B" }} />
                      : <Star size={15} weight="fill" style={{ color: "#FFD600" }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold leading-tight ${item.scheduled ? "text-white/35 line-through" : "text-white"}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] font-semibold text-white/30">{item.who}&apos;s Must Do</div>
                  </div>
                  {!item.scheduled && (
                    <Link
                      href={`${base}/itinerary`}
                      className="text-[10px] font-black text-[#00A8CC] hover:underline flex-shrink-0 mt-0.5"
                    >
                      Schedule
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── COMING UP ────────────────────────────────────────────── */}
          <div
            className="og-upcoming rounded-[20px] border p-5"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35">Coming Up</div>
              <Link
                href={`${base}/itinerary`}
                className="text-[10px] font-black text-[#00A8CC] hover:underline flex items-center gap-1"
              >
                Full itinerary <ArrowRight size={10} weight="bold" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COMING_UP.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[14px] p-4 flex gap-3 items-start"
                  style={{ backgroundColor: "#1e1e1e" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.Icon size={14} weight="fill" color="#fff" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-[1px] text-white/30 mb-0.5">{item.date}</div>
                    <div className="text-sm font-bold text-white leading-tight">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUICK ACTIONS ────────────────────────────────────────── */}
          <div
            className="og-actions rounded-[20px] border p-5"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-4">Quick Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={`${base}/${action.href}`}
                  className="action-btn flex items-center justify-center gap-2 rounded-[12px] py-3 px-4 text-sm font-black text-[#1a1a1a] hover:opacity-95"
                  style={{
                    backgroundColor: action.color,
                    boxShadow: `0 4px 0 ${action.shadow}`,
                  }}
                >
                  <action.Icon size={15} weight="fill" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
