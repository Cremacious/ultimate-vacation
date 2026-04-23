import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { packingItems, packingLists, tripMembers, users } from "@/lib/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  clothing: "Clothing",
  toiletries: "Toiletries",
  electronics: "Electronics",
  documents: "Documents",
  other: "Other",
};

const MEMBER_COLORS = [
  "#FF2D8B",
  "#00A8CC",
  "#FFD600",
  "#00C96B",
  "#A855F7",
  "#FF8C00",
  "#00E5FF",
  "#FF3DA7",
];

type PackingListType = "personal" | "shared";
type PackingVisibility = "private" | "public";

export type PackingMemberView = {
  userId: string;
  name: string;
  initials: string;
  color: string;
};

export type PackingItemView = {
  id: string;
  listId: string;
  listName: string;
  listType: PackingListType;
  listVisibility: PackingVisibility;
  text: string;
  isPacked: boolean;
  addedById: string;
  ownerUserId: string;
  categoryKey: string;
  quantity: number | null;
  assigneeUserId: string | null;
  assigneeName: string | null;
  assigneeInitials: string | null;
  assigneeColor: string | null;
  visibilityOverride: PackingVisibility | null;
  effectiveVisibility: PackingVisibility;
};

export type PackingCategoryView = {
  key: string;
  label: string;
  items: PackingItemView[];
  packedCount: number;
  totalCount: number;
};

export type PersonalPackingListView = {
  id: string;
  name: string;
  visibility: PackingVisibility;
  categories: PackingCategoryView[];
  packedCount: number;
  totalCount: number;
  remainingCount: number;
};

export type PublicPackingListView = {
  id: string;
  name: string;
  owner: PackingMemberView;
  categories: PackingCategoryView[];
  packedCount: number;
  totalCount: number;
  remainingCount: number;
};

export type SharedPackingListView = {
  id: string;
  name: string;
  categories: PackingCategoryView[];
  packedCount: number;
  totalCount: number;
  remainingCount: number;
};

export type PackingPageData = {
  members: PackingMemberView[];
  myLists: PersonalPackingListView[];
  publicLists: PublicPackingListView[];
  sharedLists: SharedPackingListView[];
  counts: {
    total: number;
    packed: number;
    remaining: number;
    myListsCount: number;
    myItems: number;
    myPrivateItems: number;
    sharedItems: number;
    sharedPacked: number;
  };
};

function getMemberInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[words.length - 1][0] ?? ""}`.toUpperCase();
}

function getCategoryLabel(categoryKey: string) {
  return CATEGORY_LABELS[categoryKey] ?? categoryKey.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function emptyCategoriesFromItems(items: PackingItemView[]) {
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

  return Array.from(categoryMap.values());
}

function buildPersonalListView(
  list: { id: string; name: string; visibility: PackingVisibility },
  items: PackingItemView[],
): PersonalPackingListView {
  const packedCount = items.filter((item) => item.isPacked).length;
  const totalCount = items.length;

  return {
    id: list.id,
    name: list.name,
    visibility: list.visibility,
    categories: emptyCategoriesFromItems(items),
    packedCount,
    totalCount,
    remainingCount: Math.max(totalCount - packedCount, 0),
  };
}

function buildPublicListView(
  list: { id: string; name: string; owner: PackingMemberView },
  items: PackingItemView[],
): PublicPackingListView {
  const packedCount = items.filter((item) => item.isPacked).length;
  const totalCount = items.length;

  return {
    id: list.id,
    name: list.name,
    owner: list.owner,
    categories: emptyCategoriesFromItems(items),
    packedCount,
    totalCount,
    remainingCount: Math.max(totalCount - packedCount, 0),
  };
}

function buildSharedListView(
  list: { id: string; name: string },
  items: PackingItemView[],
): SharedPackingListView {
  const packedCount = items.filter((item) => item.isPacked).length;
  const totalCount = items.length;

  return {
    id: list.id,
    name: list.name,
    categories: emptyCategoriesFromItems(items),
    packedCount,
    totalCount,
    remainingCount: Math.max(totalCount - packedCount, 0),
  };
}

export async function getPackingPageData(
  tripId: string,
  userId: string,
): Promise<PackingPageData> {
  const [memberRows, personalLists, publicLists, sharedLists] = await Promise.all([
    db
      .select({
        userId: tripMembers.userId,
        name: users.name,
      })
      .from(tripMembers)
      .innerJoin(users, eq(users.id, tripMembers.userId))
      .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt)))
      .orderBy(users.name),
    db
      .select({
        id: packingLists.id,
        name: packingLists.name,
        visibility: packingLists.visibility,
        sortOrder: packingLists.sortOrder,
        createdAt: packingLists.createdAt,
      })
      .from(packingLists)
      .where(
        and(
          eq(packingLists.tripId, tripId),
          eq(packingLists.ownerUserId, userId),
          eq(packingLists.listType, "personal"),
          isNull(packingLists.deletedAt),
        ),
      )
      .orderBy(asc(packingLists.sortOrder), asc(packingLists.createdAt)),
    db
      .select({
        id: packingLists.id,
        name: packingLists.name,
        ownerUserId: packingLists.ownerUserId,
        sortOrder: packingLists.sortOrder,
        createdAt: packingLists.createdAt,
      })
      .from(packingLists)
      .where(
        and(
          eq(packingLists.tripId, tripId),
          eq(packingLists.listType, "personal"),
          eq(packingLists.visibility, "public"),
          isNull(packingLists.deletedAt),
        ),
      )
      .orderBy(asc(packingLists.sortOrder), asc(packingLists.createdAt)),
    db
      .select({
        id: packingLists.id,
        name: packingLists.name,
        sortOrder: packingLists.sortOrder,
        createdAt: packingLists.createdAt,
      })
      .from(packingLists)
      .where(
        and(
          eq(packingLists.tripId, tripId),
          eq(packingLists.listType, "shared"),
          isNull(packingLists.deletedAt),
        ),
      )
      .orderBy(asc(packingLists.sortOrder), asc(packingLists.createdAt)),
  ]);

  const members = memberRows.map((member, index) => ({
    userId: member.userId,
    name: member.name,
    initials: getMemberInitials(member.name),
    color: MEMBER_COLORS[index % MEMBER_COLORS.length],
  }));
  const memberById = new Map(members.map((member) => [member.userId, member]));

  const publicListsForOthers = publicLists.filter((list) => list.ownerUserId !== userId);
  const allListIds = [
    ...personalLists.map((list) => list.id),
    ...publicListsForOthers.map((list) => list.id),
    ...sharedLists.map((list) => list.id),
  ];
  const itemRows =
    allListIds.length === 0
      ? []
      : await db
          .select({
            id: packingItems.id,
            listId: packingItems.listId,
            text: packingItems.text,
            isPacked: packingItems.isPacked,
            addedById: packingItems.addedById,
            ownerUserId: packingItems.ownerUserId,
            categoryKey: packingItems.categoryKey,
            quantity: packingItems.quantity,
            assigneeUserId: packingItems.assigneeUserId,
            visibilityOverride: packingItems.visibilityOverride,
            listName: packingLists.name,
            listType: packingLists.listType,
            listVisibility: packingLists.visibility,
            createdAt: packingItems.createdAt,
            sortOrder: packingItems.sortOrder,
          })
          .from(packingItems)
          .innerJoin(packingLists, eq(packingItems.listId, packingLists.id))
          .where(
            and(
              eq(packingItems.tripId, tripId),
              inArray(packingItems.listId, allListIds),
              isNull(packingItems.deletedAt),
              isNull(packingLists.deletedAt),
            ),
          )
          .orderBy(
            asc(packingLists.sortOrder),
            asc(packingItems.categoryKey),
            asc(packingItems.sortOrder),
            asc(packingItems.createdAt),
          );

  const itemsByListId = new Map<string, PackingItemView[]>();

  for (const row of itemRows) {
    if (!row.listId) continue;
    const assignee = row.assigneeUserId ? memberById.get(row.assigneeUserId) ?? null : null;

    const item: PackingItemView = {
      id: row.id,
      listId: row.listId,
      listName: row.listName,
      listType: row.listType === "shared" ? "shared" : "personal",
      listVisibility: row.listVisibility === "public" ? "public" : "private",
      text: row.text,
      isPacked: row.isPacked,
      addedById: row.addedById,
      ownerUserId: row.ownerUserId,
      categoryKey: row.categoryKey,
      quantity: row.quantity,
      assigneeUserId: row.assigneeUserId,
      assigneeName: assignee?.name ?? null,
      assigneeInitials: assignee?.initials ?? null,
      assigneeColor: assignee?.color ?? null,
      visibilityOverride:
        row.visibilityOverride === "public" || row.visibilityOverride === "private"
          ? row.visibilityOverride
          : null,
      effectiveVisibility:
        row.visibilityOverride === "public" || row.visibilityOverride === "private"
          ? row.visibilityOverride
          : row.listVisibility === "public"
            ? "public"
            : "private",
    };

    const existing = itemsByListId.get(row.listId);
    if (existing) {
      existing.push(item);
    } else {
      itemsByListId.set(row.listId, [item]);
    }
  }

  const myLists = personalLists.map((list) =>
    buildPersonalListView(
      {
        id: list.id,
        name: list.name,
        visibility: list.visibility === "public" ? "public" : "private",
      },
      itemsByListId.get(list.id) ?? [],
    ),
  );

  const publicListViews = publicListsForOthers
    .map((list) => {
      const owner = memberById.get(list.ownerUserId);
      if (!owner) return null;

      const visibleItems = (itemsByListId.get(list.id) ?? []).filter(
        (item) => item.effectiveVisibility === "public",
      );

      return buildPublicListView(
        {
          id: list.id,
          name: list.name,
          owner,
        },
        visibleItems,
      );
    })
    .filter((list): list is PublicPackingListView => Boolean(list));

  const sharedListViews = sharedLists.map((list) =>
    buildSharedListView(
      {
        id: list.id,
        name: list.name,
      },
      itemsByListId.get(list.id) ?? [],
    ),
  );

  const myItems = myLists.flatMap((list) => list.categories.flatMap((category) => category.items));
  const publicItems = publicListViews.flatMap((list) =>
    list.categories.flatMap((category) => category.items),
  );
  const sharedItems = sharedListViews.flatMap((list) => list.categories.flatMap((category) => category.items));
  const packed = [...myItems, ...publicItems, ...sharedItems].filter((item) => item.isPacked).length;
  const total = myItems.length + publicItems.length + sharedItems.length;

  return {
    members,
    myLists,
    publicLists: publicListViews,
    sharedLists: sharedListViews,
    counts: {
      total,
      packed,
      remaining: Math.max(total - packed, 0),
      myListsCount: myLists.length,
      myItems: myItems.length,
      myPrivateItems: myItems.filter((item) => item.effectiveVisibility === "private").length,
      sharedItems: sharedItems.length,
      sharedPacked: sharedItems.filter((item) => item.isPacked).length,
    },
  };
}
