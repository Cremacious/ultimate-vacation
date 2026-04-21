/**
 * Typed analytics event emission.
 *
 * Stub implementation — writes to server console. Replaced at Chunk 10 with
 * the PostHog client. Per BACKLOG.md Chunk 10: "emit early, wire late" — call
 * sites should be added starting in Chunk 2 so historical funnel data exists
 * by the time PostHog is wired.
 *
 * Canonical event list per STATE_MODEL.md 2026-04-21 conversion-loop grill
 * (PostHog funnel events + supplementary). Do not invent new event types ad
 * hoc; add them to the discriminated union below with typed props so the
 * eventual PostHog migration is trivial.
 */

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
 * Emit an event. Stub: server-side console log, one line JSON, grep-friendly.
 * Replace implementation at Chunk 10 with PostHog client call; keep the
 * function signature stable so call sites never change.
 */
export function emit(event: TripWaveEvent): void {
  const { type, ...props } = event;
  console.log(`[analytics] ${type} ${JSON.stringify(props)}`);
}
