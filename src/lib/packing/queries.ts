import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { packingItems } from "@/lib/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  clothing: "Clothing",
  toiletries: "Toiletries",
  electronics: "Electronics",
  documents: "Documents",
  other: "Other",
};

export type PackingItemView = {
  id: string;
  text: string;
  isPacked: boolean;
  addedById: string;
  ownerUserId: string;
  scope: "my" | "group";
  isPrivate: boolean;
  categoryKey: string;
  quantity: number | null;
  assigneeUserId: string | null;
};

export type PackingCategoryView = {
  key: string;
  label: string;
  items: PackingItemView[];
  packedCount: number;
  totalCount: number;
};

export type PackingListView = {
  categories: PackingCategoryView[];
  packedCount: number;
  totalCount: number;
  remainingCount: number;
};

export type PackingPageData = {
  myList: PackingListView;
  groupList: PackingListView;
  counts: {
    total: number;
    packed: number;
    remaining: number;
    myTotal: number;
    myPacked: number;
    myPrivate: number;
    groupTotal: number;
    groupPacked: number;
  };
};

function getCategoryLabel(categoryKey: string) {
  return CATEGORY_LABELS[categoryKey] ?? categoryKey.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildPackingList(items: PackingItemView[]): PackingListView {
  const categoryMap = new Map<string, PackingCategoryView>();

  for (const item of items) {
    const existing = categoryMap.get(item.categoryKey);
    if (existing) {
      existing.items.push(item);
      existing.totalCount += 1;
      existing.packedCount += item.isPacked ? 1 : 0;
      continue;
    }

    categoryMap.set(item.categoryKey, {
      key: item.categoryKey,
      label: getCategoryLabel(item.categoryKey),
      items: [item],
      packedCount: item.isPacked ? 1 : 0,
      totalCount: 1,
    });
  }

  const categories = Array.from(categoryMap.values());
  const packedCount = items.filter((item) => item.isPacked).length;
  const totalCount = items.length;

  return {
    categories,
    packedCount,
    totalCount,
    remainingCount: Math.max(totalCount - packedCount, 0),
  };
}

export async function getPackingPageData(
  tripId: string,
  userId: string,
): Promise<PackingPageData> {
  const rows = await db
    .select({
      id: packingItems.id,
      text: packingItems.text,
      isPacked: packingItems.isPacked,
      addedById: packingItems.addedById,
      ownerUserId: packingItems.ownerUserId,
      scope: packingItems.scope,
      isPrivate: packingItems.isPrivate,
      categoryKey: packingItems.categoryKey,
      quantity: packingItems.quantity,
      assigneeUserId: packingItems.assigneeUserId,
      createdAt: packingItems.createdAt,
      sortOrder: packingItems.sortOrder,
    })
    .from(packingItems)
    .where(and(eq(packingItems.tripId, tripId), isNull(packingItems.deletedAt)))
    .orderBy(
      asc(packingItems.scope),
      asc(packingItems.categoryKey),
      asc(packingItems.sortOrder),
      asc(packingItems.createdAt),
    );

  const myItems: PackingItemView[] = [];
  const groupItems: PackingItemView[] = [];

  for (const row of rows) {
    const item: PackingItemView = {
      id: row.id,
      text: row.text,
      isPacked: row.isPacked,
      addedById: row.addedById,
      ownerUserId: row.ownerUserId,
      scope: row.scope === "group" ? "group" : "my",
      isPrivate: row.isPrivate,
      categoryKey: row.categoryKey,
      quantity: row.quantity,
      assigneeUserId: row.assigneeUserId,
    };

    if (item.scope === "group") {
      groupItems.push(item);
      continue;
    }

    if (item.ownerUserId === userId) {
      myItems.push(item);
    }
  }

  const myList = buildPackingList(myItems);
  const groupList = buildPackingList(groupItems);

  return {
    myList,
    groupList,
    counts: {
      total: myList.totalCount + groupList.totalCount,
      packed: myList.packedCount + groupList.packedCount,
      remaining: myList.remainingCount + groupList.remainingCount,
      myTotal: myList.totalCount,
      myPacked: myList.packedCount,
      myPrivate: myItems.filter((item) => item.isPrivate).length,
      groupTotal: groupList.totalCount,
      groupPacked: groupList.packedCount,
    },
  };
}
