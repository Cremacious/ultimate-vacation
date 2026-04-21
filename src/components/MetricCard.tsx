import type { MetricStatus } from "@/lib/analytics/metrics";

const STATUS_COLORS: Record<MetricStatus, string> = {
  "on-target": "#FFFFFF",
  watch: "#FFEB00",
  alert: "#FF3DA7",
  "no-data": "rgba(255,255,255,0.2)",
};

type MetricCardProps = {
  label: string;
  value: string;
  target: string;
  rawCounts: string;
  status: MetricStatus;
  lowerIsBetter?: boolean;
};

export function MetricCard({
  label,
  value,
  target,
  rawCounts,
  status,
  lowerIsBetter,
}: MetricCardProps) {
  const color = STATUS_COLORS[status];
  const displayValue = status === "no-data" ? "N/A" : value;

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-[#2A2B45] bg-[#15162A] p-5 flex flex-col gap-1"
      aria-label={`${label}: ${displayValue}, target ${target}, ${rawCounts}`}
    >
      <div
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl"
        style={{ background: color }}
        aria-hidden="true"
      />
      <p className="text-sm font-bold uppercase tracking-wide text-white/50 mb-1">{label}</p>
      <p className="font-['Fredoka'] text-4xl font-semibold" style={{ color }}>
        {displayValue}
      </p>
      <p className="text-xs text-white/40 mt-2">Target: {target}</p>
      <p className="text-xs text-white/40">{rawCounts}</p>
      {lowerIsBetter && (
        <p className="text-xs text-white/30">(lower is better)</p>
      )}
    </article>
  );
}
