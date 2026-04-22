// Deterministic palette for member initials — cycles if there are more members than colors.
const MEMBER_COLORS = [
  "#FF2D8B", "#00A8CC", "#FFD600", "#00C96B",
  "#A855F7", "#FF8C00", "#00E5FF", "#FF3DA7",
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
 * Single consolidated trip identity block. Absorbs the previous separate
 * HERO / COUNTDOWN / MEMBERS / WHO'S IN cards into one header surface.
 * Kept visually light on purpose — a future design pass owns the final
 * bento-grid treatment.
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
      className="border-b flex flex-col gap-4 px-4 py-4 md:px-7 md:py-6"
      style={{ backgroundColor: "#282828", borderColor: "#333333" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1
            className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1 truncate"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {tripName}
          </h1>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {phase}
          </p>
        </div>
        <span
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-black text-[#1a1a1a]"
          style={{ backgroundColor: ballColor }}
        >
          {phase}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {hasDates && (
          <span className="text-white/75 font-semibold">
            {formatDate(startDate)} → {formatDate(endDate)}
          </span>
        )}

        <span
          className="inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" }}
        >
          <span className="text-sm">{countdownNumber}</span>
          <span className="text-white/55">{countdownLabel}</span>
        </span>

        {members.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto" aria-label={`${members.length} traveler${members.length === 1 ? "" : "s"}`}>
            {visibleMembers.map((m, i) => (
              <div
                key={m.userId}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-[#1a1a1a]"
                style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }}
                title={m.name}
              >
                {m.name.trim().charAt(0).toUpperCase()}
              </div>
            ))}
            {extraMembers > 0 && (
              <span className="text-[11px] font-semibold text-white/50 ml-1">
                +{extraMembers}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
