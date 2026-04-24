"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";

import { createTripAction, type CreateTripFormState } from "./actions";

const BALL_COLORS = [
  { hex: "#00A8CC", label: "Cyan" },
  { hex: "#FF2D8B", label: "Pink" },
  { hex: "#FFD600", label: "Yellow" },
  { hex: "#00C96B", label: "Green" },
  { hex: "#A855F7", label: "Purple" },
  { hex: "#FF8C00", label: "Orange" },
];

const initialState: CreateTripFormState = {};

export default function NewTripPage() {
  const [state, formAction, pending] = useActionState(createTripAction, initialState);
  const [ballColor, setBallColor] = useState("#00A8CC");

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#404040" }}>
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link
            href="/app"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            ← Back to trips
          </Link>
        </div>

        <h1
          className="text-4xl font-semibold text-white mb-2"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          New trip.
        </h1>
        <p className="text-white/90 font-medium text-sm mb-8">
          Give it a name and we&apos;ll handle the rest.
        </p>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-white mb-1.5">
              Trip name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              placeholder="e.g. Japan Spring 2025"
              className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00A8CC] focus:outline-none transition-colors text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-bold text-white mb-1.5">
                Start date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white focus:border-[#00A8CC] focus:outline-none transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-bold text-white mb-1.5">
                End date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white focus:border-[#00A8CC] focus:outline-none transition-colors text-sm font-medium"
              />
            </div>
          </div>

          {/* Trip color picker */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">
              Trip color
            </label>
            <input type="hidden" name="ballColor" value={ballColor} />
            <div className="flex gap-3 flex-wrap">
              {BALL_COLORS.map(({ hex, label }) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={label}
                  onClick={() => setBallColor(hex)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                  style={{
                    backgroundColor: hex,
                    outline: ballColor === hex ? `3px solid ${hex}` : "3px solid transparent",
                    outlineOffset: "3px",
                  }}
                >
                  {ballColor === hex && (
                    <span className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-3 text-sm font-semibold text-[#FF2D8B]"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full py-3.5 font-bold text-white hover:brightness-110 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: ballColor, boxShadow: "0 3px 0 rgba(0,0,0,0.35)" }}
          >
            {pending ? "Creating…" : "Create trip"}
          </button>
        </form>
      </div>
    </div>
  );
}
