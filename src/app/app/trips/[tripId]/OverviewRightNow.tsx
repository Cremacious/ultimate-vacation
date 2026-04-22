import Link from "next/link";
import {
  ArrowRight,
  Lightning,
  CalendarBlank,
  Receipt,
  Backpack,
  ChartBar,
} from "@phosphor-icons/react/dist/ssr";

import type { RightNowRow } from "@/lib/trips/pulse";

interface Props {
  rows: RightNowRow[];
  base: string;
}

type QuickAction = {
  label: string;
  href: string;
  color: string;
  shadow: string;
  Icon: typeof CalendarBlank;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Itinerary", href: "itinerary", color: "#00A8CC", shadow: "#0087a3", Icon: CalendarBlank },
  { label: "Expenses",  href: "expenses",  color: "#00C96B", shadow: "#00944f", Icon: Receipt       },
  { label: "Packing",   href: "packing",   color: "#FFD600", shadow: "#c9aa00", Icon: Backpack      },
  { label: "Polls",     href: "polls",     color: "#A855F7", shadow: "#7c3aed", Icon: ChartBar      },
];

const SEVERITY_COLORS: Record<string, string> = {
  high: "#FF2D8B",
  medium: "#FFD600",
  low: "#00A8CC",
};

/**
 * "Right now" command surface:
 *   - top ranked row is visually promoted as the "Next step" card (lightning accent)
 *   - remaining rows render as a tight ranked list
 *   - a colored quick-actions grid follows, routing to the four core workspaces
 *
 * All rows come from `buildRightNowRows` — no mock data, no fake severities.
 */
export default function OverviewRightNow({ rows, base }: Props) {
  const [lead, ...rest] = rows;

  return (
    <section aria-label="Right now" className="flex flex-col gap-3">
      <style>{`
        .action-btn {
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .action-btn:hover  { transform: translateY(2px); }
        .action-btn:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>

      {/* Lead action + list together in a bento split */}
      {rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          {/* LEAD / NEXT STEP */}
          {lead && (
            <Link
              href={lead.href}
              className="md:col-span-1 rounded-[22px] border p-5 flex flex-col justify-between gap-4 hover:brightness-110 transition min-h-[180px] group"
              style={{
                backgroundColor: "#2e2e2e",
                borderColor: `${SEVERITY_COLORS[lead.severity] ?? "#3a3a3a"}66`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${SEVERITY_COLORS[lead.severity] ?? "#00A8CC"}22`,
                  }}
                >
                  <Lightning
                    size={20}
                    weight="fill"
                    style={{ color: SEVERITY_COLORS[lead.severity] ?? "#00A8CC" }}
                  />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[2px] text-white/55">
                  Next step
                </div>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="text-base font-bold text-white leading-snug">
                  {lead.text}
                </div>
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="shrink-0 text-white/45 group-hover:text-white/90 mb-0.5"
                />
              </div>
            </Link>
          )}

          {/* RIGHT NOW LIST */}
          {rest.length > 0 && (
            <div
              className="md:col-span-2 rounded-[22px] border p-5"
              style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
            >
              <div className="text-[10px] font-black uppercase tracking-[2px] text-white/55 mb-3">
                Right now
              </div>
              <ul className="flex flex-col divide-y divide-white/[0.06]">
                {rest.map((row) => (
                  <li key={row.key}>
                    <Link
                      href={row.href}
                      data-severity={row.severity}
                      className="flex items-center justify-between gap-3 py-3 text-sm text-white/85 hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-3 leading-snug">
                        <span
                          aria-hidden
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              SEVERITY_COLORS[row.severity] ?? "#ffffff40",
                          }}
                        />
                        {row.text}
                      </span>
                      <ArrowRight
                        size={12}
                        weight="bold"
                        className="shrink-0 text-white/35"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div
        className="rounded-[22px] border p-5"
        style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
      >
        <div className="text-[10px] font-black uppercase tracking-[2px] text-white/55 mb-4">
          Jump to
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={`${base}/${action.href}`}
              className="action-btn flex items-center justify-center gap-2 rounded-[14px] py-3 px-4 text-sm font-black text-[#1a1a1a] hover:opacity-95"
              style={{
                backgroundColor: action.color,
                boxShadow: `0 4px 0 ${action.shadow}`,
              }}
            >
              <action.Icon size={16} weight="fill" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
