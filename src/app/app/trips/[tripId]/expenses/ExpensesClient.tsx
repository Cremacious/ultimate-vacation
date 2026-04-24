"use client";

import { useActionState, useState } from "react";
import {
  AirplaneTilt,
  Bed,
  ForkKnife,
  Ticket,
  Bus,
  ShoppingBag,
  DotsThree,
  CaretDown,
  CaretUp,
  Plus,
  X,
} from "@phosphor-icons/react";

import { ReceiptAttach } from "@/components/receipts/ReceiptAttach";
import { SettleUpClient } from "@/components/settle/SettleUpClient";

import { createExpenseAction, type CreateExpenseFormState } from "./actions";

type Member = { userId: string; name: string };
type Expense = {
  id: string;
  amountCents: number;
  description: string;
  category: string;
  payerId: string;
  payerName: string;
  paidAt: Date | string;
  participantCount: number;
  receipt?: { blobUrl: string; mimeType: string } | null;
};
type BalanceRow = {
  userId: string;
  name: string;
  netCents: number;
  totalPaidCents: number;
  totalOwedCents: number;
};
type TransferView = {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amountCents: number;
};
type PastSettlement = {
  id: string;
  fromName: string;
  toName: string;
  amountCents: number;
  currency: string;
  settledAt: string;
  note: string | null;
};

const CATEGORIES = [
  { key: "flights",    label: "Flights",    icon: AirplaneTilt, color: "#FF2D8B" },
  { key: "lodging",    label: "Lodging",    icon: Bed,          color: "#A855F7" },
  { key: "food",       label: "Food",       icon: ForkKnife,    color: "#FFD600" },
  { key: "activities", label: "Activities", icon: Ticket,       color: "#FF8C00" },
  { key: "transport",  label: "Transport",  icon: Bus,          color: "#00A8CC" },
  { key: "shopping",   label: "Shopping",   icon: ShoppingBag,  color: "#00C96B" },
  { key: "general",    label: "Other",      icon: DotsThree,    color: "#9CA3AF" },
] as const;

function getCategoryMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
}

function fmtMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
function fmtMoneyWhole(cents: number) {
  return `$${Math.round(cents / 100).toLocaleString()}`;
}
function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function memberColor(userId: string) {
  const PALETTE = ["#FF2D8B", "#00E5FF", "#FFD600", "#A855F7", "#FF8C00", "#00C96B"];
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
function groupByDate(expenses: Expense[]): { label: string; items: Expense[] }[] {
  const map = new Map<string, Expense[]>();
  for (const e of expenses) {
    const d = new Date(e.paidAt);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(e);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function Avatar({ name, userId }: { name: string; userId: string }) {
  const color = memberColor(userId);
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ backgroundColor: color + "33", color, border: `1.5px solid ${color}` }}
    >
      {initials(name)}
    </div>
  );
}

function ExpenseRow({
  expense,
  currentUserId,
}: {
  expense: Expense;
  currentUserId: string;
}) {
  const cat = getCategoryMeta(expense.category);
  const Icon = cat.icon;
  const myShare =
    expense.participantCount > 0
      ? Math.ceil(expense.amountCents / expense.participantCount)
      : 0;
  const iPaid = expense.payerId === currentUserId;

  return (
    <div className="rounded-xl border border-[#3a3a3a] bg-[#2e2e2e] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: cat.color + "22" }}
        >
          <Icon size={18} style={{ color: cat.color }} weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{expense.description}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {expense.payerName} paid · {expense.participantCount} people
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-white">{fmtMoney(expense.amountCents)}</p>
          <p className="text-xs mt-0.5" style={{ color: iPaid ? "#00C96B" : "#FF3DA7" }}>
            {iPaid ? `you paid` : `your share ${fmtMoney(myShare)}`}
          </p>
        </div>
      </div>
      <div className="px-4 pb-3">
        <ReceiptAttach expenseId={expense.id} initialReceipt={expense.receipt ?? null} />
      </div>
    </div>
  );
}

function LedgerTab({
  expenses,
  currentUserId,
}: {
  expenses: Expense[];
  currentUserId: string;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const groups = groupByDate(expenses);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-400 text-sm">No expenses logged yet.</p>
        <p className="text-gray-500 text-xs mt-1">Hit "Log expense" to add your first one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(({ label, items }) => {
        const open = !collapsed.has(label);
        const total = items.reduce((s, e) => s + e.amountCents, 0);
        return (
          <div key={label}>
            <button
              onClick={() =>
                setCollapsed((prev) => {
                  const next = new Set(prev);
                  if (next.has(label)) next.delete(label);
                  else next.add(label);
                  return next;
                })
              }
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{fmtMoney(total)}</span>
                {open ? (
                  <CaretUp size={12} className="text-gray-500" />
                ) : (
                  <CaretDown size={12} className="text-gray-500" />
                )}
              </div>
            </button>
            {open && (
              <div className="space-y-2">
                {items.map((e) => (
                  <ExpenseRow key={e.id} expense={e} currentUserId={currentUserId} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BalancesTab({
  balances,
  currentUserId,
  tripId,
  transfers,
  pastSettlements,
  allSettled,
  hasExpenses,
}: {
  balances: BalanceRow[];
  currentUserId: string;
  tripId: string;
  transfers: TransferView[];
  pastSettlements: PastSettlement[];
  allSettled: boolean;
  hasExpenses: boolean;
}) {
  const me = balances.find((b) => b.userId === currentUserId);
  const myNet = me?.netCents ?? 0;

  return (
    <div className="space-y-4">
      {/* Net summary card */}
      {hasExpenses && (
        <div className="rounded-xl border border-[#3a3a3a] bg-[#2e2e2e] p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your position</p>
          <div className="flex items-center gap-3">
            <div
              className="text-2xl font-bold"
              style={{
                color: myNet > 0 ? "#00C96B" : myNet < 0 ? "#FF3DA7" : "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-fredoka)",
              }}
            >
              {myNet > 0 ? "+" : ""}{fmtMoney(myNet)}
            </div>
            <p className="text-sm text-gray-400">
              {myNet > 0 ? "owed to you" : myNet < 0 ? "you owe" : "you're settled up"}
            </p>
          </div>
        </div>
      )}

      {/* Per-member rows */}
      <div className="space-y-2">
        {balances.map((b) => {
          const net = b.netCents;
          const netColor = net > 0 ? "#00C96B" : net < 0 ? "#FF3DA7" : "rgba(255,255,255,0.3)";
          return (
            <div
              key={b.userId}
              className="rounded-xl border border-[#3a3a3a] bg-[#2e2e2e] px-4 py-3 flex items-center gap-3"
            >
              <Avatar name={b.name} userId={b.userId} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{b.name}</p>
                <p className="text-xs text-gray-400">
                  paid {fmtMoney(b.totalPaidCents)} · share {fmtMoney(b.totalOwedCents)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase" style={{ color: netColor }}>
                  {net > 0 ? "owed" : net < 0 ? "owes" : "even"}
                </p>
                <p className="text-sm font-bold" style={{ color: netColor }}>
                  {fmtMoney(Math.abs(net))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SettleUpClient
        tripId={tripId}
        transfers={transfers}
        pastSettlements={pastSettlements}
        allSettled={allSettled}
        hasExpenses={hasExpenses}
      />
    </div>
  );
}

function AddExpenseForm({
  tripId,
  currentUserId,
  members,
  onClose,
}: {
  tripId: string;
  currentUserId: string;
  members: Member[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState<CreateExpenseFormState, FormData>(
    createExpenseAction,
    {}
  );
  const [checked, setChecked] = useState<Set<string>>(new Set(members.map((m) => m.userId)));
  const [category, setCategory] = useState("general");

  const toggle = (userId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  return (
    <form
      action={async (fd) => {
        await formAction(fd);
        if (!state.error) onClose();
      }}
      className="space-y-4"
    >
      <input type="hidden" name="tripId" value={tripId} />
      <input type="hidden" name="category" value={category} />

      {/* Category picker */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = category === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  borderColor: active ? c.color : "#3a3a3a",
                  backgroundColor: active ? c.color + "22" : "transparent",
                  color: active ? c.color : "#9ca3af",
                }}
              >
                <Icon size={12} weight="fill" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Amount (USD)
          </span>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-xl bg-[#282828] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Paid by
          </span>
          <select
            name="payerId"
            defaultValue={currentUserId}
            className="w-full px-3 py-2 rounded-xl bg-[#282828] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
          >
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          Description
        </span>
        <input
          name="description"
          type="text"
          required
          maxLength={200}
          placeholder="Dinner at Ichiran"
          className="w-full px-3 py-2 rounded-xl bg-[#282828] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
      </label>

      <fieldset>
        <legend className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Split between
        </legend>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => {
            const on = checked.has(m.userId);
            return (
              <button
                key={m.userId}
                type="button"
                onClick={() => toggle(m.userId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  borderColor: on ? memberColor(m.userId) : "#3a3a3a",
                  backgroundColor: on ? memberColor(m.userId) + "22" : "transparent",
                  color: on ? memberColor(m.userId) : "#9ca3af",
                }}
              >
                {initials(m.name)} {m.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
        {/* Hidden checkboxes for form submission */}
        {members
          .filter((m) => checked.has(m.userId))
          .map((m) => (
            <input key={m.userId} type="hidden" name="participantIds" value={m.userId} />
          ))}
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm font-semibold text-[#FF3DA7]">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending || checked.size === 0}
          className="px-5 py-2.5 rounded-full text-sm font-bold transition disabled:opacity-60"
          style={{ backgroundColor: "#FFD600", color: "#0a0a0a" }}
        >
          {pending ? "Saving…" : "Add expense"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-full text-sm font-semibold text-gray-400 hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ExpensesClient({
  tripId,
  tripName,
  currentUserId,
  members,
  expenses,
  balances,
  transfers,
  pastSettlements,
  allSettled,
  hasExpenses,
}: {
  tripId: string;
  tripName: string;
  currentUserId: string;
  members: Member[];
  expenses: Expense[];
  balances: BalanceRow[];
  transfers: TransferView[];
  pastSettlements: PastSettlement[];
  allSettled: boolean;
  hasExpenses: boolean;
}) {
  const [tab, setTab] = useState<"ledger" | "balances">("ledger");
  const [showForm, setShowForm] = useState(false);

  const totalSpentCents = expenses.reduce((s, e) => s + e.amountCents, 0);
  const me = balances.find((b) => b.userId === currentUserId);
  const myShareCents = me?.totalOwedCents ?? 0;
  const myNetCents = me?.netCents ?? 0;
  const netColor = myNetCents > 0 ? "#00C96B" : myNetCents < 0 ? "#FF3DA7" : "rgba(255,255,255,0.4)";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#404040" }}>
      <style>{`
        .expenses-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .expenses-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>

      {/* ── Sticky dark header ───────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 border-b border-[#3a3a3a]"
        style={{ backgroundColor: "#282828" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-semibold text-white leading-none"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Expenses
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{tripName}</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{ backgroundColor: "#FFD600", color: "#0a0a0a" }}
          >
            {showForm ? <X size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
            {showForm ? "Cancel" : "Log expense"}
          </button>
        </div>

        {/* Stats row */}
        <div className="max-w-7xl mx-auto px-6 pb-4 grid grid-cols-3 gap-4">
          {[
            { label: "Total spent", value: fmtMoneyWhole(totalSpentCents), color: "white" },
            { label: "My share", value: fmtMoneyWhole(myShareCents), color: "white" },
            { label: "My balance", value: (myNetCents > 0 ? "+" : "") + fmtMoney(myNetCents), color: netColor },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold mt-0.5" style={{ color, fontFamily: "var(--font-fredoka)" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inline add form ──────────────────────────────────────────── */}
      {showForm && (
        <div
          className="border-b border-[#3a3a3a]"
          style={{ backgroundColor: "#2e2e2e" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-5">
            <AddExpenseForm
              tripId={tripId}
              currentUserId={currentUserId}
              members={members}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="expenses-grid">
          {/* Left: tab bar + content */}
          <div>
            {/* Tab bar */}
            <div className="flex border-b border-[#3a3a3a] mb-5">
              {(["ledger", "balances"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-5 py-2.5 text-sm font-bold capitalize transition-colors border-b-2 -mb-px"
                  style={{
                    borderBottomColor: tab === t ? "#FFD600" : "transparent",
                    color: tab === t ? "#FFD600" : "#9ca3af",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "ledger" && (
              <LedgerTab expenses={expenses} currentUserId={currentUserId} />
            )}
            {tab === "balances" && (
              <BalancesTab
                balances={balances}
                currentUserId={currentUserId}
                tripId={tripId}
                transfers={transfers}
                pastSettlements={pastSettlements}
                allSettled={allSettled}
                hasExpenses={hasExpenses}
              />
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-4">
            {/* Settlement snapshot */}
            <div className="rounded-2xl border border-[#3a3a3a] bg-[#2e2e2e] p-5">
              <p
                className="text-base font-semibold text-white mb-3"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                Settlements
              </p>
              {!hasExpenses ? (
                <p className="text-sm text-gray-400">No expenses yet.</p>
              ) : allSettled ? (
                <p className="text-sm font-semibold text-[#00C96B]">Everyone is settled up!</p>
              ) : (
                <div className="space-y-2">
                  {transfers.slice(0, 3).map((t, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar name={t.fromName} userId={t.fromUserId} />
                        <span className="text-xs text-gray-400 truncate">→</span>
                        <Avatar name={t.toName} userId={t.toUserId} />
                        <span className="text-xs text-white truncate">{t.toName.split(" ")[0]}</span>
                      </div>
                      <span className="text-sm font-bold text-[#FFD600] shrink-0">
                        {fmtMoney(t.amountCents)}
                      </span>
                    </div>
                  ))}
                  {transfers.length > 3 && (
                    <p className="text-xs text-gray-400">+{transfers.length - 3} more transfers</p>
                  )}
                </div>
              )}
            </div>

            {/* Summary card */}
            <div className="rounded-2xl border border-[#3a3a3a] bg-[#2e2e2e] p-5">
              <p
                className="text-base font-semibold text-white mb-3"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                Summary
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expenses</span>
                  <span className="text-white font-semibold">{expenses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-semibold">{fmtMoney(totalSpentCents)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Members</span>
                  <span className="text-white font-semibold">{members.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Per person (avg)</span>
                  <span className="text-white font-semibold">
                    {members.length > 0 ? fmtMoney(Math.round(totalSpentCents / members.length)) : "$0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            {expenses.length > 0 && (
              <div className="rounded-2xl border border-[#3a3a3a] bg-[#2e2e2e] p-5">
                <p
                  className="text-base font-semibold text-white mb-3"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  By category
                </p>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const catTotal = expenses
                      .filter((e) => e.category === cat.key)
                      .reduce((s, e) => s + e.amountCents, 0);
                    if (catTotal === 0) return null;
                    const pct = totalSpentCents > 0 ? (catTotal / totalSpentCents) * 100 : 0;
                    const Icon = cat.icon;
                    return (
                      <div key={cat.key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <Icon size={12} weight="fill" style={{ color: cat.color }} />
                            <span className="text-gray-300">{cat.label}</span>
                          </div>
                          <span className="text-white font-semibold">{fmtMoney(catTotal)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#3a3a3a] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
