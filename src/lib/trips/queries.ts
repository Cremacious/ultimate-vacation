import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { tripMembers, trips } from "@/lib/db/schema";

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
      status: trips.status,
      createdAt: trips.createdAt,
      role: tripMembers.role,
    })
    .from(trips)
    .innerJoin(tripMembers, eq(tripMembers.tripId, trips.id))
    .where(and(eq(tripMembers.userId, userId), isNull(trips.deletedAt)))
    .orderBy(desc(trips.createdAt));
}

export type TripListItem = Awaited<ReturnType<typeof listTripsForUser>>[number];
