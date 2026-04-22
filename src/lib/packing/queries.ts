import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { packingItems } from "@/lib/db/schema";

export type PackingItem = {
  id: string;
  text: string;
  isPacked: boolean;
  addedById: string;
};

export async function listPackingItemsForTrip(tripId: string): Promise<PackingItem[]> {
  return db
    .select({
      id: packingItems.id,
      text: packingItems.text,
      isPacked: packingItems.isPacked,
      addedById: packingItems.addedById,
    })
    .from(packingItems)
    .where(and(eq(packingItems.tripId, tripId), isNull(packingItems.deletedAt)))
    .orderBy(asc(packingItems.createdAt));
}
