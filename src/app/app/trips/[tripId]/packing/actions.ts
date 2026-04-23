"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { packingItems, packingLists } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import {
  createPackingListForUser,
  ensureSharedPackingListForTrip,
} from "@/lib/packing/lists";
import { isTripVaulted } from "@/lib/trips/queries";

export type PackingFormState = { error?: string; createdListId?: string };

type PackingVisibility = "private" | "public";

function parseVisibility(value: FormDataEntryValue | null | undefined): PackingVisibility {
  return value === "public" ? "public" : "private";
}

async function getListForTrip(listId: string, tripId: string) {
  const [list] = await db
    .select({
      id: packingLists.id,
      ownerUserId: packingLists.ownerUserId,
      listType: packingLists.listType,
      visibility: packingLists.visibility,
    })
    .from(packingLists)
    .where(
      and(
        eq(packingLists.id, listId),
        eq(packingLists.tripId, tripId),
        isNull(packingLists.deletedAt),
      ),
    )
    .limit(1);

  return list;
}

async function getItemForTrip(itemId: string, tripId: string) {
  const [item] = await db
    .select({
      id: packingItems.id,
      ownerUserId: packingItems.ownerUserId,
      isPacked: packingItems.isPacked,
      listId: packingItems.listId,
      assigneeUserId: packingItems.assigneeUserId,
      listType: packingLists.listType,
      listOwnerUserId: packingLists.ownerUserId,
      listVisibility: packingLists.visibility,
      visibilityOverride: packingItems.visibilityOverride,
    })
    .from(packingItems)
    .innerJoin(packingLists, eq(packingItems.listId, packingLists.id))
    .where(
      and(
        eq(packingItems.id, itemId),
        eq(packingItems.tripId, tripId),
        isNull(packingItems.deletedAt),
        isNull(packingLists.deletedAt),
      ),
    )
    .limit(1);

  return item;
}

export async function createPackingListAction(
  tripId: string,
  _prev: PackingFormState,
  formData: FormData,
): Promise<PackingFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to create a packing list." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const visibility = parseVisibility(formData.get("visibility"));

  if (!name) return { error: "List name is required." };
  if (name.length > 50) return { error: "List names must be 50 characters or fewer." };

  const createdListId = await createPackingListForUser({
    tripId,
    userId: user.id,
    name,
    visibility,
  });

  revalidatePath(`/app/trips/${tripId}/packing`);
  return { createdListId };
}

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
  const listId = (formData.get("listId") as string | null) ?? "";
  if (!text) return { error: "Item text is required." };
  if (!listId) return { error: "Choose a list before adding an item." };
  if (text.length > 200) return { error: "Item text must be 200 characters or fewer." };

  const list = await getListForTrip(listId, tripId);
  if (!list) return { error: "That packing list could not be found." };
  if (list.listType === "personal" && list.ownerUserId !== user.id) {
    return { error: "You can only add items to your own personal lists." };
  }

  const listVisibility = list.visibility === "public" ? "public" : "private";
  const isSharedList = list.listType === "shared";

  await db.insert(packingItems).values({
    tripId,
    listId,
    text,
    addedById: user.id,
    ownerUserId: user.id,
    scope: isSharedList ? "group" : "my",
    isPrivate: listVisibility === "private",
    visibilityOverride: null,
    categoryKey: "other",
    assigneeUserId: null,
  });

  revalidatePath(`/app/trips/${tripId}/packing`);
  return {};
}

export async function setPackingListVisibilityAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const listId = (formData.get("listId") as string | null) ?? "";
  const visibility = parseVisibility(formData.get("visibility"));
  if (!listId) return;

  const list = await getListForTrip(listId, tripId);
  if (!list || list.listType !== "personal" || list.ownerUserId !== user.id) return;

  await db
    .update(packingLists)
    .set({ visibility, updatedAt: new Date() })
    .where(eq(packingLists.id, listId));

  revalidatePath(`/app/trips/${tripId}/packing`);
}

export async function setPackingItemVisibilityAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  const visibility = parseVisibility(formData.get("visibility"));
  if (!itemId) return;

  const item = await getItemForTrip(itemId, tripId);
  if (!item || item.listType !== "personal" || item.listOwnerUserId !== user.id) return;

  const listVisibility = item.listVisibility === "public" ? "public" : "private";
  const visibilityOverride = visibility === listVisibility ? null : visibility;

  await db
    .update(packingItems)
    .set({
      visibilityOverride,
      isPrivate: visibility === "private",
      updatedAt: new Date(),
    })
    .where(eq(packingItems.id, itemId));

  revalidatePath(`/app/trips/${tripId}/packing`);
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

  const item = await getItemForTrip(itemId, tripId);
  if (!item) return;
  if (item.listType === "personal" && item.listOwnerUserId !== user.id) return;

  await db
    .update(packingItems)
    .set({ isPacked: !item.isPacked, updatedAt: new Date() })
    .where(eq(packingItems.id, itemId));

  revalidatePath(`/app/trips/${tripId}/packing`);
}

export async function movePackingItemToSharedAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  if (!itemId) return;

  const item = await getItemForTrip(itemId, tripId);
  if (!item || item.listType !== "personal" || item.listOwnerUserId !== user.id) return;

  const sharedListId = await ensureSharedPackingListForTrip(tripId, user.id);

  await db
    .update(packingItems)
    .set({
      listId: sharedListId,
      scope: "group",
      isPrivate: false,
      visibilityOverride: null,
      assigneeUserId: user.id,
      updatedAt: new Date(),
    })
    .where(eq(packingItems.id, itemId));

  revalidatePath(`/app/trips/${tripId}/packing`);
}

export async function claimSharedPackingItemAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  if (!itemId) return;

  const item = await getItemForTrip(itemId, tripId);
  if (!item || item.listType !== "shared") return;

  await db
    .update(packingItems)
    .set({ assigneeUserId: user.id, updatedAt: new Date() })
    .where(eq(packingItems.id, itemId));

  revalidatePath(`/app/trips/${tripId}/packing`);
}

export async function unassignSharedPackingItemAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const itemId = (formData.get("itemId") as string | null) ?? "";
  if (!itemId) return;

  const item = await getItemForTrip(itemId, tripId);
  if (!item || item.listType !== "shared") return;
  if (item.assigneeUserId !== user.id && item.ownerUserId !== user.id) return;

  await db
    .update(packingItems)
    .set({ assigneeUserId: null, updatedAt: new Date() })
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

  const item = await getItemForTrip(itemId, tripId);
  if (!item) return;
  if (item.listType === "personal" && item.listOwnerUserId !== user.id) return;

  await db
    .update(packingItems)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(packingItems.id, itemId), eq(packingItems.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}/packing`);
}
