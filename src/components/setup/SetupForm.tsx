"use client";

import { useState, useRef } from "react";
import {
  Airplane, Car, Train, Boat, Shuffle,
  Minus, Plus, X, PlusCircle,
} from "@phosphor-icons/react";

// ─── constants ───────────────────────────────────────────────────────────────

const TRIP_TYPES = [
  "Beach", "City", "Adventure", "Road Trip",
  "Family", "Romantic", "Group", "Honeymoon",
];

const VIBES = ["Relaxed", "Packed", "Spontaneous", "Structured"];

const TRANSPORT_MODES = [
  { key: "fly",    label: "Flying",  Icon: Airplane, activeColor: "#FF2D8B" },
  { key: "drive",  label: "Driving", Icon: Car,      activeColor: "#FF8C00" },
  { key: "train",  label: "Train",   Icon: Train,    activeColor: "#00A8CC" },
  { key: "cruise", label: "Cruise",  Icon: Boat,     activeColor: "#00C96B" },
];

const BALL_COLORS = [
  "#FF2D8B", "#FF8C00", "#FFD600", "#00C96B",
  "#00A8CC", "#A855F7", "#EF4444", "#3B82F6",
];

const DEST_COLORS = ["#FF2D8B", "#FFD600", "#00C96B", "#00A8CC", "#A855F7"];

// ─── shared card style ────────────────────────────────────────────────────────

const CARD: React.CSSProperties = { backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" };

// ─── types ────────────────────────────────────────────────────────────────────

interface Destination { id: string; city: string; }

interface SetupFormProps {
  initialData?: {
    name?: string;
    destinations?: Destination[];
    startDate?: string;
    endDate?: string;
    tripTypes?: string[];
    vibes?: string[];
    transportModes?: string[];
    customTransport?: string[];
    travelers?: number;
    lodging?: { id: string; name: string }[];
    budget?: string;
    budgetType?: "total" | "per-person";
    currency?: string;
    ballColor?: string;
  };
}

// ─── primitives ───────────────────────────────────────────────────────────────

/** ALL-CAPS section label at the top of each cell */
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

/** Shared text input */
function InpBase({ className = "", style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-xl px-4 py-3 text-base font-semibold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/25 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }}
    />
  );
}

/** Dark bento cell — content centered both axes */
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

// ─── main component ───────────────────────────────────────────────────────────

export default function SetupForm({ initialData = {} }: SetupFormProps) {

  const [tripName,        setTripName]        = useState(initialData.name ?? "");
  const [destinations,    setDestinations]    = useState<Destination[]>(
    initialData.destinations ?? [{ id: "1", city: "" }]
  );
  const [startDate,       setStartDate]       = useState(initialData.startDate ?? "");
  const [endDate,         setEndDate]         = useState(initialData.endDate ?? "");
  const [tripTypes,       setTripTypes]       = useState<string[]>(initialData.tripTypes  ?? []);
  const [vibes,           setVibes]           = useState<string[]>(initialData.vibes      ?? []);
  const [transportModes,  setTransportModes]  = useState<string[]>(initialData.transportModes ?? []);
  const [customTransport, setCustomTransport] = useState<string[]>(initialData.customTransport ?? []);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDraft,     setCustomDraft]     = useState("");
  const [travelers,       setTravelers]       = useState(initialData.travelers ?? 2);
  const [budget,          setBudget]          = useState(initialData.budget ?? "");
  const [budgetType,      setBudgetType]      = useState<"total" | "per-person">(
    initialData.budgetType ?? "total"
  );
  const [ballColor,       setBallColor]       = useState(initialData.ballColor ?? "#FF2D8B");

  const customInputRef = useRef<HTMLInputElement>(null);

  const durationDays = (() => {
    if (!startDate || !endDate) return null;
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    return diff > 0 ? Math.round(diff) : null;
  })();

  function toggleArr<T>(arr: T[], setArr: (v: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }
  function addDest() {
    setDestinations((d) => [...d, { id: Date.now().toString(), city: "" }]);
  }
  function removeDest(id: string) {
    setDestinations((d) => d.filter((x) => x.id !== id));
  }
  function updateDest(id: string, city: string) {
    setDestinations((d) => d.map((x) => (x.id === id ? { ...x, city } : x)));
  }
  function commitCustomTransport() {
    const v = customDraft.trim();
    if (v && !customTransport.includes(v)) setCustomTransport((c) => [...c, v]);
    setCustomDraft("");
  }
  function removeCustomTransport(label: string) {
    setCustomTransport((c) => c.filter((x) => x !== label));
  }

  return (
    <div className="grid grid-cols-1 gap-[12px] md:grid-cols-[1.4fr_1fr]">

      {/* ── TRIP NAME — full width ───────────────────────────────── */}
      <Cell className="md:col-span-2">
        <CellLabel>Trip Name</CellLabel>
        <div className="flex items-center gap-3 w-full">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 text-xl"
            style={{ backgroundColor: "rgba(0,168,204,0.15)", border: "1px solid rgba(0,168,204,0.25)" }}
          >
            ✈
          </div>
          <InpBase
            className="flex-1"
            style={{
              fontFamily: "var(--font-fredoka)",
              fontSize: "clamp(18px, 2vw, 24px)",
              fontWeight: 600,
              padding: "12px 16px",
              borderRadius: "14px",
            }}
            placeholder="Name your trip…"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </div>
      </Cell>

      {/* ── DESTINATIONS — left col ──────────────────────────────── */}
      <Cell>
        <CellLabel>Destinations</CellLabel>
        <div className="flex flex-col gap-2.5 w-full">
          {destinations.map((d, i) => (
            <div key={d.id} className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black text-white flex-shrink-0"
                style={{ backgroundColor: DEST_COLORS[i % DEST_COLORS.length] }}
              >
                {i + 1}
              </div>
              <InpBase
                className="flex-1"
                placeholder="City, Country"
                value={d.city}
                onChange={(e) => updateDest(d.id, e.target.value)}
              />
              {destinations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDest(d.id)}
                  className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDest}
            className="flex items-center gap-2 font-black transition-opacity hover:opacity-80 mt-1 mx-auto"
            style={{
              fontSize: "13px",
              color: "#00A8CC",
              border: "1px dashed rgba(0,168,204,0.4)",
              borderRadius: "10px",
              padding: "7px 16px",
            }}
          >
            <PlusCircle size={15} weight="fill" />
            Add destination
          </button>
        </div>
      </Cell>

      {/* ── DATES — right col ────────────────────────────────────── */}
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
                className="w-full text-white/60"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <div className="text-[12px] font-black uppercase tracking-widest text-white/30 text-center mb-2">
                Return
              </div>
              <InpBase
                type="date"
                className="w-full text-white/60"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {durationDays !== null && (
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between mt-3"
              style={{ backgroundColor: "rgba(0,168,204,0.08)", border: "1px solid rgba(0,168,204,0.15)" }}
            >
              <span className="text-[12px] font-black uppercase tracking-widest text-white/35">
                Duration
              </span>
              <span
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-fredoka)", color: "#00A8CC" }}
              >
                {durationDays} days
              </span>
            </div>
          )}
        </div>
      </Cell>

      {/* ── TRANSPORT — left col ─────────────────────────────────── */}
      <Cell>
        <CellLabel>How are you getting there?</CellLabel>

        <div className="flex flex-wrap justify-center gap-2.5">
          {TRANSPORT_MODES.map(({ key, label, Icon, activeColor }) => {
            const active = transportModes.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleArr(transportModes, setTransportModes, key)}
                className="flex items-center gap-2 rounded-full font-black border transition-all"
                style={{
                  fontSize: "15px",
                  padding: "10px 20px",
                  backgroundColor: active ? activeColor : "#3a3a3a",
                  borderColor:     active ? activeColor : "#484848",
                  color:           active ? "#ffffff"   : "#9CA3AF",
                }}
              >
                <Icon size={16} weight="fill" />
                {label}
              </button>
            );
          })}

          {/* custom pills */}
          {customTransport.map((label) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full font-black"
              style={{
                fontSize: "15px",
                padding: "10px 18px",
                backgroundColor: "#A855F7",
                color: "#fff",
              }}
            >
              <Shuffle size={14} weight="fill" />
              {label}
              <button
                type="button"
                onClick={() => removeCustomTransport(label)}
                className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={12} weight="bold" />
              </button>
            </span>
          ))}

          {/* Other toggle */}
          {!showCustomInput && (
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(true);
                setTimeout(() => customInputRef.current?.focus(), 50);
              }}
              className="flex items-center gap-2 rounded-full font-black border transition-all"
              style={{
                fontSize: "15px",
                padding: "10px 20px",
                borderStyle: "dashed",
                borderColor: "#484848",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              + Other…
            </button>
          )}
        </div>

        {/* custom text input */}
        {showCustomInput && (
          <div className="mt-4 w-full">
            <input
              ref={customInputRef}
              className="w-full rounded-xl px-4 py-3 text-base font-semibold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/25 text-center"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
              placeholder="e.g. Ferry, Motorbike, Helicopter…"
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); commitCustomTransport(); }
                if (e.key === "Escape") { setShowCustomInput(false); setCustomDraft(""); }
              }}
              onBlur={() => {
                commitCustomTransport();
                if (!customDraft.trim()) setShowCustomInput(false);
              }}
            />
            <p className="text-[12px] font-bold text-white/25 text-center mt-1.5">
              Press Enter to add · Esc to cancel
            </p>
          </div>
        )}

        <p className="text-[14px] font-semibold text-white/35 text-center mt-4">
          Select all that apply. Details in Preplanning.
        </p>
      </Cell>

      {/* ── TRIP CHARACTER — right col (type + vibe stacked) ─────── */}
      <Cell className="gap-6">
        <div className="w-full">
          <CellLabel>Trip Type</CellLabel>
          <div className="flex flex-wrap justify-center gap-2">
            {TRIP_TYPES.map((t) => {
              const active = tripTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleArr(tripTypes, setTripTypes, t)}
                  className="rounded-full font-black border transition-all"
                  style={{
                    fontSize: "14px",
                    padding: "8px 16px",
                    backgroundColor: active ? "#00A8CC" : "#3a3a3a",
                    borderColor:     active ? "#00A8CC" : "#484848",
                    color:           active ? "#1a1a1a" : "#9CA3AF",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full">
          <CellLabel>Vibe</CellLabel>
          <div className="flex flex-wrap justify-center gap-2">
            {VIBES.map((v) => {
              const active = vibes.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleArr(vibes, setVibes, v)}
                  className="rounded-full font-black border transition-all"
                  style={{
                    fontSize: "14px",
                    padding: "8px 16px",
                    backgroundColor: active ? "#FFD600" : "#3a3a3a",
                    borderColor:     active ? "#FFD600" : "#484848",
                    color:           active ? "#1a1a1a" : "#9CA3AF",
                  }}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </Cell>

      {/* ── BOTTOM ROW: travelers + budget + ball color ───────────── */}
      <div className="grid grid-cols-1 gap-[12px] md:col-span-2 md:grid-cols-[1fr_1.4fr_1fr]">

        {/* Travelers */}
        <Cell>
          <CellLabel>Travelers</CellLabel>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.max(1, n - 1))}
              className="w-11 h-11 rounded-full border flex items-center justify-center text-white transition-colors hover:border-[#00A8CC] hover:text-[#00A8CC] flex-shrink-0"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            >
              <Minus size={16} weight="bold" />
            </button>
            <span
              className="font-semibold text-[#FFD600] leading-none text-center"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(52px, 5vw, 72px)", minWidth: "2ch" }}
            >
              {travelers}
            </span>
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.min(50, n + 1))}
              className="w-11 h-11 rounded-full border flex items-center justify-center text-white transition-colors hover:border-[#00A8CC] hover:text-[#00A8CC] flex-shrink-0"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            >
              <Plus size={16} weight="bold" />
            </button>
          </div>
        </Cell>

        {/* Budget */}
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
                placeholder="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
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
            <div className="flex justify-center gap-2 mt-3">
              {(["total", "per-person"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBudgetType(t)}
                  className="rounded-lg font-black border transition-all"
                  style={{
                    fontSize: "13px",
                    padding: "6px 14px",
                    backgroundColor: budgetType === t ? "#00C96B" : "transparent",
                    borderColor:     budgetType === t ? "#00C96B" : "#3a3a3a",
                    color:           budgetType === t ? "#1a1a1a" : "#9CA3AF",
                  }}
                >
                  {t === "per-person" ? "Per person" : "Total"}
                </button>
              ))}
            </div>
          </div>
        </Cell>

        {/* Ball color */}
        <Cell>
          <CellLabel>Trip Ball Color</CellLabel>
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
                  <span className="text-[13px] font-black" style={{ color: "rgba(0,0,0,0.55)" }}>✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ballColor }} />
            <span className="text-[13px] font-bold text-white/40">{ballColor}</span>
          </div>
        </Cell>
      </div>

      {/* ── SAVE BAR ─────────────────────────────────────────────── */}
      <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          className="px-6 py-3 rounded-full text-[15px] font-black border text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-3 rounded-full text-[15px] font-black text-[#1a1a1a] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#FFD600" }}
        >
          Save changes
        </button>
      </div>

    </div>
  );
}
