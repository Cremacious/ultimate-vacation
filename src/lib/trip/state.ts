/**
 * Trip state computation — pure function.
 *
 * Per STATE_MODEL.md (locked 2026-04-21 architecture grill Q2):
 *   - Only `trips.lifecycle` is stored: active | vaulted | dreaming.
 *   - The 8-state runtime enum below is computed at read time, never persisted.
 *   - Callers pass what they have; callers without an anchor-event count get
 *     Planning (never Ready) for active trips pre-departure.
 *
 * This is the canonical `computeState` entry point. Any code that needs to
 * branch on "is the trip in progress / ready / stale" must call this — no
 * ad-hoc state math elsewhere per the Chunk 1 gate.
 */

export type TripLifecycle = "active" | "vaulted" | "dreaming";

export type TripState =
  | "Draft"
  | "Planning"
  | "Ready"
  | "TravelDay"
  | "InProgress"
  | "Stale"
  | "Vaulted"
  | "Dreaming";

export type ComputeStateInput = {
  lifecycle: TripLifecycle;
  startDate: string | null; // "YYYY-MM-DD" (date column serialized)
  endDate: string | null; // "YYYY-MM-DD"
  anchorEventCount?: number;
  now: Date;
};

export function computeState(input: ComputeStateInput): TripState {
  if (input.lifecycle === "vaulted") return "Vaulted";
  if (input.lifecycle === "dreaming") return "Dreaming";

  // lifecycle === "active" from here.
  // Setup incomplete → Draft. (At launch, "setup complete" = dates are set.)
  if (!input.startDate || !input.endDate) return "Draft";

  const today = toYMD(input.now);

  // Pre-departure: Planning or Ready.
  if (today < input.startDate) {
    const daysToDeparture = daysBetween(today, input.startDate);
    const hasAnchor = (input.anchorEventCount ?? 0) >= 1;
    if (daysToDeparture <= 2) return "Ready";
    if (daysToDeparture <= 14 && hasAnchor) return "Ready";
    return "Planning";
  }

  // Travel-leg dates: start date and end date are travel days.
  if (today === input.startDate || today === input.endDate) return "TravelDay";

  // Within the trip window, between start and end.
  if (today < input.endDate) return "InProgress";

  // After end date.
  return "Stale";
}

function toYMD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(fromYMD: string, toYMD: string): number {
  const parse = (s: string): number => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((parse(toYMD) - parse(fromYMD)) / 86400000);
}
