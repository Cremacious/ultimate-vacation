"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { itineraryEvents, tripMembers } from "@/lib/db/schema";

export type ItineraryActionState = {
  error?: string;
  ok?: boolean;
  conflict?: boolean;
  conflictEventTitle?: string;
};

const VALID_CATEGORIES = new Set([
  "activity",
  "meal",
  "reservation",
  "flight",
  "transport",
  "note",
  "other",
]);

async function requireTrustedMember(userId: string, tripId: string): Promise<void> {
  const [member] = await db
    .select({ role: tripMembers.role })
    .from(tripMembers)
    .where(
      and(
        eq(tripMembers.userId, userId),
        eq(tripMembers.tripId, tripId),
        isNull(tripMembers.deletedAt)
      )
    )
    .limit(1);
  if (!member) throw new Error("Not a trip member.");
  if (member.role !== "organizer" && member.role !== "trusted") {
    throw new Error("Only organizers and trusted members can edit the itinerary.");
  }
}

export async function createEventAction(
  _prev: ItineraryActionState,
  formData: FormData
): Promise<ItineraryActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const eventDate = String(formData.get("eventDate") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "activity");
  const startTime = String(formData.get("startTime") ?? "") || null;
  const endTime = String(formData.get("endTime") ?? "") || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!tripId) return { error: "Missing trip." };
  if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return { error: "Invalid date." };
  if (!title) return { error: "Event title is required." };
  if (!VALID_CATEGORIES.has(category)) return { error: "Invalid category." };

  try {
    await requireTrustedMember(user.id, tripId);
    await db.insert(itineraryEvents).values({
      tripId,
      eventDate,
      startTime,
      endTime,
      title,
      category,
      location,
      notes,
      createdBy: user.id,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not add event." };
  }

  revalidatePath(`/app/trips/${tripId}/itinerary`);
  return { ok: true };
}

export async function updateEventAction(
  _prev: ItineraryActionState,
  formData: FormData
): Promise<ItineraryActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  const knownUpdatedAt = String(formData.get("knownUpdatedAt") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "activity");
  const startTime = String(formData.get("startTime") ?? "") || null;
  const endTime = String(formData.get("endTime") ?? "") || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!tripId || !eventId) return { error: "Missing required fields." };
  if (!title) return { error: "Event title is required." };
  if (!VALID_CATEGORIES.has(category)) return { error: "Invalid category." };

  try {
    await requireTrustedMember(user.id, tripId);

    // Fetch current row for conflict detection.
    const [current] = await db
      .select({ updatedAt: itineraryEvents.updatedAt, title: itineraryEvents.title })
      .from(itineraryEvents)
      .where(
        and(
          eq(itineraryEvents.id, eventId),
          eq(itineraryEvents.tripId, tripId),
          isNull(itineraryEvents.deletedAt)
        )
      )
      .limit(1);
    if (!current) return { error: "Event not found." };

    // Last-write-wins: detect conflict but save regardless.
    const conflict =
      Boolean(knownUpdatedAt) && new Date(knownUpdatedAt) < current.updatedAt;
    const conflictEventTitle = conflict ? current.title : undefined;

    await db
      .update(itineraryEvents)
      .set({ title, category, startTime, endTime, location, notes, updatedAt: new Date() })
      .where(eq(itineraryEvents.id, eventId));

    revalidatePath(`/app/trips/${tripId}/itinerary`);
    return { ok: true, conflict, conflictEventTitle };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update event." };
  }
}

export async function deleteEventAction(
  _prev: ItineraryActionState,
  formData: FormData
): Promise<ItineraryActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const eventId = String(formData.get("eventId") ?? "");

  if (!tripId || !eventId) return { error: "Missing required fields." };

  try {
    await requireTrustedMember(user.id, tripId);
    await db
      .update(itineraryEvents)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(itineraryEvents.id, eventId),
          eq(itineraryEvents.tripId, tripId)
        )
      );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete event." };
  }

  revalidatePath(`/app/trips/${tripId}/itinerary`);
  return { ok: true };
}
