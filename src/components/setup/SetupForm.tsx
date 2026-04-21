"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";

const BALL_COLORS = [
  "#FF2D8B", "#FF8C00", "#FFD600", "#00C96B",
  "#00A8CC", "#A855F7", "#EF4444", "#3B82F6",
];

const CARD: React.CSSProperties = { backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" };

function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[13px] font-black uppercase tracking-widest text-center mb-4"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {children}
    </div>
  );
}

function InpBase({ className = "", style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-xl px-4 py-3 text-base font-semibold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/25 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }}
    />
  );
}

function Cell({
  children,
  style,
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border p-4 md:p-6 flex flex-col items-center justify-center ${className}`}
      style={{ ...CARD, ...style }}
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
      <div className="grid grid-cols-1 gap-[12px] md:grid-cols-[1.4fr_1fr]">

        {/* ── TRIP NAME ─────────────────────────────────────────── */}
        <Cell className="md:col-span-2">
          <CellLabel>Trip Name</CellLabel>
          <div className="flex items-center gap-3 w-full">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 text-xl"
              style={{ backgroundColor: "rgba(0,168,204,0.15)", border: "1px solid rgba(0,168,204,0.25)" }}
            >
              ✈
            </div>
            <input
              name="name"
              defaultValue={initialData.name}
              placeholder="Name your trip…"
              required
              className="flex-1 outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/25"
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: 600,
                padding: "12px 16px",
                borderRadius: "14px",
                backgroundColor: "#1e1e1e",
                borderColor: "#3a3a3a",
                color: "white",
              }}
            />
          </div>
        </Cell>

        {/* ── DATES ─────────────────────────────────────────────── */}
        <Cell className="gap-4">
          <CellLabel>Dates</CellLabel>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <div className="text-[12px] font-black uppercase tracking-widest text-white/30 text-center mb-2">
                  Depart
                </div>
                <InpBase
                  type="date"
                  name="startDate"
                  className="w-full text-white/60"
                  defaultValue={initialData.startDate ?? ""}
                />
              </div>
              <div>
                <div className="text-[12px] font-black uppercase tracking-widest text-white/30 text-center mb-2">
                  Return
                </div>
                <InpBase
                  type="date"
                  name="endDate"
                  className="w-full text-white/60"
                  defaultValue={initialData.endDate ?? ""}
                />
              </div>
            </div>
          </div>
        </Cell>

        {/* ── BUDGET ────────────────────────────────────────────── */}
        <Cell>
          <CellLabel>Budget Target</CellLabel>
          <div className="w-full">
            <div className="relative">
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
                className="w-full rounded-xl pl-9 pr-3 py-3 outline-none border transition-colors focus:border-[#00C96B] placeholder-white/25 text-center"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  fontWeight: 600,
                  color: "#00C96B",
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3a3a3a",
                }}
              />
            </div>
          </div>
        </Cell>

        {/* ── BUDGET NOTES ──────────────────────────────────────── */}
        <Cell className="md:col-span-2">
          <CellLabel>Budget Notes</CellLabel>
          <textarea
            name="budgetNotes"
            rows={3}
            defaultValue={initialData.budgetNotes ?? ""}
            placeholder="e.g. Flights already booked, split equally between all travelers…"
            className="w-full rounded-xl px-4 py-3 text-base font-semibold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/25 resize-none"
            style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
          />
        </Cell>

        {/* ── BALL COLOR ────────────────────────────────────────── */}
        <Cell>
          <CellLabel>Trip Ball Color</CellLabel>
          <input type="hidden" name="ballColor" value={ballColor} />
          <div className="flex flex-wrap justify-center gap-3">
            {BALL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBallColor(c)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  backgroundColor: c,
                  outline: ballColor === c ? `3px solid ${c}` : "3px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                {ballColor === c && (
                  <span className="text-[13px] font-black" style={{ color: "rgba(0,0,0,0.55)" }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ballColor }} />
            <span className="text-[13px] font-bold text-white/40">{ballColor}</span>
          </div>
        </Cell>

        {/* ── ERROR ─────────────────────────────────────────────── */}
        {state?.error && (
          <div
            className="md:col-span-2 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255,45,139,0.1)",
              border: "1px solid rgba(255,45,139,0.3)",
              color: "#FF2D8B",
            }}
            role="alert"
          >
            {state.error}
          </div>
        )}

        {/* ── SAVE BAR ──────────────────────────────────────────── */}
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/app/trips/${tripId}/setup`}
            className="px-6 py-3 rounded-full text-[15px] font-black border text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-8 py-3 rounded-full text-[15px] font-black text-[#1a1a1a] transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#FFD600" }}
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>

      </div>
    </form>
  );
}
