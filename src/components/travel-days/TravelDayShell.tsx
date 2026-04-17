"use client";

import { useState, useRef } from "react";
import {
  Airplane,
  Car,
  Train,
  Boat,
  Bus,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  Clock,
  MapPin,
  DotsSixVertical,
  Check,
  IdentificationCard,
  CalendarBlank,
  Ticket,
  Note,
  Backpack,
  CaretDown,
  CaretRight,
  ArrowRight,
  Warning,
  X,
  SunHorizon,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransportMode = "flight" | "drive" | "train" | "cruise" | "bus";
type ViewMode = "planning" | "dayof";

interface TravelDayTask {
  id: string;
  text: string;
  done: boolean;
}

interface TravelDay {
  id: string;
  date: string;
  label: string;
  transportMode: TransportMode;
  departureTime: string;
  departureLocation: string;
  arrivalTime: string;
  arrivalLocation: string;
  serviceNumber: string;
  carrier: string;
  tasks: TravelDayTask[];
  requiredItems: string[];
  notes: string;
}

// ─── Transport Mode Config ─────────────────────────────────────────────────────

const TRANSPORT_META: Record<
  TransportMode,
  {
    label: string;
    Icon: PhosphorIcon;
    color: string;
    defaultTasks: string[];
  }
> = {
  flight: {
    label: "Flight",
    Icon: Airplane,
    color: "#FF2D8B",
    defaultTasks: [
      "Wake up early",
      "Eat breakfast",
      "Double check passport, tickets, and ID",
      "Confirm chargers and adapters are packed",
      "Turn off appliances and electronics",
      "Lock up and leave",
      "Arrive at the airport",
      "Check in and drop bags",
      "Clear security",
      "Find your gate",
      "Board the plane",
    ],
  },
  drive: {
    label: "Drive",
    Icon: Car,
    color: "#00A8CC",
    defaultTasks: [
      "Wake up early",
      "Final bag check",
      "Load the car",
      "Double check the route and tolls",
      "Fill up on gas",
      "Hit the road",
      "Rest stop halfway",
      "Arrive at destination",
    ],
  },
  train: {
    label: "Train",
    Icon: Train,
    color: "#A855F7",
    defaultTasks: [
      "Wake up early",
      "Check out of accommodation",
      "Confirm train tickets or pass",
      "Head to the station",
      "Find your platform",
      "Board the train",
      "Arrive and get to next accommodation",
    ],
  },
  cruise: {
    label: "Cruise",
    Icon: Boat,
    color: "#00A8CC",
    defaultTasks: [
      "Wake up and do final packing",
      "Check out of hotel",
      "Head to the cruise terminal",
      "Check in and board",
      "Find your cabin",
      "Attend the safety briefing",
    ],
  },
  bus: {
    label: "Bus",
    Icon: Bus,
    color: "#FFD600",
    defaultTasks: [
      "Wake up early",
      "Confirm bus tickets",
      "Head to the bus station",
      "Board the bus",
      "Arrive at destination",
    ],
  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_TRAVEL_DAYS: TravelDay[] = [
  {
    id: "td1",
    date: "2025-04-01",
    label: "Departure Day",
    transportMode: "flight",
    departureTime: "7:30 AM",
    departureLocation: "JFK Airport, New York",
    arrivalTime: "11:15 AM (+1 day)",
    arrivalLocation: "Narita Airport, Tokyo",
    serviceNumber: "JL 006",
    carrier: "Japan Airlines",
    tasks: [
      { id: "t1", text: "Wake up (5:00 AM)", done: false },
      { id: "t2", text: "Eat breakfast and review packing list", done: false },
      { id: "t3", text: "Double check passport, tickets, and ID", done: false },
      { id: "t4", text: "Confirm chargers and power adapters are packed", done: false },
      { id: "t5", text: "Turn off appliances and electronics", done: false },
      { id: "t6", text: "Lock up the house", done: false },
      { id: "t7", text: "Head to JFK Airport", done: false },
      { id: "t8", text: "Check in and drop bags at JAL counter", done: false },
      { id: "t9", text: "Clear security", done: false },
      { id: "t10", text: "Find Gate B42", done: false },
      { id: "t11", text: "Board JL 006", done: false },
    ],
    requiredItems: [
      "Passport",
      "Flight ticket (JL 006)",
      "Power adapter (Japan Type A/B)",
      "Yen cash",
      "Travel insurance card",
      "Hotel confirmation",
    ],
    notes: "Check-in opens 3 hours before departure. Aim to reach JFK by 4:30 AM.",
  },
  {
    id: "td2",
    date: "2025-04-08",
    label: "Tokyo → Kyoto",
    transportMode: "train",
    departureTime: "9:00 AM",
    departureLocation: "Tokyo Station",
    arrivalTime: "11:35 AM",
    arrivalLocation: "Kyoto Station",
    serviceNumber: "Hikari 501",
    carrier: "JR Central (Shinkansen)",
    tasks: [
      { id: "t1", text: "Check out of hotel by 8:00 AM", done: false },
      { id: "t2", text: "Grab breakfast near Tokyo Station", done: false },
      { id: "t3", text: "Validate JR Pass if not done yet", done: false },
      { id: "t4", text: "Head to Tokyo Station Shinkansen entrance", done: false },
      { id: "t5", text: "Find Track 14 for Hikari 501", done: false },
      { id: "t6", text: "Board and find reserved seats", done: false },
      { id: "t7", text: "Arrive Kyoto Station and check in", done: false },
    ],
    requiredItems: [
      "JR Pass",
      "Kyoto hotel confirmation",
      "All luggage",
      "Yen cash",
    ],
    notes: "",
  },
  {
    id: "td3",
    date: "2025-04-15",
    label: "Return Home",
    transportMode: "flight",
    departureTime: "2:20 PM",
    departureLocation: "Kansai International Airport, Osaka",
    arrivalTime: "4:05 PM (same day*)",
    arrivalLocation: "JFK Airport, New York",
    serviceNumber: "JL 061",
    carrier: "Japan Airlines",
    tasks: [
      { id: "t1", text: "Check out of hotel by 11:00 AM", done: false },
      { id: "t2", text: "Final packing check", done: false },
      { id: "t3", text: "Head to Kansai International Airport", done: false },
      { id: "t4", text: "Check in and drop bags", done: false },
      { id: "t5", text: "Clear immigration and security", done: false },
      { id: "t6", text: "Pick up last duty-free items", done: false },
      { id: "t7", text: "Find departure gate", done: false },
      { id: "t8", text: "Board JL 061", done: false },
      { id: "t9", text: "Clear US customs and immigration on arrival", done: false },
    ],
    requiredItems: [
      "Passport",
      "Return flight ticket (JL 061)",
      "Customs declaration form",
      "All luggage",
    ],
    notes: "* You gain back the day crossing the International Date Line heading east.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    dayOfMonth: d.getUTCDate(),
    monthShort: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }),
  };
}

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}
    >
      {children}
    </div>
  );
}

// ─── Travel Day List Card ─────────────────────────────────────────────────────

function TravelDayListCard({
  day,
  active,
  onClick,
}: {
  day: TravelDay;
  active: boolean;
  onClick: () => void;
}) {
  const meta = TRANSPORT_META[day.transportMode];
  const Icon = meta.Icon;
  const { weekday, dayOfMonth, monthShort } = formatDate(day.date);
  const done = day.tasks.filter((t) => t.done).length;
  const total = day.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl px-3 py-2.5 transition-all"
      style={{
        backgroundColor: active ? "#333333" : "transparent",
        border: active ? "1px solid rgba(255,45,139,0.25)" : "1px solid transparent",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Transport icon circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: active ? meta.color : "#3a3a3a" }}
        >
          <Icon size={14} weight="fill" color={active ? "white" : "#9CA3AF"} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold truncate"
            style={{ color: active ? "white" : "#d1d5db" }}
          >
            {day.label}
          </p>
          <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
            {weekday}, {monthShort} {dayOfMonth}
          </p>
        </div>

        {/* Progress pill */}
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: pct === 100 ? "#FF8C00" + "22" : "#3a3a3a",
            color: pct === 100 ? "#FF8C00" : "#9CA3AF",
          }}
        >
          {done}/{total}
        </div>
      </div>
    </button>
  );
}

// ─── Add Day Form ─────────────────────────────────────────────────────────────

interface AddDayFormProps {
  onSave: (day: TravelDay) => void;
  onCancel: () => void;
}

function AddDayForm({ onSave, onCancel }: AddDayFormProps) {
  const [mode, setMode] = useState<TransportMode>("flight");
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [departTime, setDepartTime] = useState("");
  const [departLoc, setDepartLoc] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalLoc, setArrivalLoc] = useState("");
  const [serviceNum, setServiceNum] = useState("");
  const [carrier, setCarrier] = useState("");

  const handleSave = () => {
    if (!date || !label) return;
    const meta = TRANSPORT_META[mode];
    const newDay: TravelDay = {
      id: `td${Date.now()}`,
      date,
      label,
      transportMode: mode,
      departureTime: departTime,
      departureLocation: departLoc,
      arrivalTime,
      arrivalLocation: arrivalLoc,
      serviceNumber: serviceNum,
      carrier,
      tasks: meta.defaultTasks.map((text, i) => ({
        id: `t${i + 1}`,
        text,
        done: false,
      })),
      requiredItems: [],
      notes: "",
    };
    onSave(newDay);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-dark p-6">
      <div className="max-w-lg space-y-6">
        <div>
          <h2
            className="text-2xl font-semibold text-white mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Add a travel day
          </h2>
          <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
            We'll fill in the default task list for your transport type.
          </p>
        </div>

        {/* Transport mode */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>
            Transport Mode
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TRANSPORT_META) as TransportMode[]).map((m) => {
              const meta = TRANSPORT_META[m];
              const MIcon = meta.Icon;
              const sel = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
                  style={{
                    backgroundColor: sel ? meta.color : "#3a3a3a",
                    color: sel ? "white" : "#9CA3AF",
                  }}
                >
                  <MIcon size={14} weight="fill" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date + Label */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 transition-colors"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Departure Day"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 transition-colors placeholder-[#555]"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
        </div>

        {/* Departure */}
        <DarkCard className="p-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF2D8B" }}>
            Departure
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#9CA3AF" }}>Time</label>
              <input
                type="text"
                value={departTime}
                onChange={(e) => setDepartTime(e.target.value)}
                placeholder="7:30 AM"
                className="w-full rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#9CA3AF" }}>Location</label>
              <input
                type="text"
                value={departLoc}
                onChange={(e) => setDepartLoc(e.target.value)}
                placeholder="JFK Airport"
                className="w-full rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
              />
            </div>
          </div>
        </DarkCard>

        {/* Arrival */}
        <DarkCard className="p-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#00A8CC" }}>
            Arrival
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#9CA3AF" }}>Time</label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="11:15 AM"
                className="w-full rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#9CA3AF" }}>Location</label>
              <input
                type="text"
                value={arrivalLoc}
                onChange={(e) => setArrivalLoc(e.target.value)}
                placeholder="Narita Airport"
                className="w-full rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
              />
            </div>
          </div>
        </DarkCard>

        {/* Service number + carrier */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>
              {mode === "flight" ? "Flight Number" : mode === "train" ? "Train / Service" : "Route / Number"}
            </label>
            <input
              type="text"
              value={serviceNum}
              onChange={(e) => setServiceNum(e.target.value)}
              placeholder={mode === "flight" ? "JL 006" : "Hikari 501"}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>
              Carrier / Operator
            </label>
            <input
              type="text"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="Japan Airlines"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60 placeholder-[#555]"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
        </div>

        <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
          We'll add the default task list for a {TRANSPORT_META[mode].label.toLowerCase()} day. You can customize it after.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!date || !label}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#FF2D8B", color: "white" }}
          >
            Add travel day
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Row ────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  isNext,
  isLast,
  dayOfMode,
  onToggle,
  onDelete,
  onRename,
}: {
  task: TravelDayTask;
  isNext: boolean;
  isLast: boolean;
  dayOfMode: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(task.text);

  const saveEdit = () => {
    if (editVal.trim()) onRename(editVal.trim());
    setEditing(false);
  };

  return (
    <div className="flex items-stretch">
      {/* Timeline track */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 36 }}>
        {/* Circle */}
        <button
          onClick={onToggle}
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-3 transition-all duration-200 relative z-10"
          style={{
            backgroundColor: task.done ? "#FF8C00" : "transparent",
            border: task.done
              ? "none"
              : isNext
              ? "2px solid #FF2D8B"
              : "2px solid #4a4a4a",
            boxShadow: isNext && !task.done ? "0 0 0 4px rgba(255,45,139,0.12)" : "none",
          }}
        >
          {task.done && <Check size={11} weight="bold" color="white" />}
        </button>

        {/* Connector line */}
        {!isLast && (
          <div
            className="flex-1 w-0.5 mt-1"
            style={{
              backgroundColor: task.done ? "#4a4a4a" : "#2e2e2e",
              minHeight: 24,
            }}
          />
        )}
      </div>

      {/* Task content */}
      <div
        className={`flex-1 group flex items-center gap-2 px-2 rounded-xl cursor-pointer transition-all ${
          task.done ? "opacity-35" : ""
        } hover:bg-[#333333]/40`}
        style={{ minHeight: dayOfMode ? 56 : 48 }}
        onClick={() => {
          if (!editing) onToggle();
        }}
      >
        {/* Drag handle */}
        {!dayOfMode && (
          <div
            className="opacity-0 group-hover:opacity-60 flex-shrink-0 cursor-grab"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "#555" }}
          >
            <DotsSixVertical size={14} />
          </div>
        )}

        {/* Text */}
        {editing ? (
          <input
            autoFocus
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 rounded-lg px-2 py-1 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/60"
            style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={`flex-1 font-medium ${dayOfMode ? "text-base" : "text-sm"} ${
              task.done ? "line-through" : "text-white"
            }`}
            style={{ color: task.done ? "#555" : isNext ? "white" : "#e5e7eb" }}
          >
            {task.text}
          </span>
        )}

        {/* Action buttons */}
        {!dayOfMode && !editing && (
          <div
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setEditVal(task.text);
                setEditing(true);
              }}
              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              <PencilSimple size={12} />
            </button>
            <button
              onClick={onDelete}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,45,139,0.15)";
                (e.currentTarget as HTMLElement).style.color = "#FF2D8B";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#9CA3AF";
              }}
            >
              <Trash size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export default function TravelDayShell() {
  const [days, setDays] = useState<TravelDay[]>(INITIAL_TRAVEL_DAYS);
  const [selectedId, setSelectedId] = useState<string>("td1");
  const [adding, setAdding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("planning");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [itemsOpen, setItemsOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const timelineRef = useRef<HTMLDivElement>(null);

  const selectedDay = days.find((d) => d.id === selectedId) ?? null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectDay = (id: string) => {
    setSelectedId(id);
    setAdding(false);
    setViewMode("planning");
    setMobileView("detail");
  };

  const handleAddDay = (day: TravelDay) => {
    setDays((prev) => [...prev, day]);
    setSelectedId(day.id);
    setAdding(false);
    setMobileView("detail");
  };

  const handleToggleTask = (taskId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === selectedId
          ? {
              ...d,
              tasks: d.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : d
      )
    );

    // Smooth scroll to next incomplete task
    setTimeout(() => {
      if (!timelineRef.current || !selectedDay) return;
      const tasks = selectedDay.tasks;
      const idx = tasks.findIndex((t) => t.id === taskId);
      const nextIncomplete = tasks.slice(idx + 1).find((t) => !t.done);
      if (nextIncomplete) {
        const el = timelineRef.current.querySelector(`[data-task="${nextIncomplete.id}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 200);
  };

  const handleDeleteTask = (taskId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === selectedId
          ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) }
          : d
      )
    );
  };

  const handleRenameTask = (taskId: string, text: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === selectedId
          ? {
              ...d,
              tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, text } : t)),
            }
          : d
      )
    );
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: TravelDayTask = {
      id: `t${Date.now()}`,
      text: newTaskText.trim(),
      done: false,
    };
    setDays((prev) =>
      prev.map((d) =>
        d.id === selectedId ? { ...d, tasks: [...d.tasks, newTask] } : d
      )
    );
    setNewTaskText("");
    setAddingTask(false);
  };

  const handleUpdateNotes = (notes: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === selectedId ? { ...d, notes } : d))
    );
  };

  const totalTasks = days.reduce((s, d) => s + d.tasks.length, 0);
  const doneTasks = days.reduce((s, d) => s + d.tasks.filter((t) => t.done).length, 0);

  // ── Left Panel ────────────────────────────────────────────────────────────

  const leftPanel = (
    <div
      className="flex-shrink-0 border-r flex flex-col"
      style={{
        width: 260,
        height: "100%",
        backgroundColor: "#252525",
        borderColor: "#333333",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-5 pb-3 border-b flex items-center justify-between"
        style={{ borderColor: "#333333" }}
      >
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>
          {days.length} {days.length === 1 ? "day" : "days"} planned
        </p>
        <button
          onClick={() => {
            setAdding(true);
            setSelectedId("");
            setMobileView("detail");
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#3a3a3a", color: "#FF2D8B" }}
          title="Add travel day"
        >
          <Plus size={15} weight="bold" />
        </button>
      </div>

      {/* Day list */}
      <div className="flex-1 overflow-y-auto scrollbar-dark px-2 py-2 space-y-0.5">
        {days.map((day) => (
          <TravelDayListCard
            key={day.id}
            day={day}
            active={day.id === selectedId && !adding}
            onClick={() => handleSelectDay(day.id)}
          />
        ))}
      </div>

      {/* Add day prompt at bottom */}
      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: "#333333" }}>
        <button
          onClick={() => {
            setAdding(true);
            setSelectedId("");
            setMobileView("detail");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[#333333]/60"
          style={{
            border: "1px dashed #3a3a3a",
            color: "#9CA3AF",
          }}
        >
          <Plus size={14} weight="bold" />
          Add travel day
        </button>
      </div>
    </div>
  );

  // ── Right Panel Content ───────────────────────────────────────────────────

  let rightContent: React.ReactNode;

  if (adding) {
    rightContent = (
      <AddDayForm onSave={handleAddDay} onCancel={() => setAdding(false)} />
    );
  } else if (!selectedDay) {
    rightContent = (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ border: "2px dashed #3a3a3a" }}
          >
            <Airplane size={24} weight="fill" style={{ color: "#3a3a3a" }} />
          </div>
          <p className="text-base font-bold text-white mb-1">Pick a travel day</p>
          <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
            Select a day from the sidebar or add your first one.
          </p>
        </div>
      </div>
    );
  } else {
    const meta = TRANSPORT_META[selectedDay.transportMode];
    const Icon = meta.Icon;
    const { full: fullDate, weekday, dayOfMonth, monthShort } = formatDate(
      selectedDay.date
    );
    const done = selectedDay.tasks.filter((t) => t.done).length;
    const total = selectedDay.tasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const nextTaskIdx = selectedDay.tasks.findIndex((t) => !t.done);

    rightContent = (
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        {/* Mobile back button */}
        <div className="md:hidden px-4 pt-4">
          <button
            onClick={() => setMobileView("list")}
            className="flex items-center gap-1.5 text-sm font-semibold mb-3"
            style={{ color: "#9CA3AF" }}
          >
            <ArrowLeft size={14} />
            All days
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Day header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                >
                  <Icon size={16} weight="fill" color="white" />
                </div>
                <h2
                  className="text-2xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {selectedDay.label}
                </h2>
              </div>
              <p className="text-sm font-medium ml-12" style={{ color: "#9CA3AF" }}>
                {fullDate}
              </p>
            </div>

            {/* Planning / Day of toggle */}
            <div
              className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: "#1e1e1e", border: "1px solid #3a3a3a" }}
            >
              <button
                onClick={() => setViewMode("planning")}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: viewMode === "planning" ? "#3a3a3a" : "transparent",
                  color: viewMode === "planning" ? "white" : "#9CA3AF",
                }}
              >
                Planning
              </button>
              <button
                onClick={() => setViewMode("dayof")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: viewMode === "dayof" ? "#FF2D8B" : "transparent",
                  color: viewMode === "dayof" ? "white" : "#9CA3AF",
                }}
              >
                <SunHorizon size={12} weight="fill" />
                Day of
              </button>
            </div>
          </div>

          {/* Mode description banner */}
          {viewMode === "planning" ? (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" }}>
              <PencilSimple size={14} weight="fill" style={{ color: "#9CA3AF", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs font-medium leading-snug" style={{ color: "#9CA3AF" }}>
                <span className="font-bold" style={{ color: "white" }}>Planning mode</span> — Edit and reorder your task list, add custom steps, and get everything set before the travel day arrives.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,140,0,0.08)", border: "1px solid rgba(255,140,0,0.25)" }}>
              <SunHorizon size={14} weight="fill" style={{ color: "#FF8C00", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs font-medium leading-snug" style={{ color: "#FF8C00" }}>
                <span className="font-bold">Day of mode</span> — Editing is locked. Tasks are larger for easier tapping on the go. Work through the list and tap each step to check it off.
              </p>
            </div>
          )}

          {/* Transport info card */}
          <DarkCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: meta.color }}
              >
                {meta.label} Details
              </span>
              {selectedDay.serviceNumber && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: meta.color + "22", color: meta.color }}
                >
                  {selectedDay.serviceNumber}
                </span>
              )}
              {selectedDay.carrier && (
                <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                  · {selectedDay.carrier}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Departure */}
              <div className="flex-1">
                <p
                  className="text-xs font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9CA3AF" }}
                >
                  Depart
                </p>
                {selectedDay.departureTime && (
                  <p className="text-lg font-bold text-white leading-tight">
                    {selectedDay.departureTime}
                  </p>
                )}
                {selectedDay.departureLocation && (
                  <p className="text-xs font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
                    {selectedDay.departureLocation}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <div style={{ color: "#3a3a3a" }}>
                <ArrowRight size={18} weight="bold" />
              </div>

              {/* Arrival */}
              <div className="flex-1 text-right">
                <p
                  className="text-xs font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9CA3AF" }}
                >
                  Arrive
                </p>
                {selectedDay.arrivalTime && (
                  <p className="text-lg font-bold text-white leading-tight">
                    {selectedDay.arrivalTime}
                  </p>
                )}
                {selectedDay.arrivalLocation && (
                  <p className="text-xs font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
                    {selectedDay.arrivalLocation}
                  </p>
                )}
              </div>
            </div>
          </DarkCard>

          {/* Task timeline */}
          <DarkCard className="p-4" style={{ borderColor: viewMode === "dayof" ? "rgba(255,140,0,0.4)" : "#3a3a3a" }}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "#FF2D8B" }}
                >
                  Checklist
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: pct === 100 ? "#FF8C00" + "22" : "#3a3a3a",
                    color: pct === 100 ? "#FF8C00" : "#9CA3AF",
                  }}
                >
                  {done}/{total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full overflow-hidden"
                  style={{ width: 80, height: 4, backgroundColor: "#3a3a3a" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct === 100 ? "#FF8C00" : "#FF2D8B",
                    }}
                  />
                </div>
                <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                  {pct}%
                </span>
              </div>
            </div>


            {/* Tasks */}
            <div ref={timelineRef}>
              {selectedDay.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                    No tasks yet. Add your first one below.
                  </p>
                </div>
              ) : (
                selectedDay.tasks.map((task, idx) => (
                  <div key={task.id} data-task={task.id}>
                    <TaskRow
                      task={task}
                      isNext={idx === nextTaskIdx}
                      isLast={idx === selectedDay.tasks.length - 1}
                      dayOfMode={viewMode === "dayof"}
                      onToggle={() => handleToggleTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onRename={(text) => handleRenameTask(task.id, text)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Add task */}
            {viewMode === "planning" && (
              <div className="mt-3 ml-9">
                {addingTask ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTask();
                        if (e.key === "Escape") {
                          setAddingTask(false);
                          setNewTaskText("");
                        }
                      }}
                      placeholder="New task..."
                      className="flex-1 rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#FF2D8B]/60 placeholder-[#555]"
                      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                    />
                    <button
                      onClick={handleAddTask}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#FF2D8B", color: "white" }}
                    >
                      <Check size={14} weight="bold" />
                    </button>
                    <button
                      onClick={() => {
                        setAddingTask(false);
                        setNewTaskText("");
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[#3a3a3a]"
                      style={{ color: "#9CA3AF" }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTask(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full transition-colors hover:bg-[#333333]/60"
                    style={{
                      border: "1px dashed #3a3a3a",
                      color: "#9CA3AF",
                    }}
                  >
                    <Plus size={13} weight="bold" />
                    Add task
                  </button>
                )}
              </div>
            )}

            {/* Done state */}
            {pct === 100 && selectedDay.tasks.length > 0 && (
              <div
                className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
                style={{
                  backgroundColor: "rgba(255,140,0,0.12)",
                  border: "1px solid rgba(255,140,0,0.25)",
                  color: "#FF8C00",
                }}
              >
                <Check size={16} weight="bold" />
                All done. You crushed it.
              </div>
            )}
          </DarkCard>

          {/* Required items */}
          <DarkCard className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#333333]/40"
              onClick={() => setItemsOpen((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Backpack size={14} weight="fill" style={{ color: "#FFD600" }} />
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "#FFD600" }}
                >
                  Required Items
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
                >
                  {selectedDay.requiredItems.length}
                </span>
              </div>
              {itemsOpen ? (
                <CaretDown size={13} style={{ color: "#9CA3AF" }} />
              ) : (
                <CaretRight size={13} style={{ color: "#9CA3AF" }} />
              )}
            </button>

            {itemsOpen && (
              <div className="px-4 pb-4 space-y-2">
                {selectedDay.requiredItems.length === 0 ? (
                  <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                    No required items yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedDay.requiredItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                        style={{
                          backgroundColor: "#1e1e1e",
                          border: "1px solid #3a3a3a",
                          color: "#e5e7eb",
                        }}
                      >
                        <IdentificationCard
                          size={13}
                          weight="fill"
                          style={{ color: "#FFD600", flexShrink: 0 }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs font-medium pt-1" style={{ color: "#555" }}>
                  These items are pulled from your packing list and pre-departure checklist.
                </p>
              </div>
            )}
          </DarkCard>

          {/* Notes */}
          <DarkCard className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#333333]/40"
              onClick={() => setNotesOpen((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Note size={14} weight="fill" style={{ color: "#9CA3AF" }} />
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "#9CA3AF" }}
                >
                  Notes
                </span>
              </div>
              {notesOpen ? (
                <CaretDown size={13} style={{ color: "#9CA3AF" }} />
              ) : (
                <CaretRight size={13} style={{ color: "#9CA3AF" }} />
              )}
            </button>

            {notesOpen && (
              <div className="px-4 pb-4">
                <textarea
                  value={selectedDay.notes}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  placeholder="Any notes for this travel day..."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/50 transition-colors resize-none placeholder-[#555]"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                />
              </div>
            )}
          </DarkCard>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .td-left  { display: ${mobileView === "list" ? "flex" : "none"} !important; width: 100% !important; height: auto !important; position: static !important; border-right: none !important; }
          .td-right { display: ${mobileView === "detail" ? "flex" : "none"} !important; }
        }
      `}</style>

      <div className="flex flex-col" style={{ height: "calc(100vh - 56px)", backgroundColor: "#404040" }}>

        {/* Header band */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ backgroundColor: "#282828", borderBottom: "1px solid #333333" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-fredoka)", fontSize: "2rem", color: "white", lineHeight: 1.1 }}>Travel Days</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>Apr 1 · Apr 8 · Apr 15</p>
          </div>
          <button
            onClick={() => { setAdding(true); setSelectedId(""); setMobileView("detail"); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:translate-y-0.5"
            style={{ backgroundColor: "#FF2D8B", color: "white", boxShadow: "0 4px 0 #991b5c" }}
          >
            <Plus size={14} weight="bold" />
            Add travel day
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #2a2a2a" }}>
          {[
            { value: days.length,  label: "Travel days",  color: "#00A8CC" },
            { value: totalTasks,   label: "Total tasks",  color: "#FF2D8B" },
            { value: doneTasks,    label: "Tasks done",   color: "#00C96B" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a" }}>
              <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "#9CA3AF" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Two-panel area */}
        <div className="flex flex-1 min-h-0">
          <div className="td-left hidden md:flex flex-col">{leftPanel}</div>
          <div className="td-right flex-1 flex flex-col overflow-hidden">{rightContent}</div>
        </div>

      </div>
    </>
  );
}
