interface TripBallProps {
  color?: string;
  fillPct?: number;
  size?: number;
  glow?: boolean;
  pulse?: boolean;
  /** Background of inner donut cutout. Defaults to elevated-card. */
  surfaceColor?: string;
  /** Color of the unfilled arc. Defaults to elevated-card. */
  emptyArcColor?: string;
  className?: string;
}

export default function TripBall({
  color = "#7C5CFF",
  fillPct = 0,
  size = 52,
  glow = false,
  pulse = false,
  surfaceColor = "#15162A",
  emptyArcColor = "#15162A",
  className = "",
}: TripBallProps) {
  const pct = Math.min(100, Math.max(0, fillPct));
  const deg = (pct / 100) * 360;
  const isEmpty = pct < 2;

  const background = isEmpty
    ? "transparent"
    : pct >= 100
    ? color
    : `conic-gradient(${color} ${deg}deg, ${emptyArcColor} ${deg}deg)`;

  const border = isEmpty ? `2px dashed ${color}` : "none";
  const boxShadow = glow ? `0 0 28px ${color}50` : undefined;

  return (
    <div
      aria-hidden="true"
      className={`relative rounded-full flex-shrink-0 ${pulse ? "animate-wave-pulse" : ""} ${className}`}
      style={{ width: size, height: size, background, border, boxShadow }}
    >
      {pct > 0 && pct < 100 && (
        <div
          className="absolute rounded-full"
          style={{ inset: "15%", backgroundColor: surfaceColor }}
        />
      )}
    </div>
  );
}
