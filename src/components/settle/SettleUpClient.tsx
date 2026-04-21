"use client";

/**
 * Settle-up client island for /app/trips/[tripId]/balances.
 *
 * Renders interactive "Mark as paid" affordances on each pending transfer row
 * plus a "Mark trip settled" button when all net balances are zero. Opens
 * <ConfirmationSheet> for payment with Venmo/Zelle deep-links.
 *
 * Scope:
 *   - Trust-based: any trip member can mark any pair's settlement
 *   - No callback from Venmo/Zelle; user explicitly confirms "I paid them"
 *   - Emits `trip_settled` analytics event when user confirms mark-trip-settled
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { vaultTripAction } from "@/app/app/trips/[tripId]/balances/actions";
import { ConfirmationSheet } from "@/components/ConfirmationSheet";
import {
  buildVenmoDeepLink,
  buildZelleDeepLink,
} from "@/lib/settlements/deep-links";

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
  settledAt: string; // ISO
  note: string | null;
};

export type SettleUpClientProps = {
  tripId: string;
  transfers: TransferView[];
  pastSettlements: PastSettlement[];
  allSettled: boolean;
  hasExpenses: boolean;
};

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SettleUpClient({
  tripId,
  transfers,
  pastSettlements,
  allSettled,
  hasExpenses,
}: SettleUpClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingTransfer, setPendingTransfer] = useState<TransferView | null>(null);
  const [tripSettledConfirm, setTripSettledConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  async function recordSettlement(transfer: TransferView) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/settlements", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            tripId,
            fromUserId: transfer.fromUserId,
            toUserId: transfer.toUserId,
            amountCents: transfer.amountCents,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Failed" }));
          throw new Error(body.error ?? "Settlement failed");
        }
        setPendingTransfer(null);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Settlement failed");
      }
    });
  }

  async function markTripSettled() {
    setError(null);
    startTransition(async () => {
      const result = await vaultTripAction(tripId);
      if (!result.ok) {
        setError(result.error);
      }
      setTripSettledConfirm(false);
      router.refresh();
    });
  }

  const venmoUrls = pendingTransfer
    ? buildVenmoDeepLink({
        amountCents: pendingTransfer.amountCents,
        note: "TripWave settle-up",
      })
    : null;
  const zelleUrls = pendingTransfer
    ? buildZelleDeepLink({
        amountCents: pendingTransfer.amountCents,
        note: "TripWave settle-up",
      })
    : null;

  return (
    <div>
      {/* All-settled hero + mark-trip-settled */}
      {hasExpenses && (
        allSettled ? (
          <div className="rounded-xl bg-[#0f2a1e] border border-[#00C96B] px-4 py-4 mb-4 text-center">
            <p className="text-[#00C96B] font-semibold mb-2">Everyone is settled up ✓</p>
            <button
              onClick={() => setTripSettledConfirm(true)}
              className="text-sm font-semibold text-white bg-[#00C96B] rounded-lg px-4 py-2 hover:bg-[#00b85e] transition-colors"
            >
              Mark trip settled
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#1e1e1e] border border-[#3a3a3a] px-4 py-4 mb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Final step</p>
            <p className="text-sm text-gray-400 mb-3">
              Mark all {transfers.length} payment{transfers.length === 1 ? "" : "s"} below as done to settle this trip.
            </p>
            <button
              disabled
              aria-disabled="true"
              className="text-sm font-semibold text-gray-600 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 cursor-not-allowed"
            >
              Mark trip settled
            </button>
          </div>
        )
      )}

      {/* Pending transfers */}
      {!allSettled && transfers.length > 0 && (
        <ul className="space-y-2">
          {transfers.map((t, i) => (
            <li
              key={`${t.fromUserId}-${t.toUserId}-${i}`}
              className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 flex items-center justify-between"
            >
              <div className="text-sm text-white">
                <span className="font-bold">{t.fromName}</span>
                <span className="text-gray-400"> pays </span>
                <span className="font-bold">{t.toName}</span>
                <span className="text-gray-400"> → </span>
                <span className="font-bold text-[#00A8CC]">{formatMoney(t.amountCents)}</span>
              </div>
              <button
                onClick={() => setPendingTransfer(t)}
                aria-label={`${t.fromName} owes ${t.toName} ${formatMoney(t.amountCents)}. Mark as paid.`}
                className="text-xs font-semibold text-white bg-[#00A8CC] rounded-lg px-3 py-1.5 hover:bg-[#0094b3] transition-colors"
              >
                Mark as paid
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Past settlements disclosure */}
      {pastSettlements.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
          >
            {historyOpen ? "Hide" : "Show"} past settlements · {pastSettlements.length}
          </button>
          {historyOpen && (
            <ul className="mt-3 space-y-1.5">
              {pastSettlements.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg bg-[#1f1f1f] border border-[#2a2a2a] px-3 py-2 text-xs text-gray-300 flex items-center justify-between"
                >
                  <span>
                    <span className="text-white font-semibold">{s.fromName}</span>
                    <span className="text-gray-500"> → </span>
                    <span className="text-white font-semibold">{s.toName}</span>
                    <span className="text-gray-500"> · </span>
                    <span className="text-[#00A8CC]">{formatMoney(s.amountCents)}</span>
                  </span>
                  <span className="text-gray-500">{formatDate(s.settledAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg bg-[#2a1414] border border-[#D9304F] px-3 py-2 text-xs text-[#ffb3bf]"
        >
          {error}
        </div>
      )}

      {/* Settle confirmation sheet */}
      <ConfirmationSheet
        open={!!pendingTransfer}
        onClose={() => !isPending && setPendingTransfer(null)}
        title={pendingTransfer ? `Settle with ${pendingTransfer.toName}` : ""}
        actions={
          pendingTransfer && (
            <>
              <button
                disabled={isPending}
                onClick={() => recordSettlement(pendingTransfer)}
                className="w-full md:w-auto text-sm font-semibold text-white bg-[#00A8CC] rounded-lg px-4 py-2.5 hover:bg-[#0094b3] disabled:opacity-50 transition-colors"
              >
                {isPending ? "Recording…" : "Mark as paid"}
              </button>
              {venmoUrls && (
                <a
                  href={venmoUrls.app}
                  onClick={(e) => {
                    // Fallback to web URL if app scheme fails after short delay
                    const fallbackTimer = window.setTimeout(() => {
                      window.location.href = venmoUrls.web;
                    }, 600);
                    // Cancel fallback if user navigates away (app opened)
                    window.addEventListener(
                      "blur",
                      () => window.clearTimeout(fallbackTimer),
                      { once: true }
                    );
                    void e;
                  }}
                  aria-label={`Open Venmo to pay ${pendingTransfer.toName}`}
                  className="w-full md:w-auto text-center text-sm font-semibold text-white border border-[#00A8CC] rounded-lg px-4 py-2.5 hover:bg-[#0f2833] transition-colors"
                >
                  Open Venmo
                </a>
              )}
              {zelleUrls && (
                <a
                  href={zelleUrls.app}
                  onClick={() => {
                    const fallbackTimer = window.setTimeout(() => {
                      window.location.href = zelleUrls.web;
                    }, 600);
                    window.addEventListener(
                      "blur",
                      () => window.clearTimeout(fallbackTimer),
                      { once: true }
                    );
                  }}
                  aria-label={`Open Zelle to pay ${pendingTransfer.toName}`}
                  className="w-full md:w-auto text-center text-sm font-semibold text-white border border-[#00A8CC] rounded-lg px-4 py-2.5 hover:bg-[#0f2833] transition-colors"
                >
                  Open Zelle
                </a>
              )}
              <button
                disabled={isPending}
                onClick={() => setPendingTransfer(null)}
                className="w-full md:w-auto text-sm font-semibold text-gray-400 hover:text-white px-4 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </>
          )
        }
      >
        {pendingTransfer && (
          <>
            <p>
              <span className="font-bold text-white">{pendingTransfer.fromName}</span> pays{" "}
              <span className="font-bold text-white">{pendingTransfer.toName}</span>{" "}
              <span className="font-bold text-[#00A8CC]">{formatMoney(pendingTransfer.amountCents)}</span>
            </p>
            <p className="text-gray-400 mt-2 text-xs">
              Once you&apos;ve paid them outside TripWave, mark it here.
            </p>
          </>
        )}
      </ConfirmationSheet>

      {/* Mark-trip-settled confirm sheet */}
      <ConfirmationSheet
        open={tripSettledConfirm}
        onClose={() => !isPending && setTripSettledConfirm(false)}
        title="Mark trip settled?"
        actions={
          <>
            <button
              disabled={isPending}
              onClick={markTripSettled}
              className="w-full md:w-auto text-sm font-semibold text-white bg-[#00C96B] rounded-lg px-4 py-2.5 hover:bg-[#00b85e] disabled:opacity-50 transition-colors"
            >
              {isPending ? "…" : "Yes, mark settled"}
            </button>
            <button
              disabled={isPending}
              onClick={() => setTripSettledConfirm(false)}
              className="w-full md:w-auto text-sm font-semibold text-gray-400 hover:text-white px-4 py-2.5 transition-colors"
            >
              Not yet
            </button>
          </>
        }
      >
        <p>Everyone&apos;s balance is zero. Nice work.</p>
        <p className="text-gray-400 mt-2 text-xs">
          This records that the trip wrapped up cleanly.
        </p>
      </ConfirmationSheet>
    </div>
  );
}
