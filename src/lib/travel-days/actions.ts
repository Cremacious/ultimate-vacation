"use server";

import { revalidatePath } from "next/cache";
import { and, asc, eq, isNull, or } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { itineraryEvents, travelDays, travelDayTasks, tripMembers } from "@/lib/db/schema";

export type TravelDayActionState = {
  error?: string;
  ok?: boolean;
  day?: { id: string; date: string; label: string; transportMode: string };
  task?: { id: string; text: string; done: boolean; sortOrder: number };
  newDays?: Array<{
    id: string;
    date: string;
    label: string;
    transportMode: string;
    tasks: Array<{ id: string; text: string; done: boolean; sortOrder: number }>;
  }>;
};

const VALID_MODES = new Set(["flight", "drive", "train", "cruise", "bus"]);

const DEFAULT_TASKS: Record<string, string[]> = {
  flight: [
    "Wake up early",
    "Eat breakfast",
    "Double check passport, tickets, and ID",
    "Confirm chargers and adapters are packed",
    "Turn off appliances and electronics",
    "Lock up and leave",
    "Arrive at the airport",
    "Check in and drop bags",
    "Clear security",
    "Find your gate",
    "Board the plane",
  ],
  drive: [
    "Wake up early",
    "Final bag check",
    "Load the car",
    "Double check the route and tolls",
    "Fill up on gas",
    "Hit the road",
    "Rest stop halfway",
    "Arrive at destination",
  ],
  train: [
    "Wake up early",
    "Check out of accommodation",
    "Confirm train tickets or pass",
    "Head to the station",
    "Find your platform",
    "Board the train",
    "Arrive and get to next accommodation",
  ],
  cruise: [
    "Wake up and do final packing",
    "Check out of hotel",
    "Head to the cruise terminal",
    "Check in and board",
    "Find your cabin",
    "Attend the safety briefing",
  ],
  bus: [
    "Wake up early",
    "Confirm bus tickets",
    "Head to the bus station",
    "Board the bus",
    "Arrive at destination",
  ],
};

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
    throw new Error("Only organizers and trusted members can edit travel days.");
  }
}

async function requireMember(userId: string, tripId: string): Promise<void> {
  const [member] = await db
    .select({ id: tripMembers.id })
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
}

export async function createTravelDayAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const date = String(formData.get("date") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const transportMode = String(formData.get("transportMode") ?? "flight");

  if (!tripId) return { error: "Missing trip." };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Invalid date." };
  if (!label) return { error: "Label is required." };
  if (!VALID_MODES.has(transportMode)) return { error: "Invalid transport mode." };

  try {
    await requireTrustedMember(user.id, tripId);
    const [newDay] = await db
      .insert(travelDays)
      .values({ tripId, date, label, transportMode, createdBy: user.id })
      .returning({
        id: travelDays.id,
        date: travelDays.date,
        label: travelDays.label,
        transportMode: travelDays.transportMode,
      });
    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true, day: newDay };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not add travel day." };
  }
}

export async function updateTravelDayLabelAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const travelDayId = String(formData.get("travelDayId") ?? "");
  const label = String(formData.get("label") ?? "").trim();

  if (!tripId || !travelDayId) return { error: "Missing required fields." };
  if (!label) return { error: "Label is required." };

  try {
    await requireTrustedMember(user.id, tripId);
    await db
      .update(travelDays)
      .set({ label, updatedAt: new Date() })
      .where(
        and(
          eq(travelDays.id, travelDayId),
          eq(travelDays.tripId, tripId),
          isNull(travelDays.deletedAt)
        )
      );
    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update label." };
  }
}

export async function deleteTravelDayAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const travelDayId = String(formData.get("travelDayId") ?? "");

  if (!tripId || !travelDayId) return { error: "Missing required fields." };

  try {
    await requireTrustedMember(user.id, tripId);
    await db
      .update(travelDays)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(travelDays.id, travelDayId), eq(travelDays.tripId, tripId))
      );
    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete travel day." };
  }
}

export async function createTaskAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const travelDayId = String(formData.get("travelDayId") ?? "");
  const text = String(formData.get("text") ?? "").trim();

  if (!tripId || !travelDayId) return { error: "Missing required fields." };
  if (!text) return { error: "Task text is required." };
  if (text.length > 160) return { error: "Task text too long." };

  try {
    await requireTrustedMember(user.id, tripId);

    const existingTasks = await db
      .select({ sortOrder: travelDayTasks.sortOrder })
      .from(travelDayTasks)
      .where(
        and(eq(travelDayTasks.travelDayId, travelDayId), isNull(travelDayTasks.deletedAt))
      )
      .orderBy(asc(travelDayTasks.sortOrder));

    const nextSort =
      existingTasks.length > 0
        ? existingTasks[existingTasks.length - 1].sortOrder + 1
        : 0;

    const [newTask] = await db
      .insert(travelDayTasks)
      .values({ travelDayId, text, done: false, sortOrder: nextSort, createdBy: user.id })
      .returning({
        id: travelDayTasks.id,
        text: travelDayTasks.text,
        done: travelDayTasks.done,
        sortOrder: travelDayTasks.sortOrder,
      });

    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true, task: newTask };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not add task." };
  }
}

export async function toggleTaskDoneAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const done = formData.get("done") === "true";

  if (!tripId || !taskId) return { error: "Missing required fields." };

  try {
    await requireMember(user.id, tripId);
    await db
      .update(travelDayTasks)
      .set({ done, updatedAt: new Date() })
      .where(eq(travelDayTasks.id, taskId));
    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update task." };
  }
}

export async function deleteTaskAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");

  if (!tripId || !taskId) return { error: "Missing required fields." };

  try {
    await requireTrustedMember(user.id, tripId);
    await db
      .update(travelDayTasks)
      .set({ deletedAt: new Date() })
      .where(eq(travelDayTasks.id, taskId));
    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete task." };
  }
}

export async function generateFromTripAction(
  _prev: TravelDayActionState,
  formData: FormData
): Promise<TravelDayActionState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");

  if (!tripId) return { error: "Missing trip." };

  try {
    await requireTrustedMember(user.id, tripId);

    const [existingDayDates, travelEvents] = await Promise.all([
      db
        .select({ date: travelDays.date })
        .from(travelDays)
        .where(and(eq(travelDays.tripId, tripId), isNull(travelDays.deletedAt))),
      db
        .select({
          eventDate: itineraryEvents.eventDate,
          title: itineraryEvents.title,
          category: itineraryEvents.category,
        })
        .from(itineraryEvents)
        .where(
          and(
            eq(itineraryEvents.tripId, tripId),
            isNull(itineraryEvents.deletedAt),
            or(
              eq(itineraryEvents.category, "flight"),
              eq(itineraryEvents.category, "transport")
            )
          )
        )
        .orderBy(asc(itineraryEvents.eventDate)),
    ]);

    const existingDates = new Set(existingDayDates.map((d) => d.date));

    const eventsByDate = new Map<string, typeof travelEvents>();
    for (const event of travelEvents) {
      const arr = eventsByDate.get(event.eventDate) ?? [];
      arr.push(event);
      eventsByDate.set(event.eventDate, arr);
    }

    if (eventsByDate.size === 0) {
      return { ok: true, newDays: [] };
    }

    const createdDays: TravelDayActionState["newDays"] = [];

    for (const [date, events] of eventsByDate) {
      if (existingDates.has(date)) continue;

      const hasFlight = events.some((e) => e.category === "flight");
      const transportMode = hasFlight ? "flight" : "drive";
      const label = events[0].title;

      const [newDay] = await db
        .insert(travelDays)
        .values({ tripId, date, label, transportMode, createdBy: user.id })
        .returning({ id: travelDays.id, date: travelDays.date, label: travelDays.label, transportMode: travelDays.transportMode });

      const taskTexts = DEFAULT_TASKS[transportMode] ?? [];
      let insertedTasks: Array<{ id: string; text: string; done: boolean; sortOrder: number }> = [];

      if (taskTexts.length > 0) {
        insertedTasks = await db
          .insert(travelDayTasks)
          .values(
            taskTexts.map((text, i) => ({
              travelDayId: newDay.id,
              text,
              done: false,
              sortOrder: i,
              createdBy: user.id,
            }))
          )
          .returning({
            id: travelDayTasks.id,
            text: travelDayTasks.text,
            done: travelDayTasks.done,
            sortOrder: travelDayTasks.sortOrder,
          });
      }

      createdDays.push({ ...newDay, tasks: insertedTasks });
    }

    revalidatePath(`/app/trips/${tripId}/travel-days`);
    return { ok: true, newDays: createdDays };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not generate travel days." };
  }
}
