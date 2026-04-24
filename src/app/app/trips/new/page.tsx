"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

import TripBall from "@/components/TripBall";
import DatePicker from "@/components/DatePicker";
import { createTripAction, type CreateTripFormState } from "./actions";

const BALL_COLORS = [
  { hex: "#00A8CC", label: "Cyan" },
  { hex: "#FF2D8B", label: "Pink" },
  { hex: "#FFD600", label: "Yellow" },
  { hex: "#00C96B", label: "Green" },
  { hex: "#A855F7", label: "Purple" },
  { hex: "#FF8C00", label: "Orange" },
  { hex: "#EF4444", label: "Red" },
  { hex: "#3B82F6", label: "Blue" },
  { hex: "#14B8A6", label: "Teal" },
  { hex: "#84CC16", label: "Lime" },
];

const initialState: CreateTripFormState = {};

export default function NewTripPage() {
  const [state, formAction, pending] = useActionState(createTripAction, initialState);
  const [ballColor, setBallColor] = useState("#00A8CC");

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6" style={{ backgroundColor: "#404040" }}>
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full border border-[#3A3A3A] bg-[#252525] px-4 py-2 transition-colors hover:bg-[#2E2E2E]"
            style={{ color: "#00C96B", boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
          >
            <ArrowLeft size={13} weight="bold" />
            <span style={{ fontFamily: "var(--font-fredoka)", fontSize: "0.95rem", fontWeight: 700 }}>
              Your trips
            </span>
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-5">
          <h1
            className="text-5xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-fredoka)", color: "#00A8CC" }}
          >
            New trip.
          </h1>
          <p className="text-white/80 text-sm font-medium">
            Name it, pick a vibe, set the dates. Easy.
          </p>
        </div>

        {/* Bento grid */}
        <form action={formAction}>
          <input type="hidden" name="ballColor" value={ballColor} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* ── Trip name ── col-span-2, big Fredoka input */}
            <div
              className="lg:col-span-2 rounded-2xl border border-[#3A3A3A] p-6 flex flex-col gap-4 min-h-[180px] justify-center relative"
              style={{ backgroundColor: "#2E2E2E" }}
            >
              <label
                htmlFor="name"
                className="absolute top-5 left-6 text-xs font-black uppercase tracking-widest"
                style={{ color: "#FF2D8B", fontFamily: "var(--font-fredoka)" }}
              >
                Trip name
              </label>
              <div
                className="w-full border-b-2 transition-colors"
                style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}
                onFocusCapture={e => (e.currentTarget.style.borderBottomColor = "#FF2D8B")}
                onBlurCapture={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="e.g. Japan Spring 2025"
                  className="w-full bg-transparent outline-none text-white placeholder:text-white/40 font-semibold"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                    lineHeight: 1.2,
                    paddingBottom: "2px",
                  }}
                />
              </div>
              {state.error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-3 py-2 text-xs font-semibold text-[#FF2D8B]"
                >
                  {state.error}
                </p>
              )}
            </div>

            {/* ── Color picker ── live ball preview + swatches */}
            <div
              className="rounded-2xl border border-[#3A3A3A] p-6 flex flex-col items-center gap-4"
              style={{ backgroundColor: "#2E2E2E" }}
            >
              <p className="text-xs font-black uppercase tracking-widest self-start" style={{ fontFamily: "var(--font-fredoka)", color: "#A855F7" }}>
                Trip color
              </p>
              <TripBall color={ballColor} fillPct={0} size={72} glow />
              <div className="flex flex-wrap justify-center gap-3">
                {BALL_COLORS.map(({ hex, label }) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={label}
                    onClick={() => setBallColor(hex)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      backgroundColor: hex,
                      outline: ballColor === hex ? `3px solid ${hex}` : "3px solid transparent",
                      outlineOffset: "3px",
                    }}
                  >
                    {ballColor === hex && (
                      <span className="text-[10px] font-black" style={{ color: "rgba(0,0,0,0.5)" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Start date ── */}
            <div
              className="rounded-2xl border border-[#3A3A3A] p-5 flex flex-col gap-3"
              style={{ backgroundColor: "#2E2E2E" }}
            >
              <label
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#00C96B", fontFamily: "var(--font-fredoka)" }}
              >
                Start date
              </label>
              <DatePicker name="startDate" accentColor="#00C96B" placeholder="When do you leave?" />
            </div>

            {/* ── End date ── */}
            <div
              className="rounded-2xl border border-[#3A3A3A] p-5 flex flex-col gap-3"
              style={{ backgroundColor: "#2E2E2E" }}
            >
              <label
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#FF8C00", fontFamily: "var(--font-fredoka)" }}
              >
                End date
              </label>
              <DatePicker name="endDate" accentColor="#FF8C00" placeholder="When are you back?" />
            </div>

            {/* ── Submit ── */}
            <div
              className="rounded-2xl border border-[#3A3A3A] p-5 flex flex-col justify-end"
              style={{ backgroundColor: "#2E2E2E" }}
            >
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full py-3.5 font-bold hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: ballColor,
                  color: "#171717",
                  fontFamily: "var(--font-fredoka)",
                  boxShadow: "0 3px 0 rgba(0,0,0,0.35)",
                  fontSize: "1.1rem",
                }}
              >
                {pending ? "Let's go…" : "Let's go →"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
