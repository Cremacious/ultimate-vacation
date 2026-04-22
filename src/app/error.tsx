"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TripWave] unhandled error", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center px-4">
      <div
        className="w-20 h-20 rounded-full mb-8 flex-shrink-0"
        style={{
          background: "radial-gradient(circle at 35% 35%, #00D4FF, #00A8CC)",
          boxShadow: "0 0 40px #00A8CC44",
        }}
      />

      <h1
        className="text-3xl font-semibold text-white mb-2 text-center"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Something went wrong.
      </h1>

      <p className="text-sm text-gray-400 font-medium text-center max-w-xs leading-relaxed mb-8">
        An unexpected error occurred. Your trip data is safe.
        {error.digest && (
          <span className="block mt-1 text-xs text-gray-600">
            Ref: {error.digest}
          </span>
        )}
      </p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full text-sm hover:bg-[#0096b8] transition-colors"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          Try again
        </button>

        <Link
          href="/app"
          className="text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors"
        >
          Back to your trips
        </Link>
      </div>
    </div>
  );
}
