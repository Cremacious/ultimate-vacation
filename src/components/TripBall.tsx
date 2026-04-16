interface TripBallProps {
  fillPct?: number;
  color?: string;
  size?: number;
  pulse?: boolean;
}

export default function TripBall({
  fillPct = 0,
  color = "#00A8CC",
  size = 48,
  pulse = true,
}: TripBallProps) {
  const deg = Math.min(360, (fillPct / 100) * 360);
  const isEmpty = fillPct < 2;

  return (
    <div
      className={pulse ? "animate-wave-pulse" : ""}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <div
        className="rounded-full relative"
        style={{
          width: size,
          height: size,
          background: isEmpty
            ? "transparent"
            : `conic-gradient(${color} ${deg}deg, #E5E7EB ${deg}deg)`,
          border: isEmpty ? `2px dashed ${color}` : "none",
          boxShadow: fillPct > 80 ? `0 0 ${size / 2}px ${color}30` : undefined,
        }}
      >
        {fillPct > 0 && fillPct < 100 && (
          <div className="absolute inset-[15%] rounded-full bg-white" />
        )}

        {fillPct >= 40 && (
          <div
            className="absolute rounded-full"
            style={{
              inset: "20%",
              background: `radial-gradient(circle at 60% 40%, transparent 55%, ${color}18 100%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
