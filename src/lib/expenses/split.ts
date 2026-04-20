/**
 * Equal split over integer cents, with remainder distributed to the first N
 * participants so the sum always equals the original amount.
 *
 * Example: 1000 cents / 3 → [334, 333, 333] (sum 1000).
 *
 * Deterministic given input order. Callers should pass participantIds in the
 * order they want the remainder to fall — beta is fine with insertion order.
 */
export function computeEqualSplit(
  amountCents: number,
  participantIds: string[]
): { userId: string; amountCents: number }[] {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Expense amount must be a positive integer number of cents.");
  }
  if (participantIds.length === 0) {
    throw new Error("At least one participant is required.");
  }
  const n = participantIds.length;
  const base = Math.floor(amountCents / n);
  const remainder = amountCents - base * n;
  return participantIds.map((userId, i) => ({
    userId,
    amountCents: base + (i < remainder ? 1 : 0),
  }));
}
