"use client";

import { useState, useEffect, useRef } from "react";
import { Warning } from "@phosphor-icons/react";
import { deleteTripAction } from "@/lib/trips/actions";

interface DeleteTripDialogProps {
  trip: { id: string; name: string };
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteTripDialog({ trip, onClose, onDeleted }: DeleteTripDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteTripAction(trip.id);
    if (result.ok) {
      onDeleted();
    } else {
      setError(result.error);
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        tabIndex={-1}
        className="fixed z-50 inset-0 flex items-center justify-center px-4 focus:outline-none"
      >
        <div
          className="w-full max-w-sm rounded-2xl border border-[#3A3A3A] p-6 flex flex-col gap-5"
          style={{ backgroundColor: "#2E2E2E", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
        >
          {/* Icon + title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,45,139,0.15)" }}
            >
              <Warning size={24} weight="bold" style={{ color: "#FF2D8B" }} />
            </div>
            <h2
              id="delete-dialog-title"
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Delete this trip?
            </h2>
            <p className="text-sm text-white/80">
              <span className="font-bold text-white">{trip.name}</span> will be gone for everyone.
              Expenses, packing lists, itinerary — all of it. This can&apos;t be undone.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-2.5 text-sm font-semibold text-[#FF2D8B] text-center"
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full rounded-full py-3 text-sm font-bold transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FF2D8B",
                color: "#171717",
                fontFamily: "var(--font-fredoka)",
                boxShadow: "0 3px 0 #99003d",
              }}
            >
              {deleting ? "Deleting…" : "Yes, delete it"}
            </button>
            <button
              onClick={onClose}
              disabled={deleting}
              className="w-full rounded-full border border-[#3A3A3A] py-3 text-sm font-bold text-white transition hover:bg-white/5 disabled:opacity-60"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Keep it
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
