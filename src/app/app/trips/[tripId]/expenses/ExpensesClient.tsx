"use client";

import { useActionState, useState } from "react";

import { ReceiptAttach } from "@/components/receipts/ReceiptAttach";
import { SettleUpClient } from "@/components/settle/SettleUpClient";

import { createExpenseAction, type CreateExpenseFormState } from "./actions";

type Member = { userId: string; name: string };
type Expense = {
  id: string;
  amountCents: number;
  description: string;
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

const initialState: CreateExpenseFormState = {};

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ExpensesClient({
  tripId,
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
  currentUserId: string;
  members: Member[];
  expenses: Expense[];
  balances: BalanceRow[];
  transfers: TransferView[];
  pastSettlements: PastSettlement[];
  allSettled: boolean;
  hasExpenses: boolean;
}) {
  const [state, formAction, pending] = useActionState(createExpenseAction, initialState);
  const [checked, setChecked] = useState<Set<string>>(new Set(members.map((m) => m.userId)));

  const toggle = (userId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  return (
    <div className="space-y-10">
      {/* ── Add expense form ─────────────────────────────────────────── */}
      <form action={formAction} className="space-y-4 rounded-2xl border border-[#2A2B45] p-5" style={{ backgroundColor: "#15162A" }}>
        <input type="hidden" name="tripId" value={tripId} />
        <h2 className="text-lg font-semibold text-white">Add expense</h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
              Amount (USD)
            </span>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A12] border border-[#2A2B45] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
              Paid by
            </span>
            <select
              name="payerId"
              defaultValue={currentUserId}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A12] border border-[#2A2B45] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
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
          <span className="block text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
            Description
          </span>
          <input
            name="description"
            type="text"
            required
            maxLength={200}
            placeholder="Dinner at Ichiran"
            className="w-full px-3 py-2 rounded-xl bg-[#0A0A12] border border-[#2A2B45] text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
          />
        </label>

        <fieldset>
          <legend className="block text-xs font-bold text-white/50 uppercase tracking-wide mb-2">
            Split equally between
          </legend>
          <div className="space-y-1.5">
            {members.map((m) => (
              <label key={m.userId} className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  name="participantIds"
                  value={m.userId}
                  checked={checked.has(m.userId)}
                  onChange={() => toggle(m.userId)}
                />
                {m.name}
              </label>
            ))}
          </div>
        </fieldset>

        {state.error && (
          <p role="alert" className="text-sm font-semibold text-[#FF3DA7]">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="text-sm font-semibold text-[#00C96B]">Expense added.</p>
        )}

        <button
          type="submit"
          disabled={pending || checked.size === 0}
          className="font-bold px-5 py-2.5 rounded-full hover:brightness-110 transition disabled:opacity-60"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          {pending ? "Saving…" : "Add expense"}
        </button>
      </form>

      {/* ── Recent expenses ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Recent expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-white/40">No expenses logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="rounded-xl border border-[#2A2B45] px-4 py-3"
                style={{ backgroundColor: "#15162A" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold truncate">{e.description}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {e.payerName} paid · split {e.participantCount} way{e.participantCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-white font-bold">{formatMoney(e.amountCents)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#2A2B45]">
                  <ReceiptAttach expenseId={e.id} initialReceipt={e.receipt ?? null} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Balances ─────────────────────────────────────────────────── */}
      {hasExpenses && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Balances</h2>
          <ul className="space-y-2 mb-6">
            {balances.map((b) => {
              const tone =
                b.netCents > 0 ? "#00C96B" : b.netCents < 0 ? "#FF3DA7" : "rgba(255,255,255,0.4)";
              const label =
                b.netCents > 0 ? "is owed" : b.netCents < 0 ? "owes" : "settled";
              return (
                <li
                  key={b.userId}
                  className="rounded-xl border border-[#2A2B45] px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: "#15162A" }}
                >
                  <div>
                    <p className="text-white font-semibold">{b.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      paid {formatMoney(b.totalPaidCents)} · share {formatMoney(b.totalOwedCents)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase" style={{ color: tone }}>
                      {label}
                    </p>
                    <p className="font-bold" style={{ color: tone }}>
                      {formatMoney(Math.abs(b.netCents))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <SettleUpClient
            tripId={tripId}
            transfers={transfers}
            pastSettlements={pastSettlements}
            allSettled={allSettled}
            hasExpenses={hasExpenses}
          />
        </div>
      )}
    </div>
  );
}
