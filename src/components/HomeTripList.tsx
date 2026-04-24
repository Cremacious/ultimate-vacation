"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CopySimple, Trash } from "@phosphor-icons/react";

import TripBall from "./TripBall";
import DuplicateSheet from "./DuplicateSheet";
import DeleteTripDialog from "./DeleteTripDialog";

export type HomeTripItem = {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  ballColor: string;
  lifecycle: string;
  role: string;
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
  if (start === 1) return "Tomorrow. So close.";
  if (start === 0) return "Today. Go.";
  if (end !== null && end >= 0) return "Happening now";
  return "All done";
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
  onDelete,
}: {
  trip: HomeTripItem;
  onDuplicate: (trip: HomeTripItem) => void;
  onDelete: (trip: HomeTripItem) => void;
}) {
  const d = daysUntil(trip.startDate);
  const urgency = d !== null && d >= 0 && d <= 7;
  const past = isPast(trip);
  const signal = tripStatusSignal(trip);
  const isOrganizer = trip.role === "organizer";

  // How many action buttons appear on the right
  const actionCount = (past ? 1 : 0) + (isOrganizer ? 1 : 0);

  return (
    <div className="relative">
      <Link
        href={`/app/trips/${trip.id}`}
        className="block relative overflow-hidden rounded-2xl px-5 py-5 hover:brightness-110 transition"
        style={{ backgroundColor: "#252525", boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
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
          {/* Reserve space for action buttons */}
          {actionCount > 0 && (
            <div
              className="flex-shrink-0"
              style={{ width: actionCount * 44 }}
              aria-hidden="true"
            />
          )}
        </div>
      </Link>

      {/* Action buttons — sit on top of the card, right side */}
      {actionCount > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {past && (
            <button
              onClick={() => onDuplicate(trip)}
              aria-label={`Duplicate ${trip.name}`}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/8 text-white/80 hover:text-white"
            >
              <CopySimple size={16} />
            </button>
          )}
          {isOrganizer && (
            <button
              onClick={() => onDelete(trip)}
              aria-label={`Delete ${trip.name}`}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[#FF2D8B]/15 text-white/40 hover:text-[#FF2D8B]"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface HomeTripListProps {
  trips: HomeTripItem[];
}

export default function HomeTripList({ trips }: HomeTripListProps) {
  const router = useRouter();
  const [duplicateTarget, setDuplicateTarget] = useState<HomeTripItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomeTripItem | null>(null);

  return (
    <>
      <div className="mb-4">
        <h2
          className="text-lg font-black uppercase tracking-widest"
          style={{ color: "#FFD600" }}
        >
          Your trips
        </h2>
      </div>

      <div className="space-y-3">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDuplicate={setDuplicateTarget}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>

      {duplicateTarget && (
        <DuplicateSheet
          trip={duplicateTarget}
          onClose={() => setDuplicateTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteTripDialog
          trip={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
