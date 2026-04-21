/**
 * Receipt read path.
 *
 * Used by expense-list UI to render "has receipt" indicator per row.
 */

import { and, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { expenseReceipts } from "@/lib/db/schema";

export type ReceiptListItem = {
  id: string;
  expenseId: string;
  blobUrl: string;
  mimeType: string;
  sizeBytes: number;
};

/**
 * Fetch all receipts for a batch of expense ids. Excludes soft-deleted.
 * Caller is responsible for auth/membership gating at the parent-resource level.
 */
export async function listReceiptsForExpenses(
  expenseIds: string[]
): Promise<ReceiptListItem[]> {
  if (expenseIds.length === 0) return [];
  return db
    .select({
      id: expenseReceipts.id,
      expenseId: expenseReceipts.expenseId,
      blobUrl: expenseReceipts.blobUrl,
      mimeType: expenseReceipts.mimeType,
      sizeBytes: expenseReceipts.sizeBytes,
    })
    .from(expenseReceipts)
    .where(
      and(inArray(expenseReceipts.expenseId, expenseIds), isNull(expenseReceipts.deletedAt))
    );
}
