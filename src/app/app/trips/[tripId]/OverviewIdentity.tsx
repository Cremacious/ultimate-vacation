// Deterministic palette for member initials — cycles if there are more members than colors.
const MEMBER_COLORS = [
  "#FF2D8B",
  "#00A8CC",
  "#FFD600",
  "#00C96B",
  "#A855F7",
  "#FF8C00",
  "#00E5FF",
  "#FF3DA7",
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export type IdentityMember = { userId: string; name: string; role: string };

interface Props {
  tripName: string;
  phase: string;
  ballColor: string;
  startDate: string | null;
  endDate: string | null;
  countdownNumber: string;
  countdownLabel: string;
  members: IdentityMember[];
}

/**
 * Trip identity bento: hero + countdown + travelers.
 * Hero carries brand identity (name, dates, phase) with a ballColor radial glow.
 * Countdown and travelers tiles give the page command-center presence.
 */
export default function OverviewIdentity({
  tripName,
  phase,
  ballColor,
  startDate,
  endDate,
  countdownNumber,
  countdownLabel,
  members,
}: Props) {
  const hasDates = Boolean(startDate || endDate);
  const visibleMembers = members.slice(0, 6);
  const extraMembers = Math.max(0, members.length - visibleMembers.length);

  return (
    <section
      aria-label="Trip identity"
      className="px-3 pt-3 pb-0 md:px-6 md:pt-6"
    >
      <style>{`
        .identity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 768px) {
          .identity-grid {
            grid-template-columns: 2fr 1fr 1fr;
            grid-auto-rows: minmax(200px, auto);
          }
          .ig-hero      { grid-column: 1; grid-row: 1; }
          .ig-countdown { grid-column: 2; grid-row: 1; }
          .ig-members   { grid-column: 3; grid-row: 1; }
        }
      `}</style>

      <div className="identity-grid">
        {/* HERO */}
        <div
          className="ig-hero rounded-[22px] border relative overflow-hidden p-5 md:p-7 flex flex-col justify-between min-h-[200px]"
          style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 15% 70%, ${ballColor}33 0%, transparent 62%)`,
            }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="text-[10px] font-black uppercase tracking-[3px] text-white/55">
              Your trip
            </div>
            <span
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black text-[#1a1a1a]"
              style={{ backgroundColor: ballColor }}
            >
              {phase}
            </span>
          </div>

          <div className="relative mt-4">
            <h1
              className="text-3xl md:text-[2.6rem] font-semibold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {tripName}
            </h1>

            {hasDates && (
              <div
                className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
                style={{
                  backgroundColor: `${ballColor}1F`,
                  border: `1px solid ${ballColor}40`,
                }}
              >
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Depart
                  </div>
                  <div
                    className="font-semibold text-base text-white leading-none"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {formatDate(startDate)}
                  </div>
                </div>
                <div className="text-white/45 text-sm">→</div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Return
                  </div>
                  <div
                    className="font-semibold text-base text-white leading-none"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {formatDate(endDate)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COUNTDOWN */}
        <div
          className="ig-countdown rounded-[22px] flex flex-col items-center justify-center text-center p-5 min-h-[180px]"
          style={{ backgroundColor: ballColor }}
        >
          <div
            className="font-semibold text-[#1a1a1a] leading-none"
            style={{
              fontFamily: "var(--font-fredoka)",
              fontSize: "clamp(56px, 6vw, 96px)",
            }}
          >
            {countdownNumber}
          </div>
          <div className="text-[12px] font-black uppercase tracking-[2px] text-black/60 mt-2">
            {countdownLabel}
          </div>
        </div>

        {/* TRAVELERS */}
        <div
          className="ig-members rounded-[22px] flex flex-col items-center justify-center text-center gap-3 p-5 min-h-[180px]"
          style={{ backgroundColor: "#FFD600" }}
        >
          <div
            className="font-semibold text-[#1a1a1a] leading-none"
            style={{
              fontFamily: "var(--font-fredoka)",
              fontSize: "clamp(44px, 5vw, 72px)",
            }}
          >
            {members.length}
          </div>
          <div className="text-[12px] font-black uppercase tracking-[2px] text-black/60">
            {members.length === 1 ? "Traveler" : "Travelers"}
          </div>
          {visibleMembers.length > 0 && (
            <div
              className="flex gap-1.5 flex-wrap justify-center"
              aria-label={`${members.length} traveler${members.length === 1 ? "" : "s"}`}
            >
              {visibleMembers.map((m, i) => (
                <div
                  key={m.userId}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                  style={{
                    backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length],
                    boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
                  }}
                  title={m.name}
                >
                  {m.name.trim().charAt(0).toUpperCase()}
                </div>
              ))}
              {extraMembers > 0 && (
                <span className="text-[12px] font-black text-black/60 self-center ml-1">
                  +{extraMembers}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
