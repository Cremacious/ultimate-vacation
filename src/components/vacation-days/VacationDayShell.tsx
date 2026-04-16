"use client";

import { useState } from "react";
import {
  Mountains,
  ForkKnife,
  Airplane,
  House,
  ShoppingBag,
  Ticket,
  Sun,
  MapPin,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Receipt,
  ArrowLeft,
  Check,
  X,
  Star,
  Trophy,
  PaperPlaneTilt,
  CalendarBlank,
  UsersThree,
  Confetti,
  Smiley,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "lodging"
  | "shopping"
  | "entertainment"
  | "free";

interface DayEvent {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  location: string;
  category: EventCategory;
  confirmed: boolean;
  cost?: number;
}

interface MeetupMessage {
  id: string;
  author: string;
  initials: string;
  color: string;
  message: string;
  minsAgo: number;
}

interface QuickVote {
  question: string;
  yes: number;
  no: number;
  total: number;
  myVote: "yes" | "no" | null;
}

interface TodayExpense {
  id: string;
  description: string;
  amountYen: number;
  amountUsd: number;
  paidBy: string;
  split: boolean;
}

interface ScavengerItem {
  id: string;
  text: string;
  points: number;
  done: boolean;
}

interface VacationDay {
  date: string;
  destination: string;
  destColor: string;
  tripDayNum: number;
  events: DayEvent[];
  meetupMessages: MeetupMessage[];
  vote: QuickVote | null;
  expenses: TodayExpense[];
  briefingNote: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  EventCategory,
  { label: string; color: string; Icon: PhosphorIcon }
> = {
  sightseeing: { label: "Sightseeing", color: "#FF2D8B", Icon: Mountains },
  food: { label: "Food & Drink", color: "#FFD600", Icon: ForkKnife },
  transport: { label: "Transport", color: "#00A8CC", Icon: Airplane },
  lodging: { label: "Lodging", color: "#A855F7", Icon: House },
  shopping: { label: "Shopping", color: "#FF8C00", Icon: ShoppingBag },
  entertainment: { label: "Entertainment", color: "#00C96B", Icon: Ticket },
  free: { label: "Free Time", color: "#9CA3AF", Icon: Sun },
};

const DEST_RANGES = [
  { name: "Tokyo", full: "Tokyo, Japan", color: "#FF2D8B", from: "2025-04-01", to: "2025-04-07" },
  { name: "Kyoto", full: "Kyoto, Japan", color: "#FFD600", from: "2025-04-08", to: "2025-04-11" },
  { name: "Osaka", full: "Osaka, Japan", color: "#00C96B", from: "2025-04-12", to: "2025-04-15" },
];

function getDest(date: string) {
  return (
    DEST_RANGES.find((d) => date >= d.from && date <= d.to) ?? {
      name: "Unknown",
      full: "Unknown",
      color: "#9CA3AF",
    }
  );
}

const TRAVEL_DATES = new Set(["2025-04-01", "2025-04-08", "2025-04-15"]);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SCAVENGER_ITEMS: ScavengerItem[] = [
  { id: "s1", text: "Eat something you can't identify", points: 5, done: true },
  { id: "s2", text: "Buy something from a 100-yen shop", points: 3, done: true },
  { id: "s3", text: "Witness a vending machine moment", points: 2, done: true },
  { id: "s4", text: "See a shrine or temple", points: 2, done: true },
  { id: "s5", text: "Photo with someone in traditional clothing", points: 5, done: false },
  { id: "s6", text: "Navigate the subway with zero English", points: 10, done: false },
  { id: "s7", text: "Try karaoke", points: 8, done: false },
  { id: "s8", text: "Find a cat café", points: 5, done: false },
  { id: "s9", text: "Have a full combini breakfast", points: 3, done: false },
  { id: "s10", text: "Make a local friend", points: 10, done: false },
];

const MOCK_DAYS: VacationDay[] = [
  // Tokyo days
  {
    date: "2025-04-02",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 2,
    events: [
      { id: "e1", time: "10:00", title: "Shinjuku Gyoen Garden", location: "Shinjuku", category: "sightseeing", confirmed: true },
      { id: "e2", time: "13:00", title: "Ramen at Ichiran", location: "Shinjuku", category: "food", confirmed: true, cost: 1200 },
      { id: "e3", time: "15:30", title: "Kabukicho neon walk", location: "Shinjuku", category: "sightseeing", confirmed: false },
      { id: "e4", time: "19:00", title: "Izakaya dinner", location: "Shinjuku", category: "food", confirmed: true, cost: 3500 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Cherry blossom season. Gyoen is peak pink right now.",
  },
  {
    date: "2025-04-03",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 3,
    events: [
      { id: "e1", time: "08:30", title: "Senso-ji Temple", location: "Asakusa", category: "sightseeing", confirmed: true },
      { id: "e2", time: "11:00", title: "Ueno Park stroll", location: "Ueno", category: "free", confirmed: true },
      { id: "e3", time: "13:30", title: "Sushi lunch at Tsukiji Outer Market", location: "Tsukiji", category: "food", confirmed: true, cost: 2800 },
      { id: "e4", time: "19:00", title: "Yakitori dinner", location: "Asakusa", category: "food", confirmed: true, cost: 4200 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Senso-ji is packed before 9 AM — get there early.",
  },
  {
    date: "2025-04-04",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 4,
    events: [
      { id: "e1", time: "09:00", title: "Tsukiji Outer Market breakfast", location: "Tsukiji", category: "food", confirmed: true, cost: 1500 },
      { id: "e2", time: "14:00", title: "teamLab Planets", location: "Toyosu", category: "entertainment", confirmed: true, cost: 3200 },
      { id: "e3", time: "18:00", title: "Odaiba waterfront", location: "Odaiba", category: "free", confirmed: false },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "teamLab tickets are timed entry — don't be late.",
  },
  // APR 5 — FULL DETAIL DAY
  {
    date: "2025-04-05",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 5,
    events: [
      { id: "e1", time: "10:00", endTime: "12:00", title: "Harajuku shopping", location: "Cat Street & Takeshita Dori", category: "shopping", confirmed: true, cost: 8500 },
      { id: "e2", time: "12:30", endTime: "13:30", title: "Ramen at Afuri", location: "Omotesando", category: "food", confirmed: true, cost: 1400 },
      { id: "e3", time: "14:00", endTime: "15:30", title: "Meiji Shrine", location: "Harajuku", category: "sightseeing", confirmed: true },
      { id: "e4", time: "16:30", endTime: "18:00", title: "Shibuya Crossing", location: "Shibuya", category: "sightseeing", confirmed: true },
      { id: "e5", time: "19:00", title: "Sushi dinner at Sushi no Midori", location: "Shibuya", category: "food", confirmed: true, cost: 4200 },
    ],
    meetupMessages: [
      { id: "m1", author: "Emma", initials: "EM", color: "#00C96B", message: "At Shibuya crossing now! Where is everyone? 🚦", minsAgo: 2 },
      { id: "m2", author: "Sarah", initials: "SA", color: "#FF2D8B", message: "Near the Meiji Shrine torii gate, come find me", minsAgo: 11 },
      { id: "m3", author: "Tom", initials: "TM", color: "#00A8CC", message: "Still in Harajuku finishing takoyaki 🐙 coming soon", minsAgo: 18 },
    ],
    vote: {
      question: "Shibuya scramble at sunset or wait for the night lights?",
      yes: 2,
      no: 1,
      total: 4,
      myVote: null,
    },
    expenses: [
      { id: "x1", description: "Ramen at Afuri", amountYen: 1400, amountUsd: 9, paidBy: "Sarah", split: true },
      { id: "x2", description: "Subway IC card top-up", amountYen: 1000, amountUsd: 7, paidBy: "You", split: false },
      { id: "x3", description: "Meiji Shrine donation", amountYen: 1000, amountUsd: 7, paidBy: "Tom", split: false },
    ],
    briefingNote: "Dinner moved to 7 PM. Tom is always late but we love him.",
  },
  {
    date: "2025-04-06",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 6,
    events: [
      { id: "e1", time: "10:00", title: "Akihabara electric town", location: "Akihabara", category: "shopping", confirmed: true },
      { id: "e2", time: "14:00", title: "Tokyo Tower observation deck", location: "Minato", category: "sightseeing", confirmed: true, cost: 1200 },
      { id: "e3", time: "19:00", title: "Tonkatsu dinner", location: "Shinjuku", category: "food", confirmed: true, cost: 2200 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Last full day in Tokyo. Make it count.",
  },
  {
    date: "2025-04-07",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 7,
    events: [
      { id: "e1", time: "09:00", title: "Nikko day trip", location: "Nikko", category: "sightseeing", confirmed: true },
      { id: "e2", time: "13:00", title: "Lunch at Nikko Kanaya Hotel", location: "Nikko", category: "food", confirmed: false, cost: 3500 },
      { id: "e3", time: "18:00", title: "Return to Tokyo", location: "JR Nikko Line", category: "transport", confirmed: true },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Pack light today — it's a day trip. Big bags stay at the hotel.",
  },
  // Kyoto days
  {
    date: "2025-04-09",
    destination: "Kyoto",
    destColor: "#FFD600",
    tripDayNum: 9,
    events: [
      { id: "e1", time: "08:00", title: "Fushimi Inari Shrine", location: "Fushimi", category: "sightseeing", confirmed: true },
      { id: "e2", time: "12:00", title: "Kaiseki lunch", location: "Gion", category: "food", confirmed: true, cost: 5500 },
      { id: "e3", time: "15:00", title: "Gion evening walk", location: "Gion", category: "sightseeing", confirmed: true },
      { id: "e4", time: "19:30", title: "Tofu restaurant dinner", location: "Higashiyama", category: "food", confirmed: true, cost: 4000 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Fushimi Inari before 8 AM is almost crowd-free. This is the move.",
  },
  {
    date: "2025-04-10",
    destination: "Kyoto",
    destColor: "#FFD600",
    tripDayNum: 10,
    events: [
      { id: "e1", time: "09:30", title: "Arashiyama Bamboo Grove", location: "Arashiyama", category: "sightseeing", confirmed: true },
      { id: "e2", time: "11:30", title: "Tenryu-ji Garden", location: "Arashiyama", category: "sightseeing", confirmed: true, cost: 1100 },
      { id: "e3", time: "14:00", title: "Kinkaku-ji Golden Pavilion", location: "Kita-ku", category: "sightseeing", confirmed: true, cost: 500 },
      { id: "e4", time: "19:00", title: "Nishiki Market evening snacks", location: "Downtown Kyoto", category: "food", confirmed: true },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "The golden pavilion looks impossible in person. No filter needed.",
  },
  {
    date: "2025-04-11",
    destination: "Kyoto",
    destColor: "#FFD600",
    tripDayNum: 11,
    events: [
      { id: "e1", time: "09:00", title: "Nijo Castle", location: "Nijo", category: "sightseeing", confirmed: true, cost: 1300 },
      { id: "e2", time: "13:00", title: "Ramen lunch", location: "Downtown Kyoto", category: "food", confirmed: true, cost: 1200 },
      { id: "e3", time: "15:00", title: "Philosopher's Path", location: "Higashiyama", category: "free", confirmed: true },
      { id: "e4", time: "19:00", title: "Farewell Kyoto dinner", location: "Gion", category: "food", confirmed: true, cost: 6000 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Last day in Kyoto. The Philosopher's Path hits different in cherry blossom season.",
  },
  // Osaka days
  {
    date: "2025-04-12",
    destination: "Osaka",
    destColor: "#00C96B",
    tripDayNum: 12,
    events: [
      { id: "e1", time: "11:00", title: "Check in to hotel", location: "Namba", category: "lodging", confirmed: true },
      { id: "e2", time: "14:00", title: "Dotonbori street food crawl", location: "Dotonbori", category: "food", confirmed: true, cost: 2500 },
      { id: "e3", time: "17:00", title: "Kuromon Ichiba Market", location: "Nipponbashi", category: "food", confirmed: true },
      { id: "e4", time: "20:00", title: "Takoyaki at Juhachiban", location: "Dotonbori", category: "food", confirmed: true, cost: 800 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Osaka is built different. It's all about the food from here on.",
  },
  {
    date: "2025-04-13",
    destination: "Osaka",
    destColor: "#00C96B",
    tripDayNum: 13,
    events: [
      { id: "e1", time: "09:30", title: "Osaka Castle", location: "Chuo-ku", category: "sightseeing", confirmed: true, cost: 600 },
      { id: "e2", time: "13:00", title: "Okonomiyaki lunch", location: "Fukushima", category: "food", confirmed: true, cost: 1200 },
      { id: "e3", time: "15:30", title: "Shinsekai retro district", location: "Naniwa", category: "sightseeing", confirmed: true },
      { id: "e4", time: "19:00", title: "Wagyu dinner splurge", location: "Namba", category: "food", confirmed: true, cost: 9800 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "The castle park is also excellent for picnics if anyone wants a detour.",
  },
  {
    date: "2025-04-14",
    destination: "Osaka",
    destColor: "#00C96B",
    tripDayNum: 14,
    events: [
      { id: "e1", time: "10:00", title: "Namba shopping", location: "Namba", category: "shopping", confirmed: true },
      { id: "e2", time: "13:00", title: "Lunch at the conveyor belt sushi place", location: "Nipponbashi", category: "food", confirmed: true, cost: 2100 },
      { id: "e3", time: "15:00", title: "Free time / souvenir run", location: "Dotonbori", category: "free", confirmed: false },
      { id: "e4", time: "19:00", title: "Final trip dinner", location: "Namba", category: "food", confirmed: true, cost: 7500 },
    ],
    meetupMessages: [],
    vote: null,
    expenses: [],
    briefingNote: "Last night. Someone's going to cry. It won't be Tom (it will be Tom).",
  },
];

// Day number within destination (e.g. "Tokyo Day 3")
function destDayLabel(day: VacationDay): string {
  const dest = DEST_RANGES.find((d) => d.name === day.destination);
  if (!dest) return `Day ${day.tripDayNum}`;
  const daysInDest = MOCK_DAYS.filter((d) => d.destination === day.destination);
  const idx = daysInDest.findIndex((d) => d.date === day.date);
  return `${day.destination} · Day ${idx + 1}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    long: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }),
    dayNum: d.getUTCDate(),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
      {children}
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

const SELECTED_DATE = "2025-04-05";

export default function VacationDayShell() {
  const [selectedDate, setSelectedDate] = useState(SELECTED_DATE);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [scavengerItems, setScavengerItems] = useState(SCAVENGER_ITEMS);
  const [scavengerOpen, setScavengerOpen] = useState(false);
  const [days, setDays] = useState(MOCK_DAYS);
  const [meetupInput, setMeetupInput] = useState("");
  const [showMeetupInput, setShowMeetupInput] = useState(false);
  const [expenseForm, setExpenseForm] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("You");

  const day = days.find((d) => d.date === selectedDate)!;
  const { weekday, long: longDate, dayNum, month } = formatDate(selectedDate);

  const handleVote = (v: "yes" | "no") => {
    setDays((prev) =>
      prev.map((d) =>
        d.date === selectedDate && d.vote
          ? {
              ...d,
              vote: {
                ...d.vote,
                yes: v === "yes" ? d.vote.yes + 1 : d.vote.yes,
                no: v === "no" ? d.vote.no + 1 : d.vote.no,
                myVote: v,
              },
            }
          : d
      )
    );
  };

  const handlePostMeetup = () => {
    if (!meetupInput.trim()) return;
    setDays((prev) =>
      prev.map((d) =>
        d.date === selectedDate
          ? {
              ...d,
              meetupMessages: [
                { id: `m${Date.now()}`, author: "You", initials: "ME", color: "#00A8CC", message: meetupInput.trim(), minsAgo: 0 },
                ...d.meetupMessages,
              ],
            }
          : d
      )
    );
    setMeetupInput("");
    setShowMeetupInput(false);
  };

  const handleLogExpense = () => {
    if (!expenseAmt || !expenseDesc) return;
    const amt = parseFloat(expenseAmt);
    setDays((prev) =>
      prev.map((d) =>
        d.date === selectedDate
          ? {
              ...d,
              expenses: [
                ...d.expenses,
                {
                  id: `x${Date.now()}`,
                  description: expenseDesc,
                  amountYen: Math.round(amt * 148),
                  amountUsd: amt,
                  paidBy: expensePaidBy,
                  split: true,
                },
              ],
            }
          : d
      )
    );
    setExpenseDesc("");
    setExpenseAmt("");
    setExpenseForm(false);
  };

  const toggleScavenger = (id: string) => {
    setScavengerItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const totalExpenses = day.expenses.reduce((s, e) => s + e.amountUsd, 0);
  const scavengerPts = scavengerItems.filter((s) => s.done).reduce((s, i) => s + i.points, 0);
  const scavengerTotal = scavengerItems.reduce((s, i) => s + i.points, 0);

  // ── Left Panel ──────────────────────────────────────────────────────────────

  const leftPanel = (
    <div
      className="flex-shrink-0 border-r flex flex-col"
      style={{ width: 248, height: "calc(100vh - 56px)", position: "sticky", top: 56, backgroundColor: "#252525", borderColor: "#333333" }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b" style={{ borderColor: "#333333" }}>
        <h2 className="text-xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-fredoka)" }}>
          Vacation Days
        </h2>
        <p className="text-xs font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
          {MOCK_DAYS.length} days · Apr 2–14
        </p>
      </div>

      {/* Day list */}
      <div className="flex-1 overflow-y-auto scrollbar-dark px-2 py-2 space-y-0.5">
        {/* Group by destination */}
        {DEST_RANGES.map((dest) => {
          const destDays = days.filter((d) => d.destination === dest.name);
          return (
            <div key={dest.name}>
              {/* Destination label */}
              <div className="px-3 pt-3 pb-1 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dest.color }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: dest.color }}>
                  {dest.name}
                </span>
              </div>
              {destDays.map((d) => {
                const active = d.date === selectedDate;
                const { weekday: wd, dayNum: dn, month: mo } = formatDate(d.date);
                const dIdx = destDays.findIndex((x) => x.date === d.date);
                return (
                  <button
                    key={d.date}
                    onClick={() => { setSelectedDate(d.date); setMobileView("detail"); }}
                    className="w-full text-left rounded-xl px-3 py-2 transition-all"
                    style={{
                      backgroundColor: active ? "#333333" : "transparent",
                      border: active ? `1px solid ${dest.color}33` : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Day number */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                        style={{
                          backgroundColor: active ? dest.color : "#3a3a3a",
                          color: active ? "white" : "#9CA3AF",
                          fontFamily: "var(--font-fredoka)",
                        }}
                      >
                        {dIdx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: active ? "white" : "#d1d5db" }}>
                          {wd}, {mo} {dn}
                        </p>
                        <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                          {d.events.length} events
                        </p>
                      </div>

                      {/* Event count badge */}
                      {d.events.filter((e) => e.confirmed).length > 0 && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: active ? dest.color + "33" : "#3a3a3a", color: active ? dest.color : "#9CA3AF" }}
                        >
                          {d.events.filter((e) => e.confirmed).length}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Right Panel ─────────────────────────────────────────────────────────────

  const rightPanel = (
    <div className="flex-1 overflow-y-auto scrollbar-dark">
      {/* Mobile back */}
      <div className="md:hidden px-4 pt-4">
        <button onClick={() => setMobileView("list")} className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "#9CA3AF" }}>
          <ArrowLeft size={14} /> All days
        </button>
      </div>

      <div className="p-6 space-y-5 max-w-2xl">

        {/* ── Morning Briefing Card ── */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${day.destColor}18 0%, #2e2e2e 60%)`,
            border: `1px solid ${day.destColor}30`,
          }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ backgroundColor: day.destColor, filter: "blur(40px)" }}
          />

          <div className="relative">
            {/* Destination pill */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: day.destColor }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: day.destColor }}>
                {destDayLabel(day)}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                Trip Day {day.tripDayNum} of 15
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-semibold text-white mb-0.5" style={{ fontFamily: "var(--font-fredoka)" }}>
              {longDate}
            </h2>

            {/* Sassy briefing note */}
            {day.briefingNote && (
              <p className="text-sm font-medium mt-1 mb-3" style={{ color: "#d1d5db" }}>
                {day.briefingNote}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <CalendarBlank size={13} weight="fill" style={{ color: day.destColor }} />
                <span className="text-sm font-bold" style={{ color: "#e5e7eb" }}>
                  {day.events.length} events
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun size={13} weight="fill" style={{ color: "#FFD600" }} />
                <span className="text-sm font-bold" style={{ color: "#e5e7eb" }}>
                  Partly cloudy · 18°C
                </span>
              </div>
              {day.vote && !day.vote.myVote && (
                <div className="flex items-center gap-1.5">
                  <UsersThree size={13} weight="fill" style={{ color: "#00A8CC" }} />
                  <span className="text-sm font-bold" style={{ color: "#00A8CC" }}>
                    Vote active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Today's Schedule ── */}
        <DarkCard className="p-4">
          <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#00A8CC" }}>
            Today's Schedule
          </p>

          {day.events.length === 0 ? (
            <div className="text-center py-6">
              <CalendarBlank size={28} weight="fill" style={{ color: "#3a3a3a", margin: "0 auto 8px" }} />
              <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Nothing planned yet. That's brave.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {day.events.map((ev) => {
                const meta = CATEGORY_META[ev.category];
                const Icon = meta.Icon;
                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-[#333333]/40 transition-colors group"
                  >
                    {/* Time */}
                    <div className="w-14 flex-shrink-0 pt-0.5">
                      <span className="text-xs font-black" style={{ color: "#9CA3AF" }}>
                        {ev.time}
                      </span>
                    </div>

                    {/* Category dot */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.color + "22" }}
                    >
                      <Icon size={12} weight="fill" color={meta.color} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-tight">{ev.title}</p>
                      {ev.location && (
                        <p className="text-xs font-medium mt-0.5 flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                          <MapPin size={10} weight="fill" />
                          {ev.location}
                        </p>
                      )}
                    </div>

                    {/* Cost + confirmed */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {ev.cost && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
                          ¥{ev.cost.toLocaleString()}
                        </span>
                      )}
                      {ev.confirmed ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "#00C96B22" }}>
                          <Check size={10} weight="bold" color="#00C96B" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#9CA3AF" }}>
                          unconfirmed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[#333333]/60"
            style={{ border: "1px dashed #3a3a3a", color: "#9CA3AF" }}
          >
            <Plus size={13} weight="bold" />
            Add event to today
          </button>
        </DarkCard>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Log Expense */}
          <button
            onClick={() => setExpenseForm((v) => !v)}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
            style={{
              backgroundColor: expenseForm ? "#00C96B22" : "#2e2e2e",
              border: `1px solid ${expenseForm ? "#00C96B55" : "#3a3a3a"}`,
              color: expenseForm ? "#00C96B" : "#9CA3AF",
            }}
          >
            <Receipt size={20} weight="fill" />
            Log expense
          </button>

          {/* Quick Vote */}
          <button
            className="flex flex-col items-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
            style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a", color: "#9CA3AF" }}
          >
            <ThumbsUp size={20} weight="fill" />
            Quick vote
          </button>

          {/* Meetup Point */}
          <button
            onClick={() => setShowMeetupInput((v) => !v)}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
            style={{
              backgroundColor: showMeetupInput ? "#00A8CC22" : "#2e2e2e",
              border: `1px solid ${showMeetupInput ? "#00A8CC55" : "#3a3a3a"}`,
              color: showMeetupInput ? "#00A8CC" : "#9CA3AF",
            }}
          >
            <MapPin size={20} weight="fill" />
            Meetup point
          </button>
        </div>

        {/* Expense quick form */}
        {expenseForm && (
          <DarkCard className="p-4">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#00C96B" }}>
              Log an expense
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="What was it?"
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00C96B]/50 placeholder-[#555] col-span-2"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                />
                <input
                  type="number"
                  value={expenseAmt}
                  onChange={(e) => setExpenseAmt(e.target.value)}
                  placeholder="Amount (USD)"
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00C96B]/50 placeholder-[#555]"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                />
                <div className="flex gap-1.5">
                  {["You", "Sarah", "Tom", "Emma"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setExpensePaidBy(p)}
                      className="flex-1 rounded-xl text-xs font-bold py-2.5 transition-all"
                      style={{
                        backgroundColor: expensePaidBy === p ? "#00C96B22" : "#3a3a3a",
                        color: expensePaidBy === p ? "#00C96B" : "#9CA3AF",
                        border: `1px solid ${expensePaidBy === p ? "#00C96B55" : "transparent"}`,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleLogExpense}
                  disabled={!expenseAmt || !expenseDesc}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                  style={{ backgroundColor: "#00C96B", color: "white" }}
                >
                  Log it
                </button>
                <button
                  onClick={() => setExpenseForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </DarkCard>
        )}

        {/* ── Group Coordination ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Meetup Point */}
          <DarkCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#00A8CC" }}>
                Where is everyone
              </p>
              <button
                onClick={() => setShowMeetupInput((v) => !v)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg transition-colors hover:bg-[#3a3a3a]"
                style={{ color: "#00A8CC" }}
              >
                + Post
              </button>
            </div>

            {showMeetupInput && (
              <div className="mb-3 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={meetupInput}
                  onChange={(e) => setMeetupInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostMeetup()}
                  placeholder="Where are you right now?"
                  className="flex-1 rounded-xl px-3 py-2 text-xs font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555]"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                />
                <button
                  onClick={handlePostMeetup}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#00A8CC" }}
                >
                  <PaperPlaneTilt size={13} weight="fill" color="white" />
                </button>
              </div>
            )}

            {day.meetupMessages.length === 0 ? (
              <p className="text-xs font-medium" style={{ color: "#555" }}>
                No location updates yet. Post yours.
              </p>
            ) : (
              <div className="space-y-2">
                {day.meetupMessages.map((m) => (
                  <div key={m.id} className="flex items-start gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ backgroundColor: m.color + "33", color: m.color }}
                    >
                      {m.initials.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white leading-snug">{m.message}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: "#555" }}>
                        {m.author} · {m.minsAgo === 0 ? "just now" : `${m.minsAgo}m ago`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs font-medium mt-3" style={{ color: "#444" }}>
              Clears at end of day
            </p>
          </DarkCard>

          {/* Quick Thumbs Vote */}
          <DarkCard className="p-4">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#FFD600" }}>
              Quick vote
            </p>

            {day.vote ? (
              <div>
                <p className="text-sm font-bold text-white mb-3 leading-snug">{day.vote.question}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => !day.vote?.myVote && handleVote("yes")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                    style={{
                      backgroundColor: day.vote.myVote === "yes" ? "#00C96B22" : "#3a3a3a",
                      border: `1px solid ${day.vote.myVote === "yes" ? "#00C96B55" : "transparent"}`,
                      color: day.vote.myVote === "yes" ? "#00C96B" : "#9CA3AF",
                      cursor: day.vote.myVote ? "default" : "pointer",
                    }}
                  >
                    <ThumbsUp size={16} weight="fill" />
                    Sunset ({day.vote.yes})
                  </button>
                  <button
                    onClick={() => !day.vote?.myVote && handleVote("no")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                    style={{
                      backgroundColor: day.vote.myVote === "no" ? "#FF2D8B22" : "#3a3a3a",
                      border: `1px solid ${day.vote.myVote === "no" ? "#FF2D8B55" : "transparent"}`,
                      color: day.vote.myVote === "no" ? "#FF2D8B" : "#9CA3AF",
                      cursor: day.vote.myVote ? "default" : "pointer",
                    }}
                  >
                    <ThumbsDown size={16} weight="fill" />
                    Night ({day.vote.no})
                  </button>
                </div>

                {/* Tally bar */}
                <div className="rounded-full overflow-hidden" style={{ height: 4, backgroundColor: "#3a3a3a" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((day.vote.yes / (day.vote.yes + day.vote.no || 1)) * 100)}%`, backgroundColor: "#00C96B" }}
                  />
                </div>
                <p className="text-xs font-medium mt-1.5" style={{ color: "#555" }}>
                  {day.vote.yes + day.vote.no} of {day.vote.total} voted{day.vote.myVote ? " · You voted" : " · Tap to vote"}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs font-medium mb-3" style={{ color: "#555" }}>No active vote right now.</p>
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-[#FFD60022]"
                  style={{ border: "1px dashed #3a3a3a", color: "#9CA3AF" }}
                >
                  Start a quick vote
                </button>
              </div>
            )}
          </DarkCard>
        </div>

        {/* ── Today's Expenses ── */}
        <DarkCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#00C96B" }}>
              Expenses today
            </p>
            {totalExpenses > 0 && (
              <span className="text-sm font-black" style={{ color: "#00C96B" }}>
                ${totalExpenses} total
              </span>
            )}
          </div>

          {day.expenses.length === 0 ? (
            <p className="text-sm font-medium" style={{ color: "#555" }}>
              Nothing logged yet. Someone definitely bought something.
            </p>
          ) : (
            <div className="space-y-2 mb-3">
              {day.expenses.map((exp) => (
                <div key={exp.id} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ backgroundColor: "#1e1e1e" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#00C96B22" }}>
                    <Receipt size={13} weight="fill" color="#00C96B" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{exp.description}</p>
                    <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                      Paid by {exp.paidBy}{exp.split ? " · split evenly" : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black" style={{ color: "#00C96B" }}>${exp.amountUsd}</p>
                    <p className="text-xs font-medium" style={{ color: "#555" }}>¥{exp.amountYen.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setExpenseForm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[#333333]/60"
            style={{ border: "1px dashed #3a3a3a", color: "#9CA3AF" }}
          >
            <Plus size={13} weight="bold" />
            Log expense
          </button>
        </DarkCard>

        {/* ── Scavenger Hunt ── */}
        <DarkCard className="overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#333333]/40"
            onClick={() => setScavengerOpen((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <Trophy size={14} weight="fill" style={{ color: "#FFD600" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#FFD600" }}>
                Scavenger Hunt
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: scavengerPts > 0 ? "#FFD60022" : "#3a3a3a",
                  color: scavengerPts > 0 ? "#FFD600" : "#9CA3AF",
                }}
              >
                {scavengerPts} / {scavengerTotal} pts
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
              {scavengerOpen ? "▲" : "▼"}
            </span>
          </button>

          {scavengerOpen && (
            <div className="px-4 pb-4 space-y-1.5">
              {/* Progress bar */}
              <div className="rounded-full overflow-hidden mb-3" style={{ height: 4, backgroundColor: "#3a3a3a" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((scavengerPts / scavengerTotal) * 100)}%`,
                    backgroundColor: "#FFD600",
                  }}
                />
              </div>

              {scavengerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleScavenger(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-[#333333]/40"
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: item.done ? "#FFD600" : "transparent",
                      border: item.done ? "none" : "2px solid #4a4a4a",
                    }}
                  >
                    {item.done && <Check size={10} weight="bold" color="#1a1a1a" />}
                  </div>

                  {/* Text */}
                  <span
                    className="flex-1 text-sm font-medium leading-snug"
                    style={{ color: item.done ? "#666" : "#e5e7eb", textDecoration: item.done ? "line-through" : "none" }}
                  >
                    {item.text}
                  </span>

                  {/* Points */}
                  <span
                    className="text-xs font-black flex-shrink-0 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: item.done ? "#FFD60022" : "#3a3a3a",
                      color: item.done ? "#FFD600" : "#9CA3AF",
                    }}
                  >
                    +{item.points}
                  </span>
                </button>
              ))}

              <p className="text-xs font-medium pt-1" style={{ color: "#444" }}>
                Tap to check off. Results are visible to the whole group.
              </p>
            </div>
          )}
        </DarkCard>

      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .vd-left  { display: ${mobileView === "list" ? "flex" : "none"} !important; width: 100% !important; height: auto !important; position: static !important; border-right: none !important; }
          .vd-right { display: ${mobileView === "detail" ? "flex" : "none"} !important; }
        }
      `}</style>

      <div className="flex" style={{ height: "calc(100vh - 56px)", backgroundColor: "#1e1e1e" }}>
        <div className="vd-left hidden md:flex flex-col">{leftPanel}</div>
        <div className="vd-right flex-1 flex flex-col overflow-hidden">{rightPanel}</div>
      </div>
    </>
  );
}
