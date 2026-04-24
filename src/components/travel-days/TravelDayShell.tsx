"use client";

import { useState, useTransition, useEffect, useActionState, useRef } from "react";
import {
  Airplane,
  Car,
  Train,
  Boat,
  Bus,
  Trash,
  PencilSimple,
  Check,
  Plus,
  X,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

import {
  createTravelDayAction,
  updateTravelDayLabelAction,
  deleteTravelDayAction,
  createTaskAction,
  toggleTaskDoneAction,
  deleteTaskAction,
  generateFromTripAction,
  type TravelDayActionState,
} from "@/lib/travel-days/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransportMode = "flight" | "drive" | "train" | "cruise" | "bus";

type Task = { id: string; text: string; done: boolean; sortOrder: number };

type TravelDay = {
  id: string;
  date: string;
  label: string;
  transportMode: string;
  tasks: Task[];
};

export type TravelDayShellProps = {
  tripId: string;
  initialDays: TravelDay[];
  canEdit: boolean;
  hasItineraryTransportEvents: boolean;
};

// ─── Transport config (client-only — icons are React components) ──────────────

const TRANSPORT_META: Record<
  TransportMode,
  { label: string; Icon: PhosphorIcon; color: string }
> = {
  flight: { label: "Flight", Icon: Airplane, color: "#FF3DA7" },
  drive: { label: "Drive", Icon: Car, color: "#FF9236" },
  train: { label: "Train", Icon: Train, color: "#00E5FF" },
  cruise: { label: "Cruise", Icon: Boat, color: "#B14DFF" },
  bus: { label: "Bus", Icon: Bus, color: "#6C6E8A" },
};

const TRANSPORT_MODES = Object.keys(TRANSPORT_META) as TransportMode[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function safeMode(mode: string): TransportMode {
  return (TRANSPORT_META[mode as TransportMode] ? mode : "flight") as TransportMode;
}

// ─── QuickAddInput ────────────────────────────────────────────────────────────

function QuickAddInput({
  onSubmit,
  onCollapse,
}: {
  onSubmit: (text: string) => void;
  onCollapse: () => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue("");
    }
  }

  return (
    <div className="mt-2 flex items-center gap-1 min-h-[44px]">
      <div
        className="w-[44px] h-[44px] flex items-center justify-center flex-shrink-0"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        <Plus size={14} />
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCollapse();
        }}
        onBlur={() => {
          if (value.trim()) submit();
          else onCollapse();
        }}
        placeholder="Add a task..."
        maxLength={160}
        aria-label="Add task"
        className="flex-1 bg-transparent border-b text-white text-sm placeholder:text-white/30 focus:outline-none py-1 transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
        onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#00E5FF")}
        onBlurCapture={(e) =>
          ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.2)")
        }
      />
    </div>
  );
}

// ─── TaskRow ──────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  canEdit,
  onToggle,
  onDelete,
}: {
  task: Task;
  canEdit: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggle}
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.text}
        className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center"
      >
        <span
          className="w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors"
          style={{
            borderColor: task.done ? "#00E5FF" : "rgba(255,255,255,0.25)",
            backgroundColor: task.done ? "#00E5FF" : "transparent",
          }}
        >
          {task.done && <Check size={12} weight="bold" style={{ color: "#0A0A12" }} />}
        </span>
      </button>

      <span
        className={`flex-1 text-sm leading-snug ${
          task.done ? "line-through" : ""
        }`}
        style={{ color: task.done ? "rgba(255,255,255,0.4)" : "white" }}
      >
        {task.text}
      </span>

      {canEdit && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete task: ${task.text}`}
          className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")
          }
        >
          <Trash size={16} />
        </button>
      )}
    </div>
  );
}

// ─── TravelDayShell ───────────────────────────────────────────────────────────

export default function TravelDayShell({
  tripId,
  initialDays,
  canEdit,
  hasItineraryTransportEvents,
}: TravelDayShellProps) {
  const [days, setDays] = useState<TravelDay[]>(initialDays);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TransportMode>("flight");
  const [activeAddTaskDayId, setActiveAddTaskDayId] = useState<string | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState("");
  const [confirmDeleteDayId, setConfirmDeleteDayId] = useState<string | null>(null);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  const [createDayState, createDayFormAction, createDayPending] = useActionState<
    TravelDayActionState,
    FormData
  >(createTravelDayAction, {});

  const [generateState, generateFormAction, generatePending] = useActionState<
    TravelDayActionState,
    FormData
  >(generateFromTripAction, {});

  useEffect(() => {
    if (!createDayState.ok || !createDayState.day) return;
    setDays((prev) =>
      [...prev, { ...createDayState.day!, tasks: [] }].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    );
    setAddDayOpen(false);
    setSelectedMode("flight");
  }, [createDayState]);

  useEffect(() => {
    if (!generateState.ok) return;
    const newDays = generateState.newDays ?? [];
    if (newDays.length > 0) {
      setDays((prev) =>
        [...prev, ...newDays].sort((a, b) => a.date.localeCompare(b.date))
      );
      setGenerateMessage(
        `Added ${newDays.length} travel day${newDays.length !== 1 ? "s" : ""} from your itinerary.`
      );
    } else {
      setGenerateMessage("All travel day dates already have checklists.");
    }
    const t = setTimeout(() => setGenerateMessage(null), 4000);
    return () => clearTimeout(t);
  }, [generateState]);

  function handleToggleTask(dayId: string, taskId: string, newDone: boolean) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, done: newDone } : t)) }
          : d
      )
    );
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tripId", tripId);
      fd.set("taskId", taskId);
      fd.set("done", String(newDone));
      await toggleTaskDoneAction({}, fd);
    });
  }

  function handleDeleteTask(dayId: string, taskId: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) } : d
      )
    );
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tripId", tripId);
      fd.set("taskId", taskId);
      await deleteTaskAction({}, fd);
    });
  }

  function handleAddTask(dayId: string, text: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tripId", tripId);
      fd.set("travelDayId", dayId);
      fd.set("text", text);
      const result = await createTaskAction({}, fd);
      if (result.ok && result.task) {
        setDays((prev) =>
          prev.map((d) =>
            d.id === dayId ? { ...d, tasks: [...d.tasks, result.task!] } : d
          )
        );
      }
    });
  }

  function startEditLabel(dayId: string, current: string) {
    setEditingLabelId(dayId);
    setEditingLabelValue(current);
  }

  function handleSaveLabel(dayId: string) {
    const trimmed = editingLabelValue.trim();
    setEditingLabelId(null);
    if (!trimmed) return;
    setDays((prev) => prev.map((d) => (d.id === dayId ? { ...d, label: trimmed } : d)));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tripId", tripId);
      fd.set("travelDayId", dayId);
      fd.set("label", trimmed);
      await updateTravelDayLabelAction({}, fd);
    });
  }

  function handleDeleteDay(dayId: string) {
    setDays((prev) => prev.filter((d) => d.id !== dayId));
    setConfirmDeleteDayId(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tripId", tripId);
      fd.set("travelDayId", dayId);
      await deleteTravelDayAction({}, fd);
    });
  }

  const totalTasks = days.reduce((s, d) => s + d.tasks.length, 0);
  const totalDone = days.reduce((s, d) => s + d.tasks.filter((t) => t.done).length, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#404040" }}>
      {/* ── Sticky dark header ── */}
      <div
        className="sticky top-0 z-30 border-b border-[#333333]"
        style={{ backgroundColor: "#282828" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: "2rem",
                color: "white",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Travel Days
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
              Pre-departure checklists
            </p>
          </div>
          {canEdit && (
            <div className="flex items-center gap-2">
              {days.length > 0 && (
                <form action={generateFormAction}>
                  <input type="hidden" name="tripId" value={tripId} />
                  <button
                    type="submit"
                    disabled={generatePending || !hasItineraryTransportEvents}
                    title={
                      !hasItineraryTransportEvents
                        ? "No flight or transport events in itinerary"
                        : undefined
                    }
                    className="border font-bold rounded-xl px-3 py-2.5 text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: "#FFD600", color: "#FFD600" }}
                  >
                    {generatePending ? "Generating…" : "Generate"}
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setAddDayOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: "#FF2D8B", color: "white", boxShadow: "0 4px 0 #991b5c" }}
              >
                <Plus size={14} weight="bold" />
                Add travel day
              </button>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 px-6 pb-4">
          {[
            { value: days.length,  label: "Travel days",  color: "#00A8CC" },
            { value: totalTasks,   label: "Total tasks",  color: "#FF2D8B" },
            { value: totalDone,    label: "Tasks done",   color: "#00C96B" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-4 py-3"
              style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-fredoka)",
                  fontSize: "1.75rem",
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs font-bold uppercase tracking-widest mt-1"
                style={{ color: "#9CA3AF" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

      {/* ── Generate result banner ── */}
      {generateMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 px-4 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between gap-3"
          style={{
            backgroundColor: "rgba(0,229,255,0.08)",
            borderColor: "rgba(0,229,255,0.25)",
            color: "#00E5FF",
          }}
        >
          <span>{generateMessage}</span>
          <button
            type="button"
            onClick={() => setGenerateMessage(null)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Generate error ── */}
      {generateState.error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl border text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.25)",
            color: "rgb(248,113,113)",
          }}
        >
          {generateState.error}
        </div>
      )}

      {/* ── Add travel day form ── */}
      {addDayOpen && canEdit && (
        <form
          action={createDayFormAction}
          className="mb-4 rounded-2xl border p-5"
          style={{ backgroundColor: "#15162A", borderColor: "#2A2B45" }}
        >
          <input type="hidden" name="tripId" value={tripId} />
          <h3 className="text-white font-semibold mb-4">Add Travel Day</h3>

          <div className="mb-4">
            <label
              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none border transition-colors"
              style={{ backgroundColor: "#0A0A12", borderColor: "#2A2B45" }}
            />
          </div>

          <div className="mb-4">
            <label
              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Label
            </label>
            <input
              type="text"
              name="label"
              placeholder="e.g. NYC → LAX"
              required
              maxLength={80}
              className="w-full rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none border placeholder:text-white/30 transition-colors"
              style={{ backgroundColor: "#0A0A12", borderColor: "#2A2B45" }}
            />
          </div>

          <div className="mb-5">
            <label
              className="text-xs font-semibold uppercase tracking-wide mb-2 block"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Transport mode
            </label>
            <div className="grid grid-cols-5 gap-2">
              {TRANSPORT_MODES.map((mode) => {
                const meta = TRANSPORT_META[mode];
                const isSelected = selectedMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all"
                    style={{
                      borderColor: isSelected ? meta.color : "#2A2B45",
                      color: isSelected ? meta.color : "rgba(255,255,255,0.4)",
                      backgroundColor: isSelected ? `${meta.color}18` : "transparent",
                    }}
                  >
                    <meta.Icon size={20} weight="fill" />
                    <span className="text-xs font-semibold">{meta.label}</span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="transportMode" value={selectedMode} />
          </div>

          {createDayState.error && (
            <p className="text-sm mb-3" style={{ color: "rgb(248,113,113)" }}>
              {createDayState.error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createDayPending}
              className="flex-1 font-bold py-2.5 rounded-full text-sm transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
            >
              {createDayPending ? "Adding…" : "Add Travel Day"}
            </button>
            <button
              type="button"
              onClick={() => setAddDayOpen(false)}
              className="px-5 py-2.5 rounded-full border text-sm transition-colors hover:text-white"
              style={{ borderColor: "#2A2B45", color: "rgba(255,255,255,0.6)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Empty state ── */}
      {days.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            <path d="M216,64H176V56a24,24,0,0,0-24-24H104A24,24,0,0,0,80,56v8H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V80H216V200ZM72,152a8,8,0,0,1,8-8H176a8,8,0,0,1,0,16H80A8,8,0,0,1,72,152Zm0-32a8,8,0,0,1,8-8H176a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Z" />
          </svg>
          <div>
            <h2 className="text-white font-semibold text-lg mb-1">No travel days yet</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Seed your checklist from your itinerary in one click.
            </p>
          </div>
          {canEdit && (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <form action={generateFormAction}>
                <input type="hidden" name="tripId" value={tripId} />
                <button
                  type="submit"
                  disabled={generatePending || !hasItineraryTransportEvents}
                  title={
                    !hasItineraryTransportEvents
                      ? "No flight or transport events in itinerary"
                      : undefined
                  }
                  className="font-bold px-6 py-3 rounded-full text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#FFEB00", color: "#0A0A12" }}
                >
                  {generatePending ? "Generating…" : "Generate from trip"}
                </button>
              </form>
              <button
                type="button"
                onClick={() => setAddDayOpen(true)}
                className="border font-semibold px-6 py-3 rounded-full text-sm transition-colors hover:text-white"
                style={{ borderColor: "#2A2B45", color: "rgba(255,255,255,0.7)" }}
              >
                + Add manually
              </button>
            </div>
          )}
          {!hasItineraryTransportEvents && canEdit && (
            <p className="text-xs max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              No flight or transport events in your itinerary yet — add them in the Itinerary tab
              first.
            </p>
          )}
        </div>
      )}

      {/* ── Travel day cards ── */}
      <div className="space-y-4">
        {days.map((day) => {
          const mode = safeMode(day.transportMode);
          const meta = TRANSPORT_META[mode];
          const doneCount = day.tasks.filter((t) => t.done).length;
          const total = day.tasks.length;
          const allDone = total > 0 && doneCount === total;
          const isEditingLabel = editingLabelId === day.id;
          const isConfirmDelete = confirmDeleteDayId === day.id;

          return (
            <section
              key={day.id}
              aria-label={`${formatDate(day.date)} travel day`}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "#15162A", borderColor: "#2A2B45" }}
            >
              {/* Card header row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 flex-shrink-0"
                  style={{ backgroundColor: `${meta.color}25`, color: meta.color }}
                >
                  <meta.Icon size={13} weight="fill" />
                  <span className="text-xs font-bold">{meta.label}</span>
                </div>

                <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {formatDate(day.date)}
                </span>

                <div className="flex-1" />

                {total > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor: allDone
                        ? "rgba(0,229,255,0.12)"
                        : "rgba(255,255,255,0.06)",
                      color: allDone ? "#00E5FF" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {doneCount} / {total} done
                  </span>
                )}

                {canEdit && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmDeleteDayId(isConfirmDelete ? null : day.id)
                    }
                    aria-label={`Delete travel day: ${day.label}`}
                    className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.7)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.3)")
                    }
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>

              {/* Delete confirm */}
              {isConfirmDelete && (
                <div
                  className="mb-4 p-3 rounded-xl border flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    borderColor: "rgba(239,68,68,0.25)",
                  }}
                >
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                    Remove this travel day and all its tasks?
                  </span>
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteDay(day.id)}
                      className="text-xs font-bold transition-colors"
                      style={{ color: "rgb(248,113,113)" }}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteDayId(null)}
                      className="text-xs font-semibold transition-colors"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Label */}
              {isEditingLabel ? (
                <input
                  value={editingLabelValue}
                  onChange={(e) => setEditingLabelValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveLabel(day.id);
                    if (e.key === "Escape") setEditingLabelId(null);
                  }}
                  onBlur={() => handleSaveLabel(day.id)}
                  maxLength={80}
                  aria-label="Travel day label"
                  autoFocus
                  className="w-full bg-transparent text-white text-lg font-semibold pb-0.5 mb-4 focus:outline-none border-b"
                  style={{ fontFamily: "var(--font-fredoka)", borderColor: "#00E5FF" }}
                />
              ) : (
                <div
                  className={`flex items-center gap-2 mb-4 ${canEdit ? "cursor-text group" : ""}`}
                  onClick={() => canEdit && startEditLabel(day.id, day.label)}
                >
                  <h3
                    className="text-white font-semibold text-lg leading-tight"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {day.label}
                  </h3>
                  {canEdit && (
                    <PencilSimple
                      size={14}
                      className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0"
                      style={{ color: "white" }}
                    />
                  )}
                </div>
              )}

              {/* Task list */}
              <div className="space-y-0.5">
                {day.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    canEdit={canEdit}
                    onToggle={() => handleToggleTask(day.id, task.id, !task.done)}
                    onDelete={() => handleDeleteTask(day.id, task.id)}
                  />
                ))}
              </div>

              {/* Quick-add task */}
              {canEdit &&
                (activeAddTaskDayId === day.id ? (
                  <QuickAddInput
                    onSubmit={(text) => handleAddTask(day.id, text)}
                    onCollapse={() => setActiveAddTaskDayId(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveAddTaskDayId(day.id)}
                    className="mt-2 w-full text-left text-sm transition-colors py-2 pl-[44px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.6)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.3)")
                    }
                  >
                    + Add task
                  </button>
                ))}
            </section>
          );
        })}
      </div>
      </div>
    </div>
  );
}
