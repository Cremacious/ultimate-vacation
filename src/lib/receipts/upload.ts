/**
 * Manual receipt upload — Vercel Blob + expense_receipts table.
 *
 * Per 2026-04-21 architecture grill Q6. Scope (launch):
 *   - User uploads an image or PDF via file picker from an expense row.
 *   - File lands in Vercel Blob (public-read signed URL).
 *   - expense_receipts row records url + metadata + uploader.
 *   - No OCR / receipt scanning (explicitly cut from launch).
 *
 * Access model: any trip member can attach a receipt to any expense on their
 * trip. Matches the "trust-based" posture of the settle-up flow.
 *
 * Env required:
 *   BLOB_READ_WRITE_TOKEN — set in Vercel project settings + .env.local for dev.
 *   See https://vercel.com/docs/storage/vercel-blob/using-blob-sdk
 */

import { put } from "@vercel/blob";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { expenseReceipts, expenses, tripMembers } from "@/lib/db/schema";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

export type UploadReceiptInput = {
  expenseId: string;
  file: File;
};

export type CreatedReceipt = {
  id: string;
  expenseId: string;
  blobUrl: string;
  mimeType: string;
  sizeBytes: number;
};

/**
 * Upload a receipt file for an expense. Returns the created row.
 *
 * Throws:
 *   - "File too large" if > 10MB
 *   - "Unsupported file type" if not image/* or application/pdf
 *   - "Only trip members can attach receipts" if caller is not a member of
 *     the expense's trip
 *   - "Expense not found" if expenseId is invalid / soft-deleted
 *   - propagates Vercel Blob errors (network, auth, quota)
 */
export async function uploadReceipt(
  userId: string,
  input: UploadReceiptInput
): Promise<CreatedReceipt> {
  const { expenseId, file } = input;

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File too large. Maximum 10MB.");
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, HEIC, or PDF.");
  }

  // Find the expense and check caller is a member of its trip.
  const [expense] = await db
    .select({ id: expenses.id, tripId: expenses.tripId })
    .from(expenses)
    .where(and(eq(expenses.id, expenseId), isNull(expenses.deletedAt)))
    .limit(1);
  if (!expense) throw new Error("Expense not found.");

  const [memberRow] = await db
    .select({ id: tripMembers.id })
    .from(tripMembers)
    .where(
      and(
        eq(tripMembers.tripId, expense.tripId),
        eq(tripMembers.userId, userId),
        isNull(tripMembers.deletedAt)
      )
    )
    .limit(1);
  if (!memberRow) {
    throw new Error("Only trip members can attach receipts.");
  }

  // Upload to Vercel Blob. Pathname includes expenseId for traceability and
  // a timestamp for uniqueness.
  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 100);
  const pathname = `receipts/${expense.tripId}/${expenseId}/${Date.now()}_${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  // Insert DB row. On failure, we leave the blob — it's unreferenced and
  // cheap; a post-launch cleanup cron can sweep orphans.
  const [row] = await db
    .insert(expenseReceipts)
    .values({
      expenseId: expense.id,
      blobUrl: blob.url,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedBy: userId,
    })
    .returning({
      id: expenseReceipts.id,
      expenseId: expenseReceipts.expenseId,
      blobUrl: expenseReceipts.blobUrl,
      mimeType: expenseReceipts.mimeType,
      sizeBytes: expenseReceipts.sizeBytes,
    });

  return row;
}
