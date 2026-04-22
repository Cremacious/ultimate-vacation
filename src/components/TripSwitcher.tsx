"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";

import { fetchUserTripsAction, type SerializedTripListItem } from "@/lib/trips/actions";
import { type CurrentTrip } from "./AppShellProvider";

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function countdownLabel(startDate: string | null): string {
  const d = daysUntil(startDate);
  if (d === null) return "Dates TBD";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 0) return "In progress";
  return `${d}d away`;
}

function SkeletonRow() {
  return (
    <div className="px-4 py-3 flex items-center gap-2.5">
      <div className="w-2 h-2 rounded-full bg-white/10 flex-shrink-0" />
      <div className="h-3 rounded bg-white/10 animate-pulse w-3/4" />
    </div>
  );
}

interface TripSwitcherProps {
  currentTrip: CurrentTrip;
}

export default function TripSwitcher({ currentTrip }: TripSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<SerializedTripListItem[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done">("idle");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || loadState !== "idle") return;

    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchUserTripsAction();
        if (!cancelled) {
          setTrips(data);
          setLoadState("done");
        }
      } catch {
        if (!cancelled) {
          setLoadState("done");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, loadState]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const otherTrips = trips.filter((t) => t.id !== currentTrip.id);

  return (
    <div className="relative z-[70]">
      <button
        ref={triggerRef}
        onClick={() => {
          if (!open && loadState === "idle") {
            setLoadState("loading");
          }
          setOpen((v) => !v);
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Switch trip, current: ${currentTrip.name}`}
        className="hidden md:flex rounded-full bg-[#2a2a2a] hover:bg-[#333333] items-center gap-2 px-3 py-1.5 h-9 transition-colors"
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: currentTrip.ballColor }}
        />
        <span className="text-sm font-bold text-white truncate max-w-[120px]">
          {currentTrip.name}
        </span>
        <CaretDown size={12} className="text-white/60 flex-shrink-0" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Switch trip"
          tabIndex={-1}
          className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] rounded-2xl border border-white/10 focus:outline-none z-[120]"
          style={{ backgroundColor: "#222222", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}
        >
          {/* Current trip row */}
          <div className="px-4 py-3 flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentTrip.ballColor }}
            />
            <span className="text-sm font-semibold text-white/60 truncate flex-1">
              {currentTrip.name}
            </span>
            <span className="text-xs bg-white/6 text-white/35 px-2 py-0.5 rounded-full flex-shrink-0">
              current
            </span>
          </div>

          {/* Other trips */}
          {loadState === "loading" && (
            <>
              <div className="mx-4 border-t border-white/8" />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {loadState === "done" && otherTrips.length > 0 && (
            <>
              <div className="mx-4 border-t border-white/8" />
              {otherTrips.map((t) => (
                <Link
                  key={t.id}
                  href={`/app/trips/${t.id}`}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 flex items-center gap-2.5 hover:bg-white/5 transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.ballColor }}
                  />
                  <span className="text-sm font-medium text-white truncate flex-1">{t.name}</span>
                  <span className="text-xs text-white/40 flex-shrink-0">
                    {countdownLabel(t.startDate)}
                  </span>
                </Link>
              ))}
            </>
          )}

          {/* Footer */}
          <div className="mx-4 border-t border-white/8" />
          <div className="px-4 py-3 flex items-center justify-between">
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              All trips
            </Link>
            <Link
              href="/app/trips/new"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold hover:brightness-110 transition"
              style={{ color: "#12b8e8" }}
            >
              New trip
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
