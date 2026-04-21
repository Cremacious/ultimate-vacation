"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  CalendarBlank,
  PencilSimple,
  Trash,
  Plus,
  Mountains,
  ForkKnife,
  Airplane,
  CalendarCheck,
  Car,
  Note,
  MapPin,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { ConflictToast } from "@/components/ConflictToast";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  type ItineraryActionState,
} from "@/lib/itinerary/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SerializedEvent = {
  id: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  title: string;
  category: string;
  location: string | null;
  notes: string | null;
  updatedAt: string; // ISO string serialized from server Date
};

export type ItineraryShellProps = {
  tripId: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  initialEvents: SerializedEvent[];
  canEdit: boolean;
  initialDate?: string;
};

// ─── Category meta ────────────────────────────────────────────────────────────

type ICategory = "activity" | "meal" | "reservation" | "flight" | "transport" | "note" | "other";

const CATEGORY_META: Record<ICategory, { label: string; Icon: PhosphorIcon; color: string }> = {
  activity:    { label: "Activity",    Icon: Mountains,     color: "#FF3DA7" },
  meal:        { label: "Meal",        Icon: ForkKnife,     color: "#FFEB00" },
  reservation: { label: "Reservation", Icon: CalendarCheck, color: "#B14DFF" },
  flight:      { label: "Flight",      Icon: Airplane,      color: "#00E5FF" },
  transport:   { label: "Transport",   Icon: Car,           color: "#FF9236" },
  note:        { label: "Note",        Icon: Note,          color: "#D1D2E8" },
  other:       { label: "Other",       Icon: MapPin,        color: "#6C6E8A" },
};

function categoryMeta(cat: string) {
  return CATEGORY_META[(cat as ICategory)] ?? CATEGORY_META.other;
}

// ─── Trip day generation ──────────────────────────────────────────────────────

type TripDay = {
  date: string;
  dayNum: number;
  total: number;
  weekday: string;
  dayOfMonth: number;
  monthShort: string;
};

function generateDays(startDate: string, endDate: string): TripDay[] {
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days: TripDay[] = [];
  const start = new Date(startDate + "T12:00:00Z");
  const end   = new Date(endDate   + "T12:00:00Z");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return days;
  const total = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  let cur = new Date(start);
  let n = 1;
  while (cur <= end) {
    const d = cur.toISOString().slice(0, 10);
    days.push({
      date: d,
      dayNum: n,
      total,
      weekday: WD[cur.getUTCDay()],
      dayOfMonth: cur.getUTCDate(),
      monthShort: MO[cur.getUTCMonth()],
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
    n++;
  }
  return days;
}

// ─── Primitive components ─────────────────────────────────────────────────────

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
      className={`w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00E5FF] placeholder-white/20 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }}
    />
  );
}

// ─── CategoryPills ────────────────────────────────────────────────────────────

function CategoryPills({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">
        Category
      </p>
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(CATEGORY_META) as [ICategory, (typeof CATEGORY_META)[ICategory]][]).map(
          ([key, meta]) => {
            const active = value === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black transition-all border"
                style={{
                  backgroundColor: active ? `${meta.color}22` : "transparent",
                  borderColor: active ? meta.color : "#484848",
                  color: active ? meta.color : "rgba(255,255,255,0.5)",
                }}
              >
                <meta.Icon size={11} weight="fill" />
                {meta.label}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

// ─── AddEventForm ─────────────────────────────────────────────────────────────

function AddEventForm({
  tripId,
  dayDate,
  formAction,
  pending,
  state,
  onCancel,
}: {
  tripId: string;
  dayDate: string;
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: ItineraryActionState;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState("activity");

  return (
    <DarkCard className="p-5">
      <p className="text-sm font-black text-white mb-4">New event</p>
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="eventDate" value={dayDate} />
        <input type="hidden" name="category" value={category} />

        <FieldInput
          name="title"
          placeholder="Event title"
          required
          maxLength={200}
          autoFocus
        />
        <CategoryPills value={category} onChange={setCategory} />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
              Start
            </p>
            <FieldInput name="startTime" type="time" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
              End
            </p>
            <FieldInput name="endTime" type="time" />
          </div>
        </div>

        <FieldInput name="location" placeholder="Location (optional)" maxLength={300} />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          maxLength={1000}
          className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00E5FF] placeholder-white/20 resize-none"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
        />

        {state.error && (
          <p role="alert" className="text-xs font-semibold text-[#FF3DA7]">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2 rounded-[10px] text-sm font-black transition-colors disabled:opacity-60"
            style={{ backgroundColor: "#00E5FF", color: "#0a0a12" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </DarkCard>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────

function EventCard({
  event,
  tripId,
  isEditing,
  onEditStart,
  onEditCancel,
  updateFormAction,
  updatePending,
  updateState,
  canEdit,
}: {
  event: SerializedEvent;
  tripId: string;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  updateFormAction: (formData: FormData) => void;
  updatePending: boolean;
  updateState: ItineraryActionState;
  canEdit: boolean;
}) {
  const [draftCategory, setDraftCategory] = useState(event.category);
  const [deletePending, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (isEditing) setDraftCategory(event.category);
  }, [isEditing, event.category]);

  function handleDelete() {
    const fd = new FormData();
    fd.set("tripId", tripId);
    fd.set("eventId", event.id);
    startDeleteTransition(async () => {
      await deleteEventAction({}, fd);
      onEditCancel();
    });
  }

  const meta = categoryMeta(event.category);
  const { Icon, color, label } = meta;
  const draftMeta = categoryMeta(draftCategory);

  if (isEditing) {
    return (
      <DarkCard className="overflow-hidden flex-1">
        <div style={{ height: "3px", backgroundColor: draftMeta.color }} />
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm font-black text-white">Edit event</p>
          <form action={updateFormAction} className="flex flex-col gap-3">
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="eventId" value={event.id} />
            <input type="hidden" name="knownUpdatedAt" value={event.updatedAt} />
            <input type="hidden" name="category" value={draftCategory} />

            <FieldInput
              name="title"
              defaultValue={event.title}
              placeholder="Event title"
              required
              maxLength={200}
            />
            <CategoryPills value={draftCategory} onChange={setDraftCategory} />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                  Start
                </p>
                <FieldInput name="startTime" type="time" defaultValue={event.startTime ?? ""} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                  End
                </p>
                <FieldInput name="endTime" type="time" defaultValue={event.endTime ?? ""} />
              </div>
            </div>

            <FieldInput
              name="location"
              defaultValue={event.location ?? ""}
              placeholder="Location (optional)"
              maxLength={300}
            />
            <textarea
              name="notes"
              defaultValue={event.notes ?? ""}
              placeholder="Notes (optional)"
              maxLength={1000}
              className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00E5FF] placeholder-white/20 resize-none"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
            />

            {updateState.error && (
              <p role="alert" className="text-xs font-semibold text-[#FF3DA7]">
                {updateState.error}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletePending}
                className="flex items-center gap-1.5 text-sm font-black transition-colors disabled:opacity-50"
                style={{ color: "#ef4444" }}
              >
                <Trash size={14} weight="fill" />
                {deletePending ? "Deleting…" : "Delete"}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onEditCancel}
                  className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePending}
                  className="px-5 py-2 rounded-[10px] text-sm font-black transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "#00E5FF", color: "#0a0a12" }}
                >
                  {updatePending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </DarkCard>
    );
  }

  // ── Compact view ───────────────────────────────────────────────────────────
  return (
    <DarkCard className="overflow-hidden flex-1">
      <div style={{ height: "3px", backgroundColor: color }} />
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
              style={{ backgroundColor: `${color}18`, borderColor: `${color}40`, color }}
            >
              <Icon size={10} weight="fill" />
              {label}
            </span>
            {(event.startTime || event.endTime) && (
              <span
                className="text-[10px] font-black"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {event.startTime ?? ""}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </span>
            )}
          </div>
          {canEdit && (
            <button
              onClick={onEditStart}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)" }}
              aria-label={`Edit ${event.title}`}
            >
              <PencilSimple size={13} weight="fill" />
            </button>
          )}
        </div>

        <p className="text-sm font-black text-white mb-1.5 leading-snug">{event.title}</p>

        {event.location && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin
              size={10}
              weight="fill"
              style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
            />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {event.location}
            </span>
          </div>
        )}

        {event.notes && (
          <p
            className="text-[10px] truncate max-w-[200px]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {event.notes.length > 80 ? event.notes.slice(0, 80) + "…" : event.notes}
          </p>
        )}
      </div>
    </DarkCard>
  );
}

// ─── ItineraryShell ───────────────────────────────────────────────────────────

export default function ItineraryShell({
  tripId,
  startDate,
  endDate,
  initialEvents,
  canEdit,
  initialDate,
}: ItineraryShellProps) {
  const tripDays = generateDays(startDate, endDate);

  const defaultDay =
    initialDate && tripDays.some((d) => d.date === initialDate)
      ? initialDate
      : (tripDays[0]?.date ?? "");

  const [activeDayDate, setActiveDayDate] = useState(defaultDay);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [addingEvent, setAddingEvent] = useState(false);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [showConflictToast, setShowConflictToast] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");

  const [createState, createFormAction, createPending] = useActionState(
    createEventAction,
    {}
  );
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateEventAction,
    {}
  );

  // Close add form on successful create.
  useEffect(() => {
    if (createState.ok) setAddingEvent(false);
  }, [createState]);

  // Close edit form; show conflict toast if detected.
  useEffect(() => {
    if (updateState.ok) {
      setActiveEditId(null);
      if (updateState.conflict) {
        setConflictMessage(
          `Someone updated "${updateState.conflictEventTitle ?? "this event"}" while you were editing. Your version was saved.`
        );
        setShowConflictToast(true);
      }
    }
  }, [updateState]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const daysWithEvents = tripDays.filter((d) =>
    initialEvents.some((e) => e.eventDate === d.date)
  ).length;
  const coveragePct =
    tripDays.length > 0 ? Math.round((daysWithEvents / tripDays.length) * 100) : 0;
  const coverageLabel =
    coveragePct === 0
      ? "None"
      : coveragePct < 50
      ? "Partial"
      : coveragePct < 85
      ? "Good"
      : "Complete";
  const coverageColor =
    coveragePct === 0
      ? "#9CA3AF"
      : coveragePct < 50
      ? "#FF9236"
      : coveragePct < 85
      ? "#FFEB00"
      : "#39FF6B";

  // ── Active day data ────────────────────────────────────────────────────────
  const activeDay = tripDays.find((d) => d.date === activeDayDate) ?? tripDays[0];
  const dayEvents = initialEvents
    .filter((e) => e.eventDate === activeDayDate)
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

  const formattedDate = activeDayDate
    ? new Date(activeDayDate + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";

  // ── Day list panel ─────────────────────────────────────────────────────────
  const DayListPanel = (
    <div className="flex flex-col h-full">
      <div
        className="px-4 pt-4 pb-3 border-b"
        style={{ borderColor: "#333333" }}
      >
        <p
          className="text-[11px] font-black"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {tripDays.length} days · {startDate} – {endDate}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {tripDays.map((day) => {
          const isActive = day.date === activeDayDate;
          const count = initialEvents.filter((e) => e.eventDate === day.date).length;
          return (
            <button
              key={day.date}
              onClick={() => {
                setActiveDayDate(day.date);
                setMobileView("detail");
                setAddingEvent(false);
                setActiveEditId(null);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] mx-1 transition-all text-left"
              style={{
                width: "calc(100% - 8px)",
                backgroundColor: isActive ? "rgba(0,229,255,0.08)" : "transparent",
                border: isActive
                  ? "1px solid rgba(0,229,255,0.2)"
                  : "1px solid transparent",
              }}
            >
              <div
                className="rounded-full flex-shrink-0"
                style={{ width: "8px", height: "8px", backgroundColor: "#00E5FF" }}
              />

              <div
                className="flex flex-col items-center leading-none flex-shrink-0"
                style={{ minWidth: "32px" }}
              >
                <span
                  className="uppercase tracking-widest"
                  style={{
                    fontSize: "9px",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {day.weekday}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontFamily: "var(--font-fredoka)",
                    color: isActive ? "#00E5FF" : "white",
                    lineHeight: 1,
                  }}
                >
                  {day.dayOfMonth}
                </span>
                <span
                  className="uppercase tracking-widest"
                  style={{
                    fontSize: "9px",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {day.monthShort}
                </span>
              </div>

              <div className="flex-1 min-w-0" />

              {count > 0 ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(0,229,255,0.15)",
                    color: "#00E5FF",
                  }}
                >
                  {count}
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

  // ── Day timeline panel ─────────────────────────────────────────────────────
  const DayTimelinePanel = (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden px-4 pt-4 pb-2">
        <button
          onClick={() => setMobileView("list")}
          className="flex items-center gap-2 text-sm font-black transition-colors"
          style={{ color: "#00E5FF" }}
        >
          ← All Days
        </button>
      </div>

      <div className="px-5 pt-5 pb-4">
        <h2
          className="text-white leading-tight mb-1"
          style={{ fontSize: "26px", fontFamily: "var(--font-fredoka)" }}
        >
          {formattedDate}
        </h2>
        {activeDay && (
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-black border"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "#3a3a3a",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Day {activeDay.dayNum} of {activeDay.total}
            </span>
          </div>
        )}
        <div
          className="mt-3 rounded-full"
          style={{ height: "3px", width: "48px", backgroundColor: "#00E5FF" }}
        />
      </div>

      <div className="px-5 pb-6">
        {dayEvents.length === 0 && !addingEvent ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ width: "72px", height: "72px", borderColor: "#3a3a3a" }}
            >
              <CalendarBlank
                size={28}
                weight="fill"
                style={{ color: "rgba(255,255,255,0.2)" }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white/40">
                Nothing planned for {formattedDate}
              </p>
              <p className="text-xs text-white/25 mt-1">
                {canEdit ? "Be the first to add something." : "Check back later."}
              </p>
            </div>
            {canEdit && (
              <button
                onClick={() => setAddingEvent(true)}
                className="flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-black transition-colors"
                style={{ backgroundColor: "#00E5FF", color: "#0a0a12" }}
              >
                <Plus size={14} weight="bold" />
                Add the first event
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dayEvents.map((event) => (
              <div key={event.id} className="flex gap-3 items-start">
                <div
                  className="flex flex-col items-end pt-3.5 flex-shrink-0"
                  style={{ width: "56px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {event.startTime ?? ""}
                  </span>
                  {event.endTime && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {event.endTime}
                    </span>
                  )}
                </div>

                <EventCard
                  event={event}
                  tripId={tripId}
                  isEditing={activeEditId === event.id}
                  onEditStart={() => { setActiveEditId(event.id); setAddingEvent(false); }}
                  onEditCancel={() => setActiveEditId(null)}
                  updateFormAction={updateFormAction}
                  updatePending={updatePending}
                  updateState={activeEditId === event.id ? updateState : {}}
                  canEdit={canEdit}
                />
              </div>
            ))}

            {addingEvent && canEdit && (
              <div className="flex gap-3 items-start">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <div className="flex-1">
                  <AddEventForm
                    tripId={tripId}
                    dayDate={activeDayDate}
                    formAction={createFormAction}
                    pending={createPending}
                    state={createState}
                    onCancel={() => setAddingEvent(false)}
                  />
                </div>
              </div>
            )}

            {!addingEvent && canEdit && (
              <div className="flex gap-3 items-start mt-2">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <button
                  onClick={() => { setAddingEvent(true); setActiveEditId(null); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-[18px] py-4 border-2 border-dashed text-sm font-black transition-all hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#404040" }}>
      {/* Page header */}
      <div
        className="sticky top-14 z-10 border-b px-5 py-4 flex items-center justify-between gap-4"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "var(--font-fredoka)",
              color: "white",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Itinerary
          </h1>
          <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
            {canEdit ? "Trusted members can edit" : "View only"}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {[
              { value: initialEvents.length, label: "Events",       color: "#00E5FF" },
              { value: daysWithEvents,        label: "Days",         color: "#B14DFF" },
              { value: `${coveragePct}%`,     label: coverageLabel,  color: coverageColor },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center px-3 py-1.5 rounded-xl border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "#3a3a3a",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    fontSize: "1.1rem",
                    color: s.color,
                    lineHeight: 1,
                    fontWeight: 900,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                  style={{ color: "#555" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {canEdit && (
            <button
              onClick={() => { setAddingEvent(true); setActiveEditId(null); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
              style={{
                backgroundColor: "#00E5FF",
                color: "#0a0a12",
                boxShadow: "0 4px 0 #007a8f",
              }}
            >
              <Plus size={14} weight="bold" />
              Add event
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 relative">
        {/* Desktop: two-panel */}
        <div
          className="hidden md:flex flex-col border-r flex-shrink-0"
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
        <div
          className="hidden md:flex flex-1 flex-col"
          style={{ overflowY: "auto" }}
        >
          {DayTimelinePanel}
        </div>

        {/* Mobile: single-panel */}
        <div className="md:hidden flex-1 flex flex-col">
          {mobileView === "list" ? (
            <div
              className="flex flex-col"
              style={{ backgroundColor: "#252525", minHeight: "100%" }}
            >
              {DayListPanel}
            </div>
          ) : (
            <div
              className="flex flex-col"
              style={{ backgroundColor: "#1e1e1e", minHeight: "100%" }}
            >
              {DayTimelinePanel}
            </div>
          )}
        </div>
      </div>

      {/* Conflict toast */}
      {showConflictToast && (
        <ConflictToast
          message={conflictMessage}
          onDismiss={() => setShowConflictToast(false)}
        />
      )}
    </div>
  );
}
