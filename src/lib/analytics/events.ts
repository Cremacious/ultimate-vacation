/**
 * Typed analytics event emission.
 *
 * Wired to PostHog server SDK at Chunk 9. Falls back to console.log when
 * POSTHOG_API_KEY is absent (local dev, misconfigured envs).
 *
 * Canonical event list per STATE_MODEL.md 2026-04-21 conversion-loop grill.
 * Do not invent new event types ad hoc; extend the discriminated union below.
 */

import { getPostHogClient } from "./posthog-server";

export type TripWaveEvent =
  // Linear funnel events (STATE_MODEL.md § Public MVP canonical list)
  | { type: "landing_page_visit"; sessionId?: string }
  | { type: "signup_completed"; userId: string }
  | { type: "trip_created"; userId: string; tripId: string }
  | { type: "first_invite_sent"; userId: string; tripId: string }
  | { type: "first_invite_accepted"; userId: string; tripId: string }
  | { type: "first_expense_logged"; userId: string; tripId: string; expenseId: string }
  | { type: "two_member_expense_threshold"; tripId: string }
  | { type: "trip_end_date_reached"; tripId: string }
  | { type: "trip_settled"; userId: string; tripId: string }
  | { type: "post_trip_prompt_shown"; userId: string; tripId: string }
  | { type: "supporter_purchased"; userId: string; source: string }
  | { type: "participant_becomes_organizer"; userId: string; newTripId: string }
  // Supplementary (non-linear)
  | { type: "ad_impression_prompt_shown"; userId: string }
  | { type: "affiliate_click"; userId: string; tripId: string; partner: string }
  | {
      type: "supporter_prompt_dismissed";
      userId: string;
      surface: "post_trip" | "ad_impression" | "account_menu";
    };

/**
 * Emit a TripWave analytics event to PostHog.
 *
 * distinctId resolution:
 *   - events with userId     → userId (identified event)
 *   - events with only tripId → `trip_{tripId}` (group-level event)
 *   - anonymous events        → "$server"
 *
 * Swallows all errors — analytics must never break writes.
 */
export function emit(event: TripWaveEvent): void {
  try {
    const { type, ...rest } = event as TripWaveEvent & Record<string, unknown>;
    const userId = typeof rest.userId === "string" ? rest.userId : undefined;
    const tripId = typeof rest.tripId === "string" ? rest.tripId : undefined;
    const distinctId = userId ?? (tripId ? `trip_${tripId}` : "$server");

    const properties: Record<string, unknown> = { ...rest };
    if (userId) delete properties.userId;

    const client = getPostHogClient();
    if (client) {
      client.capture({ distinctId, event: type, properties });
    } else {
      console.log(`[analytics] ${type}`, properties);
    }
  } catch {
    // swallow — analytics must never throw into callers
  }
}
