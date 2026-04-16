"use client";

import { useState } from "react";
import {
  Users, Airplane, Car, Train, Boat, House,
  CurrencyDollar, MapPin, Files, Sparkle, CheckSquare,
  Plus, X, PlusCircle, Warning, Check,
  ForkKnife, Ticket, ShoppingBag, Bus, Tag,
} from "@phosphor-icons/react";

// ─── types ────────────────────────────────────────────────────────────────────

type SectionStatus = "empty" | "partial" | "done";
type SeatClass = "economy" | "premium" | "business" | "first";
type AccommodationType = "hotel" | "airbnb" | "resort" | "hostel" | "motel" | "rental" | "other";

interface SectionDef {
  key: string;
  label: string;
  Icon: React.ElementType;
  color: string;
}

interface FlightLeg {
  id: string;
  fromCode: string; fromCity: string;
  toCode: string;   toCity: string;
  flightNumber: string;
  departDate: string; departTime: string;
  arriveDate: string; arriveTime: string;
  seatClass: SeatClass;
  confirmCode: string;
  notes: string;
}

interface DrivingLeg {
  id: string;
  fromCity: string;
  toCity: string;
  departDate: string;
  departTime: string;
  estimatedHours: string;
  stops: { id: string; city: string }[];
  rentalCar: boolean;
  carDetails: string;
  rentalCost: string;       // total rental cost in USD, only relevant when rentalCar === true
  rentalDays: string;       // number of rental days
  notes: string;
}

interface LodgingStay {
  id: string;
  name: string;
  type: AccommodationType;
  address: string;
  city: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  costPerNight: string;
  confirmCode: string;
  roomType: string;
  notes: string;
}

type DestinationType =
  | "city" | "beach" | "mountain" | "countryside"
  | "island" | "national-park" | "ski" | "other";

interface MustDoItem {
  id: string;
  text: string;
  done: boolean;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  type: DestinationType;
  color: string;
  arrivalDate: string;
  departureDate: string;
  mustDo: MustDoItem[];
  notes: string;
}

// ─── transport mode metadata ──────────────────────────────────────────────────

const TRANSPORT_META: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  fly:    { label: "Flights",  Icon: Airplane, color: "#FF2D8B" },
  drive:  { label: "Driving",  Icon: Car,      color: "#FF8C00" },
  train:  { label: "Train",    Icon: Train,    color: "#00A8CC" },
  cruise: { label: "Cruise",   Icon: Boat,     color: "#00C96B" },
};

// ─── section registry ─────────────────────────────────────────────────────────

const ALL_SECTIONS: SectionDef[] = [
  { key: "group",        label: "Group",        Icon: Users,          color: "#00A8CC" },
  { key: "travel",       label: "Travel",        Icon: Airplane,       color: "#FF2D8B" },
  { key: "lodging",      label: "Lodging",       Icon: House,          color: "#A855F7" },
  { key: "budget",       label: "Budget",        Icon: CurrencyDollar, color: "#00C96B" },
  { key: "destinations", label: "Destinations",  Icon: MapPin,         color: "#FFD600" },
  { key: "documents",    label: "Documents",     Icon: Files,          color: "#00A8CC" },
  { key: "vibe",         label: "Trip Vibe",     Icon: Sparkle,        color: "#FF2D8B" },
  { key: "predeparture", label: "Pre-Departure", Icon: CheckSquare,    color: "#00C96B" },
];

// ─── mock state ───────────────────────────────────────────────────────────────

const MOCK_STATUSES: Record<string, SectionStatus> = {
  group: "done", travel: "partial", lodging: "partial",
  budget: "partial", destinations: "partial", documents: "empty",
  vibe: "empty", predeparture: "empty",
};

const MOCK_STATUS_TEXT: Record<string, string> = {
  group:        "4 travelers added",
  travel:       "2 flights entered",
  lodging:      "1 of 2 stays confirmed",
  budget:       "Budget set · 8 categories",
  destinations: "3 stops · 12 days planned",
  documents:    "Not started",
  vibe:         "Not started",
  predeparture: "Not started",
};

// ─── mock travel data ─────────────────────────────────────────────────────────

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

const INITIAL_DRIVING_LEGS: DrivingLeg[] = [
  {
    id: "1",
    fromCity: "Tokyo",
    toCity: "Kyoto",
    departDate: "2025-04-08",
    departTime: "09:00",
    estimatedHours: "2.5",
    stops: [],
    rentalCar: true,
    carDetails: "Toyota Prius · Budget Rent-a-Car",
    rentalCost: "180",
    rentalDays: "3",
    notes: "",
  },
];

const SEAT_CLASSES: { key: SeatClass; label: string }[] = [
  { key: "economy",  label: "Economy"  },
  { key: "premium",  label: "Premium"  },
  { key: "business", label: "Business" },
  { key: "first",    label: "First"    },
];

const ACCOM_TYPES: { key: AccommodationType; label: string }[] = [
  { key: "hotel",   label: "Hotel"           },
  { key: "airbnb",  label: "Airbnb"          },
  { key: "resort",  label: "Resort"          },
  { key: "hostel",  label: "Hostel"          },
  { key: "motel",   label: "Motel"           },
  { key: "rental",  label: "Vacation Rental" },
  { key: "other",   label: "Other"           },
];

const INITIAL_LODGING_STAYS: LodgingStay[] = [
  {
    id: "1",
    name: "Park Hyatt Tokyo",
    type: "hotel",
    address: "3-7-1-2 Nishi Shinjuku",
    city: "Tokyo, Japan",
    checkInDate:  "2025-04-02", checkInTime:  "15:00",
    checkOutDate: "2025-04-07", checkOutTime: "11:00",
    costPerNight: "280",
    confirmCode: "PH8823X",
    roomType: "Deluxe King",
    notes: "Requested high floor with city view.",
  },
  {
    id: "2",
    name: "Kyoto Machiya Stay",
    type: "airbnb",
    address: "Higashiyama-ku",
    city: "Kyoto, Japan",
    checkInDate:  "2025-04-08", checkInTime:  "16:00",
    checkOutDate: "2025-04-12", checkOutTime: "10:00",
    costPerNight: "150",
    confirmCode: "",
    roomType: "",
    notes: "",
  },
];

const DEST_TYPES: { key: DestinationType; label: string }[] = [
  { key: "city",          label: "City"          },
  { key: "beach",         label: "Beach"         },
  { key: "mountain",      label: "Mountain"      },
  { key: "countryside",   label: "Countryside"   },
  { key: "island",        label: "Island"        },
  { key: "national-park", label: "National Park" },
  { key: "ski",           label: "Ski Resort"    },
  { key: "other",         label: "Other"         },
];

const DEST_COLOR_OPTIONS = ["#FF2D8B", "#00A8CC", "#FFD600", "#00C96B", "#FF8C00", "#A855F7"];

const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: "d1", name: "Tokyo", country: "Japan", type: "city", color: "#FF2D8B",
    arrivalDate: "2025-04-02", departureDate: "2025-04-07",
    mustDo: [
      { id: "d1a", text: "Shibuya Crossing at night",       done: true  },
      { id: "d1b", text: "teamLab Planets",                 done: false },
      { id: "d1c", text: "Shinjuku Gyoen cherry blossoms",  done: false },
      { id: "d1d", text: "Tsukiji Outer Market breakfast",  done: false },
      { id: "d1e", text: "Senso-ji Temple at sunrise",      done: false },
    ],
    notes: "Book teamLab tickets well in advance. Check cherry blossom forecast.",
  },
  {
    id: "d2", name: "Kyoto", country: "Japan", type: "city", color: "#FFD600",
    arrivalDate: "2025-04-08", departureDate: "2025-04-12",
    mustDo: [
      { id: "d2a", text: "Fushimi Inari at dawn",           done: false },
      { id: "d2b", text: "Arashiyama Bamboo Grove",         done: false },
      { id: "d2c", text: "Kinkaku-ji (Golden Pavilion)",    done: false },
      { id: "d2d", text: "Nishiki Market food walk",        done: false },
    ],
    notes: "Rent bikes to explore. Comfortable shoes — lots of walking.",
  },
  {
    id: "d3", name: "Osaka", country: "Japan", type: "city", color: "#00C96B",
    arrivalDate: "2025-04-12", departureDate: "2025-04-15",
    mustDo: [
      { id: "d3a", text: "Dotonbori street food crawl",     done: false },
      { id: "d3b", text: "Osaka Castle grounds",            done: false },
      { id: "d3c", text: "Kuromon Ichiba Market",           done: false },
    ],
    notes: "",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function iconBgColor(status: SectionStatus, isActive: boolean): string {
  if (isActive)             return "#00A8CC";
  if (status === "done")    return "#00C96B";
  if (status === "partial") return "#FF8C00";
  return "#3a3a3a";
}

function calcNights(checkIn: string, checkOut: string): number | null {
  if (!checkIn || !checkOut) return null;
  const diff = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
  );
  return diff > 0 ? diff : null;
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

function CardLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[10px] font-black uppercase tracking-[1.5px] text-white/35 text-center mb-2 ${className}`}>
      {children}
    </div>
  );
}

function FieldInput({ className = "", style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
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

// ─── FLIGHTS bento ────────────────────────────────────────────────────────────

interface FlightsBentoProps {
  leg: FlightLeg;
  updateLeg: (id: string, field: keyof FlightLeg, value: string) => void;
}

function FlightsBento({ leg, updateLeg }: FlightsBentoProps) {
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
      <div className="fb">

        {/* Route */}
        <DarkCard className="fb-airports p-4 md:p-5">
          <CardLabel>Route</CardLabel>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-white leading-none mb-1.5"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "38px" }}>
                {leg.fromCode || "???"}
              </div>
              <div className="text-[11px] font-bold text-white/35 mb-3">{leg.fromCity || "Origin"}</div>
              <FieldInput placeholder="IATA code (SRQ)" value={leg.fromCode} maxLength={3}
                onChange={(e) => updateLeg(leg.id, "fromCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }} />
              <FieldInput className="mt-2" placeholder="City, Country" value={leg.fromCity}
                onChange={(e) => updateLeg(leg.id, "fromCity", e.target.value)} />
            </div>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <Airplane size={24} weight="fill" style={{ color: "rgba(255,255,255,0.15)" }} />
              <div className="text-white/15 text-lg font-black">→</div>
            </div>
            <div className="flex-1 text-right">
              <div className="font-semibold text-white leading-none mb-1.5"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "38px" }}>
                {leg.toCode || "???"}
              </div>
              <div className="text-[11px] font-bold text-white/35 mb-3">{leg.toCity || "Destination"}</div>
              <FieldInput placeholder="IATA code (NRT)" value={leg.toCode} maxLength={3}
                onChange={(e) => updateLeg(leg.id, "toCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }} />
              <FieldInput className="mt-2" placeholder="City, Country" value={leg.toCity}
                onChange={(e) => updateLeg(leg.id, "toCity", e.target.value)} />
            </div>
          </div>
          {/* Mobile */}
          <div className="flex md:hidden items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold text-white leading-none mb-1"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px" }}>
                {leg.fromCode || "???"}
              </div>
              <FieldInput className="mb-1.5" placeholder="SRQ" value={leg.fromCode} maxLength={3}
                onChange={(e) => updateLeg(leg.id, "fromCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }} />
              <FieldInput placeholder="City, Country" value={leg.fromCity}
                onChange={(e) => updateLeg(leg.id, "fromCity", e.target.value)} />
            </div>
            <div className="pt-2 flex-shrink-0">
              <Airplane size={18} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
            <div className="flex-1 text-right">
              <div className="font-semibold text-white leading-none mb-1"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px" }}>
                {leg.toCode || "???"}
              </div>
              <FieldInput className="mb-1.5" placeholder="NRT" value={leg.toCode} maxLength={3}
                onChange={(e) => updateLeg(leg.id, "toCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "3px", textAlign: "center", fontWeight: 900 }} />
              <FieldInput placeholder="City, Country" value={leg.toCity}
                onChange={(e) => updateLeg(leg.id, "toCity", e.target.value)} />
            </div>
          </div>
        </DarkCard>

        {/* Flight # */}
        <DarkCard className="fb-flightnum p-4 md:p-5 flex flex-col items-center justify-center">
          <CardLabel>Flight #</CardLabel>
          <div className="font-semibold mb-3 text-center"
               style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 2.5vw, 30px)", color: "#00A8CC" }}>
            {leg.flightNumber || "—"}
          </div>
          <FieldInput placeholder="AA2847" value={leg.flightNumber}
            onChange={(e) => updateLeg(leg.id, "flightNumber", e.target.value.toUpperCase())}
            style={{ textTransform: "uppercase", textAlign: "center", letterSpacing: "1px", fontWeight: 900 }} />
        </DarkCard>

        {/* Times */}
        <DarkCard className="fb-times p-4 md:p-5">
          <CardLabel>Depart → Arrive</CardLabel>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Depart</div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput type="date" value={leg.departDate} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "departDate", e.target.value)} />
                <FieldInput type="time" value={leg.departTime} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "departTime", e.target.value)} />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-1 px-2">
              <Airplane size={14} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
              <div className="text-[10px] font-black text-white/15 uppercase tracking-widest">direct</div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Arrive</div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput type="date" value={leg.arriveDate} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "arriveDate", e.target.value)} />
                <FieldInput type="time" value={leg.arriveTime} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "arriveTime", e.target.value)} />
              </div>
            </div>
          </div>
        </DarkCard>

        {/* Seat + Confirm + Notes */}
        <div className="fb-extras-wrap">
          <div className="fb-extras">
            <DarkCard className="p-4 md:p-5 flex flex-col items-center justify-center">
              <CardLabel>Seat Class</CardLabel>
              <div className="flex flex-wrap justify-center gap-1.5">
                {SEAT_CLASSES.map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => updateLeg(leg.id, "seatClass", key)}
                    className="rounded-full font-black border text-[13px] transition-all"
                    style={{
                      padding: "7px 14px",
                      backgroundColor: leg.seatClass === key ? "#FF2D8B" : "#3a3a3a",
                      borderColor:     leg.seatClass === key ? "#FF2D8B" : "#484848",
                      color:           leg.seatClass === key ? "#fff"   : "#9CA3AF",
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </DarkCard>
            <DarkCard className="p-4 md:p-5 flex flex-col items-center justify-center">
              <CardLabel>Confirmation</CardLabel>
              <div className="font-semibold mb-3 text-center tracking-widest"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(18px, 2vw, 24px)", color: "#FFD600" }}>
                {leg.confirmCode || "—"}
              </div>
              <FieldInput placeholder="XKMN29" value={leg.confirmCode}
                onChange={(e) => updateLeg(leg.id, "confirmCode", e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", textAlign: "center", letterSpacing: "3px", fontWeight: 900 }} />
            </DarkCard>
            <DarkCard className="p-4 md:p-5 flex flex-col">
              <CardLabel>Notes</CardLabel>
              <textarea placeholder="Seat preferences, meal requests, layover notes…"
                value={leg.notes}
                onChange={(e) => updateLeg(leg.id, "notes", e.target.value)}
                className="flex-1 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white outline-none border resize-none transition-colors focus:border-[#00A8CC] placeholder-white/20"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "88px" }} />
            </DarkCard>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── DRIVING bento ────────────────────────────────────────────────────────────

interface DrivingBentoProps {
  leg: DrivingLeg;
  updateLeg: (id: string, field: keyof DrivingLeg, value: string | boolean) => void;
  addStop: (legId: string) => void;
  removeStop: (legId: string, stopId: string) => void;
  updateStop: (legId: string, stopId: string, city: string) => void;
}

function DrivingBento({ leg, updateLeg, addStop, removeStop, updateStop }: DrivingBentoProps) {
  return (
    <>
      <style>{`
        .db { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .db-extras { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .db            { grid-template-columns: 1fr 1fr; }
          .db-route      { grid-column: 1 / 3; }
          .db-extras-wrap { grid-column: 1 / 3; }
          .db-extras     { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      <div className="db">

        {/* Route + Departure */}
        <DarkCard className="db-route p-4 md:p-5">
          <CardLabel>Route &amp; Departure</CardLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_2px_1fr]">
            {/* From */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">From</div>
              <div className="font-semibold text-white leading-none mb-2 text-center"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 2.5vw, 30px)" }}>
                {leg.fromCity || "Origin"}
              </div>
              <FieldInput placeholder="City" value={leg.fromCity}
                onChange={(e) => updateLeg(leg.id, "fromCity", e.target.value)} style={{ textAlign: "center" }} />
            </div>
            {/* Arrow */}
            <div className="hidden md:flex flex-col items-center justify-center gap-1 px-2">
              <Car size={20} weight="fill" style={{ color: "rgba(255,255,255,0.15)" }} />
              <div className="text-white/15 font-black">→</div>
            </div>
            {/* To */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">To</div>
              <div className="font-semibold text-white leading-none mb-2 text-center"
                   style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 2.5vw, 30px)" }}>
                {leg.toCity || "Destination"}
              </div>
              <FieldInput placeholder="City" value={leg.toCity}
                onChange={(e) => updateLeg(leg.id, "toCity", e.target.value)} style={{ textAlign: "center" }} />
            </div>
            {/* Divider */}
            <div className="hidden md:block w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            {/* Departure */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Departure</div>
              <div className="grid grid-cols-1 gap-2">
                <FieldInput type="date" value={leg.departDate} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "departDate", e.target.value)} />
                <FieldInput type="time" value={leg.departTime} className="text-white/70 text-xs"
                  onChange={(e) => updateLeg(leg.id, "departTime", e.target.value)} />
                <div className="flex items-center gap-2">
                  <FieldInput placeholder="Est. hours (e.g. 2.5)" value={leg.estimatedHours}
                    onChange={(e) => updateLeg(leg.id, "estimatedHours", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </DarkCard>

        {/* Stops + Vehicle/Notes */}
        <div className="db-extras-wrap">
          <div className="db-extras">
            {/* Stops */}
            <DarkCard className="p-4 md:p-5">
              <CardLabel>Stops Along the Way</CardLabel>
              <div className="flex flex-col gap-2">
                {leg.stops.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                         style={{ backgroundColor: "#FF8C00" }}>
                      {i + 1}
                    </div>
                    <FieldInput
                      className="flex-1"
                      placeholder="City name"
                      value={stop.city}
                      onChange={(e) => updateStop(leg.id, stop.id, e.target.value)}
                    />
                    <button type="button" onClick={() => removeStop(leg.id, stop.id)}
                      className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0">
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addStop(leg.id)}
                  className="flex items-center gap-2 font-black text-sm transition-opacity hover:opacity-80 mx-auto mt-1"
                  style={{ color: "#FF8C00", fontSize: "13px", border: "1px dashed rgba(255,140,0,0.4)", borderRadius: "10px", padding: "6px 16px" }}>
                  <Plus size={13} weight="bold" />
                  Add stop
                </button>
                {leg.stops.length === 0 && (
                  <p className="text-[12px] font-semibold text-white/25 text-center mt-1">No stops — direct drive</p>
                )}
              </div>
            </DarkCard>

            {/* Vehicle + Notes */}
            <DarkCard className="p-4 md:p-5 flex flex-col gap-4">
              <div>
                <CardLabel>Vehicle</CardLabel>
                {/* Own car / Rental toggle */}
                <div className="flex gap-2 justify-center mb-3">
                  {[{ val: false, label: "Own Car" }, { val: true, label: "Rental Car" }].map(({ val, label }) => (
                    <button key={label} type="button"
                      onClick={() => updateLeg(leg.id, "rentalCar", val)}
                      className="rounded-full font-black border text-[13px] transition-all"
                      style={{
                        padding: "7px 16px",
                        backgroundColor: leg.rentalCar === val ? "#FF8C00" : "#3a3a3a",
                        borderColor:     leg.rentalCar === val ? "#FF8C00" : "#484848",
                        color:           leg.rentalCar === val ? "#fff"   : "#9CA3AF",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Car details */}
                <FieldInput
                  placeholder={leg.rentalCar ? "Budget Rent-a-Car · Prius" : "Make, model, plates…"}
                  value={leg.carDetails}
                  onChange={(e) => updateLeg(leg.id, "carDetails", e.target.value)}
                />

                {/* Rental cost — only shown when rental is selected */}
                {leg.rentalCar && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[10px] font-black uppercase tracking-[1.5px] text-white/35 text-center mb-2">
                      Rental Cost
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Total cost */}
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-white/30 pointer-events-none">$</span>
                        <FieldInput
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={leg.rentalCost}
                          onChange={(e) => updateLeg(leg.id, "rentalCost", e.target.value)}
                          className="pl-6 text-right"
                        />
                        <span className="block text-[9px] font-black uppercase tracking-widest text-white/25 text-center mt-1">Total Cost</span>
                      </div>
                      {/* Days */}
                      <div className="relative">
                        <FieldInput
                          type="number"
                          min="1"
                          placeholder="1"
                          value={leg.rentalDays}
                          onChange={(e) => updateLeg(leg.id, "rentalDays", e.target.value)}
                          className="text-center"
                        />
                        <span className="block text-[9px] font-black uppercase tracking-widest text-white/25 text-center mt-1">Days</span>
                      </div>
                    </div>
                    {/* Per-day breakdown */}
                    {leg.rentalCost && leg.rentalDays && Number(leg.rentalDays) > 0 && (
                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-black" style={{ color: "#FF8C00" }}>
                          ${(Number(leg.rentalCost) / Number(leg.rentalDays)).toFixed(2)}
                          <span className="text-white/30 font-bold"> / day</span>
                        </span>
                      </div>
                    )}
                    {/* Trip cost contribution badge */}
                    {leg.rentalCost && (
                      <div className="mt-2 flex items-center justify-center gap-1.5 rounded-[10px] px-3 py-1.5"
                           style={{ backgroundColor: "rgba(255,140,0,0.1)", border: "1px solid rgba(255,140,0,0.2)" }}>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#FF8C00" }}>
                          +${Number(leg.rentalCost).toLocaleString()} to trip cost
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <CardLabel>Notes</CardLabel>
                <textarea
                  placeholder="Toll roads, parking, scenic routes…"
                  value={leg.notes}
                  onChange={(e) => updateLeg(leg.id, "notes", e.target.value)}
                  className="w-full rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white outline-none border resize-none transition-colors focus:border-[#00A8CC] placeholder-white/20"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "72px" }}
                />
              </div>
            </DarkCard>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── LODGING bento ────────────────────────────────────────────────────────────

const LODGING_COLOR = "#A855F7";

interface LodgingBentoProps {
  stay: LodgingStay;
  updateStay: (id: string, field: keyof LodgingStay, value: string) => void;
}

function LodgingBento({ stay, updateStay }: LodgingBentoProps) {
  const nights = calcNights(stay.checkInDate, stay.checkOutDate);
  const totalCost = nights !== null && stay.costPerNight
    ? (nights * Number(stay.costPerNight))
    : null;

  return (
    <>
      <style>{`
        .lb { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .lb-extras-wrap { display: contents; }
        .lb-extras { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .lb              { grid-template-columns: 1fr 1fr 1fr; }
          .lb-property     { grid-column: 1 / 3; }
          .lb-confirm      { grid-column: 3; grid-row: 1; }
          .lb-dates        { grid-column: 1 / 4; }
          .lb-extras-wrap  { display: block; grid-column: 1 / 4; }
          .lb-extras       { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
          .lb-cost         { grid-column: 1 / 3; }
        }
      `}</style>
      <div className="lb">

        {/* Property */}
        <DarkCard className="lb-property p-4 md:p-5">
          <CardLabel>Property</CardLabel>
          {/* Big name display */}
          <div className="font-semibold text-white leading-none mb-1 truncate"
               style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 2.8vw, 32px)" }}>
            {stay.name || "Property Name"}
          </div>
          <div className="text-[11px] font-bold text-white/30 mb-3 truncate">
            {stay.city || "City, Country"}
          </div>
          {/* Name + city fields */}
          <div className="flex flex-col gap-2 mb-3">
            <FieldInput
              placeholder="Hotel / Airbnb name"
              value={stay.name}
              onChange={(e) => updateStay(stay.id, "name", e.target.value)}
            />
            <div className="grid grid-cols-[1fr_1fr] gap-2">
              <FieldInput
                placeholder="Address"
                value={stay.address}
                onChange={(e) => updateStay(stay.id, "address", e.target.value)}
              />
              <FieldInput
                placeholder="City, Country"
                value={stay.city}
                onChange={(e) => updateStay(stay.id, "city", e.target.value)}
              />
            </div>
          </div>
          {/* Accommodation type pills */}
          <div className="flex flex-wrap gap-1.5">
            {ACCOM_TYPES.map(({ key, label }) => (
              <button key={key} type="button"
                onClick={() => updateStay(stay.id, "type", key)}
                className="rounded-full font-black border text-[12px] transition-all"
                style={{
                  padding: "5px 12px",
                  backgroundColor: stay.type === key ? LODGING_COLOR : "#3a3a3a",
                  borderColor:     stay.type === key ? LODGING_COLOR : "#484848",
                  color:           stay.type === key ? "#fff"        : "#9CA3AF",
                }}>
                {label}
              </button>
            ))}
          </div>
        </DarkCard>

        {/* Confirmation */}
        <DarkCard className="lb-confirm p-4 md:p-5 flex flex-col items-center justify-center gap-3">
          <CardLabel>Confirmation</CardLabel>
          <div className="font-semibold tracking-widest text-center"
               style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(20px, 2vw, 28px)", color: "#FFD600" }}>
            {stay.confirmCode || "—"}
          </div>
          <FieldInput
            placeholder="XKMN29"
            value={stay.confirmCode}
            onChange={(e) => updateStay(stay.id, "confirmCode", e.target.value.toUpperCase())}
            style={{ textTransform: "uppercase", textAlign: "center", letterSpacing: "3px", fontWeight: 900 }}
          />
          {/* Room type */}
          <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
            <div className="text-[10px] font-black uppercase tracking-[1.5px] text-white/35 text-center mb-2">Room Type</div>
            <FieldInput
              placeholder="Deluxe King, Suite…"
              value={stay.roomType}
              onChange={(e) => updateStay(stay.id, "roomType", e.target.value)}
              style={{ textAlign: "center" }}
            />
          </div>
        </DarkCard>

        {/* Check-in / Check-out */}
        <DarkCard className="lb-dates p-4 md:p-5">
          <CardLabel>Check-in → Check-out</CardLabel>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
            {/* Check-in */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Check-in</div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput type="date" value={stay.checkInDate} className="text-white/70 text-xs"
                  onChange={(e) => updateStay(stay.id, "checkInDate", e.target.value)} />
                <FieldInput type="time" value={stay.checkInTime} className="text-white/70 text-xs"
                  onChange={(e) => updateStay(stay.id, "checkInTime", e.target.value)} />
              </div>
            </div>
            {/* Nights pill */}
            <div className="hidden md:flex flex-col items-center justify-center gap-1 px-2">
              <div
                className="rounded-full font-black text-[13px] px-3 py-1.5 text-center"
                style={{
                  backgroundColor: nights !== null ? `${LODGING_COLOR}22` : "rgba(255,255,255,0.05)",
                  color: nights !== null ? LODGING_COLOR : "rgba(255,255,255,0.2)",
                  border: `1px solid ${nights !== null ? LODGING_COLOR + "55" : "rgba(255,255,255,0.1)"}`,
                  minWidth: "52px",
                }}>
                {nights !== null ? `${nights}n` : "--"}
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">nights</div>
            </div>
            {/* Check-out */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Check-out</div>
              <div className="grid grid-cols-2 gap-2">
                <FieldInput type="date" value={stay.checkOutDate} className="text-white/70 text-xs"
                  onChange={(e) => updateStay(stay.id, "checkOutDate", e.target.value)} />
                <FieldInput type="time" value={stay.checkOutTime} className="text-white/70 text-xs"
                  onChange={(e) => updateStay(stay.id, "checkOutTime", e.target.value)} />
              </div>
            </div>
          </div>
          {/* Mobile nights pill */}
          {nights !== null && (
            <div className="flex md:hidden justify-center mt-3">
              <div className="rounded-full font-black text-[12px] px-4 py-1"
                   style={{ backgroundColor: `${LODGING_COLOR}22`, color: LODGING_COLOR, border: `1px solid ${LODGING_COLOR}55` }}>
                {nights} night{nights !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </DarkCard>

        {/* Cost + Notes */}
        <div className="lb-extras-wrap">
          <div className="lb-extras">

            {/* Cost */}
            <DarkCard className="lb-cost p-4 md:p-5">
              <CardLabel>Cost</CardLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
                {/* Per-night */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/25 text-center mb-2">Per Night</div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-white/30 pointer-events-none">$</span>
                    <FieldInput
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={stay.costPerNight}
                      onChange={(e) => updateStay(stay.id, "costPerNight", e.target.value)}
                      className="pl-6 text-right"
                    />
                  </div>
                </div>
                {/* Breakdown */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] p-3"
                     style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {nights !== null && stay.costPerNight ? (
                    <>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/25">
                        {nights} night{nights !== 1 ? "s" : ""} ×  ${Number(stay.costPerNight).toLocaleString()}
                      </div>
                      <div className="font-semibold leading-none"
                           style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px", color: LODGING_COLOR }}>
                        ${totalCost!.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/20">total</div>
                    </>
                  ) : (
                    <div className="text-[11px] font-bold text-white/20 text-center">
                      Enter dates + nightly rate to calculate total
                    </div>
                  )}
                </div>
              </div>
              {/* Trip cost badge */}
              {totalCost !== null && (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-[10px] px-3 py-1.5"
                     style={{ backgroundColor: `${LODGING_COLOR}18`, border: `1px solid ${LODGING_COLOR}33` }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: LODGING_COLOR }}>
                    +${totalCost.toLocaleString()} to trip cost
                  </span>
                </div>
              )}
            </DarkCard>

            {/* Notes */}
            <DarkCard className="p-4 md:p-5 flex flex-col">
              <CardLabel>Notes</CardLabel>
              <textarea
                placeholder="Special requests, amenities, parking, early check-in…"
                value={stay.notes}
                onChange={(e) => updateStay(stay.id, "notes", e.target.value)}
                className="flex-1 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white outline-none border resize-none transition-colors focus:border-[#00A8CC] placeholder-white/20"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "100px" }}
              />
            </DarkCard>

          </div>
        </div>

      </div>
    </>
  );
}

// ─── BUDGET section ───────────────────────────────────────────────────────────

const BUDGET_COLOR = "#00C96B";

interface BudgetItem {
  key: string;
  label: string;
  Icon: React.ElementType;
  color: string;
  amount: string;
  isAuto: boolean;
  autoLabel?: string;
}

interface BudgetSectionProps {
  linkedLodging: number;
  linkedCarRental: number;
}

function BudgetSection({ linkedLodging, linkedCarRental }: BudgetSectionProps) {
  const [targetBudget, setTargetBudget] = useState("5000");
  const [items, setItems] = useState<BudgetItem[]>([
    { key: "flights",    label: "Flights",       Icon: Airplane,    color: "#FF2D8B", amount: "1200",                                   isAuto: false },
    { key: "lodging",    label: "Lodging",        Icon: House,       color: "#A855F7", amount: String(linkedLodging  || 2000),            isAuto: linkedLodging > 0,   autoLabel: "from lodging"  },
    { key: "car",        label: "Car Rental",     Icon: Car,         color: "#FF8C00", amount: String(linkedCarRental || 180),            isAuto: linkedCarRental > 0, autoLabel: "from driving"  },
    { key: "food",       label: "Food & Dining",  Icon: ForkKnife,   color: "#FFD600", amount: "600",  isAuto: false },
    { key: "activities", label: "Activities",     Icon: Ticket,      color: "#00A8CC", amount: "400",  isAuto: false },
    { key: "shopping",   label: "Shopping",       Icon: ShoppingBag, color: "#FF2D8B", amount: "300",  isAuto: false },
    { key: "transit",    label: "Local Transit",  Icon: Bus,         color: "#00C96B", amount: "150",  isAuto: false },
    { key: "misc",       label: "Misc / Other",   Icon: Tag,         color: "#9CA3AF", amount: "200",  isAuto: false },
  ]);

  function updateAmount(key: string, value: string) {
    setItems((prev) => prev.map((it) => it.key === key ? { ...it, amount: value } : it));
  }

  const target      = Number(targetBudget) || 0;
  const autoTotal   = items.filter((it) =>  it.isAuto).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const manualTotal = items.filter((it) => !it.isAuto).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const grandTotal  = autoTotal + manualTotal;
  const remaining   = target - grandTotal;
  const autoPct     = target > 0 ? Math.min((autoTotal  / target) * 100, 100) : 0;
  const manualPct   = target > 0 ? Math.min((manualTotal / target) * 100, 100 - autoPct) : 0;
  const isOver      = remaining < 0;

  return (
    <>
      <style>{`
        .bb { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .bc { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .bb           { grid-template-columns: 1fr 1fr 1fr; }
          .bb-hero      { grid-column: 1 / 3; }
          .bb-stats     { grid-column: 3; grid-row: 1; }
          .bb-cats      { grid-column: 1 / 4; }
          .bc           { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
      <div className="bb">

        {/* ── Hero: target + progress bar ── */}
        <DarkCard className="bb-hero p-4 md:p-5">
          <CardLabel>Total Trip Budget</CardLabel>

          {/* Big number */}
          <div className="flex items-end gap-3 mb-4">
            <div className="font-semibold leading-none"
                 style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(38px, 5vw, 54px)", color: BUDGET_COLOR }}>
              {target > 0 ? `$${target.toLocaleString()}` : "—"}
            </div>
            {target > 0 && grandTotal > 0 && (
              <div className="text-[13px] font-black mb-1.5" style={{ color: isOver ? "#FF2D8B" : "#9CA3AF" }}>
                {isOver
                  ? `$${Math.abs(remaining).toLocaleString()} over budget`
                  : `$${remaining.toLocaleString()} remaining`}
              </div>
            )}
          </div>

          {/* Target input */}
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-white/30 pointer-events-none">$</span>
            <FieldInput
              type="number" min="0" placeholder="Set your total budget"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              className="pl-6"
            />
          </div>

          {/* Segmented bar */}
          {target > 0 && (
            <>
              <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="h-full transition-all duration-500 rounded-l-full"
                     style={{ width: `${autoPct}%`, backgroundColor: BUDGET_COLOR }} />
                <div className="h-full transition-all duration-500"
                     style={{ width: `${manualPct}%`, backgroundColor: "#00A8CC",
                              borderRadius: autoPct === 0 ? "9999px 0 0 9999px" : undefined }} />
              </div>
              <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                {[
                  { dot: BUDGET_COLOR, label: `Auto-linked  $${autoTotal.toLocaleString()}` },
                  { dot: "#00A8CC",    label: `Manual est.  $${manualTotal.toLocaleString()}` },
                  { dot: "#3a3a3a",    label: `Unallocated  $${Math.max(0, remaining).toLocaleString()}` },
                ].map(({ dot, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="text-[10px] font-black text-white/35">{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DarkCard>

        {/* ── Stats sidebar ── */}
        <DarkCard className="bb-stats p-4 md:p-5 flex flex-col justify-center gap-0">
          <CardLabel>Summary</CardLabel>
          {[
            { label: "Auto-linked",                             value: autoTotal,           color: BUDGET_COLOR },
            { label: "Manual est.",                             value: manualTotal,          color: "#00A8CC"    },
            { label: "Grand total",                             value: grandTotal,           color: "#fff"       },
            { label: isOver ? "Over budget" : "Remaining",     value: Math.abs(remaining),  color: isOver ? "#FF2D8B" : "#9CA3AF" },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <span className="text-[11px] font-black uppercase tracking-widest text-white/35">{label}</span>
              <span className="font-semibold" style={{ fontFamily: "var(--font-fredoka)", fontSize: "22px", color }}>
                ${value.toLocaleString()}
              </span>
            </div>
          ))}

          {/* % used mini-bar */}
          {target > 0 && grandTotal > 0 && (
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Budget used</span>
                <span className="text-[14px] font-black" style={{ color: isOver ? "#FF2D8B" : BUDGET_COLOR }}>
                  {Math.round((grandTotal / target) * 100)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a3a" }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{
                       width: `${Math.min((grandTotal / target) * 100, 100)}%`,
                       backgroundColor: isOver ? "#FF2D8B" : BUDGET_COLOR,
                     }} />
              </div>
            </div>
          )}
        </DarkCard>

        {/* ── Category grid ── */}
        <DarkCard className="bb-cats p-4 md:p-5">
          <CardLabel>By Category</CardLabel>
          <div className="bc">
            {items.map((item) => {
              const pct = grandTotal > 0 && Number(item.amount) > 0
                ? (Number(item.amount) / grandTotal) * 100
                : 0;
              return (
                <div key={item.key}
                  className="flex flex-col gap-2.5 rounded-[14px] p-3"
                  style={{ backgroundColor: "#252525", border: "1px solid #333333" }}>

                  {/* Icon + label row */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: item.color + "22" }}>
                      <item.Icon size={13} weight="fill" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-white/65 truncate leading-tight">{item.label}</div>
                      {item.isAuto && item.autoLabel && (
                        <div className="text-[9px] font-black uppercase tracking-wider leading-tight mt-0.5"
                             style={{ color: item.color }}>
                          ↑ {item.autoLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount input */}
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-white/25 pointer-events-none">$</span>
                    <input
                      type="number" min="0" placeholder="0"
                      value={item.amount}
                      onChange={(e) => updateAmount(item.key, e.target.value)}
                      className="w-full rounded-[8px] pl-5 pr-2 py-2 text-sm font-black text-white outline-none border transition-colors focus:border-[#00A8CC] text-right"
                      style={{ backgroundColor: "#1e1e1e", borderColor: item.isAuto ? item.color + "55" : "#3a3a3a" }}
                    />
                  </div>

                  {/* Share-of-total bar */}
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                         style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: item.color }} />
                  </div>

                  {/* % label */}
                  {pct > 0 && (
                    <div className="text-[9px] font-black text-right" style={{ color: item.color + "99", marginTop: "-6px" }}>
                      {pct.toFixed(0)}%
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </DarkCard>

      </div>
    </>
  );
}

// ─── DESTINATIONS section ────────────────────────────────────────────────────

function AddMustDoInputSmall({
  destId, color, onAdd,
}: {
  destId: string;
  color: string;
  onAdd: (destId: string, text: string) => void;
}) {
  const [text, setText] = useState("");
  function commit() {
    if (text.trim()) { onAdd(destId, text.trim()); setText(""); }
  }
  return (
    <div className="flex items-center gap-3 mt-3 pt-3"
         style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button type="button" onClick={commit}
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
        style={{ borderColor: `${color}70`, backgroundColor: "transparent" }}>
        <Plus size={9} weight="bold" style={{ color: `${color}90` }} />
      </button>
      <input
        type="text" value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        placeholder="Add item… press Enter"
        className="flex-1 bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-white/20 transition-colors placeholder-white/20 pb-0.5"
      />
    </div>
  );
}

interface DestinationsBentoProps {
  dest:             Destination;
  updateDest:       (id: string, field: keyof Destination, value: string) => void;
  toggleMustDo:     (destId: string, itemId: string) => void;
  updateMustDoText: (destId: string, itemId: string, text: string) => void;
  addMustDo:        (destId: string, text: string) => void;
  removeMustDo:     (destId: string, itemId: string) => void;
}

function DestinationsBento({
  dest, updateDest, toggleMustDo, updateMustDoText, addMustDo, removeMustDo,
}: DestinationsBentoProps) {
  const days      = calcNights(dest.arrivalDate, dest.departureDate);
  const doneCount = dest.mustDo.filter((m) => m.done).length;

  return (
    <>
      <style>{`
        .destb { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 768px) {
          .destb          { grid-template-columns: 1fr 1fr 1fr; }
          .destb-info     { grid-column: 1 / 3; }
          .destb-dates    { grid-column: 3; grid-row: 1; }
          .destb-mustdo   { grid-column: 1 / 4; }
          .destb-notes    { grid-column: 1 / 4; }
        }
      `}</style>
      <div className="destb">

        {/* ── Info ── */}
        <DarkCard className="destb-info p-4 md:p-5">
          <CardLabel>Destination</CardLabel>
          {/* Big name */}
          <div className="font-semibold leading-none mb-1 truncate"
               style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(24px, 3vw, 36px)", color: dest.color }}>
            {dest.name || "City / Place"}
          </div>
          <div className="text-[11px] font-bold text-white/30 mb-4">
            {dest.country || "Country"}
          </div>
          {/* Name + country fields */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <FieldInput placeholder="City / Place name" value={dest.name}
              onChange={(e) => updateDest(dest.id, "name", e.target.value)} />
            <FieldInput placeholder="Country" value={dest.country}
              onChange={(e) => updateDest(dest.id, "country", e.target.value)} />
          </div>
          {/* Type pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {DEST_TYPES.map(({ key, label }) => (
              <button key={key} type="button"
                onClick={() => updateDest(dest.id, "type", key)}
                className="rounded-full font-black border text-[11px] transition-all"
                style={{
                  padding: "4px 10px",
                  backgroundColor: dest.type === key ? dest.color : "#3a3a3a",
                  borderColor:     dest.type === key ? dest.color : "#484848",
                  color:           dest.type === key ? "#fff"     : "#9CA3AF",
                }}>
                {label}
              </button>
            ))}
          </div>
          {/* Color picker */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">Color</div>
            <div className="flex gap-2">
              {DEST_COLOR_OPTIONS.map((c) => (
                <button key={c} type="button"
                  onClick={() => updateDest(dest.id, "color", c)}
                  className="w-6 h-6 rounded-full transition-all flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    outline:    dest.color === c ? `2px solid ${c}` : "none",
                    outlineOffset: "2px",
                    opacity:   dest.color === c ? 1 : 0.4,
                    transform: dest.color === c ? "scale(1.2)" : "scale(1)",
                  }} />
              ))}
            </div>
          </div>
        </DarkCard>

        {/* ── Dates ── */}
        <DarkCard className="destb-dates p-4 md:p-5">
          <CardLabel>Dates</CardLabel>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-1.5">Arrival</div>
              <FieldInput type="date" value={dest.arrivalDate} className="text-white/70 text-xs"
                onChange={(e) => updateDest(dest.id, "arrivalDate", e.target.value)} />
            </div>
            {/* Days pill */}
            <div className="flex justify-center">
              <div className="rounded-full font-black text-[13px] px-4 py-1 text-center"
                   style={{
                     backgroundColor: days !== null ? `${dest.color}22` : "rgba(255,255,255,0.04)",
                     color:           days !== null ? dest.color         : "rgba(255,255,255,0.2)",
                     border: `1px solid ${days !== null ? dest.color + "55" : "rgba(255,255,255,0.08)"}`,
                     minWidth: "80px",
                   }}>
                {days !== null ? `${days} day${days !== 1 ? "s" : ""}` : "— days"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-1.5">Departure</div>
              <FieldInput type="date" value={dest.departureDate} className="text-white/70 text-xs"
                onChange={(e) => updateDest(dest.id, "departureDate", e.target.value)} />
            </div>
          </div>
        </DarkCard>

        {/* ── Must-Do list ── */}
        <DarkCard className="destb-mustdo p-4 md:p-5">
          <div className="flex items-center justify-between mb-1">
            <CardLabel className="mb-0">Must-Do</CardLabel>
            {dest.mustDo.length > 0 && (
              <span className="text-[11px] font-black" style={{ color: dest.color }}>
                {doneCount} / {dest.mustDo.length} done
              </span>
            )}
          </div>
          {dest.mustDo.length > 0 && (
            <div className="h-1.5 rounded-full overflow-hidden mt-2 mb-4" style={{ backgroundColor: "#3a3a3a" }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width: `${(doneCount / dest.mustDo.length) * 100}%`, backgroundColor: dest.color }} />
            </div>
          )}
          {dest.mustDo.length === 0 && (
            <p className="py-3 text-center text-[12px] font-bold text-white/20">
              No items yet — add your first must-do below
            </p>
          )}
          <div className="flex flex-col gap-2.5">
            {dest.mustDo.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                {/* Checkbox */}
                <button type="button"
                  onClick={() => toggleMustDo(dest.id, item.id)}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
                  style={{
                    backgroundColor: item.done ? dest.color : "transparent",
                    borderColor:     item.done ? dest.color : "rgba(255,255,255,0.2)",
                  }}>
                  {item.done && <Check size={10} weight="bold" color="#fff" />}
                </button>
                {/* Text */}
                <input type="text" value={item.text}
                  onChange={(e) => updateMustDoText(dest.id, item.id, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold outline-none border-b border-transparent focus:border-white/20 transition-colors placeholder-white/20 pb-0.5"
                  style={{
                    color:          item.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.9)",
                    textDecoration: item.done ? "line-through" : "none",
                  }}
                  placeholder="What to do…" />
                {/* Delete */}
                <button type="button"
                  onClick={() => removeMustDo(dest.id, item.id)}
                  className="text-white/15 hover:text-white/60 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                  <X size={12} weight="bold" />
                </button>
              </div>
            ))}
          </div>
          <AddMustDoInputSmall destId={dest.id} color={dest.color} onAdd={addMustDo} />
        </DarkCard>

        {/* ── Notes ── */}
        <DarkCard className="destb-notes p-4 md:p-5 flex flex-col">
          <CardLabel>Notes</CardLabel>
          <textarea
            placeholder="Tips, research needed, best time to visit…"
            value={dest.notes}
            onChange={(e) => updateDest(dest.id, "notes", e.target.value)}
            className="flex-1 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white outline-none border resize-none transition-colors focus:border-[#00A8CC] placeholder-white/20"
            style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "72px" }}
          />
        </DarkCard>

      </div>
    </>
  );
}

// ─── placeholder section ──────────────────────────────────────────────────────

function PlaceholderSection({ section }: { section: SectionDef }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
           style={{ backgroundColor: section.color + "22", border: `1.5px dashed ${section.color}55` }}>
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
  const [activeSection,    setActiveSection]    = useState("group");
  const [activeTravelMode, setActiveTravelMode] = useState(transportModes[0] ?? "");

  // Flight state
  const [flightLegs,     setFlightLegs]     = useState<FlightLeg[]>(INITIAL_FLIGHT_LEGS);
  const [activeFlightLeg, setActiveFlightLeg] = useState(0);

  // Driving state
  const [drivingLegs,     setDrivingLegs]     = useState<DrivingLeg[]>(INITIAL_DRIVING_LEGS);
  const [activeDrivingLeg, setActiveDrivingLeg] = useState(0);

  // Lodging state
  const [lodgingStays,     setLodgingStays]     = useState<LodgingStay[]>(INITIAL_LODGING_STAYS);
  const [activeLodgingStay, setActiveLodgingStay] = useState(0);

  // Destinations state
  const [destinations,         setDestinations]         = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [activeDestinationIdx, setActiveDestinationIdx] = useState(0);

  // Progress metrics
  const touchedCount = ALL_SECTIONS.filter((s) => MOCK_STATUSES[s.key] !== "empty").length;
  const progressPct  = Math.round(
    (ALL_SECTIONS.reduce((acc, s) => {
      const st = MOCK_STATUSES[s.key] ?? "empty";
      return acc + (st === "done" ? 1 : st === "partial" ? 0.5 : 0);
    }, 0) / ALL_SECTIONS.length) * 100
  );

  // ── Flight handlers ────────────────────────────────────────────────────────
  function updateFlightLeg(id: string, field: keyof FlightLeg, value: string) {
    setFlightLegs((legs) => legs.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }
  function addFlightLeg() {
    const newLeg: FlightLeg = {
      id: Date.now().toString(), fromCode: "", fromCity: "", toCode: "", toCity: "",
      flightNumber: "", departDate: "", departTime: "", arriveDate: "", arriveTime: "",
      seatClass: "economy", confirmCode: "", notes: "",
    };
    setFlightLegs((legs) => [...legs, newLeg]);
    setActiveFlightLeg(flightLegs.length);
  }
  function removeFlightLeg(id: string) {
    setFlightLegs((legs) => legs.filter((l) => l.id !== id));
  }

  // ── Driving handlers ───────────────────────────────────────────────────────
  function updateDrivingLeg(id: string, field: keyof DrivingLeg, value: string | boolean) {
    setDrivingLegs((legs) => legs.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }
  function addDrivingLeg() {
    const newLeg: DrivingLeg = {
      id: Date.now().toString(), fromCity: "", toCity: "",
      departDate: "", departTime: "", estimatedHours: "",
      stops: [], rentalCar: false, carDetails: "", rentalCost: "", rentalDays: "", notes: "",
    };
    setDrivingLegs((legs) => [...legs, newLeg]);
    setActiveDrivingLeg(drivingLegs.length);
  }
  function removeDrivingLeg(id: string) {
    setDrivingLegs((legs) => legs.filter((l) => l.id !== id));
  }
  function addStop(legId: string) {
    setDrivingLegs((legs) => legs.map((l) =>
      l.id === legId ? { ...l, stops: [...l.stops, { id: Date.now().toString(), city: "" }] } : l
    ));
  }
  function removeStop(legId: string, stopId: string) {
    setDrivingLegs((legs) => legs.map((l) =>
      l.id === legId ? { ...l, stops: l.stops.filter((s) => s.id !== stopId) } : l
    ));
  }
  function updateStop(legId: string, stopId: string, city: string) {
    setDrivingLegs((legs) => legs.map((l) =>
      l.id === legId ? { ...l, stops: l.stops.map((s) => s.id === stopId ? { ...s, city } : s) } : l
    ));
  }

  // ── Lodging handlers ──────────────────────────────────────────────────────
  function updateLodgingStay(id: string, field: keyof LodgingStay, value: string) {
    setLodgingStays((stays) => stays.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }
  function addLodgingStay() {
    const newStay: LodgingStay = {
      id: Date.now().toString(), name: "", type: "hotel",
      address: "", city: "", checkInDate: "", checkInTime: "15:00",
      checkOutDate: "", checkOutTime: "11:00", costPerNight: "",
      confirmCode: "", roomType: "", notes: "",
    };
    setLodgingStays((stays) => [...stays, newStay]);
    setActiveLodgingStay(lodgingStays.length);
  }
  function removeLodgingStay(id: string) {
    setLodgingStays((stays) => stays.filter((s) => s.id !== id));
  }

  // ── Destination handlers ──────────────────────────────────────────────────
  function updateDestination(id: string, field: keyof Destination, value: string) {
    setDestinations((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));
  }
  function addDestination() {
    const nextColor = DEST_COLOR_OPTIONS[destinations.length % DEST_COLOR_OPTIONS.length];
    const newDest: Destination = {
      id: Date.now().toString(), name: "", country: "", type: "city",
      color: nextColor, arrivalDate: "", departureDate: "", mustDo: [], notes: "",
    };
    setDestinations((prev) => [...prev, newDest]);
    setActiveDestinationIdx(destinations.length);
  }
  function removeDestination(id: string) {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    setActiveDestinationIdx((i) => Math.max(0, i - 1));
  }
  function toggleMustDo(destId: string, itemId: string) {
    setDestinations((prev) => prev.map((d) =>
      d.id === destId
        ? { ...d, mustDo: d.mustDo.map((m) => m.id === itemId ? { ...m, done: !m.done } : m) }
        : d
    ));
  }
  function updateMustDoText(destId: string, itemId: string, text: string) {
    setDestinations((prev) => prev.map((d) =>
      d.id === destId
        ? { ...d, mustDo: d.mustDo.map((m) => m.id === itemId ? { ...m, text } : m) }
        : d
    ));
  }
  function addMustDo(destId: string, text: string) {
    setDestinations((prev) => prev.map((d) =>
      d.id === destId
        ? { ...d, mustDo: [...d.mustDo, { id: Date.now().toString(), text, done: false }] }
        : d
    ));
  }
  function removeMustDo(destId: string, itemId: string) {
    setDestinations((prev) => prev.map((d) =>
      d.id === destId
        ? { ...d, mustDo: d.mustDo.filter((m) => m.id !== itemId) }
        : d
    ));
  }

  // ── Linked cost totals (passed to Budget section) ─────────────────────────
  const linkedLodging = lodgingStays.reduce((sum, s) => {
    const n = calcNights(s.checkInDate, s.checkOutDate);
    return sum + (n !== null && s.costPerNight ? n * Number(s.costPerNight) : 0);
  }, 0);
  const linkedCarRental = drivingLegs.reduce((sum, l) => {
    return sum + (l.rentalCar && l.rentalCost ? Number(l.rentalCost) : 0);
  }, 0);

  const currentSection = ALL_SECTIONS.find((s) => s.key === activeSection) ?? ALL_SECTIONS[0];

  // ── Active leg info for sub-nav ────────────────────────────────────────────
  const travelLegs      = activeTravelMode === "fly"   ? flightLegs  : drivingLegs;
  const activeLegIndex  = activeTravelMode === "fly"   ? activeFlightLeg : activeDrivingLeg;
  const setActiveLegIdx = activeTravelMode === "fly"   ? setActiveFlightLeg : setActiveDrivingLeg;
  const addLeg          = activeTravelMode === "fly"   ? addFlightLeg : addDrivingLeg;
  const removeLeg       = activeTravelMode === "fly"
    ? removeFlightLeg
    : removeDrivingLeg;
  const modeColor       = TRANSPORT_META[activeTravelMode]?.color ?? "#00A8CC";

  // ── Sub-nav (travel + lodging) ─────────────────────────────────────────────
  function renderSubNav(): React.ReactNode {
    // ── Destination stop tabs ──
    if (activeSection === "destinations") {
      return (
        <div className="mt-4 pt-4 flex items-center gap-2 flex-wrap"
             style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {destinations.map((d, i) => (
            <button key={d.id} type="button"
              onClick={() => setActiveDestinationIdx(i)}
              className="flex items-center gap-1.5 rounded-full font-black border transition-all text-sm"
              style={{
                padding: "6px 14px",
                backgroundColor: activeDestinationIdx === i ? d.color : "rgba(255,255,255,0.05)",
                borderColor:     activeDestinationIdx === i ? d.color : "rgba(255,255,255,0.10)",
                color:           activeDestinationIdx === i ? "#fff"  : "#9CA3AF",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
              {d.name || `Stop ${i + 1}`}
              {destinations.length > 1 && (
                <span role="button"
                  onClick={(e) => { e.stopPropagation(); removeDestination(d.id); }}
                  className="ml-1 opacity-60 hover:opacity-100 cursor-pointer">
                  <X size={11} weight="bold" />
                </span>
              )}
            </button>
          ))}
          <button type="button" onClick={addDestination}
            className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
            style={{
              padding: "6px 14px",
              borderStyle: "dashed",
              borderColor: "#FFD60055",
              color: "#FFD600",
              backgroundColor: "transparent",
            }}>
            <Plus size={11} weight="bold" />
            Add stop
          </button>
        </div>
      );
    }

    // ── Lodging stay tabs ──
    if (activeSection === "lodging") {
      return (
        <div className="mt-4 pt-4 flex items-center gap-2 flex-wrap"
             style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {lodgingStays.map((s, i) => (
            <button key={s.id} type="button"
              onClick={() => setActiveLodgingStay(i)}
              className="flex items-center gap-1.5 rounded-full font-black border transition-all text-sm"
              style={{
                padding: "6px 14px",
                backgroundColor: activeLodgingStay === i ? LODGING_COLOR : "rgba(255,255,255,0.05)",
                borderColor:     activeLodgingStay === i ? LODGING_COLOR : "rgba(255,255,255,0.10)",
                color:           activeLodgingStay === i ? "#fff"        : "#9CA3AF",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
              {s.name ? s.name.split(" ").slice(0, 2).join(" ") : `Stay ${i + 1}`}
              {lodgingStays.length > 1 && (
                <span role="button"
                  onClick={(e) => { e.stopPropagation(); removeLodgingStay(s.id); setActiveLodgingStay(Math.max(0, i - 1)); }}
                  className="ml-1 opacity-60 hover:opacity-100 cursor-pointer">
                  <X size={11} weight="bold" />
                </span>
              )}
            </button>
          ))}
          <button type="button" onClick={addLodgingStay}
            className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
            style={{
              padding: "6px 14px",
              borderStyle: "dashed",
              borderColor: `${LODGING_COLOR}55`,
              color: LODGING_COLOR,
              backgroundColor: "transparent",
            }}>
            <Plus size={11} weight="bold" />
            Add stay
          </button>
        </div>
      );
    }

    if (activeSection !== "travel") return null;

    if (transportModes.length === 0) return (
      <div className="flex items-center gap-2 mt-4 pt-4 text-white/30 text-sm font-semibold"
           style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Warning size={16} weight="fill" />
        No transport modes selected — go to Setup to add them.
      </div>
    );

    return (
      <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Transport mode tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {transportModes.map((mode) => {
            const meta = TRANSPORT_META[mode];
            if (!meta) return null;
            const isMode = activeTravelMode === mode;
            return (
              <button key={mode} type="button"
                onClick={() => setActiveTravelMode(mode)}
                className="flex items-center gap-2 rounded-full font-black border text-sm transition-all"
                style={{
                  padding: "7px 16px",
                  backgroundColor: isMode ? meta.color : "rgba(255,255,255,0.07)",
                  borderColor:     isMode ? meta.color : "rgba(255,255,255,0.12)",
                  color:           isMode ? "#fff"    : "#9CA3AF",
                }}>
                <meta.Icon size={14} weight="fill" />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Leg tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {travelLegs.map((l, i) => (
            <button key={l.id} type="button"
              onClick={() => setActiveLegIdx(i)}
              className="flex items-center gap-1.5 rounded-full font-black border transition-all text-sm"
              style={{
                padding: "6px 14px",
                backgroundColor: activeLegIndex === i ? modeColor : "rgba(255,255,255,0.05)",
                borderColor:     activeLegIndex === i ? modeColor : "rgba(255,255,255,0.10)",
                color:           activeLegIndex === i ? "#fff"   : "#9CA3AF",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
              Leg {i + 1}
              {travelLegs.length > 1 && (
                <span role="button"
                  onClick={(e) => { e.stopPropagation(); removeLeg(l.id); setActiveLegIdx(Math.max(0, i - 1)); }}
                  className="ml-1 opacity-60 hover:opacity-100 cursor-pointer">
                  <X size={11} weight="bold" />
                </span>
              )}
            </button>
          ))}
          <button type="button" onClick={addLeg}
            className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
            style={{
              padding: "6px 14px",
              borderStyle: "dashed",
              borderColor: `${modeColor}55`,
              color: modeColor,
              backgroundColor: "transparent",
            }}>
            <Plus size={11} weight="bold" />
            Add leg
          </button>
        </div>
      </div>
    );
  }

  // ── Section content ────────────────────────────────────────────────────────
  function renderContent(): React.ReactNode {
    if (!currentSection) return null;
    switch (currentSection.key) {
      case "travel": {
        if (transportModes.length === 0) return null;
        if (activeTravelMode === "fly") {
          const leg = flightLegs[activeFlightLeg] ?? flightLegs[0];
          return leg ? <FlightsBento leg={leg} updateLeg={updateFlightLeg} /> : null;
        }
        if (activeTravelMode === "drive") {
          const leg = drivingLegs[activeDrivingLeg] ?? drivingLegs[0];
          return leg
            ? <DrivingBento leg={leg} updateLeg={updateDrivingLeg}
                addStop={addStop} removeStop={removeStop} updateStop={updateStop} />
            : null;
        }
        return <PlaceholderSection section={{ ...currentSection, label: TRANSPORT_META[activeTravelMode]?.label ?? "Travel" }} />;
      }
      case "group":
        return <GroupSection />;
      case "budget":
        return <BudgetSection linkedLodging={linkedLodging} linkedCarRental={linkedCarRental} />;
      case "destinations": {
        const dest = destinations[activeDestinationIdx] ?? destinations[0];
        return dest ? (
          <DestinationsBento
            dest={dest}
            updateDest={updateDestination}
            toggleMustDo={toggleMustDo}
            updateMustDoText={updateMustDoText}
            addMustDo={addMustDo}
            removeMustDo={removeMustDo}
          />
        ) : null;
      }
      case "lodging": {
        const stay = lodgingStays[activeLodgingStay] ?? lodgingStays[0];
        return stay
          ? <LodgingBento stay={stay} updateStay={updateLodgingStay} />
          : null;
      }
      default:
        return <PlaceholderSection section={currentSection} />;
    }
  }

  return (
    <div className="flex flex-col">

      {/* ── DARK PAGE HEADER ─────────────────────────────────────── */}
      <header className="border-b flex-shrink-0 px-4 py-4 md:px-7 md:py-5"
              style={{ backgroundColor: "#282828", borderColor: "#333333" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
                style={{ fontFamily: "var(--font-fredoka)" }}>
              Preplanning
            </h1>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Fill in the details. Everything here is optional.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-0.5">Ball fill</div>
            <div className="font-semibold leading-none"
                 style={{ fontFamily: "var(--font-fredoka)", fontSize: "26px", color: "#00A8CC" }}>
              {progressPct}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a3a" }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #FF2D8B, #00A8CC)" }} />
          </div>
          <span className="text-[11px] font-black whitespace-nowrap" style={{ color: "#00A8CC" }}>
            {touchedCount} of {ALL_SECTIONS.length} sections touched
          </span>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div className="flex">

        {/* Desktop panel nav */}
        <nav className="hidden md:flex flex-col w-[220px] border-r flex-shrink-0 sticky overflow-y-auto"
             style={{ backgroundColor: "#252525", borderColor: "#333333", top: "56px", height: "calc(100vh - 56px)" }}>
          <div className="p-3 flex flex-col gap-0.5">
            {ALL_SECTIONS.map((s) => {
              const status   = MOCK_STATUSES[s.key] ?? "empty";
              const isActive = activeSection === s.key;
              return (
                <button key={s.key} type="button" onClick={() => setActiveSection(s.key)}
                  className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 transition-all text-left"
                  style={{
                    backgroundColor: isActive ? "rgba(0,168,204,0.1)" : "transparent",
                    border: isActive ? "1px solid rgba(0,168,204,0.25)" : "1px solid transparent",
                  }}>
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                       style={{ backgroundColor: iconBgColor(status, isActive) }}>
                    <s.Icon size={15} weight="fill" color={isActive || status !== "empty" ? "#fff" : "#9CA3AF"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-black leading-none truncate"
                         style={{ color: isActive ? "#fff" : status !== "empty" ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}>
                      {s.label}
                    </div>
                    <div className="text-[10px] font-bold mt-0.5 truncate"
                         style={{ color: isActive ? "#00A8CC" : statusTextColor(status) }}>
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

          {/* Mobile tab bar */}
          <div className="md:hidden flex border-b flex-shrink-0 sticky z-10 overflow-x-auto gap-1.5 px-3 py-2.5"
               style={{
                 top: "56px",
                 backgroundColor: "#252525",
                 borderColor: "#333333",
                 WebkitOverflowScrolling: "touch",
                 scrollbarWidth: "none",
               } as React.CSSProperties}>
            {ALL_SECTIONS.map((s) => {
              const status   = MOCK_STATUSES[s.key] ?? "empty";
              const isActive = activeSection === s.key;
              return (
                <button key={s.key} type="button" onClick={() => setActiveSection(s.key)}
                  className="flex flex-col items-center gap-1 rounded-xl flex-shrink-0 transition-all"
                  style={{
                    minWidth: "58px", padding: "8px 8px",
                    backgroundColor: isActive ? "rgba(0,168,204,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(0,168,204,0.3)" : "1px solid transparent",
                  }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: iconBgColor(status, isActive) }}>
                    <s.Icon size={13} weight="fill" color={isActive || status !== "empty" ? "#fff" : "#9CA3AF"} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wide text-center leading-tight"
                        style={{ color: isActive ? "#00A8CC" : "#9CA3AF" }}>
                    {s.label.replace(" ", "\n")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section content */}
          <div className="p-4 md:p-6 flex flex-col gap-4">

            {/* Dark section intro bar */}
            {currentSection && (
              <div className="rounded-[20px] border px-5 py-4 flex-shrink-0"
                   style={{ backgroundColor: "#282828", borderColor: "#333333" }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: currentSection.color }}>
                    <currentSection.Icon size={20} weight="fill" color="#fff" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white leading-none"
                         style={{ fontFamily: "var(--font-fredoka)" }}>
                      {currentSection.label}
                    </div>
                    <div className="text-[11px] font-bold mt-0.5"
                         style={{ color: statusTextColor(MOCK_STATUSES[currentSection.key] ?? "empty") }}>
                      {MOCK_STATUS_TEXT[currentSection.key]}
                    </div>
                  </div>
                </div>
                {renderSubNav()}
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
