import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FA] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 480,
          height: 480,
          top: "-15%",
          right: "-15%",
          background: "#00A8CC",
          opacity: 0.22,
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 360,
          height: 360,
          bottom: "-12%",
          left: "-12%",
          background: "#FF2D8B",
          opacity: 0.18,
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 80,
          height: 80,
          top: "28%",
          left: "6%",
          background: "#FFD600",
          opacity: 0.35,
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 40,
          height: 40,
          bottom: "22%",
          right: "10%",
          background: "#00A8CC",
          opacity: 0.3,
        }}
      />

      {/* Logo */}
      <Link href="/" className="mb-8 relative z-10 flex items-center gap-2">
        <div className="relative w-5 h-5 flex-shrink-0">
          <span
            className="animate-ripple absolute inset-0 rounded-full"
            style={{ backgroundColor: "#00A8CC" }}
          />
          <span
            className="animate-ripple-2 absolute inset-0 rounded-full"
            style={{ backgroundColor: "#00A8CC" }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "#00A8CC" }}
          />
        </div>
        <span
          className="text-2xl font-semibold text-[#00A8CC]"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          TripWave
        </span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
