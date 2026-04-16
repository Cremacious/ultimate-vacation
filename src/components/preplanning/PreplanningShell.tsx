"use client";

import { useState } from "react";
import {
  Users, Airplane, Car, Train, Boat, House,
  CurrencyDollar, MapPin, Files, Sparkle, CheckSquare,
  Plus, X, PlusCircle,
} from "@phosphor-icons/react";

// ─── types ────────────────────────────────────────────────────────────────────

type SectionStatus = "empty" | "partial" | "done";
type SeatClass = "economy" | "premium" | "business" | "first";

interface SectionDef {
  key: string;
  label: string;
  Icon: React.ElementType;
  color: string;
  transport?: string;
}

interface FlightLeg {
  id: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  flightNumber: string;
  departDate: string;
  departTime: string;
  arriveDate: string;
  arriveTime: string;
  seatClass: SeatClass;
  confirmCode: string;
  notes: string;
}

// ─── section registry ─────────────────────────────────────────────────────────

const ALL_SECTIONS: SectionDef[] = [
  { key: "group",        label: "Group",         Icon: Users,          color: "#00A8CC" },
  { key: "flights",      label: "Flights",        Icon: Airplane,       color: "#FF2D8B", transport: "fly"    },
  { key: "driving",      label: "Driving",        Icon: Car,            color: "#FF8C00", transport: "drive"  },
  { key: "train",        label: "Train",          Icon: Train,          color: "#00A8CC", transport: "train"  },
  { key: "cruise",       label: "Cruise",         Icon: Boat,           color: "#00C96B", transport: "cruise" },
  { key: "lodging",      label: "Lodging",        Icon: House,          color: "#A855F7" },
  { key: "budget",       label: "Budget",         Icon: CurrencyDollar, color: "#00C96B" },
  { key: "destinations", label: "Destinations",   Icon: MapPin,         color: "#FFD600" },
  { key: "documents",    label: "Documents",      Icon: Files,          color: "#00A8CC" },
  { key: "vibe",         label: "Trip Vibe",      Icon: Sparkle,        color: "#FF2D8B" },
  { key: "predeparture", label: "Pre-Departure",  Icon: CheckSquare,    color: "#00C96B" },
];

// ─── mock section state ───────────────────────────────────────────────────────

const MOCK_STATUSES: Record<string, SectionStatus> = {
  group: "done", flights: "partial", driving: "empty", train: "empty",
  cruise: "empty", lodging: "empty", budget: "empty", destinations: "empty",
  documents: "empty", vibe: "empty", predeparture: "empty",
};

const MOCK_STATUS_TEXT: Record<string, string> = {
  group: "4 travelers added",
  flights: "1 of 2 legs entered",
  driving: "Not started",
  train: "Not started",
  cruise: "Not started",
  lodging: "Not started",
  budget: "Not started",
  destinations: "Not started",
  documents: "Not started",
  vibe: "Not started",
  predeparture: "Not started",
};

// ─── mock flight data ─────────────────────────────────────────────────────────

const INITIAL_FLIGHT_LEGS: FlightLeg[] = [
  {
    id: "1",
    fromCode: "SRQ", fromCity: "Sarasota, FL",
    toCode: "JFK",   toCity: "New York, NY",
    flightNumber: "AA2847",
    departDate: "2025-04-01", departTime: "07:15",
    arriveDate: "2025-04-01", arriveTime: "10:30",
    seatClass: "economy", confirmCode: "XK92MN", notes: "",
  },
  {
    id: "2",
    fromCode: "JFK", fromCity: "New York, NY",
    toCode: "NRT",   toCity: "Tokyo, Japan",
    flightNumber: "JL005",
    departDate: "2025-04-01", departTime: "14:00",
    arriveDate: "2025-04-02", arriveTime: "17:30",
    seatClass: "business", confirmCode: "", notes: "Window seats requested",
  },
];

const SEAT_CLASSES: { key: SeatClass; label: string }[] = [
  { key: "economy",  label: "Economy"  },
  { key: "premium",  label: "Premium"  },
  { key: "business", label: "Business" },
  { key: "first",    label: "First"    },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function iconBgColor(status: SectionStatus, isActive: boolean): string {
  if (isActive)            return "#00A8CC";
  if (status === "done")   return "#00C96B";
  if (status === "partial")return "#FF8C00";
  return "#3a3a3a";
}

function statusTextColor(status: SectionStatus): string {
  if (status === "done")    return "#00C96B";
  if (status === "partial") return "#FF8C00";
  return "rgba(255,255,255,0.25)";
}

// ─── shared primitives ────────────────────────────────────────────────────────

function DarkCard({ children, className = "", style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-black uppercase tracking-[1.5px] text-white/35 text-center mb-2">
      {children}
    </div>
  );
}

function FieldInput({
  className = "",
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }}
    />
  );
}

// ─── GROUP section ────────────────────────────────────────────────────────────

function GroupSection() {
  const travelers = [
    { name: "Chris M.", role: "Organizer", color: "#FF2D8B" },
    { name: "Sarah M.", role: "Traveler",  color: "#FFD600" },
    { name: "Tom K.",   role: "Traveler",  color: "#00A8CC" },
    { name: "Lisa R.",  role: "Traveler",  color: "#00C96B" },
  ];
  return (
    <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
      {travelers.map((t, i) => (
        <DarkCard key={i} className="p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white"
            style={{ backgroundColor: t.color }}
          >
            {t.name[0]}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{t.name}</div>
            <div className="text-[11px] font-semibold text-white/40">{t.role}</div>
          </div>
        </DarkCard>
      ))}
      <DarkCard className="p-4 sm:col-span-2">
        <button
          type="button"
          className="flex items-center gap-2 font-black text-sm transition-opacity hover:opacity-80 mx-auto"
          style={{ color: "#00A8CC" }}
        >
          <PlusCircle size={18} weight="fill" />
          Invite a traveler
        </button>
      </DarkCard>
    </div>
  );
}

// ─── FLIGHTS section ──────────────────────────────────────────────────────────

interface FlightsSectionProps {
  leg: FlightLeg;
  updateLeg: (id: string, field: keyof FlightLeg, value: string) => void;
}

function FlightsSection({ leg, updateLeg }: FlightsSectionProps) {
  return (
    <>
      <style>{`
        .fb { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .fb-extras { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .fb           { grid-template-columns: 1fr 1fr 1fr; }
          .fb-airports  { grid-column: 1 / 3; }
          .fb-flightnum { grid-column: 3; grid-row: 1; }
          .fb-times     { grid-column: 1 / 4; }
          .fb-extras-wrap { grid-column: 1 / 4; }
          .fb-extras    { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>

      {/* Bento */}
      <div className="fb">

        {/* ── Airports ──────────────────────────────────────────── */}
        <DarkCard className="fb-airports p-4 md:p-5">
          <CardLabel>Route</CardLabel>

          {/* Desktop: side-by-side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex-1">
              <div
                className="font-semibold text-white leading-none mb-1.5"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "38px" }}
              >
                {leg.fromCode || "???"}
              </div>
              <div className="text-[11px] font-bold text-white/35 mb-3">
                {leg.fromCity || "Origin city"}
              </div>
              <FieldInput
                placeholder="IATA code (SRQ)"
                value={leg.fromCode}
                maxLength={3}
                onChange={(e) => updateLeg(leg.id, "fromCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }}
              />
              <FieldInput
                className="mt-2"
                placeholder="City, Country"
                value={leg.fromCity}
                onChange={(e) => updateLeg(leg.id, "fromCity", e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <Airplane size={24} weight="fill" style={{ color: "rgba(255,255,255,0.15)" }} />
              <div className="text-white/15 text-lg font-black">→</div>
            </div>

            <div className="flex-1 text-right">
              <div
                className="font-semibold text-white leading-none mb-1.5"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "38px" }}
              >
                {leg.toCode || "???"}
              </div>
              <div className="text-[11px] font-bold text-white/35 mb-3">
                {leg.toCity || "Destination"}
              </div>
              <FieldInput
                placeholder="IATA code (NRT)"
                value={leg.toCode}
                maxLength={3}
                onChange={(e) => updateLeg(leg.id, "toCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }}
              />
              <FieldInput
                className="mt-2"
                placeholder="City, Country"
                value={leg.toCity}
                onChange={(e) => updateLeg(leg.id, "toCity", e.target.value)}
              />
            </div>
          </div>

          {/* Mobile: compact side-by-side */}
          <div className="flex md:hidden items-start gap-3">
            <div className="flex-1">
              <div
                className="font-semibold text-white leading-none mb-1"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px" }}
              >
                {leg.fromCode || "???"}
              </div>
              <FieldInput
                className="mb-1.5"
                placeholder="SRQ"
                value={leg.fromCode}
                maxLength={3}
                onChange={(e) => updateLeg(leg.id, "fromCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }}
              />
              <FieldInput
                placeholder="City, Country"
                value={leg.fromCity}
                onChange={(e) => updateLeg(leg.id, "fromCity", e.target.value)}
              />
            </div>
            <div className="pt-2 flex-shrink-0">
              <Airplane size={18} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
            <div className="flex-1 text-right">
              <div
                className="font-semibold text-white leading-none mb-1"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px" }}
              >
                {leg.toCode || "???"}
              </div>
              <FieldInput
                className="mb-1.5"
                placeholder="NRT"
                value={leg.toCode}
                maxLength={3}
                onChange={(e) => updateLeg(leg.id, "toCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }}
              />
              <FieldInput
                placeholder="City, Country"
                value={leg.toCity}
                onChange={(e) => updateLeg(leg.id, "toCity", e.target.value)}
              />
            </div>
          </div>
        </DarkCard>

        {/* ── Flight number ──────────────────────────────────────── */}
        <DarkCard className="fb-flightnum p-4 md:p-5 flex flex-col items-center justify-center">
          <CardLabel>Flight #</CardLabel>
          <div
            className="font-semibold mb-3 text-center"
            style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 2.5vw, 30px)", color: "#00A8CC" }}
          >
            {leg.flightNumber || "—"}
          </div>
          <FieldInput
            placeholder="AA2847"
            value={leg.flightNumber}
            onChange={(e) => updateLeg(leg.id, "flightNumber", e.target.value.toUpperCase())}
            style={{ textTransform: "uppercase", textAlign: "center", letterSpacing: "1px", fontWeight: 900 }}
          />
        </DarkCard>

        {/* ── Depart / Arrive times ──────────────────────────────── */}
        <DarkCard className="fb-times p-4 md:p-5">
          <CardLabel>Depart → Arrive</CardLabel>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">
                Depart
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput
                  type="date"
                  value={leg.departDate}
                  onChange={(e) => updateLeg(leg.id, "departDate", e.target.value)}
                  className="text-white/70 text-xs"
                />
                <FieldInput
                  type="time"
                  value={leg.departTime}
                  onChange={(e) => updateLeg(leg.id, "departTime", e.target.value)}
                  className="text-white/70 text-xs"
                />
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center gap-1 px-2">
              <Airplane size={14} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
              <div className="text-[10px] font-black text-white/15 uppercase tracking-widest">direct</div>
            </div>

            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">
                Arrive
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput
                  type="date"
                  value={leg.arriveDate}
                  onChange={(e) => updateLeg(leg.id, "arriveDate", e.target.value)}
                  className="text-white/70 text-xs"
                />
                <FieldInput
                  type="time"
                  value={leg.arriveTime}
                  onChange={(e) => updateLeg(leg.id, "arriveTime", e.target.value)}
                  className="text-white/70 text-xs"
                />
              </div>
            </div>
          </div>
        </DarkCard>

        {/* ── Seat class + confirmation + notes ─────────────────── */}
        <div className="fb-extras-wrap">
          <div className="fb-extras">

            {/* Seat class */}
            <DarkCard className="p-4 md:p-5 flex flex-col items-center justify-center">
              <CardLabel>Seat Class</CardLabel>
              <div className="flex flex-wrap justify-center gap-1.5">
                {SEAT_CLASSES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateLeg(leg.id, "seatClass", key)}
                    className="rounded-full font-black border text-[13px] transition-all"
                    style={{
                      padding: "7px 14px",
                      backgroundColor: leg.seatClass === key ? "#FF2D8B" : "#3a3a3a",
                      borderColor:     leg.seatClass === key ? "#FF2D8B" : "#484848",
                      color:           leg.seatClass === key ? "#fff"   : "#9CA3AF",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </DarkCard>

            {/* Confirmation code */}
            <DarkCard className="p-4 md:p-5 flex flex-col items-center justify-center">
              <CardLabel>Confirmation</CardLabel>
              <div
                className="font-semibold mb-3 text-center tracking-widest"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(18px, 2vw, 24px)", color: "#FFD600" }}
              >
                {leg.confirmCode || "—"}
              </div>
              <FieldInput
                placeholder="XKMN29"
                value={leg.confirmCode}
                onChange={(e) => updateLeg(leg.id, "confirmCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", textAlign: "center", letterSpacing: "3px", fontWeight: 900 }}
              />
            </DarkCard>

            {/* Notes */}
            <DarkCard className="p-4 md:p-5 flex flex-col">
              <CardLabel>Notes</CardLabel>
              <textarea
                placeholder="Seat preferences, meal requests, layover notes…"
                value={leg.notes}
                onChange={(e) => updateLeg(leg.id, "notes", e.target.value)}
                className="flex-1 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white outline-none border resize-none transition-colors focus:border-[#00A8CC] placeholder-white/20"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "88px" }}
              />
            </DarkCard>

          </div>
        </div>

      </div>
    </>
  );
}

// ─── placeholder for unbuilt sections ────────────────────────────────────────

function PlaceholderSection({ section }: { section: SectionDef }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: section.color + "22", border: `1.5px dashed ${section.color}55` }}
      >
        <section.Icon size={28} weight="fill" style={{ color: section.color }} />
      </div>
      <p className="text-base font-bold text-white/40">{section.label}</p>
      <p className="text-sm font-semibold text-white/20 mt-1">Coming soon — under construction.</p>
    </div>
  );
}

// ─── main shell ───────────────────────────────────────────────────────────────

interface PreplanningShellProps {
  transportModes: string[];
}

export default function PreplanningShell({ transportModes }: PreplanningShellProps) {
  const sections = ALL_SECTIONS.filter(
    (s) => !s.transport || transportModes.includes(s.transport)
  );

  const [activeSection, setActiveSection] = useState(sections[0]?.key ?? "group");
  const [flightLegs,    setFlightLegs]    = useState<FlightLeg[]>(INITIAL_FLIGHT_LEGS);
  const [activeFlightLeg, setActiveFlightLeg] = useState(0);

  // Progress metrics
  const touchedCount = sections.filter((s) => MOCK_STATUSES[s.key] !== "empty").length;
  const progressPct  = Math.round(
    (sections.reduce((acc, s) => {
      const st = MOCK_STATUSES[s.key] ?? "empty";
      return acc + (st === "done" ? 1 : st === "partial" ? 0.5 : 0);
    }, 0) / sections.length) * 100
  );

  // Flight handlers
  function updateFlightLeg(id: string, field: keyof FlightLeg, value: string) {
    setFlightLegs((legs) => legs.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }
  function addFlightLeg() {
    const newLeg: FlightLeg = {
      id: Date.now().toString(),
      fromCode: "", fromCity: "", toCode: "", toCity: "",
      flightNumber: "", departDate: "", departTime: "",
      arriveDate: "", arriveTime: "",
      seatClass: "economy", confirmCode: "", notes: "",
    };
    setFlightLegs((legs) => [...legs, newLeg]);
    setActiveFlightLeg(flightLegs.length);
  }
  function removeFlightLeg(id: string) {
    setFlightLegs((legs) => legs.filter((l) => l.id !== id));
  }

  const currentSection = sections.find((s) => s.key === activeSection) ?? sections[0];

  function renderSubNav(): React.ReactNode {
    if (activeSection !== "flights") return null;
    return (
      <div className="flex items-center gap-2 flex-wrap mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {flightLegs.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveFlightLeg(i)}
            className="flex items-center gap-1.5 rounded-full font-black border transition-all text-sm"
            style={{
              padding: "7px 16px",
              backgroundColor: activeFlightLeg === i ? "#FF2D8B" : "rgba(255,255,255,0.07)",
              borderColor:     activeFlightLeg === i ? "#FF2D8B" : "rgba(255,255,255,0.12)",
              color:           activeFlightLeg === i ? "#fff"   : "#9CA3AF",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
            Leg {i + 1}
            {flightLegs.length > 1 && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFlightLeg(l.id);
                  setActiveFlightLeg(Math.max(0, i - 1));
                }}
                className="ml-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={11} weight="bold" />
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={addFlightLeg}
          className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
          style={{
            padding: "7px 16px",
            borderStyle: "dashed",
            borderColor: "rgba(255,45,139,0.35)",
            color: "#FF2D8B",
            backgroundColor: "transparent",
          }}
        >
          <Plus size={12} weight="bold" />
          Add leg
        </button>
      </div>
    );
  }

  function renderContent() {
    if (!currentSection) return null;
    switch (currentSection.key) {
      case "flights": {
        const leg = flightLegs[activeFlightLeg] ?? flightLegs[0];
        return leg ? <FlightsSection leg={leg} updateLeg={updateFlightLeg} /> : null;
      }
      case "group":
        return <GroupSection />;
      default:
        return <PlaceholderSection section={currentSection} />;
    }
  }

  return (
    <div className="flex flex-col">

      {/* ── DARK PAGE HEADER ─────────────────────────────────────── */}
      <header
        className="border-b flex-shrink-0 px-4 py-4 md:px-7 md:py-5"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Preplanning
            </h1>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Fill in the details. Everything here is optional.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-0.5">
              Ball fill
            </div>
            <div
              className="font-semibold leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "26px", color: "#00A8CC" }}
            >
              {progressPct}%
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a3a" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #FF2D8B, #00A8CC)" }}
            />
          </div>
          <span className="text-[11px] font-black whitespace-nowrap" style={{ color: "#00A8CC" }}>
            {touchedCount} of {sections.length} sections touched
          </span>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div className="flex">

        {/* Desktop panel nav — sticky below TopNav */}
        <nav
          className="hidden md:flex flex-col w-[220px] border-r flex-shrink-0 sticky overflow-y-auto"
          style={{
            backgroundColor: "#252525",
            borderColor: "#333333",
            top: "56px",
            height: "calc(100vh - 56px)",
          }}
        >
          <div className="p-3 flex flex-col gap-0.5">
            {sections.map((s) => {
              const status   = MOCK_STATUSES[s.key] ?? "empty";
              const isActive = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveSection(s.key)}
                  className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 transition-all text-left"
                  style={{
                    backgroundColor: isActive ? "rgba(0,168,204,0.1)" : "transparent",
                    border: isActive ? "1px solid rgba(0,168,204,0.25)" : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ backgroundColor: iconBgColor(status, isActive) }}
                  >
                    <s.Icon
                      size={15}
                      weight="fill"
                      color={isActive || status !== "empty" ? "#fff" : "#9CA3AF"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-black leading-none truncate"
                      style={{
                        color: isActive
                          ? "#fff"
                          : status !== "empty"
                          ? "rgba(255,255,255,0.75)"
                          : "#9CA3AF",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="text-[10px] font-bold mt-0.5 truncate"
                      style={{ color: isActive ? "#00A8CC" : statusTextColor(status) }}
                    >
                      {MOCK_STATUS_TEXT[s.key]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content column */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Mobile horizontal tab bar — sticky below TopNav */}
          <div
            className="md:hidden flex border-b flex-shrink-0 sticky z-10 overflow-x-auto gap-1.5 px-3 py-2.5"
            style={{
              top: "56px",
              backgroundColor: "#252525",
              borderColor: "#333333",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            } as React.CSSProperties}
          >
            {sections.map((s) => {
              const status   = MOCK_STATUSES[s.key] ?? "empty";
              const isActive = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveSection(s.key)}
                  className="flex flex-col items-center gap-1 rounded-xl flex-shrink-0 transition-all"
                  style={{
                    minWidth: "58px",
                    padding: "8px 8px",
                    backgroundColor: isActive ? "rgba(0,168,204,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(0,168,204,0.3)" : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: iconBgColor(status, isActive) }}
                  >
                    <s.Icon
                      size={13}
                      weight="fill"
                      color={isActive || status !== "empty" ? "#fff" : "#9CA3AF"}
                    />
                  </div>
                  <span
                    className="text-[9px] font-black uppercase tracking-wide text-center leading-tight"
                    style={{ color: isActive ? "#00A8CC" : "#9CA3AF" }}
                  >
                    {s.label.replace(" ", "\n")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section content */}
          <div className="p-4 md:p-6 flex flex-col gap-4">

            {/* Dark section intro bar: icon + title + status + sub-nav */}
            {currentSection && (
              <div
                className="rounded-[20px] border px-5 py-4 flex-shrink-0"
                style={{ backgroundColor: "#282828", borderColor: "#333333" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: currentSection.color }}
                  >
                    <currentSection.Icon size={20} weight="fill" color="#fff" />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-semibold text-white leading-none"
                      style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                      {currentSection.label}
                    </div>
                    <div
                      className="text-[11px] font-bold mt-0.5"
                      style={{ color: statusTextColor(MOCK_STATUSES[currentSection.key] ?? "empty") }}
                    >
                      {MOCK_STATUS_TEXT[currentSection.key]}
                    </div>
                  </div>
                </div>
                {renderSubNav()}
              </div>
            )}

            {/* Bento / section content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
