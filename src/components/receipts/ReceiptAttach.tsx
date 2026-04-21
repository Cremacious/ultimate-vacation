"use client";

/**
 * Receipt upload affordance for an expense row.
 *
 * Minimum UX: tap "Attach receipt" → file picker → POST /api/receipts/upload
 * → thumbnail + "View" link after success. For PDFs, shows a generic icon.
 *
 * Scope (launch): manual upload only. No OCR, no multi-file, no crop.
 */

import { useRef, useState, useTransition } from "react";

export type ReceiptAttachProps = {
  expenseId: string;
  /** Existing receipt URL if one was already uploaded (server-side fetch). */
  initialReceipt?: { blobUrl: string; mimeType: string } | null;
};

export function ReceiptAttach({ expenseId, initialReceipt }: ReceiptAttachProps) {
  const [receipt, setReceipt] = useState<{ blobUrl: string; mimeType: string } | null>(
    initialReceipt ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);

  function pickFile() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    startTransition(async () => {
      const form = new FormData();
      form.append("expenseId", expenseId);
      form.append("file", f);
      try {
        const res = await fetch("/api/receipts/upload", {
          method: "POST",
          body: form,
        });
        const json = (await res.json()) as {
          receipt?: { blobUrl: string; mimeType: string };
          error?: string;
        };
        if (!res.ok || !json.receipt) {
          throw new Error(json.error ?? "Upload failed");
        }
        setReceipt({ blobUrl: json.receipt.blobUrl, mimeType: json.receipt.mimeType });
        if (fileRef.current) fileRef.current.value = "";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  if (receipt) {
    const isImage = receipt.mimeType.startsWith("image/");
    return (
      <div className="flex items-center gap-2">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={receipt.blobUrl}
            alt="Attached receipt"
            className="w-12 h-12 rounded-lg border border-[#3a3a3a] object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-gray-400">
            PDF
          </div>
        )}
        <a
          href={receipt.blobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#00A8CC] hover:underline"
        >
          View
        </a>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
        onChange={onFile}
        className="hidden"
      />
      <button
        onClick={pickFile}
        disabled={isPending}
        className="text-xs font-semibold text-gray-400 hover:text-white transition-colors disabled:opacity-50"
      >
        {isPending ? "Uploading…" : "Attach receipt"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-[#ffb3bf]">
          {error}
        </p>
      )}
    </div>
  );
}
