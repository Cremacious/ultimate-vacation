/**
 * Client → server analytics emission bridge. Client islands (SettleUpClient etc.)
 * call this endpoint so the event goes through the server-side `emit()` stub
 * (which at Chunk 10 becomes PostHog capture).
 *
 * The server-side emit stub is kept canonical so the Chunk 10 cut-over is a
 * single-file edit.
 */

import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { emit, type TripWaveEvent } from "@/lib/analytics/events";

type RawEvent = { type?: string } & Record<string, unknown>;

const ALLOWED_CLIENT_TYPES = new Set<TripWaveEvent["type"]>([
  "trip_settled",
  "post_trip_prompt_shown",
  "supporter_prompt_dismissed",
  "ad_impression_prompt_shown",
  "affiliate_click",
  "participant_becomes_organizer",
  "landing_page_visit",
]);

export async function POST(req: Request) {
  try {
    // Auth gate: most client-emitted events belong to an authenticated session.
    // The one exception — landing_page_visit — is pre-signup; we accept it
    // without auth but scrub the userId. For launch scope this is enough.
    const body = (await req.json()) as RawEvent;
    if (!body.type || typeof body.type !== "string") {
      return NextResponse.json({ error: "Missing event type." }, { status: 400 });
    }
    if (!ALLOWED_CLIENT_TYPES.has(body.type as TripWaveEvent["type"])) {
      return NextResponse.json({ error: "Event type not client-emittable." }, { status: 400 });
    }

    if (body.type === "landing_page_visit") {
      emit({ type: "landing_page_visit", sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined });
      return NextResponse.json({ ok: true });
    }

    const user = await requireUser();

    // Type-narrow by event.type. We trust the client for correlation fields
    // (tripId, etc.) because they're observable in server logs downstream.
    switch (body.type) {
      case "trip_settled": {
        if (typeof body.tripId !== "string") {
          return NextResponse.json({ error: "tripId required." }, { status: 400 });
        }
        emit({ type: "trip_settled", userId: user.id, tripId: body.tripId });
        break;
      }
      case "post_trip_prompt_shown": {
        if (typeof body.tripId !== "string") {
          return NextResponse.json({ error: "tripId required." }, { status: 400 });
        }
        emit({ type: "post_trip_prompt_shown", userId: user.id, tripId: body.tripId });
        break;
      }
      case "supporter_prompt_dismissed": {
        const surface = body.surface;
        if (
          surface !== "post_trip" &&
          surface !== "ad_impression" &&
          surface !== "account_menu"
        ) {
          return NextResponse.json({ error: "Invalid surface." }, { status: 400 });
        }
        emit({ type: "supporter_prompt_dismissed", userId: user.id, surface });
        break;
      }
      case "ad_impression_prompt_shown": {
        emit({ type: "ad_impression_prompt_shown", userId: user.id });
        break;
      }
      case "affiliate_click": {
        if (typeof body.tripId !== "string" || typeof body.partner !== "string") {
          return NextResponse.json(
            { error: "tripId + partner required." },
            { status: 400 }
          );
        }
        emit({
          type: "affiliate_click",
          userId: user.id,
          tripId: body.tripId,
          partner: body.partner,
        });
        break;
      }
      case "participant_becomes_organizer": {
        if (typeof body.newTripId !== "string") {
          return NextResponse.json({ error: "newTripId required." }, { status: 400 });
        }
        emit({
          type: "participant_becomes_organizer",
          userId: user.id,
          newTripId: body.newTripId,
        });
        break;
      }
      default:
        return NextResponse.json({ error: "Unhandled event type." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Emit failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
