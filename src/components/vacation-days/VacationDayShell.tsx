"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  ThumbsUp,
  ThumbsDown,
  Receipt,
  ArrowLeft,
  Check,
  Trophy,
  PaperPlaneTilt,
  CalendarBlank,
  UsersThree,
  MapPin,
  Sun,
} from "@phosphor-icons/react";
import {
  type ScheduleEvent,
  CATEGORY_META,
  DEST_RANGES,
  MOCK_EVENTS,
} from "@/lib/schedule";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// events are now derived from shared MOCK_EVENTS — not stored here
interface VacationDayMeta {
  date: string;
  destination: string;   // short name: "Tokyo", "Kyoto", "Osaka"
  destColor: string;
  tripDayNum: number;
  meetupMessages: MeetupMessage[];
  vote: QuickVote | null;
  expenses: TodayExpense[];
  briefingNote: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SCAVENGER_ITEMS: ScavengerItem[] = [
  { id: "s1",  text: "Eat something you can't identify",            points: 5,  done: true  },
  { id: "s2",  text: "Buy something from a 100-yen shop",           points: 3,  done: true  },
  { id: "s3",  text: "Witness a vending machine moment",            points: 2,  done: true  },
  { id: "s4",  text: "See a shrine or temple",                      points: 2,  done: true  },
  { id: "s5",  text: "Photo with someone in traditional clothing",  points: 5,  done: false },
  { id: "s6",  text: "Navigate the subway with zero English",       points: 10, done: false },
  { id: "s7",  text: "Try karaoke",                                 points: 8,  done: false },
  { id: "s8",  text: "Find a cat café",                             points: 5,  done: false },
  { id: "s9",  text: "Have a full combini breakfast",               points: 3,  done: false },
  { id: "s10", text: "Make a local friend",                         points: 10, done: false },
];

const MOCK_DAY_META: VacationDayMeta[] = [
  // Tokyo
  { date: "2025-04-02", destination: "Tokyo", destColor: "#FF2D8B", tripDayNum: 2,  meetupMessages: [], vote: null, expenses: [], briefingNote: "Cherry blossom season. Gyoen is peak pink right now." },
  { date: "2025-04-03", destination: "Tokyo", destColor: "#FF2D8B", tripDayNum: 3,  meetupMessages: [], vote: null, expenses: [], briefingNote: "Senso-ji is packed before 9 AM — get there early." },
  { date: "2025-04-04", destination: "Tokyo", destColor: "#FF2D8B", tripDayNum: 4,  meetupMessages: [], vote: null, expenses: [], briefingNote: "teamLab tickets are timed entry — don't be late." },
  {
    date: "2025-04-05",
    destination: "Tokyo",
    destColor: "#FF2D8B",
    tripDayNum: 5,
    meetupMessages: [
      { id: "m1", author: "Emma",  initials: "EM", color: "#00C96B", message: "At Shibuya crossing now! Where is everyone? 🚦", minsAgo: 2  },
      { id: "m2", author: "Sarah", initials: "SA", color: "#FF2D8B", message: "Near the Meiji Shrine torii gate, come find me",  minsAgo: 11 },
      { id: "m3", author: "Tom",   initials: "TM", color: "#00A8CC", message: "Still in Harajuku finishing takoyaki 🐙 coming soon", minsAgo: 18 },
    ],
    vote: {
      question: "Golden Gai tonight or early night for tomorrow?",
      yes: 2,
      no: 1,
      total: 4,
      myVote: null,
    },
    expenses: [
      { id: "x1", description: "Shinjuku Gyoen entry", amountYen: 500,  amountUsd: 3,  paidBy: "You",   split: true  },
      { id: "x2", description: "Subway IC card top-up", amountYen: 1000, amountUsd: 7,  paidBy: "You",   split: false },
      { id: "x3", description: "Meiji Shrine donation", amountYen: 1000, amountUsd: 7,  paidBy: "Tom",   split: false },
    ],
    briefingNote: "Peak cherry blossoms at Gyoen today. Golden Gai crawl in the evening.",
  },
  { date: "2025-04-06", destination: "Tokyo", destColor: "#FF2D8B", tripDayNum: 6,  meetupMessages: [], vote: null, expenses: [], briefingNote: "Last full day in Tokyo. Make it count." },
  { date: "2025-04-07", destination: "Tokyo", destColor: "#FF2D8B", tripDayNum: 7,  meetupMessages: [], vote: null, expenses: [], briefingNote: "Pack light today — it's a day trip. Big bags stay at the hotel." },
  // Kyoto
  { date: "2025-04-09", destination: "Kyoto", destColor: "#FFD600", tripDayNum: 9,  meetupMessages: [], vote: null, expenses: [], briefingNote: "Fushimi Inari before 8 AM is almost crowd-free. This is the move." },
  { date: "2025-04-10", destination: "Kyoto", destColor: "#FFD600", tripDayNum: 10, meetupMessages: [], vote: null, expenses: [], briefingNote: "The golden pavilion looks impossible in person. No filter needed." },
  { date: "2025-04-11", destination: "Kyoto", destColor: "#FFD600", tripDayNum: 11, meetupMessages: [], vote: null, expenses: [], briefingNote: "Last day in Kyoto. The Philosopher's Path hits different in cherry blossom season." },
  // Osaka
  { date: "2025-04-12", destination: "Osaka", destColor: "#00C96B", tripDayNum: 12, meetupMessages: [], vote: null, expenses: [], briefingNote: "Osaka is built different. It's all about the food from here on." },
  { date: "2025-04-13", destination: "Osaka", destColor: "#00C96B", tripDayNum: 13, meetupMessages: [], vote: null, expenses: [], briefingNote: "The castle park is also excellent for picnics if anyone wants a detour." },
  { date: "2025-04-14", destination: "Osaka", destColor: "#00C96B", tripDayNum: 14, meetupMessages: [], vote: null, expenses: [], briefingNote: "Last night. Someone's going to cry. It won't be Tom (it will be Tom)." },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function destDayLabel(day: VacationDayMeta): string {
  const dest = DEST_RANGES.find((d) => d.short === day.destination);
  if (!dest) return `Day ${day.tripDayNum}`;
  const daysInDest = MOCK_DAY_META.filter((d) => d.destination === day.destination);
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

interface VacationDayShellProps {
  tripId: string;
  initialDate?: string;
}

export default function VacationDayShell({ tripId, initialDate }: VacationDayShellProps) {
  const base = `/app/trips/${tripId}`;
  const DEFAULT_DATE = "2025-04-05";

  const [selectedDate, setSelectedDate] = useState(initialDate ?? DEFAULT_DATE);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [scavengerItems, setScavengerItems] = useState(SCAVENGER_ITEMS);
  const [scavengerOpen, setScavengerOpen] = useState(true);
  const [days, setDays] = useState(MOCK_DAY_META);
  const [meetupInput, setMeetupInput] = useState("");
  const [showMeetupInput, setShowMeetupInput] = useState(false);
  const [expenseForm, setExpenseForm] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("You");

  const day = days.find((d) => d.date === selectedDate) ?? days[0];
  const { weekday, long: longDate, dayNum, month } = formatDate(selectedDate);

  // Events derived from shared MOCK_EVENTS — single source of truth
  const dayEvents: ScheduleEvent[] = MOCK_EVENTS
    .filter((e) => e.dayDate === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
      style={{ width: 248, height: "100%", backgroundColor: "#252525", borderColor: "#333333" }}
    >
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "#333333" }}>
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>
          {MOCK_DAY_META.length} days · 3 cities
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-dark px-2 py-2 space-y-0.5">
        {DEST_RANGES.map((dest) => {
          const destDays = days.filter((d) => d.destination === dest.short);
          if (destDays.length === 0) return null;
          return (
            <div key={dest.short}>
              <div className="px-3 pt-3 pb-1 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dest.color }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: dest.color }}>
                  {dest.short}
                </span>
              </div>
              {destDays.map((d) => {
                const active = d.date === selectedDate;
                const { weekday: wd, dayNum: dn, month: mo } = formatDate(d.date);
                const dIdx = destDays.findIndex((x) => x.date === d.date);
                const dateEvents = MOCK_EVENTS.filter((e) => e.dayDate === d.date);
                const confirmedCount = dateEvents.filter((e) => e.confirmed).length;
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
                          {dateEvents.length} events
                        </p>
                      </div>

                      {confirmedCount > 0 && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: active ? dest.color + "33" : "#3a3a3a", color: active ? dest.color : "#9CA3AF" }}
                        >
                          {confirmedCount}
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
      <div className="md:hidden px-4 pt-4">
        <button onClick={() => setMobileView("list")} className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "#9CA3AF" }}>
          <ArrowLeft size={14} /> All days
        </button>
      </div>

      <div className="p-5 vd-detail-grid">

        {/* ── Left column: briefing + schedule ── */}
        <div className="space-y-4">

        {/* ── Morning Briefing Card ── */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${day.destColor}18 0%, #2e2e2e 60%)`,
            border: `1px solid ${day.destColor}30`,
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ backgroundColor: day.destColor, filter: "blur(40px)" }}
          />

          <div className="relative">
            {/* Destination pill + cross-nav to Itinerary */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: day.destColor }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: day.destColor }}>
                  {destDayLabel(day)}
                </span>
              </div>
              <Link
                href={`${base}/itinerary?date=${selectedDate}`}
                className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[10px] font-black transition-all border hover:border-[#00A8CC]/50 hover:text-[#00A8CC]"
                style={{ borderColor: "#3a3a3a", color: "rgba(255,255,255,0.35)", backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <CalendarBlank size={10} weight="fill" />
                Full Itinerary
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                Trip Day {day.tripDayNum} of 15
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-0.5" style={{ fontFamily: "var(--font-fredoka)" }}>
              {longDate}
            </h2>

            {day.briefingNote && (
              <p className="text-sm font-medium mt-1 mb-3" style={{ color: "#d1d5db" }}>
                {day.briefingNote}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <CalendarBlank size={13} weight="fill" style={{ color: day.destColor }} />
                <span className="text-sm font-bold" style={{ color: "#e5e7eb" }}>
                  {dayEvents.length} events
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

          {dayEvents.length === 0 ? (
            <div className="text-center py-6">
              <CalendarBlank size={28} weight="fill" style={{ color: "#3a3a3a", margin: "0 auto 8px" }} />
              <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Nothing planned yet. That's brave.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {dayEvents.map((ev) => {
                const meta = CATEGORY_META[ev.category];
                const Icon = meta.Icon;
                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-[#333333]/40 transition-colors group"
                  >
                    <div className="w-14 flex-shrink-0 pt-0.5">
                      <span className="text-xs font-black" style={{ color: "#9CA3AF" }}>
                        {ev.startTime}
                      </span>
                    </div>

                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.color + "22" }}
                    >
                      <Icon size={12} weight="fill" color={meta.color} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-tight">{ev.title}</p>
                      {ev.location && (
                        <p className="text-xs font-medium mt-0.5 flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                          <MapPin size={10} weight="fill" />
                          {ev.location}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {ev.cost && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
                          {ev.cost}
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

          <Link
            href={`${base}/itinerary?date=${selectedDate}`}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[#333333]/60"
            style={{ border: "1px dashed #3a3a3a", color: "#9CA3AF" }}
          >
            <Plus size={13} weight="bold" />
            Add event in Itinerary
          </Link>
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
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: item.done ? "#FFD600" : "transparent",
                      border: item.done ? "none" : "2px solid #4a4a4a",
                    }}
                  >
                    {item.done && <Check size={10} weight="bold" color="#1a1a1a" />}
                  </div>

                  <span
                    className="flex-1 text-sm font-medium leading-snug"
                    style={{ color: item.done ? "#666" : "#e5e7eb", textDecoration: item.done ? "line-through" : "none" }}
                  >
                    {item.text}
                  </span>

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

        </div>{/* end left col */}

        {/* ── Right column ── */}
        <div className="space-y-4">

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-3 gap-3">
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

          <button
            className="flex flex-col items-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
            style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a", color: "#9CA3AF" }}
          >
            <ThumbsUp size={20} weight="fill" />
            Quick vote
          </button>

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
                    Yes ({day.vote.yes})
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
                    No ({day.vote.no})
                  </button>
                </div>

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
        </div>{/* end right col */}

      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .vd-detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; }
        @media (max-width: 1024px) { .vd-detail-grid { grid-template-columns: 1fr; } }
        @media (max-width: 767px) {
          .vd-left  { display: var(--vd-left-display, flex) !important; width: 100% !important; height: auto !important; position: static !important; border-right: none !important; }
          .vd-right { display: var(--vd-right-display, flex) !important; }
        }
      `}</style>

      <div className="flex flex-col" style={{
        height: "calc(100vh - 56px)",
        backgroundColor: "#404040",
        "--vd-left-display": mobileView === "list" ? "flex" : "none",
        "--vd-right-display": mobileView === "detail" ? "flex" : "none",
      } as React.CSSProperties}>

        {/* Header band */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ backgroundColor: "#282828", borderBottom: "1px solid #333333" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-fredoka)", fontSize: "2rem", color: "white", lineHeight: 1.1 }}>Vacation Days</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>Apr 2–14 · Japan · {MOCK_DAY_META.length} days</p>
          </div>
          <button
            onClick={() => setExpenseForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:translate-y-0.5"
            style={{ backgroundColor: "#00C96B", color: "white", boxShadow: "0 4px 0 #007a42" }}
          >
            <Receipt size={14} weight="fill" />
            Log expense
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #2a2a2a" }}>
          {[
            { value: MOCK_DAY_META.length, label: "Days planned", color: "#00A8CC" },
            { value: `$${totalExpenses}`, label: "Spent today",   color: "#00C96B" },
            { value: `${scavengerPts} pts`, label: "Hunt score",  color: "#FFD600" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a" }}>
              <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "#9CA3AF" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Two-panel area */}
        <div className="flex flex-1 min-h-0">
          <div className="vd-left hidden md:flex flex-col">{leftPanel}</div>
          <div className="vd-right flex-1 flex flex-col overflow-hidden">{rightPanel}</div>
        </div>

      </div>
    </>
  );
}
