"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { packingItems } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import { isTripVaulted } from "@/lib/trips/queries";

export type PackingFormState = { error?: string };

export async function addPackingItemAction(
  tripId: string,
  _prev: PackingFormState,
  formData: FormData,
): Promise<PackingFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to add items." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const text = (formData.get("text") as string | null)?.trim() ?? "";
  if (!text) return { error: "Item text is required." };
  if (text.length > 200) return { error: "Item text must be 200 characters or fewer." };

  await db.insert(packingItems).values({ tripId, text, addedById: user.id });

  revalidatePath(`/app/trips/${tripId}/packing`);
  return {};
}

export async function togglePackingItemAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  if (!itemId) return;

  const [item] = await db
    .select({ isPacked: packingItems.isPacked })
    .from(packingItems)
    .where(
      and(
        eq(packingItems.id, itemId),
        eq(packingItems.tripId, tripId),
        isNull(packingItems.deletedAt),
      ),
    )
    .limit(1);
  if (!item) return;

  await db
    .update(packingItems)
    .set({ isPacked: !item.isPacked })
    .where(eq(packingItems.id, itemId));

  revalidatePath(`/app/trips/${tripId}/packing`);
}

export async function deletePackingItemAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  if (!itemId) return;

  await db
    .update(packingItems)
    .set({ deletedAt: new Date() })
    .where(and(eq(packingItems.id, itemId), eq(packingItems.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}/packing`);
}
