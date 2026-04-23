"use client";

import { useActionState } from "react";
import { Backpack, Check, Plus, Trash } from "@phosphor-icons/react";

import type { PackingItem } from "@/lib/packing/queries";
import type { PackingFormState } from "./actions";

interface Props {
  tripName: string;
  items: PackingItem[];
  addAction: (_prev: PackingFormState, formData: FormData) => Promise<PackingFormState>;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

const SURFACE = "#404040";
const HEADER_SURFACE = "#282828";
const CARD_SURFACE = "#2e2e2e";
const BORDER = "#3a3a3a";

function DarkCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
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
  item: PackingItem;
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

      <span
        className="flex-1 text-sm font-semibold leading-snug transition-colors"
        style={{
          color: item.isPacked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.88)",
          textDecoration: item.isPacked ? "line-through" : "none",
        }}
      >
        {item.text}
      </span>

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

export default function PackingClient({
  tripName,
  items,
  addAction,
  toggleAction,
  deleteAction,
}: Props) {
  const [addState, formAction, pending] = useActionState(addAction, {});

  const packedCount = items.filter((item) => item.isPacked).length;
  const totalCount = items.length;
  const remainingCount = Math.max(totalCount - packedCount, 0);
  const completionPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const progressAccent = completionPct === 100 ? "#00C96B" : "#00A8CC";
  const statusCopy =
    totalCount === 0
      ? "Start the list with the first thing you do not want to forget."
      : remainingCount === 0
        ? "Everything on this checklist is packed."
        : `${remainingCount} item${remainingCount === 1 ? "" : "s"} still left to pack.`;

  return (
    <div className="min-h-[calc(100vh-68px)]" style={{ backgroundColor: SURFACE }}>
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
              Live checklist for {tripName}
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
              {packedCount}
              <span style={{ fontSize: "1rem", color: "#555" }}>/{totalCount}</span>
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

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <StatCard label="Items packed" value={packedCount} suffix={`/${totalCount}`} accent="#00A8CC" />
            <StatCard label="Still to pack" value={remainingCount} accent="#00C96B" />
            <StatCard label="Completion" value={`${completionPct}%`} accent="#FF2D8B" />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full border px-4 py-1.5 text-sm font-black text-white"
                    style={{ backgroundColor: "#00A8CC", borderColor: "#00A8CC" }}
                  >
                    Checklist
                  </span>
                  <span
                    className="rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color: "#9CA3AF",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    {totalCount} items
                  </span>
                </div>

                <form action={formAction} className="flex w-full gap-2 xl:max-w-[440px]">
                  <input
                    type="text"
                    name="text"
                    placeholder="Add an item..."
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
                    {pending ? "Adding..." : "Add"}
                  </button>
                </form>
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
                    <Backpack size={14} weight="fill" color="#00A8CC" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-black text-white">All items</p>
                    <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Real trip data, with the old packing-page composition restored around it.
                    </p>
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <span className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {packedCount}/{totalCount}
                    </span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ backgroundColor: BORDER }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%`, backgroundColor: progressAccent }}
                      />
                    </div>
                  </div>
                </div>

                {totalCount === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Nothing here yet. Add the first thing to pack.
                    </p>
                  </div>
                ) : (
                  <ul className="px-4 py-2">
                    {items.map((item) => (
                      <ChecklistRow
                        key={item.id}
                        item={item}
                        toggleAction={toggleAction}
                        deleteAction={deleteAction}
                      />
                    ))}
                  </ul>
                )}
              </DarkCard>
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
                      One live checklist for everything you need to bring.
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>
                        Progress
                      </span>
                      <span className="text-xs font-black" style={{ color: progressAccent }}>
                        {packedCount}/{totalCount}
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
                        {packedCount}
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
                        Remaining
                      </span>
                      <span className="text-sm font-black" style={{ color: "#FF2D8B" }}>
                        {remainingCount}
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
