import Link from "next/link";
import { PencilSimple, MapPin, Airplane, Car, Train, Boat, Shuffle } from "@phosphor-icons/react/dist/ssr";

// Mock data — replace with DB fetch
const mockSetup = {
  name: "Japan Spring 2025",
  destinations: [
    { city: "Tokyo", country: "Japan" },
    { city: "Kyoto", country: "Japan" },
    { city: "Osaka", country: "Japan" },
  ],
  startDate: "Apr 1, 2025",
  endDate: "Apr 14, 2025",
  durationDays: 14,
  tripTypes: ["City"],
  vibes: ["Relaxed"],
  transportModes: ["fly", "drive"],
  customTransport: [] as string[],
  travelers: 4,
  lodging: [
    { name: "Hotel Gracery Shinjuku", dates: "Apr 1 – Apr 8", city: "Tokyo" },
    { name: "Airbnb Gion District", dates: "Apr 8 – Apr 14", city: "Kyoto" },
  ],
  budget: 5000,
  budgetType: "per-person" as "total" | "per-person",
  currency: "USD",
  ballColor: "#FF2D8B",
};

const TRANSPORT_META: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  fly:    { label: "Flying",  color: "#FF2D8B", Icon: Airplane },
  drive:  { label: "Driving", color: "#FF8C00", Icon: Car },
  train:  { label: "Train",   color: "#00A8CC", Icon: Train },
  cruise: { label: "Cruise",  color: "#00C96B", Icon: Boat },
};

const DEST_COLORS = ["#FF2D8B", "#FFD600", "#00C96B", "#00A8CC", "#A855F7"];

export default async function SetupPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const s = mockSetup;

  const budgetDisplay =
    s.currency === "USD" ? `$${s.budget.toLocaleString()}` : `${s.budget.toLocaleString()} ${s.currency}`;

  return (
    <>
      <style>{`
        .setup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .sg-hero     { grid-column: 1 / 3; }
        .sg-bottom   { grid-column: 1 / 3; }

        @media (min-width: 768px) {
          .setup-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
          .sg-hero     { grid-column: 1;     grid-row: 1 / 3; }
          .sg-duration { grid-column: 2;     grid-row: 1;     }
          .sg-budget   { grid-column: 3;     grid-row: 1;     }
          .sg-travelers{ grid-column: 2;     grid-row: 2;     }
          .sg-transport{ grid-column: 3;     grid-row: 2;     }
          .sg-bottom   { grid-column: 1 / 4;               }
        }
      `}</style>

      <div>
        {/* ── Page header ───────────────────────────────────────── */}
        <div
          className="border-b flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-7 md:py-6"
          style={{ backgroundColor: "#282828", borderColor: "#333333" }}
        >
          <div>
            <h1
              className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Setup
            </h1>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Your trip at a glance
            </p>
          </div>
          <Link
            href={`/app/trips/${tripId}/setup/edit`}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm text-[#1a1a1a] transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: "#00A8CC" }}
          >
            <PencilSimple size={15} weight="bold" />
            <span className="hidden sm:inline">Edit Setup</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        </div>

        {/* ── Bento grid body ───────────────────────────────────── */}
        <div className="p-3 md:p-6">
          <div className="setup-grid">

            {/* ── HERO — mobile: full-width row 1, desktop: col 1 rows 1-2 ── */}
            <div
              className="sg-hero rounded-[20px] border flex flex-col justify-end relative overflow-hidden p-5 md:p-7"
              style={{
                backgroundColor: "#2e2e2e",
                borderColor: "#3a3a3a",
                minHeight: "200px",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 20% 50%, ${s.ballColor}1f 0%, transparent 65%)`,
                }}
              />
              <div className="relative">
                <div className="text-[10px] font-black uppercase tracking-[3px] text-white/35 mb-1">
                  Trip Name
                </div>
                <div
                  className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-2"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {s.name}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                  {s.destinations.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <MapPin size={12} weight="fill" style={{ color: DEST_COLORS[i % DEST_COLORS.length] }} />
                      <span className="text-sm font-bold text-white/70">
                        {d.city}, {d.country}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
                  style={{ backgroundColor: "rgba(0,168,204,0.12)", border: "1px solid rgba(0,168,204,0.25)" }}
                >
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Depart</div>
                    <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                      {s.startDate}
                    </div>
                  </div>
                  <div className="text-white/25 text-sm">→</div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Return</div>
                    <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                      {s.endDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── DURATION — mobile: col 1 row 2, desktop: col 2 row 1 ── */}
            <div
              className="sg-duration rounded-[20px] p-5 md:p-6 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: "#00A8CC" }}
            >
              <div
                className="font-semibold text-[#1a1a1a] leading-none"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
              >
                {s.durationDays}
              </div>
              <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">Days</div>
            </div>

            {/* ── BUDGET — mobile: col 2 row 2, desktop: col 3 row 1 ── */}
            <div
              className="sg-budget rounded-[20px] border p-5 md:p-6 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
            >
              <div className="text-[11px] font-black uppercase tracking-[2px] text-white/35 mb-2">Budget</div>
              <div
                className="font-semibold text-[#00C96B] leading-none"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(32px, 4.5vw, 68px)" }}
              >
                {budgetDisplay}
              </div>
              <div className="text-[12px] font-bold text-white/35 mt-2">
                {s.budgetType === "per-person" ? "per person" : "total"} · {s.currency}
              </div>
            </div>

            {/* ── TRAVELERS — mobile: col 1 row 3, desktop: col 2 row 2 ── */}
            <div
              className="sg-travelers rounded-[20px] p-5 md:p-6 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: "#FFD600" }}
            >
              <div
                className="font-semibold text-[#1a1a1a] leading-none"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
              >
                {s.travelers}
              </div>
              <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">Travelers</div>
            </div>

            {/* ── TRANSPORT — mobile: col 2 row 3, desktop: col 3 row 2 ── */}
            <div
              className="sg-transport rounded-[20px] border p-5 md:p-6 flex flex-col items-center justify-center gap-3"
              style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
            >
              <div className="text-[11px] font-black uppercase tracking-[2px] text-white/35 text-center">
                Getting There
              </div>
              <div className="flex flex-col items-center gap-2.5">
                {s.transportModes.map((key) => {
                  const meta = TRANSPORT_META[key];
                  if (!meta) return null;
                  const { label, color, Icon } = meta;
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        <Icon size={14} weight="fill" color="#fff" />
                      </div>
                      <span
                        className="font-semibold text-white"
                        style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(17px, 2vw, 26px)" }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
                {s.customTransport.map((label, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#A855F7" }}
                    >
                      <Shuffle size={14} weight="fill" color="#fff" />
                    </div>
                    <span
                      className="font-semibold text-white"
                      style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(17px, 2vw, 26px)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BOTTOM ROW — full-width, 3 cells ──────────────── */}
            <div className="sg-bottom grid grid-cols-1 gap-[10px] sm:grid-cols-3">
              {/* Trip type */}
              <div
                className="rounded-[20px] border p-5 flex flex-col items-center justify-center"
                style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
              >
                <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 text-center mb-3">
                  Type
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {s.tripTypes.map((t) => (
                    <span
                      key={t}
                      className="px-3.5 py-1.5 rounded-full text-xs font-black text-[#1a1a1a]"
                      style={{ backgroundColor: "#00A8CC" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div
                className="rounded-[20px] border p-5 flex flex-col items-center justify-center"
                style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
              >
                <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 text-center mb-3">
                  Vibe
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {s.vibes.map((v) => (
                    <span
                      key={v}
                      className="px-3.5 py-1.5 rounded-full text-xs font-black text-[#1a1a1a]"
                      style={{ backgroundColor: "#FFD600" }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lodging */}
              <div
                className="rounded-[20px] border p-5 flex flex-col items-center justify-center"
                style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
              >
                <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 text-center mb-3">
                  Lodging
                </div>
                <div className="flex flex-col items-center gap-2">
                  {s.lodging.map((l, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ backgroundColor: DEST_COLORS[i % DEST_COLORS.length] }}
                      />
                      <div>
                        <div className="text-[13px] font-bold text-white leading-tight">{l.name}</div>
                        <div className="text-[11px] font-semibold text-white/40">
                          {l.dates} · {l.city}
                        </div>
                      </div>
                    </div>
                  ))}
                  {s.lodging.length === 0 && (
                    <p className="text-xs font-semibold text-white/30 italic">Not set yet</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
