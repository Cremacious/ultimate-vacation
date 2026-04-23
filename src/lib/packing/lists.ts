import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { packingLists } from "@/lib/db/schema";

export const DEFAULT_PERSONAL_PACKING_LIST_NAME = "My stuff";
export const DEFAULT_SHARED_PACKING_LIST_NAME = "Shared";

type ListVisibility = "private" | "public";

async function getNextPackingListSortOrder(tripId: string, ownerUserId: string) {
  const [row] = await db
    .select({
      value: sql<number>`coalesce(max(${packingLists.sortOrder}), -1)`,
    })
    .from(packingLists)
    .where(
      and(
        eq(packingLists.tripId, tripId),
        eq(packingLists.ownerUserId, ownerUserId),
        isNull(packingLists.deletedAt),
      )
    );

  return (row?.value ?? -1) + 1;
}

export async function ensureSharedPackingListForTrip(tripId: string, actorUserId: string) {
  const [existing] = await db
    .select({ id: packingLists.id })
    .from(packingLists)
    .where(
      and(
        eq(packingLists.tripId, tripId),
        eq(packingLists.listType, "shared"),
        isNull(packingLists.deletedAt),
      )
    )
    .orderBy(asc(packingLists.createdAt))
    .limit(1);

  if (existing) return existing.id;

  const [created] = await db
    .insert(packingLists)
    .values({
      tripId,
      ownerUserId: actorUserId,
      name: DEFAULT_SHARED_PACKING_LIST_NAME,
      listType: "shared",
      visibility: "public",
      sortOrder: 0,
      createdById: actorUserId,
    })
    .returning({ id: packingLists.id });

  return created.id;
}

export async function ensureDefaultPersonalPackingListForUser(tripId: string, userId: string) {
  const [existing] = await db
    .select({ id: packingLists.id })
    .from(packingLists)
    .where(
      and(
        eq(packingLists.tripId, tripId),
        eq(packingLists.ownerUserId, userId),
        eq(packingLists.listType, "personal"),
        isNull(packingLists.deletedAt),
      )
    )
    .orderBy(asc(packingLists.sortOrder), asc(packingLists.createdAt))
    .limit(1);

  if (existing) return existing.id;

  const sortOrder = await getNextPackingListSortOrder(tripId, userId);
  const [created] = await db
    .insert(packingLists)
    .values({
      tripId,
      ownerUserId: userId,
      name: DEFAULT_PERSONAL_PACKING_LIST_NAME,
      listType: "personal",
      visibility: "private",
      sortOrder,
      createdById: userId,
    })
    .returning({ id: packingLists.id });

  return created.id;
}

export async function ensurePackingListBaseline(tripId: string, userId: string) {
  const [sharedListId, personalListId] = await Promise.all([
    ensureSharedPackingListForTrip(tripId, userId),
    ensureDefaultPersonalPackingListForUser(tripId, userId),
  ]);

  return { sharedListId, personalListId };
}

export async function createPackingListForUser(args: {
  tripId: string;
  userId: string;
  name: string;
  visibility: ListVisibility;
}) {
  const sortOrder = await getNextPackingListSortOrder(args.tripId, args.userId);

  const [created] = await db
    .insert(packingLists)
    .values({
      tripId: args.tripId,
      ownerUserId: args.userId,
      name: args.name,
      listType: "personal",
      visibility: args.visibility,
      sortOrder,
      createdById: args.userId,
    })
    .returning({ id: packingLists.id });

  return created.id;
}
