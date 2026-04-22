import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { tripMembers, trips } from "@/lib/db/schema";

export async function getTripById(tripId: string) {
  const [trip] = await db
    .select({
      id: trips.id,
      name: trips.name,
      slug: trips.slug,
      ballColor: trips.ballColor,
      lifecycle: trips.lifecycle,
      startDate: trips.startDate,
      endDate: trips.endDate,
      displayCurrency: trips.displayCurrency,
      budgetCents: trips.budgetCents,
      budgetNotes: trips.budgetNotes,
      ownerId: trips.ownerId,
    })
    .from(trips)
    .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
    .limit(1);
  return trip ?? null;
}

/**
 * List all trips where the given user is a member (includes trips they own,
 * since owners are inserted into trip_members as "organizer").
 * Soft-deleted trips are excluded.
 */
export async function listTripsForUser(userId: string) {
  return db
    .select({
      id: trips.id,
      name: trips.name,
      slug: trips.slug,
      startDate: trips.startDate,
      endDate: trips.endDate,
      ballColor: trips.ballColor,
      lifecycle: trips.lifecycle,
      createdAt: trips.createdAt,
      role: tripMembers.role,
    })
    .from(trips)
    .innerJoin(tripMembers, eq(tripMembers.tripId, trips.id))
    .where(and(eq(tripMembers.userId, userId), isNull(trips.deletedAt)))
    .orderBy(desc(trips.createdAt));
}

export type TripListItem = Awaited<ReturnType<typeof listTripsForUser>>[number];
