/**
 * Venmo / Zelle deep-link URL builders — pure functions.
 *
 * Per 2026-04-21 launch-scope grill: Venmo + Zelle deep-links in settle-up
 * confirmation sheet. No server-side callback verification — the user pays
 * externally and then explicitly confirms in-app (trust-based).
 *
 * The URLs below are best-effort. If the user's phone doesn't have the app
 * installed, the OS typically falls back to the web URL; we provide explicit
 * https:// fallbacks where possible.
 */

export type DeepLinkInput = {
  amountCents: number;
  note?: string;
  /** Recipient's Venmo username (handle), without @. Optional — sheet can leave blank. */
  venmoHandle?: string;
  /** Recipient's email or phone for Zelle. Optional. */
  zelleRecipient?: string;
};

/**
 * Builds a Venmo pay URL. Venmo URL scheme:
 *   venmo://paycharge?txn=pay&recipients={handle}&amount={dollars}&note={encoded}
 *
 * Web fallback: https://venmo.com/?txn=pay&recipients=...&amount=...&note=...
 */
export function buildVenmoDeepLink(input: DeepLinkInput): { app: string; web: string } {
  const amount = (input.amountCents / 100).toFixed(2);
  const note = encodeURIComponent(input.note ?? "");
  const recipient = input.venmoHandle ? encodeURIComponent(input.venmoHandle) : "";
  const qs = `txn=pay${recipient ? `&recipients=${recipient}` : ""}&amount=${amount}${
    note ? `&note=${note}` : ""
  }`;
  return {
    app: `venmo://paycharge?${qs}`,
    web: `https://venmo.com/?${qs}`,
  };
}

/**
 * Builds a Zelle deep-link. Zelle URL schemes vary by bank; the standards-ish
 * form is `zellepay://` but most banks intercept via universal links. We emit
 * a generic HTTPS URL pointing to Zelle's marketing/redirect page as the
 * safest fallback, plus an attempt at the app URL scheme.
 *
 * Launch-scope note: Zelle does not expose amount/note pre-fill via a
 * standardized URL. We carry amount + note in query string for user reference
 * but the Zelle app does not auto-populate them.
 */
export function buildZelleDeepLink(input: DeepLinkInput): { app: string; web: string } {
  const amount = (input.amountCents / 100).toFixed(2);
  const note = encodeURIComponent(input.note ?? "");
  const recipient = input.zelleRecipient ? encodeURIComponent(input.zelleRecipient) : "";
  const qs = `amount=${amount}${recipient ? `&recipient=${recipient}` : ""}${
    note ? `&note=${note}` : ""
  }`;
  return {
    app: `zellepay://send?${qs}`,
    web: "https://www.zellepay.com/",
  };
}
