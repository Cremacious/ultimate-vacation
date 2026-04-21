"use client";

import { useActionState, useState } from "react";

import { ReceiptAttach } from "@/components/receipts/ReceiptAttach";

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

const initialState: CreateExpenseFormState = {};

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ExpensesClient({
  tripId,
  currentUserId,
  members,
  expenses,
}: {
  tripId: string;
  currentUserId: string;
  members: Member[];
  expenses: Expense[];
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
      <form action={formAction} className="space-y-4 rounded-2xl bg-[#2a2a2a] border border-[#3a3a3a] p-5">
        <input type="hidden" name="tripId" value={tripId} />
        <h2 className="text-lg font-semibold text-white">Add expense</h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              Amount (USD)
            </span>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-xl bg-[#1e1e1e] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00A8CC]"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              Paid by
            </span>
            <select
              name="payerId"
              defaultValue={currentUserId}
              className="w-full px-3 py-2 rounded-xl bg-[#1e1e1e] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00A8CC]"
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
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
            Description
          </span>
          <input
            name="description"
            type="text"
            required
            maxLength={200}
            placeholder="Dinner at Ichiran"
            className="w-full px-3 py-2 rounded-xl bg-[#1e1e1e] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#00A8CC]"
          />
        </label>

        <fieldset>
          <legend className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
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
          <p role="alert" className="text-sm font-semibold text-[#D9304F]">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="text-sm font-semibold text-[#00C96B]">Expense added.</p>
        )}

        <button
          type="submit"
          disabled={pending || checked.size === 0}
          className="bg-[#00A8CC] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#0096b8] transition-colors disabled:opacity-60"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          {pending ? "Saving…" : "Add expense"}
        </button>
      </form>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent expenses</h2>
          {expenses.length > 0 && (
            <a
              href={`/app/trips/${tripId}/balances`}
              className="text-xs font-bold text-[#00C96B] hover:underline"
            >
              Settle up →
            </a>
          )}
        </div>
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500">No expenses logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold truncate">{e.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {e.payerName} paid · split {e.participantCount} way{e.participantCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-white font-bold">{formatMoney(e.amountCents)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#3a3a3a]">
                  <ReceiptAttach expenseId={e.id} initialReceipt={e.receipt ?? null} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
