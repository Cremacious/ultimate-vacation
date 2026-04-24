"use client";

import { useActionState, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Backpack,
  CaretDown,
  CaretUp,
  Check,
  DeviceMobile,
  Drop,
  FirstAidKit,
  GlobeHemisphereWest,
  Headphones,
  IdentificationCard,
  LockKey,
  LockSimple,
  LockSimpleOpen,
  Plus,
  TShirt,
  UsersThree,
  X,
} from "@phosphor-icons/react";

import type {
  PackingCategoryView,
  PackingItemView,
  PackingPageData,
  PersonalPackingListView,
  PublicPackingListView,
  SharedPackingListView,
} from "@/lib/packing/queries";
import type { PackingFormState } from "./actions";

interface Props {
  currentUserId: string;
  tripName: string;
  packingData: PackingPageData;
  addAction: (_prev: PackingFormState, formData: FormData) => Promise<PackingFormState>;
  createListAction: (_prev: PackingFormState, formData: FormData) => Promise<PackingFormState>;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  setListVisibilityAction: (formData: FormData) => Promise<void>;
  setItemVisibilityAction: (formData: FormData) => Promise<void>;
  moveToSharedAction: (formData: FormData) => Promise<void>;
  claimSharedItemAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction: (formData: FormData) => Promise<void>;
}

type PackingTab = "my" | "shared";

// ── Color constants ────────────────────────────────────────────────────────────
const SURFACE = "#404040";
const HEADER_SURFACE = "#282828";
const CARD_SURFACE = "#2e2e2e";
const BORDER = "#3a3a3a";
const MUTED_TEXT = "rgba(255,255,255,0.62)";

// ── Category metadata ──────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { Icon: React.ElementType; color: string }> = {
  clothing:      { Icon: TShirt,             color: "#FF2D8B" },
  toiletries:    { Icon: Drop,               color: "#00A8CC" },
  electronics:   { Icon: DeviceMobile,       color: "#FFD600" },
  documents:     { Icon: IdentificationCard, color: "#A855F7" },
  health:        { Icon: FirstAidKit,        color: "#00C96B" },
  entertainment: { Icon: Headphones,         color: "#FF8C00" },
  other:         { Icon: Backpack,           color: "#9CA3AF" },
};
const DEFAULT_CATEGORY_META = { Icon: Backpack, color: "#9CA3AF" };

// ── DarkCard ───────────────────────────────────────────────────────────────────
function DarkCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: CARD_SURFACE, borderColor: BORDER }}
    >
      {children}
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ backgroundColor: CARD_SURFACE, borderColor: BORDER }}
    >
      <p
        className="leading-none"
        style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", fontWeight: 900, color: accent }}
      >
        {value}
        {suffix ? <span style={{ fontSize: "1rem", color: "#555" }}>{suffix}</span> : null}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#9CA3AF" }}>
        {label}
      </p>
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
function EmptyState({ body, title }: { body: string; title: string }) {
  return (
    <DarkCard className="px-6 py-14 text-center">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-sm font-semibold" style={{ color: MUTED_TEXT }}>
        {body}
      </p>
    </DarkCard>
  );
}

// ── ChecklistRow ───────────────────────────────────────────────────────────────
function ChecklistRow({
  currentUserId,
  item,
  claimSharedItemAction,
  deleteAction,
  moveToSharedAction,
  readOnly = false,
  setItemVisibilityAction,
  toggleAction,
  unassignSharedItemAction,
}: {
  currentUserId: string;
  item: PackingItemView;
  claimSharedItemAction?: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveToSharedAction?: (formData: FormData) => Promise<void>;
  readOnly?: boolean;
  setItemVisibilityAction?: (formData: FormData) => Promise<void>;
  toggleAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction?: (formData: FormData) => Promise<void>;
}) {
  const nextVisibility = item.effectiveVisibility === "private" ? "public" : "private";
  const isSharedItem = item.listType === "shared";
  const isClaimedByCurrentUser = item.assigneeUserId === currentUserId;
  const canTogglePacked = !isSharedItem || !item.assigneeUserId || isClaimedByCurrentUser;
  const canDeleteItem = !isSharedItem || item.ownerUserId === currentUserId;
  const canUnassignSharedItem =
    Boolean(unassignSharedItemAction) &&
    Boolean(item.assigneeUserId) &&
    (isClaimedByCurrentUser || item.ownerUserId === currentUserId);
  const canClaimSharedItem =
    Boolean(claimSharedItemAction) && isSharedItem && !item.assigneeUserId;
  const assigneeLabel = !item.assigneeUserId
    ? "Unclaimed"
    : isClaimedByCurrentUser
      ? "You"
      : item.assigneeName ?? "Assigned";

  const checkBtnStyle = {
    backgroundColor: item.isPacked ? "#00C96B" : "transparent",
    borderColor: item.isPacked ? "#00C96B" : "rgba(255,255,255,0.25)",
    boxShadow: item.isPacked ? "0 0 0 3px rgba(0,201,107,0.25)" : "none",
  };

  const checkContent = item.isPacked ? <Check size={9} weight="bold" color="#fff" /> : null;

  return (
    <li className="group flex items-center gap-2.5 rounded-[10px] px-1 py-1.5 transition-colors hover:bg-white/[0.03]">

      {/* Toggle checkbox */}
      {readOnly || !canTogglePacked ? (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
          style={checkBtnStyle}
        >
          {checkContent}
        </span>
      ) : (
        <form action={toggleAction} className="flex-shrink-0">
          <input type="hidden" name="itemId" value={item.id} />
          <button
            type="submit"
            aria-label={item.isPacked ? `Unpack ${item.text}` : `Pack ${item.text}`}
            className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-150"
            style={checkBtnStyle}
          >
            {checkContent}
          </button>
        </form>
      )}

      {/* Item text + quantity */}
      <span
        className="flex-1 text-sm font-semibold leading-snug"
        style={{
          color: item.isPacked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)",
          textDecoration: item.isPacked ? "line-through" : "none",
        }}
      >
        {item.text}
        {item.quantity && item.quantity > 1 ? (
          <span className="ml-1.5 text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            x{item.quantity}
          </span>
        ) : null}
      </span>

      {/* Private badge — always visible when private */}
      {item.effectiveVisibility === "private" ? (
        <span
          className="flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black"
          style={{
            backgroundColor: "rgba(255,45,139,0.15)",
            borderColor: "rgba(255,45,139,0.3)",
            color: "#FF2D8B",
          }}
        >
          <LockSimple size={9} weight="fill" />
          Private
        </span>
      ) : null}

      {/* Shared item assignee badge */}
      {isSharedItem ? (
        <span
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-black"
          style={{
            color: item.assigneeUserId ? "#00C96B" : "#FFD600",
            borderColor: item.assigneeUserId ? "rgba(0,201,107,0.28)" : "rgba(255,214,0,0.28)",
            backgroundColor: item.assigneeUserId ? "rgba(0,201,107,0.12)" : "rgba(255,214,0,0.12)",
          }}
        >
          {item.assigneeInitials ? (
            <span
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px]"
              style={{
                backgroundColor: `${item.assigneeColor ?? "#00C96B"}33`,
                color: item.assigneeColor ?? "#00C96B",
              }}
            >
              {item.assigneeInitials}
            </span>
          ) : null}
          {assigneeLabel}
        </span>
      ) : null}

      {/* Action area */}
      {!readOnly ? (
        <div className="flex flex-shrink-0 items-center gap-1">

          {/* Claim — always visible */}
          {canClaimSharedItem ? (
            <form action={claimSharedItemAction!}>
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                aria-label={`Claim ${item.text}`}
                className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all"
                style={{
                  color: "#00C96B",
                  borderColor: "rgba(0,201,107,0.4)",
                  backgroundColor: "rgba(0,201,107,0.12)",
                }}
              >
                Claim
              </button>
            </form>
          ) : null}

          {/* Unassign — always visible */}
          {canUnassignSharedItem ? (
            <form action={unassignSharedItemAction!}>
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                aria-label={`Unassign ${item.text}`}
                className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all"
                style={{
                  color: "#FFD600",
                  borderColor: "rgba(255,214,0,0.4)",
                  backgroundColor: "rgba(255,214,0,0.12)",
                }}
              >
                Unassign
              </button>
            </form>
          ) : null}

          {/* Move to shared — always visible */}
          {moveToSharedAction ? (
            <form action={moveToSharedAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                aria-label={`Move ${item.text} to shared`}
                className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all"
                style={{
                  color: "#00A8CC",
                  borderColor: "rgba(0,168,204,0.4)",
                  backgroundColor: "rgba(0,168,204,0.12)",
                }}
              >
                Share
              </button>
            </form>
          ) : null}

          {/* Lock toggle — hover only */}
          {setItemVisibilityAction ? (
            <form
              action={setItemVisibilityAction}
              className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="visibility" value={nextVisibility} />
              <button
                type="submit"
                aria-label={
                  item.effectiveVisibility === "private"
                    ? `Make ${item.text} visible to group`
                    : `Hide ${item.text} from group`
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{
                  color:
                    item.effectiveVisibility === "private" ? "#FF2D8B" : "rgba(255,255,255,0.3)",
                }}
              >
                {item.effectiveVisibility === "private" ? (
                  <LockSimple size={13} weight="fill" />
                ) : (
                  <LockSimpleOpen size={13} weight="fill" />
                )}
              </button>
            </form>
          ) : null}

          {/* Delete — hover only */}
          {canDeleteItem ? (
            <form
              action={deleteAction}
              className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                aria-label={`Remove ${item.text}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:text-[#FF2D8B]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                <X size={12} weight="bold" />
              </button>
            </form>
          ) : null}
        </div>
      ) : (
        <span
          className="text-[11px] font-black uppercase tracking-[0.16em]"
          style={{ color: MUTED_TEXT }}
        >
          {item.isPacked ? "Packed" : "Visible"}
        </span>
      )}
    </li>
  );
}

// ── CategorySection ────────────────────────────────────────────────────────────
function CategorySection({
  currentUserId,
  category,
  claimSharedItemAction,
  deleteAction,
  moveToSharedAction,
  readOnly = false,
  setItemVisibilityAction,
  toggleAction,
  unassignSharedItemAction,
  addFormAction,
  listId,
}: {
  currentUserId: string;
  category: PackingCategoryView;
  claimSharedItemAction?: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveToSharedAction?: (formData: FormData) => Promise<void>;
  readOnly?: boolean;
  setItemVisibilityAction?: (formData: FormData) => Promise<void>;
  toggleAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction?: (formData: FormData) => Promise<void>;
  addFormAction?: (formData: FormData) => void;
  listId?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (category.totalCount === 0) return null;

  const meta = CATEGORY_META[category.key] ?? DEFAULT_CATEGORY_META;
  const { Icon, color } = meta;
  const pct = Math.round((category.packedCount / category.totalCount) * 100);
  const allDone = pct === 100;
  const showAddRow = !readOnly && Boolean(addFormAction) && Boolean(listId);

  return (
    <DarkCard className="overflow-hidden">
      {/* Category header */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
      >
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon size={14} weight="fill" style={{ color }} />
        </div>

        <span className="flex-1 text-left text-[13px] font-black text-white">
          {category.label}
        </span>

        <span
          className="flex-shrink-0 text-[11px] font-black"
          style={{ color: allDone ? "#00C96B" : "rgba(255,255,255,0.3)" }}
        >
          {category.packedCount}/{category.totalCount}
        </span>

        <div
          className="h-1.5 w-16 flex-shrink-0 overflow-hidden rounded-full"
          style={{ backgroundColor: "#3a3a3a" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: allDone ? "#00C96B" : color }}
          />
        </div>

        <span className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
          {collapsed ? <CaretDown size={13} weight="bold" /> : <CaretUp size={13} weight="bold" />}
        </span>
      </button>

      {/* Items + optional add row */}
      {!collapsed ? (
        <div className="px-3 pb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <ul className="flex flex-col pt-1">
            {category.items.map((item) => (
              <ChecklistRow
                key={item.id}
                currentUserId={currentUserId}
                item={item}
                claimSharedItemAction={claimSharedItemAction}
                deleteAction={deleteAction}
                moveToSharedAction={moveToSharedAction}
                readOnly={readOnly}
                setItemVisibilityAction={setItemVisibilityAction}
                toggleAction={toggleAction}
                unassignSharedItemAction={unassignSharedItemAction}
              />
            ))}
          </ul>

          {showAddRow ? (
            <div
              className="mt-2 pt-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <form action={addFormAction!} className="flex items-center gap-2.5">
                <input type="hidden" name="listId" value={listId} />
                <button
                  type="submit"
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${color}60`,
                    backgroundColor: "transparent",
                    color: `${color}90`,
                  }}
                >
                  <Plus size={9} weight="bold" />
                </button>
                <input
                  type="text"
                  name="text"
                  required
                  maxLength={200}
                  placeholder="Add item… press Enter"
                  className="flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm font-semibold text-white outline-none placeholder-white/20 focus:border-white/20 transition-colors"
                />
              </form>
            </div>
          ) : null}
        </div>
      ) : null}
    </DarkCard>
  );
}

// ── PublicListCard ─────────────────────────────────────────────────────────────
function PublicListCard({
  currentUserId,
  list,
  toggleAction,
  deleteAction,
}: {
  currentUserId: string;
  list: PublicPackingListView;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl pl-1"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderLeft: `3px solid ${list.owner.color}`,
      }}
    >
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[13px] font-black text-white">{list.name}</p>
            <p className="text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
              Public items from {list.owner.name}&apos;s list. Private items stay hidden.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
            style={{
              borderColor: `${list.owner.color}40`,
              backgroundColor: `${list.owner.color}14`,
            }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
              style={{ backgroundColor: `${list.owner.color}33`, color: list.owner.color }}
            >
              {list.owner.initials}
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white">
              {list.owner.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-black uppercase tracking-[0.16em]"
            style={{ color: list.owner.color }}
          >
            {list.packedCount}/{list.totalCount} packed
          </span>
          <span
            className="text-[11px] font-black uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {list.remainingCount} left
          </span>
        </div>
      </div>

      {list.totalCount === 0 ? (
        <p className="px-4 pb-4 text-sm font-semibold" style={{ color: MUTED_TEXT }}>
          No public items right now.
        </p>
      ) : (
        <div className="space-y-3 px-4 pb-4">
          {list.categories.map((category) => (
            <CategorySection
              key={`${list.id}-${category.key}`}
              currentUserId={currentUserId}
              category={category}
              deleteAction={deleteAction}
              readOnly
              toggleAction={toggleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getDefaultTab(packingData: PackingPageData): PackingTab {
  if (packingData.myLists.length > 0) return "my";
  return "shared";
}

// ── PackingClient ──────────────────────────────────────────────────────────────
export default function PackingClient({
  currentUserId,
  tripName,
  packingData,
  addAction,
  createListAction,
  toggleAction,
  deleteAction,
  setListVisibilityAction,
  setItemVisibilityAction,
  moveToSharedAction,
  claimSharedItemAction,
  unassignSharedItemAction,
}: Props) {
  const [activeTab, setActiveTab] = useState<PackingTab>(() => getDefaultTab(packingData));
  const [selectedListId, setSelectedListId] = useState<string | null>(
    () => packingData.myLists[0]?.id ?? null,
  );
  const [creatingList, setCreatingList] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addAction, {});
  const [createState, createListFormAction, createPending] = useActionState(createListAction, {});

  useEffect(() => {
    if (createState.createdListId) {
      setSelectedListId(createState.createdListId);
      setActiveTab("my");
      setCreatingList(false);
    }
  }, [createState.createdListId]);

  useEffect(() => {
    if (!packingData.myLists.some((list) => list.id === selectedListId)) {
      setSelectedListId(packingData.myLists[0]?.id ?? null);
    }
  }, [packingData.myLists, selectedListId]);

  const selectedList =
    packingData.myLists.find((list) => list.id === selectedListId) ??
    packingData.myLists[0] ??
    null;
  const sharedList = packingData.sharedLists[0] ?? null;

  // ── Derived counts ───────────────────────────────────────────────────────────
  const completionPct =
    packingData.counts.total > 0
      ? Math.round((packingData.counts.packed / packingData.counts.total) * 100)
      : 0;
  const progressAccent = completionPct === 100 ? "#00C96B" : "#00A8CC";

  const activeCats =
    activeTab === "my"
      ? (selectedList?.categories ?? [])
      : (sharedList?.categories ?? []);
  const categoriesDone = activeCats.filter(
    (c) => c.totalCount > 0 && c.packedCount === c.totalCount,
  ).length;

  // ── Active list visibility state (for sidebar card) ──────────────────────────
  const activeListIsPublic = activeTab === "my"
    ? selectedList?.visibility === "public"
    : true; // shared list is always group-visible

  // ── Private items warning (active list is public but has private items) ───────
  const privateItemsInActiveList =
    activeTab === "my" && selectedList?.visibility === "public"
      ? selectedList.categories
          .flatMap((c) => c.items)
          .filter((i) => i.effectiveVisibility === "private").length
      : 0;

  // ── Group packing sidebar data ────────────────────────────────────────────────
  const currentMember = packingData.members.find((m) => m.userId === currentUserId);
  const otherMembers = packingData.members.filter((m) => m.userId !== currentUserId);
  const publicListByOwnerId = new Map(packingData.publicLists.map((l) => [l.owner.userId, l]));
  const myTotalPacked = packingData.myLists.reduce((s, l) => s + l.packedCount, 0);
  const myTotalItems = packingData.myLists.reduce((s, l) => s + l.totalCount, 0);
  const myPct = myTotalItems > 0 ? Math.round((myTotalPacked / myTotalItems) * 100) : 0;
  const myHasPublicList = packingData.myLists.some((l) => l.visibility === "public");

  // ── Active list / shared list progress for sidebar ───────────────────────────
  const sidebarListName =
    activeTab === "my" ? (selectedList?.name ?? "No list") : (sharedList?.name ?? "Shared");
  const sidebarPacked =
    activeTab === "my" ? (selectedList?.packedCount ?? 0) : (sharedList?.packedCount ?? 0);
  const sidebarTotal =
    activeTab === "my" ? (selectedList?.totalCount ?? 0) : (sharedList?.totalCount ?? 0);
  const sidebarPct =
    sidebarTotal > 0 ? Math.round((sidebarPacked / sidebarTotal) * 100) : 0;
  const sidebarAccent = sidebarPct === 100 ? "#00C96B" : "#00A8CC";
  const sidebarCopy =
    activeTab === "shared"
      ? "Shared items stay visible to the group."
      : selectedList?.visibility === "private"
        ? "Only you can see this list unless you make an item public."
        : "Trip members can see this list. Private items stay hidden.";

  return (
    <div className="min-h-[calc(100vh-68px)]" style={{ backgroundColor: SURFACE }}>

      {/* ── Page header ── */}
      <div style={{ backgroundColor: HEADER_SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className="m-0 text-[2rem] leading-none text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Packing
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#9CA3AF" }}>
              Personal by default · Share when you&apos;re ready
            </p>
          </div>

          <div className="flex flex-col gap-1.5 md:items-end">
            <p
              className="leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.5rem", color: progressAccent }}
            >
              {packingData.counts.packed}
              <span style={{ fontSize: "1rem", color: "#555" }}>/{packingData.counts.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 w-28 overflow-hidden rounded-full"
                role="progressbar"
                aria-label="Overall packing progress"
                aria-valuemin={0}
                aria-valuemax={packingData.counts.total}
                aria-valuenow={packingData.counts.packed}
                style={{ backgroundColor: BORDER }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%`, backgroundColor: progressAccent }}
                />
              </div>
              <span className="text-xs font-black" style={{ color: progressAccent }}>
                {completionPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="space-y-5">

          {/* ── Stats row ── */}
          <div className="grid gap-3 md:grid-cols-3">
            <StatCard
              label="Items packed"
              value={packingData.counts.packed}
              suffix={`/${packingData.counts.total}`}
              accent="#00A8CC"
            />
            <StatCard
              label="Categories done"
              value={categoriesDone}
              accent="#FF2D8B"
            />
            <StatCard
              label="Private items"
              value={packingData.counts.myPrivateItems}
              accent="#00C96B"
            />
          </div>

          {/* ── Main grid ── */}
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">

            {/* ── Left column ── */}
            <div className="space-y-4">

              {/* List selector tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {packingData.myLists.map((list) => (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => { setActiveTab("my"); setSelectedListId(list.id); }}
                    aria-pressed={activeTab === "my" && selectedListId === list.id}
                    className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-black transition-all duration-150"
                    style={{
                      backgroundColor:
                        activeTab === "my" && selectedListId === list.id
                          ? "#00A8CC"
                          : "rgba(255,255,255,0.05)",
                      borderColor:
                        activeTab === "my" && selectedListId === list.id
                          ? "#00A8CC"
                          : "rgba(255,255,255,0.12)",
                      color:
                        activeTab === "my" && selectedListId === list.id ? "#fff" : "#9CA3AF",
                    }}
                  >
                    {list.name}
                    {list.visibility === "private" ? (
                      <LockSimple
                        size={10}
                        weight="fill"
                        style={{
                          color:
                            activeTab === "my" && selectedListId === list.id
                              ? "rgba(255,255,255,0.6)"
                              : "#FF2D8B",
                        }}
                      />
                    ) : null}
                  </button>
                ))}

                {/* Shared tab */}
                {sharedList ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("shared")}
                    aria-pressed={activeTab === "shared"}
                    className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-black transition-all duration-150"
                    style={{
                      backgroundColor:
                        activeTab === "shared"
                          ? "rgba(0,201,107,0.2)"
                          : "rgba(255,255,255,0.05)",
                      borderColor:
                        activeTab === "shared"
                          ? "rgba(0,201,107,0.5)"
                          : "rgba(255,255,255,0.12)",
                      color: activeTab === "shared" ? "#00C96B" : "#9CA3AF",
                    }}
                  >
                    <UsersThree size={12} weight="fill" />
                    Shared
                  </button>
                ) : null}

                {/* New list — inline create */}
                {creatingList ? (
                  <form
                    action={createListFormAction}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="visibility" value="private" />
                    <input
                      autoFocus
                      type="text"
                      name="name"
                      placeholder="List name…"
                      required
                      maxLength={50}
                      onKeyDown={(e) => { if (e.key === "Escape") setCreatingList(false); }}
                      className="rounded-full border px-3 py-1.5 text-sm font-bold text-white outline-none placeholder-white/20 focus:border-[#00A8CC] transition-colors"
                      style={{
                        backgroundColor: CARD_SURFACE,
                        borderColor: BORDER,
                        width: "140px",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={createPending}
                      className="text-[11px] font-black text-white/50 transition-colors hover:text-white disabled:opacity-50"
                    >
                      {createPending ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatingList(false)}
                      className="text-[11px] font-black text-white/30 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCreatingList(true)}
                    className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-black transition-all duration-150"
                    style={{
                      borderStyle: "dashed",
                      borderColor: "rgba(0,168,204,0.4)",
                      color: "#00A8CC",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Plus size={11} weight="bold" />
                    New list
                  </button>
                )}
              </div>

              {createState.error ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                  style={{
                    backgroundColor: "rgba(255,45,139,0.08)",
                    border: "1px solid rgba(255,45,139,0.2)",
                  }}
                >
                  <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                    {createState.error}
                  </span>
                </div>
              ) : null}

              {/* Private items warning banner */}
              {privateItemsInActiveList > 0 ? (
                <div
                  className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                  style={{
                    backgroundColor: "rgba(255,45,139,0.08)",
                    border: "1px solid rgba(255,45,139,0.2)",
                  }}
                >
                  <LockSimple size={12} weight="fill" style={{ color: "#FF2D8B" }} />
                  <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                    {privateItemsInActiveList} item
                    {privateItemsInActiveList !== 1 ? "s" : ""} marked private — hidden from the
                    group
                  </span>
                </div>
              ) : null}

              {/* ── My lists panel ── */}
              {activeTab === "my" ? (
                selectedList ? (
                  <div className="space-y-3">
                    {addState.error ? (
                      <div
                        role="alert"
                        className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                        style={{
                          backgroundColor: "rgba(255,45,139,0.08)",
                          border: "1px solid rgba(255,45,139,0.2)",
                        }}
                      >
                        <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                          {addState.error}
                        </span>
                      </div>
                    ) : null}

                    {selectedList.totalCount === 0 ? (
                      <>
                        <EmptyState
                          title="No items yet"
                          body="Add the first item to this list."
                        />
                        <DarkCard className="px-4 py-3">
                          <form action={addFormAction} className="flex items-center gap-2.5">
                            <input type="hidden" name="listId" value={selectedList.id} />
                            <button
                              type="submit"
                              disabled={addPending}
                              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors hover:opacity-80 disabled:opacity-50"
                              style={{
                                borderColor: "rgba(255,255,255,0.25)",
                                backgroundColor: "transparent",
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              <Plus size={9} weight="bold" />
                            </button>
                            <input
                              type="text"
                              name="text"
                              required
                              maxLength={200}
                              placeholder="Add first item… press Enter"
                              className="flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm font-semibold text-white outline-none placeholder-white/20 focus:border-white/20 transition-colors"
                            />
                          </form>
                        </DarkCard>
                      </>
                    ) : (
                      <>
                        {selectedList.categories.map((category) => (
                          <CategorySection
                            key={`${selectedList.id}-${category.key}`}
                            currentUserId={currentUserId}
                            category={category}
                            deleteAction={deleteAction}
                            moveToSharedAction={moveToSharedAction}
                            setItemVisibilityAction={setItemVisibilityAction}
                            toggleAction={toggleAction}
                            addFormAction={addFormAction}
                            listId={selectedList.id}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    title="No lists yet"
                    body="Create your first list to start packing for this trip."
                  />
                )
              ) : null}

              {/* ── Shared panel ── */}
              {activeTab === "shared" ? (
                <div className="space-y-4">
                  {sharedList ? (
                    <>
                      {addState.error ? (
                        <div
                          role="alert"
                          className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                          style={{
                            backgroundColor: "rgba(255,45,139,0.08)",
                            border: "1px solid rgba(255,45,139,0.2)",
                          }}
                        >
                          <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                            {addState.error}
                          </span>
                        </div>
                      ) : null}

                      {sharedList.totalCount === 0 ? (
                        <>
                          <EmptyState
                            title="No shared items yet"
                            body="Add the first group item so everyone knows it still needs a bringer."
                          />
                          <DarkCard className="px-4 py-3">
                            <form action={addFormAction} className="flex items-center gap-2.5">
                              <input type="hidden" name="listId" value={sharedList.id} />
                              <button
                                type="submit"
                                disabled={addPending}
                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors hover:opacity-80 disabled:opacity-50"
                                style={{
                                  borderColor: "rgba(0,201,107,0.4)",
                                  backgroundColor: "transparent",
                                  color: "rgba(0,201,107,0.6)",
                                }}
                              >
                                <Plus size={9} weight="bold" />
                              </button>
                              <input
                                type="text"
                                name="text"
                                required
                                maxLength={200}
                                placeholder="Add shared item… press Enter"
                                className="flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm font-semibold text-white outline-none placeholder-white/20 focus:border-white/20 transition-colors"
                              />
                            </form>
                          </DarkCard>
                        </>
                      ) : (
                        <div className="space-y-3">
                          {sharedList.categories.map((category) => (
                            <CategorySection
                              key={`${sharedList.id}-${category.key}`}
                              currentUserId={currentUserId}
                              category={category}
                              claimSharedItemAction={claimSharedItemAction}
                              deleteAction={deleteAction}
                              toggleAction={toggleAction}
                              unassignSharedItemAction={unassignSharedItemAction}
                              addFormAction={addFormAction}
                              listId={sharedList.id}
                            />
                          ))}
                        </div>
                      )}

                      {/* Public personal lists from other members */}
                      {packingData.publicLists.length > 0 ? (
                        <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <p
                            className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                          >
                            Public personal lists
                          </p>
                          <div className="space-y-4">
                            {packingData.publicLists.map((list) => (
                              <PublicListCard
                                key={list.id}
                                currentUserId={currentUserId}
                                list={list}
                                toggleAction={toggleAction}
                                deleteAction={deleteAction}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <EmptyState
                      title="No shared list yet"
                      body="The shared coordination list will appear here once this trip has one."
                    />
                  )}
                </div>
              ) : null}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4">

              {/* Active list card */}
              <DarkCard className="overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <p
                    className="text-xs font-black uppercase tracking-[0.22em]"
                    style={{ color: "#9CA3AF" }}
                  >
                    {sidebarListName}
                  </p>

                  {/* Visibility toggle — only for personal lists */}
                  {activeTab === "my" && selectedList ? (
                    <div className="flex items-center gap-1.5">
                      <form action={setListVisibilityAction}>
                        <input type="hidden" name="listId" value={selectedList.id} />
                        <input type="hidden" name="visibility" value="private" />
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] transition-all duration-150"
                          style={{
                            color:
                              selectedList.visibility === "private" ? "#fff" : "#FF2D8B",
                            borderColor:
                              selectedList.visibility === "private"
                                ? "#FF2D8B"
                                : "rgba(255,255,255,0.12)",
                            backgroundColor:
                              selectedList.visibility === "private"
                                ? "#FF2D8B"
                                : "rgba(255,255,255,0.03)",
                          }}
                        >
                          <LockKey size={10} weight="fill" />
                          Private
                        </button>
                      </form>
                      <form action={setListVisibilityAction}>
                        <input type="hidden" name="listId" value={selectedList.id} />
                        <input type="hidden" name="visibility" value="public" />
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] transition-all duration-150"
                          style={{
                            color:
                              selectedList.visibility === "public" ? "#fff" : "#00A8CC",
                            borderColor:
                              selectedList.visibility === "public"
                                ? "#00A8CC"
                                : "rgba(255,255,255,0.12)",
                            backgroundColor:
                              selectedList.visibility === "public"
                                ? "#00A8CC"
                                : "rgba(255,255,255,0.03)",
                          }}
                        >
                          <GlobeHemisphereWest size={10} weight="fill" />
                          Public
                        </button>
                      </form>
                    </div>
                  ) : activeTab === "shared" ? (
                    <span
                      className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
                      style={{
                        color: "#00C96B",
                        borderColor: "rgba(0,201,107,0.35)",
                        backgroundColor: "rgba(0,201,107,0.12)",
                      }}
                    >
                      <UsersThree size={10} weight="fill" />
                      Group
                    </span>
                  ) : null}
                </div>

                <div className="p-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                      Progress
                    </span>
                    <span
                      className="text-xs font-black"
                      style={{ color: sidebarPct === 100 ? "#00C96B" : "#9CA3AF" }}
                    >
                      {sidebarPacked}/{sidebarTotal}
                    </span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    role="progressbar"
                    aria-label={`${sidebarListName} progress`}
                    aria-valuemin={0}
                    aria-valuemax={sidebarTotal}
                    aria-valuenow={sidebarPacked}
                    style={{ backgroundColor: BORDER }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sidebarPct}%`,
                        backgroundColor: sidebarPct === 100 ? "#00C96B" : sidebarAccent,
                      }}
                    />
                  </div>
                  <p
                    className="mt-2 text-[10px] font-bold leading-snug"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {sidebarCopy}
                  </p>
                </div>
              </DarkCard>

              {/* Group packing card */}
              {packingData.members.length > 0 ? (
                <DarkCard className="overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <p
                      className="text-xs font-black uppercase tracking-[0.22em]"
                      style={{ color: "#9CA3AF" }}
                    >
                      Group packing
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
                    >
                      {packingData.members.length} people
                    </span>
                  </div>

                  {/* You */}
                  {currentMember ? (
                    <div
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{
                          backgroundColor: `${currentMember.color}33`,
                          border: `2px solid ${currentMember.color}55`,
                        }}
                      >
                        {currentMember.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">You</p>
                        <p
                          className="text-[11px] font-bold"
                          style={{ color: myHasPublicList ? "#00C96B" : "#9CA3AF" }}
                        >
                          {myHasPublicList
                            ? `${myTotalPacked}/${myTotalItems} packed · shared`
                            : "Private"}
                        </p>
                      </div>
                      {myHasPublicList && myTotalItems > 0 ? (
                        <div
                          className="h-1.5 w-12 flex-shrink-0 overflow-hidden rounded-full"
                          style={{ backgroundColor: "#3a3a3a" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${myPct}%`,
                              backgroundColor: myPct === 100 ? "#00C96B" : "#00A8CC",
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Other members */}
                  {otherMembers.map((member, i) => {
                    const theirList = publicListByOwnerId.get(member.userId);
                    const theirPct =
                      theirList && theirList.totalCount > 0
                        ? Math.round((theirList.packedCount / theirList.totalCount) * 100)
                        : 0;

                    return (
                      <div
                        key={member.userId}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{
                          borderBottom:
                            i < otherMembers.length - 1 ? `1px solid ${BORDER}` : "none",
                        }}
                      >
                        <div
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                          style={{
                            backgroundColor: `${member.color}33`,
                            border: `2px solid ${member.color}55`,
                          }}
                        >
                          {member.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">{member.name}</p>
                          {theirList ? (
                            <p
                              className="text-[11px] font-bold"
                              style={{ color: "#00C96B" }}
                            >
                              {theirList.packedCount}/{theirList.totalCount} · shared
                            </p>
                          ) : (
                            <p
                              className="flex items-center gap-1 text-[11px] font-bold"
                              style={{ color: "#9CA3AF" }}
                            >
                              <LockSimple size={9} weight="fill" />
                              Private
                            </p>
                          )}
                        </div>
                        {theirList && theirList.totalCount > 0 ? (
                          <div
                            className="h-1.5 w-12 flex-shrink-0 overflow-hidden rounded-full"
                            style={{ backgroundColor: "#3a3a3a" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${theirPct}%`,
                                backgroundColor: theirPct === 100 ? "#00C96B" : "#00A8CC",
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </DarkCard>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
