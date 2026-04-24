"use client";

import { useState } from "react";
import Link from "next/link";
import { CopySimple } from "@phosphor-icons/react";

import TripBall from "./TripBall";
import DuplicateSheet from "./DuplicateSheet";

export type HomeTripItem = {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  ballColor: string;
  lifecycle: string;
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function countdownLabel(trip: HomeTripItem): string {
  const start = daysUntil(trip.startDate);
  const end = daysUntil(trip.endDate);
  if (start === null && end === null) return "Dates TBD";
  if (start !== null && start > 1) return `${start} days away`;
  if (start === 1) return "Tomorrow";
  if (start === 0) return "Today";
  if (end !== null && end >= 0) return "In progress";
  return "Completed";
}

function tripStatusSignal(trip: HomeTripItem): { label: string; color: string } | null {
  if (trip.lifecycle === "vaulted") return { label: "Settled ✓", color: "#00C96B" };
  if (trip.endDate && new Date(`${trip.endDate}T00:00:00Z`) < new Date()) {
    return { label: "Settle up", color: "#FFD600" };
  }
  return null;
}

function isPast(trip: HomeTripItem): boolean {
  if (trip.lifecycle === "vaulted") return true;
  if (trip.lifecycle === "dreaming") return false;
  if (!trip.endDate) return false;
  return new Date(`${trip.endDate}T00:00:00Z`) < new Date();
}

function TripCard({
  trip,
  onDuplicate,
}: {
  trip: HomeTripItem;
  onDuplicate: (trip: HomeTripItem) => void;
}) {
  const d = daysUntil(trip.startDate);
  const urgency = d !== null && d >= 0 && d <= 7;
  const past = isPast(trip);
  const signal = tripStatusSignal(trip);

  return (
    <div className="relative">
      <Link
        href={`/app/trips/${trip.id}`}
        className="block relative overflow-hidden rounded-2xl border border-[#3A3A3A] px-5 py-5 hover:brightness-110 transition"
        style={{ backgroundColor: "#252525" }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: trip.ballColor }}
        />
        <div className="flex items-center gap-4">
          <TripBall color={trip.ballColor} fillPct={0} size={62} className="ml-2" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">{trip.name}</p>
            <p
              className={`text-sm font-semibold mt-0.5 ${urgency ? "" : "text-white/80"}`}
              style={urgency ? { color: trip.ballColor } : undefined}
            >
              {countdownLabel(trip)}
            </p>
          </div>
          {signal && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-black" style={{ color: signal.color }}>
                {signal.label}
              </p>
            </div>
          )}
          {/* Reserve space for duplicate button */}
          {past && <div className="w-11 h-11 flex-shrink-0" aria-hidden="true" />}
        </div>
      </Link>

      {past && (
        <button
          onClick={() => onDuplicate(trip)}
          aria-label={`Duplicate ${trip.name}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/5 text-white/80 hover:text-white"
        >
          <CopySimple size={16} />
        </button>
      )}
    </div>
  );
}

interface HomeTripListProps {
  trips: HomeTripItem[];
}

export default function HomeTripList({ trips }: HomeTripListProps) {
  const [duplicateTarget, setDuplicateTarget] = useState<HomeTripItem | null>(null);

  return (
    <>
      <div className="mb-4">
        <h2
          className="text-lg font-black uppercase tracking-widest text-white/80"
        >
          Your trips
        </h2>
      </div>

      <div className="space-y-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onDuplicate={setDuplicateTarget} />
        ))}
      </div>

      {duplicateTarget && (
        <DuplicateSheet
          trip={duplicateTarget}
          onClose={() => setDuplicateTarget(null)}
        />
      )}
    </>
  );
}
