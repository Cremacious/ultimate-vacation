"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import DatePicker from "@/components/DatePicker";

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

function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-widest text-white/80 text-center mb-4">
      {children}
    </p>
  );
}

function InpBase({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00A8CC] focus:outline-none transition-colors text-sm font-medium ${className}`}
    />
  );
}

function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#3A3A3A] p-4 md:p-6 flex flex-col items-center justify-center ${className}`}
      style={{ backgroundColor: "#252525" }}
    >
      {children}
    </div>
  );
}

interface SetupFormProps {
  tripId: string;
  action: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  initialData: {
    name: string;
    startDate: string | null;
    endDate: string | null;
    budgetCents: number | null;
    budgetNotes: string | null;
    ballColor: string;
  };
}

export default function SetupForm({ tripId, action, initialData }: SetupFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [ballColor, setBallColor] = useState(initialData.ballColor);

  const budgetDefault =
    initialData.budgetCents !== null ? String(initialData.budgetCents / 100) : "";

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr]">

        {/* ── TRIP NAME ─────────────────────────────────────────── */}
        <Cell className="md:col-span-2 items-start">
          <CellLabel>Trip Name</CellLabel>
          <input
            name="name"
            defaultValue={initialData.name}
            placeholder="Name your trip…"
            required
            className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00A8CC] focus:outline-none transition-colors font-semibold"
            style={{
              fontFamily: "var(--font-fredoka)",
              fontSize: "clamp(18px, 2vw, 24px)",
            }}
          />
        </Cell>

        {/* ── DATES ─────────────────────────────────────────────── */}
        <Cell className="gap-4 items-start">
          <CellLabel>Dates</CellLabel>
          <div className="w-full grid grid-cols-2 gap-2.5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/80 text-center mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                Depart
              </p>
              <DatePicker name="startDate" defaultValue={initialData.startDate} accentColor="#00C96B" placeholder="Departure" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/80 text-center mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                Return
              </p>
              <DatePicker name="endDate" defaultValue={initialData.endDate} accentColor="#FF8C00" placeholder="Return" />
            </div>
          </div>
        </Cell>

        {/* ── BUDGET ────────────────────────────────────────────── */}
        <Cell className="items-start">
          <CellLabel>Budget Target</CellLabel>
          <div className="w-full relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-white/30 pointer-events-none"
              style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
            >
              $
            </span>
            <input
              type="number"
              name="budget"
              min="0"
              step="0.01"
              placeholder="5000"
              defaultValue={budgetDefault}
              className="w-full rounded-xl pl-9 pr-3 py-3 border border-[#3A3A3A] bg-[#1E1E1E] outline-none focus:border-[#00C96B] placeholder:text-white/30 transition-colors text-center"
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: "clamp(28px, 3vw, 48px)",
                fontWeight: 600,
                color: "#00C96B",
              }}
            />
          </div>
        </Cell>

        {/* ── BUDGET NOTES ──────────────────────────────────────── */}
        <Cell className="md:col-span-2 items-start">
          <CellLabel>Budget Notes</CellLabel>
          <textarea
            name="budgetNotes"
            rows={3}
            defaultValue={initialData.budgetNotes ?? ""}
            placeholder="e.g. Flights already booked, split equally between all travelers…"
            className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-sm font-semibold text-white placeholder:text-white/30 outline-none focus:border-[#00A8CC] transition-colors resize-none"
          />
        </Cell>

        {/* ── BALL COLOR ────────────────────────────────────────── */}
        <Cell>
          <CellLabel>Trip Color</CellLabel>
          <input type="hidden" name="ballColor" value={ballColor} />
          <div className="flex flex-wrap justify-center gap-3">
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
        </Cell>

        {/* ── ERROR ─────────────────────────────────────────────── */}
        {state?.error && (
          <p
            role="alert"
            className="md:col-span-2 rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-3 text-sm font-semibold text-[#FF2D8B]"
          >
            {state.error}
          </p>
        )}

        {/* ── SAVE BAR ──────────────────────────────────────────── */}
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/app/trips/${tripId}/setup`}
            className="px-6 py-3 rounded-full text-sm font-bold border border-[#3A3A3A] text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-8 py-3 rounded-full text-sm font-bold transition hover:brightness-110 disabled:opacity-60"
            style={{ backgroundColor: "#00A8CC", color: "#171717", boxShadow: "0 3px 0 #007a99" }}
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>

      </div>
    </form>
  );
}
