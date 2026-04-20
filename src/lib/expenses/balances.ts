/**
 * Balance + settle-up math. Pure functions — no DB access here, so these are
 * fully unit-testable with fixtures. Caller assembles DB rows and passes them.
 *
 * Model (beta):
 *   totalPaid[u]  = sum of expense.amountCents where payer = u
 *   totalOwed[u]  = sum of expense_split.amountCents where userId = u
 *   net[u]        = totalPaid[u] - totalOwed[u]
 *
 *   net > 0  → u is owed money (a "creditor")
 *   net < 0  → u owes money  (a "debtor")
 *   sum of net across all members = 0 (modulo per-expense rounding, which
 *     computeEqualSplit guarantees is already resolved to integer cents).
 */

export type MemberRef = { userId: string; name: string };
export type ExpenseRow = { payerId: string; amountCents: number };
export type SplitRow = { userId: string; amountCents: number };

export type MemberBalance = {
  userId: string;
  name: string;
  totalPaidCents: number;
  totalOwedCents: number;
  netCents: number; // positive = owed to them, negative = they owe
};

export type SettlementTransfer = {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
};

export function computeTripBalances(
  members: MemberRef[],
  expensesRows: ExpenseRow[],
  splitRows: SplitRow[]
): MemberBalance[] {
  const paid = new Map<string, number>();
  const owed = new Map<string, number>();

  for (const e of expensesRows) {
    paid.set(e.payerId, (paid.get(e.payerId) ?? 0) + e.amountCents);
  }
  for (const s of splitRows) {
    owed.set(s.userId, (owed.get(s.userId) ?? 0) + s.amountCents);
  }

  return members.map((m) => {
    const p = paid.get(m.userId) ?? 0;
    const o = owed.get(m.userId) ?? 0;
    return {
      userId: m.userId,
      name: m.name,
      totalPaidCents: p,
      totalOwedCents: o,
      netCents: p - o,
    };
  });
}

/**
 * Greedy settle-up: at each step, match the single largest creditor with the
 * single largest debtor and transfer min(|debt|, credit). Produces at most
 * N-1 transfers for N members. Not guaranteed optimal in the general case
 * (minimum-transfers is NP-hard), but beta-correct and stable.
 *
 * Deterministic: ties break by userId ascending so test output is reproducible.
 */
export function planSettlement(balances: MemberBalance[]): SettlementTransfer[] {
  // Work on copies to avoid mutating caller state.
  const creditors = balances
    .filter((b) => b.netCents > 0)
    .map((b) => ({ userId: b.userId, remaining: b.netCents }))
    .sort((a, b) => b.remaining - a.remaining || a.userId.localeCompare(b.userId));
  const debtors = balances
    .filter((b) => b.netCents < 0)
    .map((b) => ({ userId: b.userId, remaining: -b.netCents }))
    .sort((a, b) => b.remaining - a.remaining || a.userId.localeCompare(b.userId));

  const transfers: SettlementTransfer[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.remaining, d.remaining);
    transfers.push({
      fromUserId: d.userId,
      toUserId: c.userId,
      amountCents: amount,
    });
    c.remaining -= amount;
    d.remaining -= amount;
    if (c.remaining === 0) ci += 1;
    if (d.remaining === 0) di += 1;
  }

  return transfers;
}
