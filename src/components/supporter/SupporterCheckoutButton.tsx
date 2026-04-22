"use client";

import { useState } from "react";

export default function SupporterCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ boxShadow: "0 3px 0 #007a99" }}
      >
        {loading ? "Redirecting to checkout…" : "Support TripWave · $4.99"}
      </button>
      {error && (
        <p className="text-center text-xs text-red-400 mt-3">{error}</p>
      )}
    </div>
  );
}
