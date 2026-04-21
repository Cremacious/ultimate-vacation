import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { itineraryEvents } from "@/lib/db/schema";

export type ItineraryEventRow = {
  id: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  title: string;
  category: string;
  location: string | null;
  notes: string | null;
  updatedAt: Date;
};

export async function listItineraryEvents(tripId: string): Promise<ItineraryEventRow[]> {
  return db
    .select({
      id: itineraryEvents.id,
      eventDate: itineraryEvents.eventDate,
      startTime: itineraryEvents.startTime,
      endTime: itineraryEvents.endTime,
      title: itineraryEvents.title,
      category: itineraryEvents.category,
      location: itineraryEvents.location,
      notes: itineraryEvents.notes,
      updatedAt: itineraryEvents.updatedAt,
    })
    .from(itineraryEvents)
    .where(and(eq(itineraryEvents.tripId, tripId), isNull(itineraryEvents.deletedAt)))
    .orderBy(asc(itineraryEvents.eventDate), asc(itineraryEvents.startTime));
}
