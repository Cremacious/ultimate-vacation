import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import type { RightNowRow } from "@/lib/trips/pulse";

interface Props {
  rows: RightNowRow[];
}

/**
 * Single ranked "Right now" action surface.
 *
 * Merges what used to be three overlapping overview components:
 *   - NextStepContent (lifecycle state prompts)
 *   - TripPulse       (live awareness feed)
 *   - QUICK_ACTIONS   (static shortcut grid)
 *
 * The ordered list is built server-side via `buildRightNowRows`. This component
 * renders and nothing more — one row shape, one visual treatment, one hierarchy.
 */
export default function OverviewRightNow({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <section
      aria-label="Right now"
      className="rounded-[20px] border p-5"
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
    >
      <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-1">
        Right now
      </div>
      <ul className="flex flex-col divide-y divide-white/[0.06]">
        {rows.map((row) => (
          <li key={row.key}>
            <RightNowItem row={row} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RightNowItem({ row }: { row: RightNowRow }) {
  return (
    <Link
      href={row.href}
      data-severity={row.severity}
      className="flex items-center justify-between gap-3 py-2 text-sm text-white/65 hover:text-white/95 transition-colors"
    >
      <span className="leading-snug">{row.text}</span>
      <ArrowRight size={11} weight="bold" className="shrink-0 text-white/25" />
    </Link>
  );
}
