"use client";

import { useEffect } from "react";

// Catches errors thrown inside the root layout itself.
// Must render its own <html>/<body> since the layout is unavailable.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TripWave] global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "360px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #00D4FF, #00A8CC)",
              boxShadow: "0 0 40px #00A8CC44",
              margin: "0 auto 1.5rem",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Something went wrong.
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#9CA3AF", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            An unexpected error occurred.
            {error.digest && (
              <span style={{ display: "block", marginTop: "0.25rem", fontSize: "0.75rem", color: "#6B7280" }}>
                Ref: {error.digest}
              </span>
            )}
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#00A8CC",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 3px 0 #007a99",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
