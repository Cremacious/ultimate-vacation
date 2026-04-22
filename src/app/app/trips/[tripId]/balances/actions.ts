"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { emit } from "@/lib/analytics/events";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import { requireUser } from "@/lib/auth/session";

export type VaultTripResult =
  | { ok: true }
  | { ok: false; error: string };

export async function vaultTripAction(tripId: string): Promise<VaultTripResult> {
  const user = await requireUser();

  const isMember = await isTripMember(user.id, tripId);
  if (!isMember) {
    return { ok: false, error: "You must be a trip member to mark it settled." };
  }

  await db
    .update(trips)
    .set({ lifecycle: "vaulted", updatedAt: new Date() })
    .where(eq(trips.id, tripId));

  emit({ type: "trip_settled", userId: user.id, tripId });

  revalidatePath(`/app/trips/${tripId}/expenses`);
  revalidatePath(`/app/trips/${tripId}`);
  revalidatePath("/app");

  return { ok: true };
}
