"use client";

import { useActionState, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Backpack,
  Check,
  GlobeHemisphereWest,
  LockKey,
  Plus,
  Stack,
  Trash,
  UsersThree,
} from "@phosphor-icons/react";

import type {
  PackingCategoryView,
  PackingItemView,
  PackingPageData,
  PersonalPackingListView,
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
      className="rounded-2xl border px-4 py-4 text-center"
      style={{ backgroundColor: CARD_SURFACE, borderColor: BORDER }}
    >
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
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#9CA3AF" }}>
        {label}
      </p>
    </div>
  );
}

function PackingTabButton({
  active,
  count,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition-colors"
      style={{
        backgroundColor: active ? "#00A8CC" : "rgba(255,255,255,0.04)",
        borderColor: active ? "#00A8CC" : "rgba(255,255,255,0.08)",
        color: "#fff",
      }}
    >
      {icon}
      <span>{label}</span>
      <span
        className="rounded-full px-2 py-0.5 text-[11px] leading-none"
        style={{
          backgroundColor: active ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.07)",
          color: active ? "#fff" : "#9CA3AF",
        }}
      >
        {count}
      </span>
    </button>
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
      className="flex min-w-[170px] flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-colors"
      style={{
        backgroundColor: active ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        borderColor: active ? visibilityColor : "rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-sm font-black text-white">{list.name}</span>
      <div className="flex items-center gap-2">
        <VisibilityPill active={active} color={visibilityColor}>
          {list.visibility === "public" ? (
            <GlobeHemisphereWest size={10} weight="fill" />
          ) : (
            <LockKey size={10} weight="fill" />
          )}
          {list.visibility}
        </VisibilityPill>
        <span className="text-[11px] font-black" style={{ color: "#9CA3AF" }}>
          {list.remainingCount} left
        </span>
      </div>
    </button>
  );
}

function EmptyState({
  body,
  title,
}: {
  body: string;
  title: string;
}) {
  return (
    <DarkCard className="px-6 py-14 text-center">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
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
  setItemVisibilityAction,
  toggleAction,
  unassignSharedItemAction,
}: {
  currentUserId: string;
  item: PackingItemView;
  claimSharedItemAction?: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveToSharedAction?: (formData: FormData) => Promise<void>;
  setItemVisibilityAction?: (formData: FormData) => Promise<void>;
  toggleAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction?: (formData: FormData) => Promise<void>;
}) {
  const visibilityColor = item.effectiveVisibility === "public" ? "#00A8CC" : "#FF2D8B";
  const nextVisibility = item.effectiveVisibility === "private" ? "public" : "private";
  const isSharedItem = item.listType === "shared";
  const isClaimedByCurrentUser = item.assigneeUserId === currentUserId;
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

  return (
    <li className="group flex items-start gap-3 rounded-[10px] px-1 py-3 transition-colors hover:bg-white/[0.03]">
      <form action={toggleAction}>
        <input type="hidden" name="itemId" value={item.id} />
        <button
          type="submit"
          aria-label={item.isPacked ? `Unpack ${item.text}` : `Pack ${item.text}`}
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all"
          style={{
            backgroundColor: item.isPacked ? "#00C96B" : "transparent",
            borderColor: item.isPacked ? "#00C96B" : "rgba(255,255,255,0.25)",
          }}
        >
          {item.isPacked ? <Check size={9} weight="bold" color="#fff" /> : null}
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <span
          className="block text-sm font-semibold leading-snug transition-colors"
          style={{
            color: item.isPacked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.88)",
            textDecoration: item.isPacked ? "line-through" : "none",
          }}
        >
          {item.text}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {item.quantity ? (
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#9CA3AF" }}>
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
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end gap-2">
          {setItemVisibilityAction ? (
            <form action={setItemVisibilityAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="visibility" value={nextVisibility} />
              <button
                type="submit"
                className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: visibilityColor,
                  borderColor: `${visibilityColor}55`,
                  backgroundColor: `${visibilityColor}14`,
                }}
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
                className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: "#00A8CC",
                  borderColor: "rgba(0,168,204,0.28)",
                  backgroundColor: "rgba(0,168,204,0.12)",
                }}
              >
                Move to shared
              </button>
            </form>
          ) : null}

          {canClaimSharedItem ? (
            <form action={claimSharedItemAction!}>
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: "#00C96B",
                  borderColor: "rgba(0,201,107,0.28)",
                  backgroundColor: "rgba(0,201,107,0.12)",
                }}
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
                className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: "#FFD600",
                  borderColor: "rgba(255,214,0,0.28)",
                  backgroundColor: "rgba(255,214,0,0.12)",
                }}
              >
                Unassign
              </button>
            </form>
          ) : null}
        </div>

        <form action={deleteAction} className="opacity-0 transition-opacity group-hover:opacity-100">
          <input type="hidden" name="itemId" value={item.id} />
          <button
            type="submit"
            aria-label={`Remove ${item.text}`}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <Trash size={14} />
          </button>
        </form>
      </div>
    </li>
  );
}

function CategoryCard({
  currentUserId,
  category,
  claimSharedItemAction,
  deleteAction,
  moveToSharedAction,
  progressAccent,
  setItemVisibilityAction,
  toggleAction,
  unassignSharedItemAction,
}: {
  currentUserId: string;
  category: PackingCategoryView;
  claimSharedItemAction?: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveToSharedAction?: (formData: FormData) => Promise<void>;
  progressAccent: string;
  setItemVisibilityAction?: (formData: FormData) => Promise<void>;
  toggleAction: (formData: FormData) => Promise<void>;
  unassignSharedItemAction?: (formData: FormData) => Promise<void>;
}) {
  const completionPct =
    category.totalCount > 0 ? Math.round((category.packedCount / category.totalCount) * 100) : 0;

  return (
    <DarkCard className="overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(0,168,204,0.14)" }}
        >
          <Stack size={14} weight="fill" color={progressAccent} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black text-white">{category.label}</p>
          <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            {category.totalCount} item{category.totalCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            {category.packedCount}/{category.totalCount}
          </span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ backgroundColor: BORDER }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%`, backgroundColor: progressAccent }}
            />
          </div>
        </div>
      </div>

      {category.totalCount === 0 ? (
        <div className="px-4 py-6 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
          No items in this category yet.
        </div>
      ) : (
        <ul className="px-4 py-2">
          {category.items.map((item) => (
            <ChecklistRow
              key={item.id}
              currentUserId={currentUserId}
              item={item}
              claimSharedItemAction={claimSharedItemAction}
              deleteAction={deleteAction}
              moveToSharedAction={moveToSharedAction}
              setItemVisibilityAction={setItemVisibilityAction}
              toggleAction={toggleAction}
              unassignSharedItemAction={unassignSharedItemAction}
            />
          ))}
        </ul>
      )}
    </DarkCard>
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
            <h1
              className="m-0 text-[2rem] leading-none text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Packing
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#9CA3AF" }}>
              Build your own lists, choose what stays private, and keep the shared gear coordinated.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 md:items-end">
            <p
              className="leading-none"
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: "1.5rem",
                color: progressAccent,
              }}
            >
              {packingData.counts.packed}
              <span style={{ fontSize: "1rem", color: "#555" }}>/{packingData.counts.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-28 overflow-hidden rounded-full" style={{ backgroundColor: BORDER }}>
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

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <StatCard
              label="Items packed"
              value={packingData.counts.packed}
              suffix={`/${packingData.counts.total}`}
              accent="#00A8CC"
            />
            <StatCard label="My lists" value={packingData.counts.myListsCount} accent="#FF2D8B" />
            <StatCard label="Shared items" value={packingData.counts.sharedItems} accent="#00C96B" />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <PackingTabButton
                  active={activeTab === "my"}
                  count={packingData.counts.myItems}
                  icon={<Backpack size={13} weight="fill" />}
                  label="My lists"
                  onClick={() => setActiveTab("my")}
                />
                <PackingTabButton
                  active={activeTab === "shared"}
                  count={packingData.counts.sharedItems}
                  icon={<UsersThree size={13} weight="fill" />}
                  label="Shared"
                  onClick={() => setActiveTab("shared")}
                />
              </div>

              {activeTab === "my" ? (
                <>
                  <DarkCard className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <p className="text-sm font-black text-white">Your lists</p>
                          <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Create bags, kits, and one-off lists here. New lists start private by default.
                          </p>
                        </div>

                        <form action={createListFormAction} className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="text"
                            name="name"
                            placeholder="New list name"
                            required
                            maxLength={50}
                            className="min-w-0 rounded-full border px-4 py-2.5 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:border-[#FF2D8B]"
                            style={{ backgroundColor: "#262626", borderColor: BORDER }}
                          />
                          <select
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
                    </div>
                  </DarkCard>

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

                  {selectedList ? (
                    <>
                      <DarkCard className="overflow-hidden">
                        <div
                          className="flex flex-col gap-4 px-4 py-4"
                          style={{ borderBottom: `1px solid ${BORDER}` }}
                        >
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                              <p className="text-lg font-black text-white">{selectedList.name}</p>
                              <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
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
                            <input
                              type="text"
                              name="text"
                              placeholder={`Add an item to ${selectedList.name}...`}
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
                              {addPending ? "Adding..." : "Add to list"}
                            </button>
                          </form>
                        </div>
                      </DarkCard>

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
                        <EmptyState
                          title="No items yet"
                          body="Add the first item to this list. You can keep the whole list private or mark specific items public."
                        />
                      ) : (
                        <div className="space-y-4">
                          {selectedList.categories.map((category) => (
                            <CategoryCard
                              key={`${selectedList.id}-${category.key}`}
                              currentUserId={currentUserId}
                              category={category}
                              deleteAction={deleteAction}
                              moveToSharedAction={moveToSharedAction}
                              progressAccent="#FF2D8B"
                              setItemVisibilityAction={setItemVisibilityAction}
                              toggleAction={toggleAction}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState
                      title="No lists yet"
                      body="Create your first list to start packing for this trip."
                    />
                  )}
                </>
              ) : (
                <>
                  {sharedList ? (
                    <>
                      <DarkCard className="overflow-hidden">
                        <div
                          className="flex flex-col gap-4 px-4 py-4"
                          style={{ borderBottom: `1px solid ${BORDER}` }}
                        >
                          <div>
                            <p className="text-lg font-black text-white">{sharedList.name}</p>
                            <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                              Shared items stay visible to the group. Claim one when you are the bringer, or move it here from a personal list.
                            </p>
                          </div>

                          <form action={addFormAction} className="flex flex-col gap-2 sm:flex-row">
                            <input type="hidden" name="listId" value={sharedList.id} />
                            <input
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
                        <EmptyState
                          title="No shared items yet"
                          body="Add the first group item here so everyone knows it still needs a bringer."
                        />
                      ) : (
                        <div className="space-y-4">
                          {sharedList.categories.map((category) => (
                            <CategoryCard
                              key={`${sharedList.id}-${category.key}`}
                              currentUserId={currentUserId}
                              category={category}
                              claimSharedItemAction={claimSharedItemAction}
                              deleteAction={deleteAction}
                              progressAccent={progressAccent}
                              toggleAction={toggleAction}
                              unassignSharedItemAction={unassignSharedItemAction}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState
                      title="No shared list yet"
                      body="The shared coordination list will appear here once this trip has one."
                    />
                  )}
                </>
              )}
            </div>

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
                    <p className="mt-1 text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.28)" }}>
                      Personal lists let you organize by bag or context. Shared keeps the group-facing items in one place.
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                        Overall progress
                      </span>
                      <span className="text-xs font-black" style={{ color: progressAccent }}>
                        {packingData.counts.packed}/{packingData.counts.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: BORDER }}>
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
                  <div
                    className="rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                        Personal lists
                      </span>
                      <span className="text-sm font-black" style={{ color: "#FF2D8B" }}>
                        {packingData.counts.myListsCount}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                        Private items
                      </span>
                      <span className="text-sm font-black" style={{ color: "#FF2D8B" }}>
                        {packingData.counts.myPrivateItems}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                        Shared items
                      </span>
                      <span className="text-sm font-black" style={{ color: "#00C96B" }}>
                        {packingData.counts.sharedItems}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.07)",
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#9CA3AF" }}>
                      Status
                    </p>
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
