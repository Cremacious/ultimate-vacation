/**
 * Trip balance computation — pure function, settlement-ledger aware.
 *
 * Per SCHEMA_DRAFT.md (locked 2026-04-21 architecture grill Q5):
 *   Balance includes the settlements ledger. `expense_splits.settled_at` was
 *   dropped in migration 0001 — per-pair settlement is stored in the
 *   `settlements` table, not as a per-split flag.
 *
 * Formula per member U:
 *   paid[U]        = sum(expenses.amountCents where payer_id = U)
 *   owed[U]        = sum(expense_splits.amountCents where user_id = U)
 *   sentSettled[U] = sum(settlements.amountCents where from_user_id = U)
 *   recvSettled[U] = sum(settlements.amountCents where to_user_id = U)
 *
 *   net[U] = paid[U] − owed[U] + sentSettled[U] − recvSettled[U]
 *
 *   net > 0 → U is owed money (creditor)
 *   net < 0 → U owes money (debtor)
 *   net = 0 → U is settled
 *
 * Sum of net across all members is zero modulo per-expense rounding
 * (callers must use integer cents; no floats).
 *
 * Note: an existing pre-Chunk-1 helper at `src/lib/expenses/balances.ts`
 * (`computeTripBalances`) does expense-only balance math without settlements.
 * Callers that need settlement-aware balances MUST use this module.
 * Consolidation of the two files is deferred to Chunk 2 (expenses moat capstone).
 */

export type MemberRef = { userId: string; name: string };
export type ExpenseRow = { payerId: string; amountCents: number };
export type SplitRow = { userId: string; amountCents: number };
export type SettlementRow = { fromUserId: string; toUserId: string; amountCents: number };

export type MemberBalance = {
  userId: string;
  name: string;
  totalPaidCents: number;
  totalOwedCents: number;
  totalSettlementsFromCents: number;
  totalSettlementsToCents: number;
  netCents: number; // > 0 = creditor (owed); < 0 = debtor (owes)
};

export function computeBalance(
  members: MemberRef[],
  expenses: ExpenseRow[],
  splits: SplitRow[],
  settlements: SettlementRow[]
): MemberBalance[] {
  const paid = new Map<string, number>();
  const owed = new Map<string, number>();
  const sent = new Map<string, number>();
  const recv = new Map<string, number>();

  for (const e of expenses) {
    paid.set(e.payerId, (paid.get(e.payerId) ?? 0) + e.amountCents);
  }
  for (const s of splits) {
    owed.set(s.userId, (owed.get(s.userId) ?? 0) + s.amountCents);
  }
  for (const s of settlements) {
    sent.set(s.fromUserId, (sent.get(s.fromUserId) ?? 0) + s.amountCents);
    recv.set(s.toUserId, (recv.get(s.toUserId) ?? 0) + s.amountCents);
  }

  return members.map((m) => {
    const p = paid.get(m.userId) ?? 0;
    const o = owed.get(m.userId) ?? 0;
    const sf = sent.get(m.userId) ?? 0;
    const sr = recv.get(m.userId) ?? 0;
    return {
      userId: m.userId,
      name: m.name,
      totalPaidCents: p,
      totalOwedCents: o,
      totalSettlementsFromCents: sf,
      totalSettlementsToCents: sr,
      netCents: p - o + sf - sr,
    };
  });
}
