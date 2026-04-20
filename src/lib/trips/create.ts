import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { tripMembers, trips } from "@/lib/db/schema";

import { buildTripSlug } from "./slug";

export type CreateTripInput = {
  name: string;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null;
};

export type CreatedTrip = {
  id: string;
  slug: string;
  name: string;
};

/**
 * Create a trip and atomically (best-effort on neon-http) register the creator
 * as the organizer member.
 *
 * neon-http has no true multi-statement transactions, so we insert the trip
 * first, then the member row. On member-insert failure we delete the trip —
 * same net effect as a rollback. A later move to neon-serverless (WS) would
 * let us wrap these in db.transaction() properly.
 */
export async function createTripForUser(
  userId: string,
  input: CreateTripInput
): Promise<CreatedTrip> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) {
    throw new Error("Trip name must be 2–80 characters.");
  }
  if (input.startDate && input.endDate && input.startDate > input.endDate) {
    throw new Error("End date must be on or after start date.");
  }

  const slug = buildTripSlug(name);

  const [trip] = await db
    .insert(trips)
    .values({
      ownerId: userId,
      name,
      slug,
      startDate: input.startDate || null,
      endDate: input.endDate || null,
    })
    .returning({ id: trips.id, slug: trips.slug, name: trips.name });

  try {
    await db.insert(tripMembers).values({
      tripId: trip.id,
      userId,
      role: "organizer",
    });
  } catch (err) {
    await db.delete(trips).where(eq(trips.id, trip.id));
    throw err;
  }

  return trip;
}
