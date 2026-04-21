"use client";

import { useEffect, useRef, useState } from "react";
import { X, WarningCircle } from "@phosphor-icons/react";

export type ConflictToastProps = {
  message: string;
  onDismiss: () => void;
  /** Auto-dismiss duration in milliseconds. Default 10 000. */
  durationMs?: number;
};

/**
 * Soft-conflict toast for last-write-wins multi-editor surfaces.
 * Shows a non-blocking amber warning with a countdown progress bar.
 * Reuse on any page where concurrent edits may overwrite another user's version.
 */
export function ConflictToast({
  message,
  onDismiss,
  durationMs = 10_000,
}: ConflictToastProps) {
  const [progress, setProgress] = useState(100);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  // Stable ref to avoid stale-closure warning in effect
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    startRef.current = performance.now();
    function tick() {
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, 1 - elapsed / durationMs);
      setProgress(remaining * 100);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDismissRef.current();
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationMs]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "#1D1E36",
        borderColor: "#FFEB00",
        boxShadow: "0 4px 24px rgba(255,235,0,0.15)",
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <WarningCircle
          size={18}
          weight="fill"
          style={{ color: "#FFEB00", flexShrink: 0, marginTop: "1px" }}
        />
        <p className="flex-1 text-sm font-semibold text-white leading-snug">{message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5" style={{ backgroundColor: "#2A2B45" }}>
        <div
          className="h-full"
          style={{ width: `${progress}%`, backgroundColor: "#FFEB00", transition: "none" }}
        />
      </div>
    </div>
  );
}
