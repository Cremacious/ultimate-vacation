import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div
        className="w-32 h-32 rounded-full mb-8"
        style={{
          background: "conic-gradient(#00A8CC 220deg, #E5E7EB 220deg)",
          boxShadow: "0 0 60px #00A8CC22",
        }}
      />
      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Lost in transit.
      </h1>
      <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
        This page doesn't exist. Maybe it was deleted, or maybe you took a wrong turn.
      </p>
      <Link
        href="/"
        className="bg-[#00A8CC] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0096b8] transition-colors"
        style={{ boxShadow: "0 3px 0 #007a99" }}
      >
        Back to home
      </Link>
    </div>
  );
}
