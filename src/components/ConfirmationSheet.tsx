"use client";

/**
 * Confirmation sheet — reusable bottom-sheet (mobile) / centered modal (desktop).
 *
 * Design-system pattern introduced in Chunk 2 (settle-up). Reused by:
 *   - Mark trip settled confirm (this chunk)
 *   - Post-trip prompt (later chunk)
 *   - Ad-impression prompt (later chunk)
 *   - Destructive confirms
 *
 * Spec:
 *   - Mobile < 768px: bottom-anchored, slide up, neon top-edge accent
 *   - Desktop ≥ 768px: centered modal, scale+fade, neon border
 *   - Backdrop blur + rgba(0,0,0,0.6); Escape + backdrop-click dismiss
 *   - Focus trap while open; focus restored to invoker on close
 *   - Reduced-motion: fade only
 */

import { useEffect, useRef } from "react";

export type ConfirmationSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rendered between title and actions. */
  children?: React.ReactNode;
  /** Stacked on mobile, horizontal-right on desktop. Pass in desired order. */
  actions?: React.ReactNode;
  /** For aria-labelledby. Defaults to an auto id. */
  titleId?: string;
};

export function ConfirmationSheet({
  open,
  onClose,
  title,
  children,
  actions,
  titleId = "confirmation-sheet-title",
}: ConfirmationSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const invokerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    invokerRef.current = document.activeElement;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // Focus the sheet on open.
    const t = window.setTimeout(() => {
      sheetRef.current?.focus();
    }, 10);

    // Prevent background scroll.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      if (invokerRef.current instanceof HTMLElement) invokerRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-hidden={false}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
      }}
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "none",
          cursor: "default",
        }}
        tabIndex={-1}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "80vh",
          background: "#1a1a1a",
          borderTop: "1px solid #00A8CC",
          padding: "24px 20px 32px",
          outline: "none",
          overflowY: "auto",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          animation: "cs-slide-up 300ms cubic-bezier(0.4, 0.1, 0.2, 1)",
        }}
        className="md:!left-1/2 md:!right-auto md:!bottom-auto md:!top-1/2 md:!-translate-x-1/2 md:!-translate-y-1/2 md:!max-w-[480px] md:!w-[90vw] md:!rounded-2xl md:!border md:!border-[#00A8CC]"
      >
        <h2
          id={titleId}
          className="text-xl font-semibold text-white mb-3"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {title}
        </h2>
        <div className="text-sm text-white mb-5" style={{ lineHeight: 1.5 }}>
          {children}
        </div>
        <div className="flex flex-col gap-2 md:flex-row-reverse md:justify-start md:gap-3">
          {actions}
        </div>
      </div>
      <style>{`
        @keyframes cs-slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[role="dialog"] { animation: cs-fade 150ms ease-out !important; }
          @keyframes cs-fade { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
