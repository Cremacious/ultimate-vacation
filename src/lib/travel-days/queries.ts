import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { travelDays, travelDayTasks } from "@/lib/db/schema";

export type TravelDayTaskRow = {
  id: string;
  text: string;
  done: boolean;
  sortOrder: number;
};

export type TravelDayRow = {
  id: string;
  date: string;
  label: string;
  transportMode: string;
  tasks: TravelDayTaskRow[];
};

export async function listTravelDays(tripId: string): Promise<TravelDayRow[]> {
  const days = await db
    .select({
      id: travelDays.id,
      date: travelDays.date,
      label: travelDays.label,
      transportMode: travelDays.transportMode,
    })
    .from(travelDays)
    .where(and(eq(travelDays.tripId, tripId), isNull(travelDays.deletedAt)))
    .orderBy(asc(travelDays.date));

  if (days.length === 0) return [];

  const dayIds = days.map((d) => d.id);

  const tasks = await db
    .select({
      id: travelDayTasks.id,
      travelDayId: travelDayTasks.travelDayId,
      text: travelDayTasks.text,
      done: travelDayTasks.done,
      sortOrder: travelDayTasks.sortOrder,
    })
    .from(travelDayTasks)
    .where(
      and(inArray(travelDayTasks.travelDayId, dayIds), isNull(travelDayTasks.deletedAt))
    )
    .orderBy(asc(travelDayTasks.sortOrder), asc(travelDayTasks.createdAt));

  const tasksByDayId = new Map<string, TravelDayTaskRow[]>();
  for (const task of tasks) {
    const arr = tasksByDayId.get(task.travelDayId) ?? [];
    arr.push({ id: task.id, text: task.text, done: task.done, sortOrder: task.sortOrder });
    tasksByDayId.set(task.travelDayId, arr);
  }

  return days.map((d) => ({
    ...d,
    tasks: tasksByDayId.get(d.id) ?? [],
  }));
}
