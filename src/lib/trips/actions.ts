"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { itineraryEvents, tripMembers, trips } from "@/lib/db/schema";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";

import { getTripById, listTripsForUser } from "./queries";
import { buildTripSlug } from "./slug";

export type SerializedTripListItem = {
  id: string;
  name: string;
  slug: string;
  startDate: string | null;
  endDate: string | null;
  ballColor: string;
  lifecycle: string;
  role: string;
};

export async function fetchUserTripsAction(): Promise<SerializedTripListItem[]> {
  const user = await requireUser();
  const rows = await listTripsForUser(user.id);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    startDate: r.startDate,
    endDate: r.endDate,
    ballColor: r.ballColor,
    lifecycle: r.lifecycle,
    role: r.role,
  }));
}

export type DuplicateTripInput = {
  name: string;
  startDate?: string;
  endDate?: string;
};

export type DuplicateTripResult =
  | { ok: true; newTripId: string }
  | { ok: false; error: string };

export async function duplicateTripAction(
  originalTripId: string,
  input: DuplicateTripInput
): Promise<DuplicateTripResult> {
  const user = await requireUser();

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Trip name is required." };

  const isMember = await isTripMember(user.id, originalTripId);
  if (!isMember) return { ok: false, error: "You are not a member of this trip." };

  const original = await getTripById(originalTripId);
  if (!original) return { ok: false, error: "Trip not found." };

  const slug = buildTripSlug(name);

  const [newTrip] = await db
    .insert(trips)
    .values({
      name,
      slug,
      ownerId: user.id,
      ballColor: original.ballColor,
      lifecycle: "active",
      budgetCents: original.budgetCents ?? null,
      budgetNotes: original.budgetNotes ?? null,
      startDate: input.startDate || null,
      endDate: input.endDate || null,
    })
    .returning({ id: trips.id });

  // Copy members (shell + members scope)
  const members = await db
    .select({ userId: tripMembers.userId, role: tripMembers.role })
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, originalTripId), isNull(tripMembers.deletedAt)));

  if (members.length > 0) {
    // Ensure current user is included as organizer even if they weren't before
    const hasCurrentUser = members.some((m) => m.userId === user.id);
    const memberRows = hasCurrentUser
      ? members
      : [{ userId: user.id, role: "organizer" as const }, ...members];

    await db.insert(tripMembers).values(
      memberRows.map((m) => ({ tripId: newTrip.id, userId: m.userId, role: m.role }))
    );
  } else {
    await db.insert(tripMembers).values({
      tripId: newTrip.id,
      userId: user.id,
      role: "organizer",
    });
  }

  // Copy itinerary skeleton — only if both trips have a startDate (scope: shell + members + budget + itinerary skeleton)
  if (input.startDate && original.startDate) {
    const origStartMs = new Date(`${original.startDate}T00:00:00Z`).getTime();
    const newStartMs = new Date(`${input.startDate}T00:00:00Z`).getTime();
    const msPerDay = 86_400_000;

    const events = await db
      .select()
      .from(itineraryEvents)
      .where(and(eq(itineraryEvents.tripId, originalTripId), isNull(itineraryEvents.deletedAt)));

    if (events.length > 0) {
      await db.insert(itineraryEvents).values(
        events.map((e) => {
          const dayOffset = Math.round(
            (new Date(`${e.eventDate}T00:00:00Z`).getTime() - origStartMs) / msPerDay
          );
          const newDateMs = newStartMs + dayOffset * msPerDay;
          const newEventDate = new Date(newDateMs).toISOString().split("T")[0];
          return {
            tripId: newTrip.id,
            eventDate: newEventDate,
            startTime: e.startTime,
            endTime: e.endTime,
            title: e.title,
            category: e.category,
            location: e.location,
            notes: e.notes,
            createdBy: user.id,
          };
        })
      );
    }
  }

  return { ok: true, newTripId: newTrip.id };
}

export async function updateTripAction(
  tripId: string,
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await requireUser();

  const canEdit = await isTripOrganizer(user.id, tripId);
  if (!canEdit) return { error: "Only organizers can edit trip details." };

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  if (!name) return { error: "Trip name is required." };

  const startDate = (formData.get("startDate") as string | null)?.trim() || null;
  const endDate = (formData.get("endDate") as string | null)?.trim() || null;
  const budgetRaw = (formData.get("budget") as string | null)?.trim() ?? "";
  const budgetNotes = (formData.get("budgetNotes") as string | null)?.trim() || null;
  const ballColor = (formData.get("ballColor") as string | null)?.trim() || "#00A8CC";

  let budgetCents: number | null = null;
  if (budgetRaw) {
    const parsed = parseFloat(budgetRaw);
    if (isNaN(parsed) || parsed < 0) return { error: "Budget must be a valid positive number." };
    budgetCents = Math.round(parsed * 100);
  }

  await db
    .update(trips)
    .set({ name, startDate, endDate, budgetCents, budgetNotes, ballColor })
    .where(eq(trips.id, tripId));

  revalidatePath(`/app/trips/${tripId}/setup`);
  revalidatePath(`/app/trips/${tripId}`);
  redirect(`/app/trips/${tripId}/setup`);
}
