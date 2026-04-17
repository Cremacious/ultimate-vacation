"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarBlank, PencilSimple, Trash, ArrowLeft, Plus, Check, MapPin,
} from "@phosphor-icons/react";
import {
  type EventCategory,
  type ScheduleEvent,
  type TripDay,
  CATEGORY_META,
  DEST_RANGES,
  TRIP_DAYS,
  MOCK_EVENTS,
} from "@/lib/schedule";

// ─── Primitive Components ─────────────────────────────────────────────────────

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
      className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}
    >
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

// ─── AddEventForm ─────────────────────────────────────────────────────────────

interface AddEventFormProps {
  dayDate: string;
  onAdd: (ev: Omit<ScheduleEvent, "id">) => void;
  onCancel: () => void;
}

function AddEventForm({ dayDate, onAdd, onCancel }: AddEventFormProps) {
  const [title, setTitle]         = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime]     = useState("10:00");
  const [category, setCategory]   = useState<EventCategory>("sightseeing");
  const [location, setLocation]   = useState("");
  const [cost, setCost]           = useState("");
  const [notes, setNotes]         = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleSave() {
    if (!title.trim()) return;
    onAdd({ dayDate, title, startTime, endTime, category, location, notes, cost, confirmed });
  }

  return (
    <DarkCard className="p-5">
      <p className="text-sm font-black text-white mb-4">New Event</p>
      <div className="flex flex-col gap-3">
        <FieldInput
          placeholder="Event title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(
              ([key, meta]) => {
                const { Icon, label, color } = meta;
                const active = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black transition-all border"
                    style={{
                      backgroundColor: active ? `${color}22` : "transparent",
                      borderColor: active ? color : "#484848",
                      color: active ? color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <Icon size={11} weight="fill" />
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Start</p>
            <FieldInput type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">End</p>
            <FieldInput type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <FieldInput
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        <FieldInput
          placeholder="Cost (e.g. ¥3,200)"
          value={cost}
          onChange={e => setCost(e.target.value)}
        />

        <textarea
          placeholder="Notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 resize-none"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
        />

        <button
          onClick={() => setConfirmed(c => !c)}
          className="flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-[11px] font-black transition-all"
          style={{
            backgroundColor: confirmed ? "rgba(0,201,107,0.15)" : "transparent",
            borderColor: confirmed ? "#00C96B" : "#484848",
            color: confirmed ? "#00C96B" : "rgba(255,255,255,0.4)",
          }}
        >
          <Check size={11} weight="bold" />
          {confirmed ? "Confirmed" : "Mark as confirmed"}
        </button>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-[10px] text-sm font-black text-white transition-colors"
            style={{ backgroundColor: "#00A8CC" }}
          >
            Save
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: ScheduleEvent;
  onSave: (updated: ScheduleEvent) => void;
  onRemove: (id: string) => void;
}

function EventCard({ event, onSave, onRemove }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ScheduleEvent>(event);

  const meta = CATEGORY_META[event.category];
  const { Icon, color, label } = meta;

  function handleSave() {
    onSave(draft);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(event);
    setIsEditing(false);
  }

  if (isEditing) {
    const draftMeta = CATEGORY_META[draft.category];
    return (
      <DarkCard className="overflow-hidden flex-1">
        <div style={{ height: "3px", backgroundColor: draftMeta.color }} />
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm font-black text-white">Edit Event</p>

          <FieldInput
            placeholder="Event title"
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
          />

          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(
                ([key, m]) => {
                  const active = draft.category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDraft(d => ({ ...d, category: key }))}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black transition-all border"
                      style={{
                        backgroundColor: active ? `${m.color}22` : "transparent",
                        borderColor: active ? m.color : "#484848",
                        color: active ? m.color : "rgba(255,255,255,0.5)",
                      }}
                    >
                      <m.Icon size={11} weight="fill" />
                      {m.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Start</p>
              <FieldInput
                type="time"
                value={draft.startTime}
                onChange={e => setDraft(d => ({ ...d, startTime: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">End</p>
              <FieldInput
                type="time"
                value={draft.endTime ?? ""}
                onChange={e => setDraft(d => ({ ...d, endTime: e.target.value || undefined }))}
              />
            </div>
          </div>

          <FieldInput
            placeholder="Location"
            value={draft.location}
            onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
          />

          <FieldInput
            placeholder="Cost (e.g. ¥3,200)"
            value={draft.cost}
            onChange={e => setDraft(d => ({ ...d, cost: e.target.value }))}
          />

          <textarea
            placeholder="Notes..."
            value={draft.notes}
            onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
            className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 resize-none"
            style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
          />

          <button
            onClick={() => setDraft(d => ({ ...d, confirmed: !d.confirmed }))}
            className="flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-[11px] font-black transition-all"
            style={{
              backgroundColor: draft.confirmed ? "rgba(0,201,107,0.15)" : "transparent",
              borderColor: draft.confirmed ? "#00C96B" : "#484848",
              color: draft.confirmed ? "#00C96B" : "rgba(255,255,255,0.4)",
            }}
          >
            <Check size={11} weight="bold" />
            {draft.confirmed ? "Confirmed" : "Mark as confirmed"}
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onRemove(event.id)}
              className="flex items-center gap-1.5 text-sm font-black transition-colors"
              style={{ color: "#ef4444" }}
            >
              <Trash size={14} weight="fill" />
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-[10px] text-sm font-black text-white transition-colors"
                style={{ backgroundColor: "#00A8CC" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </DarkCard>
    );
  }

  // Compact view
  return (
    <DarkCard className="overflow-hidden flex-1">
      <div style={{ height: "3px", backgroundColor: color }} />
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: `${color}40`,
                color,
              }}
            >
              <Icon size={10} weight="fill" />
              {label}
            </span>
            <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.35)" }}>
              {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {event.confirmed ? (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(0,201,107,0.12)",
                  borderColor: "rgba(0,201,107,0.3)",
                  color: "#00C96B",
                }}
              >
                <Check size={9} weight="bold" />
                Confirmed
              </span>
            ) : (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(255,140,0,0.1)",
                  borderColor: "rgba(255,140,0,0.25)",
                  color: "#FF8C00",
                }}
              >
                Tentative
              </span>
            )}
            <button
              onClick={() => { setDraft(event); setIsEditing(true); }}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <PencilSimple size={13} weight="fill" />
            </button>
          </div>
        </div>

        <p className="text-sm font-black text-white mb-1.5 leading-snug">{event.title}</p>

        {event.location && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={10} weight="fill" style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{event.location}</span>
          </div>
        )}

        {(event.cost || event.notes) && (
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {event.cost && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(255,214,0,0.1)",
                  borderColor: "rgba(255,214,0,0.25)",
                  color: "#FFD600",
                }}
              >
                {event.cost}
              </span>
            )}
            {event.notes && (
              <span
                className="text-[10px] truncate max-w-[180px]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {event.notes.slice(0, 60)}{event.notes.length > 60 ? "…" : ""}
              </span>
            )}
          </div>
        )}
      </div>
    </DarkCard>
  );
}

// ─── ItineraryShell ───────────────────────────────────────────────────────────

interface ItineraryShellProps {
  tripId: string;
  initialDate?: string;
}

export default function ItineraryShell({ tripId, initialDate }: ItineraryShellProps) {
  const base = `/app/trips/${tripId}`;

  const [events, setEvents]               = useState<ScheduleEvent[]>(MOCK_EVENTS);
  const [activeDayDate, setActiveDayDate] = useState(initialDate ?? "2025-04-03");
  const [mobileView, setMobileView]       = useState<"list" | "detail">("list");
  const [addingEvent, setAddingEvent]     = useState(false);

  // ── Derived coverage ───────────────────────────────────────────────────────
  const daysWithEvents  = TRIP_DAYS.filter(d => events.some(e => e.dayDate === d.date)).length;
  const coveragePct     = Math.round((daysWithEvents / TRIP_DAYS.length) * 100);
  const coverageLabel   = coveragePct === 0 ? "None" : coveragePct < 50 ? "Partial" : coveragePct < 85 ? "Good" : "Complete";
  const coverageColor   = coveragePct === 0 ? "#9CA3AF" : coveragePct < 50 ? "#FF8C00" : coveragePct < 85 ? "#FFD600" : "#00C96B";
  const totalEventCount = events.length;

  // ── Event handlers ─────────────────────────────────────────────────────────
  function addEvent(ev: Omit<ScheduleEvent, "id">) {
    setEvents(prev => [...prev, { ...ev, id: Date.now().toString() }]);
    setAddingEvent(false);
  }

  function saveEvent(updated: ScheduleEvent) {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  }

  function removeEvent(id: string) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  // ── Active day data ────────────────────────────────────────────────────────
  const activeDay = TRIP_DAYS.find(d => d.date === activeDayDate) ?? TRIP_DAYS[0];
  const dayEvents = events
    .filter(e => e.dayDate === activeDayDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formattedDate = new Date(activeDayDate + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // ── Day List Panel ─────────────────────────────────────────────────────────
  const DayListPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "#333333" }}>
        <p className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.4)" }}>
          Japan Spring 2025 · Apr 1–15 · 15 days
        </p>
        <div className="flex items-center gap-3 mt-2">
          {DEST_RANGES.map(dest => (
            <div key={dest.name} className="flex items-center gap-1.5">
              <div className="rounded-full w-2 h-2 flex-shrink-0" style={{ backgroundColor: dest.color }} />
              <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.4)" }}>
                {dest.short}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-dark py-2">
        {TRIP_DAYS.map((day: TripDay) => {
          const isActive = day.date === activeDayDate;
          const dayEventsCount = events.filter(e => e.dayDate === day.date).length;

          return (
            <button
              key={day.date}
              onClick={() => {
                setActiveDayDate(day.date);
                setMobileView("detail");
                setAddingEvent(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] mx-1 transition-all text-left"
              style={{
                width: "calc(100% - 8px)",
                backgroundColor: isActive ? "rgba(0,168,204,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(0,168,204,0.2)" : "1px solid transparent",
              }}
            >
              <div
                className="rounded-full flex-shrink-0"
                style={{ width: "8px", height: "8px", backgroundColor: day.destColor }}
              />

              <div className="flex flex-col items-center leading-none flex-shrink-0" style={{ minWidth: "32px" }}>
                <span
                  className="uppercase tracking-widest leading-none"
                  style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.35)" }}
                >
                  {day.weekday}
                </span>
                <span
                  className="leading-tight"
                  style={{ fontSize: "20px", fontFamily: "var(--font-fredoka)", color: isActive ? "#00A8CC" : "white", lineHeight: 1 }}
                >
                  {day.dayOfMonth}
                </span>
                <span
                  className="uppercase tracking-widest leading-none"
                  style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.35)" }}
                >
                  {day.monthShort}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-black truncate"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {day.destination.split(",")[0]}
                </p>
              </div>

              {dayEventsCount > 0 ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black flex-shrink-0"
                  style={{ backgroundColor: `${day.destColor}22`, color: day.destColor }}
                >
                  {dayEventsCount}
                </span>
              ) : (
                <span
                  className="text-[11px] font-black flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  —
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Day Timeline Panel ─────────────────────────────────────────────────────
  const DayTimelinePanel = (
    <div className="flex-1 overflow-y-auto scrollbar-dark">
      <div className="md:hidden px-4 pt-4 pb-2">
        <button
          onClick={() => setMobileView("list")}
          className="flex items-center gap-2 text-sm font-black transition-colors"
          style={{ color: "#00A8CC" }}
        >
          <ArrowLeft size={16} weight="bold" />
          All Days
        </button>
      </div>

      {/* Day header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-white leading-tight mb-1"
            style={{ fontSize: "26px", fontFamily: "var(--font-fredoka)" }}
          >
            {formattedDate}
          </h2>

          {/* Cross-nav to Vacation Days */}
          <Link
            href={`${base}/vacation-days?date=${activeDayDate}`}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[11px] font-black transition-all border hover:border-[#00A8CC]/50 hover:text-[#00A8CC]"
            style={{ borderColor: "#3a3a3a", color: "rgba(255,255,255,0.4)", backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <CalendarBlank size={11} weight="fill" />
            Day View
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{ width: "8px", height: "8px", backgroundColor: activeDay.destColor }}
            />
            <span className="text-sm font-black" style={{ color: "rgba(255,255,255,0.55)" }}>
              {activeDay.destination}
            </span>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-black border"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "#3a3a3a",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Day {activeDay.dayNum} of {TRIP_DAYS.length}
          </span>
        </div>

        <div
          className="mt-3 rounded-full"
          style={{ height: "3px", width: "48px", backgroundColor: activeDay.destColor }}
        />
      </div>

      {/* Events or empty state */}
      <div className="px-5 pb-6">
        {dayEvents.length === 0 && !addingEvent ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ width: "72px", height: "72px", borderColor: "#3a3a3a" }}
            >
              <CalendarBlank size={28} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white/40">No events for {formattedDate}</p>
              <p className="text-xs text-white/25 mt-1">Be the first to add something</p>
            </div>
            <button
              onClick={() => setAddingEvent(true)}
              className="flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-black text-white transition-colors"
              style={{ backgroundColor: "#00A8CC" }}
            >
              <Plus size={14} weight="bold" />
              Add the first event
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dayEvents.map(event => (
              <div key={event.id} className="flex gap-3 items-start">
                <div
                  className="flex flex-col items-end pt-3.5 flex-shrink-0"
                  style={{ width: "56px" }}
                >
                  <span
                    className="leading-none"
                    style={{ fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.4)" }}
                  >
                    {event.startTime}
                  </span>
                  {event.endTime && (
                    <span
                      className="leading-none mt-0.5"
                      style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.25)" }}
                    >
                      {event.endTime}
                    </span>
                  )}
                </div>

                <EventCard
                  event={event}
                  onSave={saveEvent}
                  onRemove={removeEvent}
                />
              </div>
            ))}

            {addingEvent && (
              <div className="flex gap-3 items-start">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <div className="flex-1">
                  <AddEventForm
                    dayDate={activeDayDate}
                    onAdd={addEvent}
                    onCancel={() => setAddingEvent(false)}
                  />
                </div>
              </div>
            )}

            {!addingEvent && (
              <div className="flex gap-3 items-start mt-2">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <button
                  onClick={() => setAddingEvent(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-[18px] py-4 border-2 border-dashed text-sm font-black transition-all hover:border-[#00A8CC]/50 hover:text-[#00A8CC]"
                  style={{ borderColor: "#3a3a3a", color: "rgba(255,255,255,0.3)" }}
                >
                  <Plus size={14} weight="bold" />
                  Add event for {formattedDate}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#1e1e1e" }}>
      {/* Page header */}
      <div
        className="sticky top-14 z-10 border-b px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div>
          <h1
            className="text-white leading-tight"
            style={{ fontSize: "clamp(24px, 4vw, 32px)", fontFamily: "var(--font-fredoka)" }}
          >
            Itinerary
          </h1>
          <p className="text-sm font-black mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Day-by-day schedule · Anyone can suggest
          </p>
        </div>

        <div
          className="flex flex-col items-end gap-0.5 rounded-[14px] px-4 py-2.5 border"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "#3a3a3a" }}
        >
          <span className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.35)" }}>
            {totalEventCount} events
          </span>
          <span className="text-sm font-black" style={{ color: coverageColor }}>
            Coverage: {coverageLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 relative">
        {/* Desktop two-panel */}
        <div
          className="hidden md:flex flex-col border-r flex-shrink-0 scrollbar-dark"
          style={{
            width: "260px",
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
            overflowY: "auto",
            backgroundColor: "#252525",
            borderColor: "#333333",
          }}
        >
          {DayListPanel}
        </div>

        <div className="hidden md:flex flex-1 flex-col scrollbar-dark" style={{ overflowY: "auto" }}>
          {DayTimelinePanel}
        </div>

        {/* Mobile single-column */}
        <div className="md:hidden flex-1 flex flex-col">
          {mobileView === "list" ? (
            <div className="flex flex-col" style={{ backgroundColor: "#252525", minHeight: "100%" }}>
              {DayListPanel}
            </div>
          ) : (
            <div className="flex flex-col" style={{ backgroundColor: "#1e1e1e", minHeight: "100%" }}>
              {DayTimelinePanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
