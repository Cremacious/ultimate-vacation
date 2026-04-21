import { and, count, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { invites, tripMembers, trips, users } from "@/lib/db/schema";

export async function getInviteByCode(code: string) {
  const [row] = await db
    .select({
      id: invites.id,
      code: invites.code,
      tripId: invites.tripId,
      tripName: trips.name,
      tripSlug: trips.slug,
      tripBallColor: trips.ballColor,
      tripStartDate: trips.startDate,
      tripEndDate: trips.endDate,
      expiresAt: invites.expiresAt,
      maxUses: invites.maxUses,
      usedCount: invites.usedCount,
      revokedAt: invites.revokedAt,
      tripDeletedAt: trips.deletedAt,
      inviterName: users.name,
    })
    .from(invites)
    .innerJoin(trips, eq(invites.tripId, trips.id))
    .leftJoin(users, eq(invites.createdBy, users.id))
    .where(eq(invites.code, code))
    .limit(1);
  return row ?? null;
}

export async function getMemberCountForTrip(tripId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt)));
  return row?.count ?? 0;
}

export async function listActiveInvitesForTrip(tripId: string) {
  return db
    .select({
      id: invites.id,
      code: invites.code,
      expiresAt: invites.expiresAt,
      maxUses: invites.maxUses,
      usedCount: invites.usedCount,
      createdAt: invites.createdAt,
    })
    .from(invites)
    .where(
      and(
        eq(invites.tripId, tripId),
        isNull(invites.revokedAt),
        isNull(invites.deletedAt)
      )
    )
    .orderBy(desc(invites.createdAt));
}
