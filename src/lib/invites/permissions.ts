import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { tripMembers } from "@/lib/db/schema";

/**
 * Beta rule: only organizers can create invites.
 * Later: co-organizer roles may gain this permission via trip_members.permissions.
 */
export async function isTripOrganizer(userId: string, tripId: string): Promise<boolean> {
  const [row] = await db
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
  return row?.role === "organizer";
}

export async function isTripMember(userId: string, tripId: string): Promise<boolean> {
  const [row] = await db
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
  return Boolean(row);
}
