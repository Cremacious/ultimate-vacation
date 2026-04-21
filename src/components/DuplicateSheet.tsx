"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";

import { duplicateTripAction } from "@/lib/trips/actions";

interface DuplicateSheetProps {
  trip: { id: string; name: string };
  onClose: () => void;
}

export default function DuplicateSheet({ trip, onClose }: DuplicateSheetProps) {
  const router = useRouter();
  const [name, setName] = useState(`${trip.name} copy`);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasDates = startDate.length > 0 && endDate.length > 0;

  // Focus panel on mount
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await duplicateTripAction(trip.id, {
      name,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setSubmitting(false);
    if (result.ok) {
      router.push(`/app/trips/${result.newTripId}/setup`);
    } else {
      setError(result.error);
    }
  }

  const labelClass = "block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1";
  const inputClass =
    "w-full bg-white/5 border border-[#2A2B45] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 transition-colors";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sheet / modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Duplicate trip"
        tabIndex={-1}
        className="
          fixed z-50 focus:outline-none
          bottom-0 inset-x-0 rounded-t-2xl
          sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bottom-auto sm:rounded-2xl
        "
      >
        <div
          className="
            w-full rounded-t-2xl border border-[#2A2B45] p-6 flex flex-col gap-4 max-h-[90dvh] overflow-y-auto
            sm:max-w-md sm:rounded-2xl
          "
          style={{ backgroundColor: "#15162A" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-lg">Duplicate trip</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm -mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            Copying from <span className="font-semibold text-white/70">{trip.name}</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label htmlFor="dup-name" className={labelClass}>Name</label>
              <input
                id="dup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className={inputClass}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="dup-start" className={labelClass}>Start date <span className="normal-case text-white/30 font-normal">(optional)</span></label>
                <input
                  id="dup-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <label htmlFor="dup-end" className={labelClass}>End date <span className="normal-case text-white/30 font-normal">(optional)</span></label>
                <input
                  id="dup-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
            <p className="text-xs -mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              Add dates to carry over itinerary titles
            </p>

            {/* Inclusion chips */}
            <div className="flex flex-wrap gap-2">
              {["Members", "Budget", "Itinerary titles"].map((label) => (
                <span
                  key={label}
                  className="text-xs px-2.5 py-1 rounded-full transition-opacity"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.6)",
                    opacity: label === "Itinerary titles" && !hasDates ? 0.4 : 1,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full font-bold rounded-xl py-3 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
              style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
            >
              {submitting ? "Duplicating…" : "Duplicate trip"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-center text-sm hover:text-white/60 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
