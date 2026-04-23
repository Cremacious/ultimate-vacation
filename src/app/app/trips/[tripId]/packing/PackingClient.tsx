"use client";

import { useActionState, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Backpack,
  Check,
  GlobeHemisphereWest,
  LockKey,
  Plus,
  Trash,
  UsersThree,
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

const SURFACE = "#404040";
const HEADER_SURFACE = "#282828";
const CARD_SURFACE = "#2e2e2e";
const BORDER = "#3a3a3a";
const MUTED_TEXT = "rgba(255,255,255,0.62)";

// Resting text is white/85 for contrast compliance — color identity comes from border + background tint.
// Hover/focus: full color fill with dark text. Full class strings required for Tailwind JIT.
const PILL = {
  cyan: "text-white/[0.85] border-[rgba(0,168,204,0.4)] bg-[rgba(0,168,204,0.12)] hover:bg-[#00A8CC] hover:border-[#00A8CC] hover:text-[#0e1117] focus-visible:bg-[#00A8CC] focus-visible:border-[#00A8CC] focus-visible:text-[#0e1117]",
  pink: "text-white/[0.85] border-[rgba(255,45,139,0.4)] bg-[rgba(255,45,139,0.12)] hover:bg-[#FF2D8B] hover:border-[#FF2D8B] hover:text-white focus-visible:bg-[#FF2D8B] focus-visible:border-[#FF2D8B] focus-visible:text-white",
  green: "text-white/[0.85] border-[rgba(0,201,107,0.4)] bg-[rgba(0,201,107,0.12)] hover:bg-[#00C96B] hover:border-[#00C96B] hover:text-[#0e1117] focus-visible:bg-[#00C96B] focus-visible:border-[#00C96B] focus-visible:text-[#0e1117]",
  yellow: "text-[#FFD600] border-[rgba(255,214,0,0.4)] bg-[rgba(255,214,0,0.12)] hover:bg-[#FFD600] hover:border-[#FFD600] hover:text-[#0e1117] focus-visible:bg-[#FFD600] focus-visible:border-[#FFD600] focus-visible:text-[#0e1117]",
} as const;

const PILL_BASE = "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50";

function DarkCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: CARD_SURFACE, borderColor: BORDER }}
    >
      {children}
    </div>
  );
}

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
      className="relative overflow-hidden rounded-2xl px-4 py-4 text-center"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-4 right-4 h-px"
        style={{ backgroundColor: accent }}
      />
      <p
        className="leading-none"
        style={{
          fontFamily: "var(--font-fredoka)",
          fontSize: "1.75rem",
          fontWeight: 900,
          color: accent,
        }}
      >
        {value}
        {suffix ? <span style={{ fontSize: "1rem", color: "#555" }}>{suffix}</span> : null}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.65)" }}>
        {label}
      </p>
    </div>
  );
}

function VisibilityPill({
  active,
  children,
  color,
}: {
  active: boolean;
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
      style={{
        color: active ? "#fff" : color,
        borderColor: active ? color : "rgba(255,255,255,0.12)",
        backgroundColor: active ? color : "rgba(255,255,255,0.03)",
      }}
    >
      {children}
    </span>
  );
}

function PersonalListChip({
  active,
  list,
  onClick,
}: {
  active: boolean;
  list: PersonalPackingListView;
  onClick: () => void;
}) {
  const visibilityColor = list.visibility === "public" ? "#00A8CC" : "#FF2D8B";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${list.name}, ${list.visibility}, ${list.remainingCount} items left`}
      className="flex min-w-[160px] flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-all duration-150"
      style={{
        backgroundColor: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        borderColor: active ? "transparent" : "rgba(255,255,255,0.08)",
        boxShadow: active ? `0 0 0 1px ${visibilityColor}` : "none",
      }}
    >
      <span className="text-[13px] font-black text-white">{list.name}</span>
      <div className="flex items-center gap-1.5">
        {list.visibility === "public" ? (
          <GlobeHemisphereWest size={10} weight="fill" color="rgba(255,255,255,0.45)" />
        ) : (
          <LockKey size={10} weight="fill" color="rgba(255,255,255,0.45)" />
        )}
        <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.45)" }}>
          {list.visibility} · {list.remainingCount} left
        </span>
      </div>
    </button>
  );
}

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
  // Shared toggle: unclaimed = anyone; claimed = assignee only
  const canTogglePacked = !isSharedItem || !item.assigneeUserId || isClaimedByCurrentUser;
  // Shared delete: only the item owner
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
  const showActionRail = !readOnly;
  const visibilityPillClass = item.effectiveVisibility === "public" ? PILL.cyan : PILL.pink;

  const toggleIndicator = (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
      style={{
        backgroundColor: item.isPacked ? "#00C96B" : "transparent",
        borderColor: item.isPacked ? "#00C96B" : "rgba(255,255,255,0.25)",
        boxShadow: item.isPacked ? "0 0 0 3px rgba(0,201,107,0.25)" : "none",
      }}
    >
      {item.isPacked ? <Check size={9} weight="bold" color="#fff" /> : null}
    </span>
  );

  return (
    <li className="group flex items-start gap-3 rounded-[10px] px-1 py-3.5 transition-colors hover:bg-white/[0.03]">
      {readOnly || !canTogglePacked ? (
        toggleIndicator
      ) : (
        <form action={toggleAction} className="mt-0.5">
          <input type="hidden" name="itemId" value={item.id} />
          <button
            type="submit"
            aria-label={item.isPacked ? `Unpack ${item.text}` : `Pack ${item.text}`}
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
            style={{
              backgroundColor: item.isPacked ? "#00C96B" : "transparent",
              borderColor: item.isPacked ? "#00C96B" : "rgba(255,255,255,0.25)",
              boxShadow: item.isPacked ? "0 0 0 3px rgba(0,201,107,0.25)" : "none",
            }}
          >
            {item.isPacked ? <Check size={9} weight="bold" color="#fff" /> : null}
          </button>
        </form>
      )}

      <div className="min-w-0 flex-1">
        <span
          className="block text-sm font-semibold leading-snug"
          style={{
            color: item.isPacked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.88)",
            textDecoration: item.isPacked ? "line-through" : "none",
          }}
        >
          {item.text}
        </span>
        {(item.quantity || isSharedItem) ? (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {item.quantity ? (
              <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#9CA3AF" }}>
                Qty {item.quantity}
              </span>
            ) : null}
            {isSharedItem ? (
              <span
                className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: item.assigneeUserId ? "#00C96B" : "#FFD600",
                  borderColor: item.assigneeUserId ? "rgba(0,201,107,0.28)" : "rgba(255,214,0,0.28)",
                  backgroundColor: item.assigneeUserId ? "rgba(0,201,107,0.12)" : "rgba(255,214,0,0.12)",
                }}
              >
                {item.assigneeInitials ? (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[9px]"
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
          </div>
        ) : null}
      </div>

      {showActionRail ? (
        <div className="flex min-h-[44px] flex-col items-end justify-center gap-1.5">
          <div className="flex flex-wrap justify-end gap-1.5">
            {setItemVisibilityAction ? (
              <form action={setItemVisibilityAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="visibility" value={nextVisibility} />
                <button
                  type="submit"
                  aria-label={`Make ${item.text} ${nextVisibility}`}
                  className={`${PILL_BASE} ${visibilityPillClass}`}
                >
                  {item.effectiveVisibility}
                </button>
              </form>
            ) : null}

            {moveToSharedAction ? (
              <form action={moveToSharedAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  aria-label={`Move ${item.text} to shared`}
                  className={`${PILL_BASE} ${PILL.cyan}`}
                >
                  Share
                </button>
              </form>
            ) : null}

            {canClaimSharedItem ? (
              <form action={claimSharedItemAction!}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  aria-label={`Claim ${item.text}`}
                  className={`${PILL_BASE} ${PILL.green}`}
                >
                  Claim
                </button>
              </form>
            ) : null}

            {canUnassignSharedItem ? (
              <form action={unassignSharedItemAction!}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  aria-label={`Unassign ${item.text}`}
                  className={`${PILL_BASE} ${PILL.yellow}`}
                >
                  Unassign
                </button>
              </form>
            ) : null}
          </div>

          {canDeleteItem ? (
            <form
              action={deleteAction}
              className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                aria-label={`Remove ${item.text}`}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                <Trash size={14} />
              </button>
            </form>
          ) : null}
        </div>
      ) : (
        <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: MUTED_TEXT }}>
          {item.isPacked ? "Packed" : "Visible"}
        </span>
      )}
    </li>
  );
}

function CategorySection({
  currentUserId,
  category,
  accent,
  claimSharedItemAction,
  deleteAction,
  moveToSharedAction,
  readOnly = false,
  setItemVisibilityAction,
  toggleAction,
  unassignSharedItemAction,
}: {
  currentUserId: string;
  category: PackingCategoryView;
  accent: string;
  claimSharedItemAction?: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveToSharedAction?: (formData: FormData) => Promise<void>;
  readOnly?: boolean;
  setItemVisibilityAction?: (formData: FormData) => Promise<void>;
  toggleAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction?: (formData: FormData) => Promise<void>;
}) {
  if (category.totalCount === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 border-l-2 pl-3" style={{ borderColor: accent }}>
        <span
          className="text-[11px] font-black uppercase tracking-[0.22em]"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {category.label}
        </span>
        <span className="ml-auto text-[11px] font-black" style={{ color: "rgba(255,255,255,0.55)" }}>
          {category.packedCount}/{category.totalCount}
        </span>
      </div>
      <ul className="pl-4">
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
    </div>
  );
}

function MemberBadge({ color, initials, name }: { color: string; initials: string; name: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
      style={{ borderColor: `${color}40`, backgroundColor: `${color}14` }}
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
        style={{ backgroundColor: `${color}33`, color }}
      >
        {initials}
      </span>
      <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white">{name}</span>
    </div>
  );
}

function PublicListCard({
  currentUserId,
  list,
  toggleAction,
}: {
  currentUserId: string;
  list: PublicPackingListView;
  toggleAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl pl-1"
      style={{ backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${list.owner.color}` }}
    >
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[13px] font-black text-white">{list.name}</p>
            <p className="text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
              Public items from {list.owner.name}'s list. Private items stay hidden.
            </p>
          </div>
          <MemberBadge color={list.owner.color} initials={list.owner.initials} name={list.owner.name} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: list.owner.color }}>
            {list.packedCount}/{list.totalCount} packed
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {list.remainingCount} left
          </span>
        </div>
      </div>

      {list.totalCount === 0 ? (
        <p className="px-4 pb-4 text-sm font-semibold" style={{ color: MUTED_TEXT }}>
          No public items right now.
        </p>
      ) : (
        <div className="space-y-4 px-4 pb-4">
          {list.categories.map((category) => (
            <CategorySection
              key={`${list.id}-${category.key}`}
              currentUserId={currentUserId}
              category={category}
              accent={list.owner.color}
              deleteAction={async () => {}}
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
  const [selectedListId, setSelectedListId] = useState<string | null>(() => packingData.myLists[0]?.id ?? null);
  const [addState, addFormAction, addPending] = useActionState(addAction, {});
  const [createState, createListFormAction, createPending] = useActionState(createListAction, {});

  useEffect(() => {
    if (createState.createdListId) {
      setSelectedListId(createState.createdListId);
      setActiveTab("my");
    }
  }, [createState.createdListId]);

  useEffect(() => {
    if (!packingData.myLists.some((list) => list.id === selectedListId)) {
      setSelectedListId(packingData.myLists[0]?.id ?? null);
    }
  }, [packingData.myLists, selectedListId]);

  const selectedList =
    packingData.myLists.find((list) => list.id === selectedListId) ?? packingData.myLists[0] ?? null;
  const sharedList = packingData.sharedLists[0] ?? null;
  const completionPct =
    packingData.counts.total > 0
      ? Math.round((packingData.counts.packed / packingData.counts.total) * 100)
      : 0;
  const progressAccent = completionPct === 100 ? "#00C96B" : "#00A8CC";
  const statusCopy =
    packingData.counts.total === 0
      ? "Start a personal list or add the first shared item to get this trip packing."
      : packingData.counts.remaining === 0
        ? "Everything across your current packing setup is marked packed."
        : `${packingData.counts.remaining} item${packingData.counts.remaining === 1 ? "" : "s"} still left to pack.`;

  return (
    <div className="min-h-[calc(100vh-68px)]" style={{ backgroundColor: SURFACE }}>
      <div style={{ backgroundColor: HEADER_SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="m-0 text-[2rem] leading-none text-white" style={{ fontFamily: "var(--font-fredoka)" }}>
              Packing
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#9CA3AF" }}>
              Build your own lists, choose what stays private, and keep the shared gear coordinated.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 md:items-end">
            <p className="leading-none" style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.5rem", color: progressAccent }}>
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
              <span className="text-xs font-black" style={{ color: progressAccent }}>{completionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <StatCard label="Items packed" value={packingData.counts.packed} suffix={`/${packingData.counts.total}`} accent="#00A8CC" />
            <StatCard label="My lists" value={packingData.counts.myListsCount} accent="#FF2D8B" />
            <StatCard label="Shared items" value={packingData.counts.sharedItems} accent="#00C96B" />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div className="space-y-4">
              {/* Segmented tab control */}
              <div
                role="tablist"
                aria-label="Packing sections"
                className="relative inline-grid grid-cols-2 rounded-full p-1"
                style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Sliding capsule — motion-safe ensures no translate animation for prefers-reduced-motion */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-1 rounded-full motion-safe:transition-transform motion-safe:duration-200"
                  style={{
                    backgroundColor: "#00A8CC",
                    width: "calc(50% - 4px)",
                    left: "4px",
                    transform: activeTab === "shared" ? "translateX(calc(100% + 4px))" : "translateX(0)",
                    transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
                <button
                  id="packing-tab-my"
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "my"}
                  aria-controls="packing-panel-my"
                  onClick={() => setActiveTab("my")}
                  className="relative z-10 flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white"
                >
                  <Backpack size={13} weight="fill" />
                  <span>My lists</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] leading-none"
                    style={{
                      backgroundColor: activeTab === "my" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.07)",
                      color: activeTab === "my" ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {packingData.counts.myItems}
                  </span>
                </button>
                <button
                  id="packing-tab-shared"
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "shared"}
                  aria-controls="packing-panel-shared"
                  onClick={() => setActiveTab("shared")}
                  className="relative z-10 flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white"
                >
                  <UsersThree size={13} weight="fill" />
                  <span>Shared</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] leading-none"
                    style={{
                      backgroundColor: activeTab === "shared" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.07)",
                      color: activeTab === "shared" ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {packingData.counts.sharedItems}
                  </span>
                </button>
              </div>

              {/* My lists panel */}
              {activeTab === "my" ? (
                <div role="tabpanel" id="packing-panel-my" aria-labelledby="packing-tab-my" className="space-y-4">
                  <DarkCard className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <p className="text-sm font-black text-white">Your lists</p>
                          <p className="text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
                            Create bags, kits, and one-off lists. New lists start private.
                          </p>
                        </div>

                        <form action={createListFormAction} className="flex flex-col gap-2 sm:flex-row">
                          <label htmlFor="new-packing-list-name" className="sr-only">New packing list name</label>
                          <input
                            id="new-packing-list-name"
                            type="text"
                            name="name"
                            placeholder="New list name"
                            required
                            maxLength={50}
                            className="min-w-0 rounded-full border px-4 py-2.5 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:border-[#FF2D8B]"
                            style={{ backgroundColor: "#262626", borderColor: BORDER }}
                          />
                          <label htmlFor="new-packing-list-visibility" className="sr-only">New list visibility</label>
                          <select
                            id="new-packing-list-visibility"
                            name="visibility"
                            defaultValue="private"
                            className="rounded-full border px-4 py-2.5 text-sm font-black text-white outline-none"
                            style={{ backgroundColor: "#262626", borderColor: BORDER }}
                          >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                          </select>
                          <button
                            type="submit"
                            disabled={createPending}
                            className="flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black transition disabled:opacity-50"
                            style={{ backgroundColor: "#FF2D8B", color: "#fff" }}
                          >
                            <Plus size={12} weight="bold" />
                            {createPending ? "Creating..." : "Create list"}
                          </button>
                        </form>
                      </div>

                      {packingData.myLists.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                          {packingData.myLists.map((list) => (
                            <PersonalListChip
                              key={list.id}
                              active={list.id === selectedList?.id}
                              list={list}
                              onClick={() => setSelectedListId(list.id)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </DarkCard>

                  {createState.error ? (
                    <div role="alert" className="flex items-center gap-2 rounded-[12px] px-3 py-2.5" style={{ backgroundColor: "rgba(255,45,139,0.08)", border: "1px solid rgba(255,45,139,0.2)" }}>
                      <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>{createState.error}</span>
                    </div>
                  ) : null}

                  {selectedList ? (
                    <>
                      <DarkCard className="overflow-hidden">
                        <div className="flex flex-col gap-4 px-4 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                              <p className="text-lg font-black text-white">{selectedList.name}</p>
                              <p className="text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
                                {selectedList.visibility === "private"
                                  ? "Only you can see this list unless you make an item public."
                                  : "Trip members can see this list. Private items stay hidden."}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <form action={setListVisibilityAction}>
                                <input type="hidden" name="listId" value={selectedList.id} />
                                <input type="hidden" name="visibility" value="private" />
                                <button type="submit">
                                  <VisibilityPill active={selectedList.visibility === "private"} color="#FF2D8B">
                                    <LockKey size={10} weight="fill" />
                                    Private
                                  </VisibilityPill>
                                </button>
                              </form>
                              <form action={setListVisibilityAction}>
                                <input type="hidden" name="listId" value={selectedList.id} />
                                <input type="hidden" name="visibility" value="public" />
                                <button type="submit">
                                  <VisibilityPill active={selectedList.visibility === "public"} color="#00A8CC">
                                    <GlobeHemisphereWest size={10} weight="fill" />
                                    Public
                                  </VisibilityPill>
                                </button>
                              </form>
                            </div>
                          </div>

                          <form action={addFormAction} className="flex flex-col gap-2 sm:flex-row">
                            <input type="hidden" name="listId" value={selectedList.id} />
                            <label htmlFor={`packing-add-item-${selectedList.id}`} className="sr-only">
                              Add item to {selectedList.name}
                            </label>
                            <input
                              id={`packing-add-item-${selectedList.id}`}
                              type="text"
                              name="text"
                              placeholder={`Add to ${selectedList.name}...`}
                              required
                              maxLength={200}
                              className="min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:border-[#FF2D8B]"
                              style={{ backgroundColor: "#262626", borderColor: BORDER }}
                            />
                            <button
                              type="submit"
                              disabled={addPending}
                              className="flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black transition disabled:opacity-50"
                              style={{ backgroundColor: "#FF2D8B", color: "#fff" }}
                            >
                              <Plus size={12} weight="bold" />
                              {addPending ? "Adding..." : "Add item"}
                            </button>
                          </form>
                        </div>
                      </DarkCard>

                      {addState.error ? (
                        <div role="alert" className="flex items-center gap-2 rounded-[12px] px-3 py-2.5" style={{ backgroundColor: "rgba(255,45,139,0.08)", border: "1px solid rgba(255,45,139,0.2)" }}>
                          <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>{addState.error}</span>
                        </div>
                      ) : null}

                      {selectedList.totalCount === 0 ? (
                        <EmptyState
                          title="No items yet"
                          body="Add the first item to this list. Keep the whole list private or mark specific items public."
                        />
                      ) : (
                        <div className="space-y-5">
                          {selectedList.categories.map((category) => (
                            <CategorySection
                              key={`${selectedList.id}-${category.key}`}
                              currentUserId={currentUserId}
                              category={category}
                              accent="#FF2D8B"
                              deleteAction={deleteAction}
                              moveToSharedAction={moveToSharedAction}
                              setItemVisibilityAction={setItemVisibilityAction}
                              toggleAction={toggleAction}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState title="No lists yet" body="Create your first list to start packing for this trip." />
                  )}
                </div>
              ) : (
                /* Shared panel */
                <div role="tabpanel" id="packing-panel-shared" aria-labelledby="packing-tab-shared" className="space-y-4">
                  {sharedList ? (
                    <>
                      <DarkCard className="overflow-hidden">
                        <div className="flex flex-col gap-4 px-4 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <div>
                            <p className="text-lg font-black text-white">{sharedList.name}</p>
                            <p className="text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
                              Shared items stay visible to the group. Claim one when you're the bringer.
                            </p>
                          </div>

                          <form action={addFormAction} className="flex flex-col gap-2 sm:flex-row">
                            <input type="hidden" name="listId" value={sharedList.id} />
                            <label htmlFor={`packing-add-shared-${sharedList.id}`} className="sr-only">Add shared packing item</label>
                            <input
                              id={`packing-add-shared-${sharedList.id}`}
                              type="text"
                              name="text"
                              placeholder="Add a shared item..."
                              required
                              maxLength={200}
                              className="min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:border-[#00A8CC]"
                              style={{ backgroundColor: "#262626", borderColor: BORDER }}
                            />
                            <button
                              type="submit"
                              disabled={addPending}
                              className="flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black transition disabled:opacity-50"
                              style={{ backgroundColor: "#00A8CC", color: "#fff" }}
                            >
                              <Plus size={12} weight="bold" />
                              {addPending ? "Adding..." : "Add shared item"}
                            </button>
                          </form>
                        </div>
                      </DarkCard>

                      {addState.error ? (
                        <div role="alert" className="flex items-center gap-2 rounded-[12px] px-3 py-2.5" style={{ backgroundColor: "rgba(255,45,139,0.08)", border: "1px solid rgba(255,45,139,0.2)" }}>
                          <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>{addState.error}</span>
                        </div>
                      ) : null}

                      {sharedList.totalCount === 0 ? (
                        <EmptyState
                          title="No shared items yet"
                          body="Add the first group item so everyone knows it still needs a bringer."
                        />
                      ) : (
                        <div className="space-y-5">
                          {sharedList.categories.map((category) => (
                            <CategorySection
                              key={`${sharedList.id}-${category.key}`}
                              currentUserId={currentUserId}
                              category={category}
                              accent={progressAccent}
                              claimSharedItemAction={claimSharedItemAction}
                              deleteAction={deleteAction}
                              toggleAction={toggleAction}
                              unassignSharedItemAction={unassignSharedItemAction}
                            />
                          ))}
                        </div>
                      )}

                      {/* Public personal lists — flat section, no outer card */}
                      <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.6)" }}>
                          Public personal lists
                        </p>
                        {packingData.publicLists.length === 0 ? (
                          <div
                            className="rounded-2xl border px-4 py-6 text-sm font-semibold"
                            style={{ borderColor: "rgba(255,255,255,0.08)", color: MUTED_TEXT }}
                          >
                            No other public personal lists are visible yet.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {packingData.publicLists.map((list) => (
                              <PublicListCard
                                key={list.id}
                                currentUserId={currentUserId}
                                list={list}
                                toggleAction={toggleAction}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      title="No shared list yet"
                      body="The shared coordination list will appear here once this trip has one."
                    />
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <DarkCard className="overflow-hidden">
                <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#9CA3AF" }}>
                    This trip
                  </p>
                </div>
                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-sm font-bold text-white">{tripName}</p>
                    <p className="mt-1 text-[11px] font-bold" style={{ color: MUTED_TEXT }}>
                      Personal lists let you organize by bag or context. Shared keeps the group-facing items in one place.
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>Overall progress</span>
                      <span className="text-xs font-black" style={{ color: progressAccent }}>
                        {packingData.counts.packed}/{packingData.counts.total}
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full"
                      role="progressbar"
                      aria-label="Overall progress summary"
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
                  </div>
                </div>
              </DarkCard>

              <DarkCard className="overflow-hidden">
                <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#9CA3AF" }}>
                    Packing summary
                  </p>
                </div>
                <div className="space-y-3 p-4">
                  {[
                    { label: "Personal lists", value: packingData.counts.myListsCount, color: "#FF2D8B" },
                    { label: "Private items", value: packingData.counts.myPrivateItems, color: "#FF2D8B" },
                    { label: "Shared items", value: packingData.counts.sharedItems, color: "#00C96B" },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl border px-3 py-3"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>{label}</span>
                      <span className="text-sm font-black" style={{ color }}>{value}</span>
                    </div>
                  ))}
                  <div
                    className="rounded-xl border px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#9CA3AF" }}>Status</p>
                    <p className="mt-2 text-sm font-bold text-white">{statusCopy}</p>
                  </div>
                </div>
              </DarkCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
