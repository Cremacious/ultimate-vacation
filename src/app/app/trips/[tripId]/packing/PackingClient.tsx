"use client";

import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import { Backpack, Check, LockKey, Plus, Stack, Trash, UsersThree } from "@phosphor-icons/react";

import type {
  PackingCategoryView,
  PackingItemView,
  PackingListView,
  PackingPageData,
} from "@/lib/packing/queries";
import type { PackingFormState } from "./actions";

interface Props {
  tripName: string;
  packingData: PackingPageData;
  addAction: (_prev: PackingFormState, formData: FormData) => Promise<PackingFormState>;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

type PackingTab = "my" | "group";

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

function ChecklistRow({
  item,
  toggleAction,
  deleteAction,
}: {
  item: PackingItemView;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <li className="group flex items-center gap-3 rounded-[10px] px-1 py-3 transition-colors hover:bg-white/[0.03]">
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
        {item.quantity ? (
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#9CA3AF" }}>
            Qty {item.quantity}
          </span>
        ) : null}
      </div>

      {item.scope === "my" && item.isPrivate ? (
        <span
          className="hidden items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] md:inline-flex"
          style={{
            color: "#FF2D8B",
            borderColor: "rgba(255,45,139,0.25)",
            backgroundColor: "rgba(255,45,139,0.08)",
          }}
        >
          <LockKey size={10} weight="fill" />
          Private
        </span>
      ) : null}

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
    </li>
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

function CategoryCard({
  category,
  progressAccent,
  toggleAction,
  deleteAction,
}: {
  category: PackingCategoryView;
  progressAccent: string;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
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

      <ul className="px-4 py-2">
        {category.items.map((item) => (
          <ChecklistRow
            key={item.id}
            item={item}
            toggleAction={toggleAction}
            deleteAction={deleteAction}
          />
        ))}
      </ul>
    </DarkCard>
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

function getDefaultTab(packingData: PackingPageData): PackingTab {
  if (packingData.myList.totalCount > 0) return "my";
  return "group";
}

function getListCopy(activeTab: PackingTab, activeList: PackingListView): { title: string; body: string } {
  if (activeTab === "my") {
    if (activeList.totalCount === 0) {
      return {
        title: "No personal items yet",
        body: "Personal-only items will appear here once they exist on this trip.",
      };
    }

    return {
      title: "My list",
      body: "Only your personal packing items appear here.",
    };
  }

  if (activeList.totalCount === 0) {
    return {
      title: "No shared items yet",
      body: "Add the first group item to start the shared list.",
    };
  }

  return {
    title: "Group list",
    body: "Shared trip items are grouped here by category.",
  };
}

export default function PackingClient({
  tripName,
  packingData,
  addAction,
  toggleAction,
  deleteAction,
}: Props) {
  const [activeTab, setActiveTab] = useState<PackingTab>(() => getDefaultTab(packingData));
  const [addState, formAction, pending] = useActionState(addAction, {});

  const activeList = activeTab === "my" ? packingData.myList : packingData.groupList;
  const completionPct =
    packingData.counts.total > 0
      ? Math.round((packingData.counts.packed / packingData.counts.total) * 100)
      : 0;
  const progressAccent = completionPct === 100 ? "#00C96B" : "#00A8CC";
  const activeListCopy = getListCopy(activeTab, activeList);
  const statusCopy =
    packingData.counts.total === 0
      ? "Start the shared list with the first thing you do not want the group to forget."
      : packingData.counts.remaining === 0
        ? "Everything across the current packing data is marked packed."
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
              Personal and shared packing, backed by the trip&apos;s live data.
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
            <StatCard label="My list" value={packingData.counts.myTotal} accent="#FF2D8B" />
            <StatCard label="Group list" value={packingData.counts.groupTotal} accent="#00C96B" />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <PackingTabButton
                    active={activeTab === "my"}
                    count={packingData.counts.myTotal}
                    icon={<Backpack size={13} weight="fill" />}
                    label="My list"
                    onClick={() => setActiveTab("my")}
                  />
                  <PackingTabButton
                    active={activeTab === "group"}
                    count={packingData.counts.groupTotal}
                    icon={<UsersThree size={13} weight="fill" />}
                    label="Group list"
                    onClick={() => setActiveTab("group")}
                  />
                </div>

                {activeTab === "group" ? (
                  <form action={formAction} className="flex w-full gap-2 xl:max-w-[460px]">
                    <input
                      type="text"
                      name="text"
                      placeholder="Add a shared item..."
                      required
                      maxLength={200}
                      className="min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm font-bold text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#00A8CC]"
                      style={{ backgroundColor: "#2e2e2e", borderColor: BORDER }}
                    />
                    <button
                      type="submit"
                      disabled={pending}
                      className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black transition disabled:opacity-50"
                      style={{ backgroundColor: "#00A8CC", color: "#fff" }}
                    >
                      <Plus size={12} weight="bold" />
                      {pending ? "Adding..." : "Add to group"}
                    </button>
                  </form>
                ) : null}
              </div>

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

              <DarkCard className="overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(0,168,204,0.14)" }}
                  >
                    {activeTab === "my" ? (
                      <Backpack size={14} weight="fill" color="#FF2D8B" />
                    ) : (
                      <UsersThree size={14} weight="fill" color="#00A8CC" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-black text-white">{activeListCopy.title}</p>
                    <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {activeListCopy.body}
                    </p>
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <span className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {activeList.packedCount}/{activeList.totalCount}
                    </span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ backgroundColor: BORDER }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${activeList.totalCount > 0 ? Math.round((activeList.packedCount / activeList.totalCount) * 100) : 0}%`,
                          backgroundColor: activeTab === "my" ? "#FF2D8B" : progressAccent,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </DarkCard>

              {activeList.totalCount === 0 ? (
                <EmptyState title={activeListCopy.title} body={activeListCopy.body} />
              ) : (
                <div className="space-y-4">
                  {activeList.categories.map((category) => (
                    <CategoryCard
                      key={category.key}
                      category={category}
                      progressAccent={activeTab === "my" ? "#FF2D8B" : progressAccent}
                      toggleAction={toggleAction}
                      deleteAction={deleteAction}
                    />
                  ))}
                </div>
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
                      Shared list items stay visible to the group. Personal items stay separated by owner.
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
                        Packed
                      </span>
                      <span className="text-sm font-black" style={{ color: "#00C96B" }}>
                        {packingData.counts.packed}
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
                        {packingData.counts.myPrivate}
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
