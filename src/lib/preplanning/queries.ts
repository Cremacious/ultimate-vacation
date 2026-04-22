import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { lodgings } from "@/lib/db/schema";

export type Lodging = {
  id: string;
  name: string;
  address: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  confirmationNumber: string | null;
  bookingUrl: string | null;
  notes: string | null;
  addedById: string;
};

export async function listLodgings(tripId: string): Promise<Lodging[]> {
  const rows = await db
    .select({
      id: lodgings.id,
      name: lodgings.name,
      address: lodgings.address,
      checkInDate: lodgings.checkInDate,
      checkOutDate: lodgings.checkOutDate,
      confirmationNumber: lodgings.confirmationNumber,
      bookingUrl: lodgings.bookingUrl,
      notes: lodgings.notes,
      addedById: lodgings.addedById,
    })
    .from(lodgings)
    .where(and(eq(lodgings.tripId, tripId), isNull(lodgings.deletedAt)))
    .orderBy(asc(lodgings.createdAt));

  return rows.map((r) => ({
    ...r,
    checkInDate: r.checkInDate ? String(r.checkInDate) : null,
    checkOutDate: r.checkOutDate ? String(r.checkOutDate) : null,
  }));
}
