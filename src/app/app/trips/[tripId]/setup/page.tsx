import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";

import { requireUser } from "@/lib/auth/session";
import { isTripMember } from "@/lib/invites/permissions";
import { listTripMembersForPicker } from "@/lib/expenses/queries";
import { getTripById } from "@/lib/trips/queries";

function formatTripDate(d: Date | string | null | undefined): string {
  if (!d) return "TBD";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcDuration(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
): number | null {
  if (!start || !end) return null;
  const s = start instanceof Date ? start : new Date(start);
  const e = end instanceof Date ? end : new Date(end);
  const days = Math.round((e.getTime() - s.getTime()) / 86_400_000);
  return days > 0 ? days : null;
}

function formatBudget(cents: number | null | undefined, currency: string): string | null {
  if (cents == null) return null;
  const amount = cents / 100;
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} ${currency}`;
}

export default async function SetupPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const canView = await isTripMember(user.id, trip.id);
  if (!canView) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/app" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view its setup.
        </p>
      </div>
    );
  }

  const members = await listTripMembersForPicker(trip.id);
  const memberCount = members.length;

  const durationDays = calcDuration(trip.startDate, trip.endDate);
  const hasDates = !!(trip.startDate || trip.endDate);
  const budgetDisplay = formatBudget(trip.budgetCents, "USD");

  return (
    <>
      <style>{`
        .setup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .sg-hero      { grid-column: 1 / 3; }
        .sg-travelers { grid-column: 1 / 3; }

        @media (min-width: 768px) {
          .setup-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
          .sg-hero      { grid-column: 1;     grid-row: 1 / 3; }
          .sg-duration  { grid-column: 2;     grid-row: 1;     }
          .sg-budget    { grid-column: 3;     grid-row: 1;     }
          .sg-travelers { grid-column: 2 / 4; grid-row: 2;     }
        }
      `}</style>

      <div>
        {/* ── Page header ───────────────────────────────────────── */}
        <div
          className="border-b flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-7 md:py-6"
          style={{ backgroundColor: "#282828", borderColor: "#333333" }}
        >
          <div>
            <h1
              className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Setup
            </h1>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Your trip at a glance
            </p>
          </div>
          <Link
            href={`/app/trips/${tripId}/setup/edit`}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm text-[#1a1a1a] transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: "#00A8CC" }}
          >
            <PencilSimple size={15} weight="bold" />
            <span className="hidden sm:inline">Edit Setup</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        </div>

        {/* ── Bento grid ────────────────────────────────────────── */}
        <div className="p-3 md:p-6">
          <div className="setup-grid">

            {/* ── HERO ─────────────────────────────────────────── */}
            <div
              className="sg-hero rounded-[20px] border flex flex-col justify-end relative overflow-hidden p-5 md:p-7"
              style={{
                backgroundColor: "#2e2e2e",
                borderColor: "#3a3a3a",
                minHeight: "200px",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 20% 50%, ${trip.ballColor}1f 0%, transparent 65%)`,
                }}
              />
              <div className="relative">
                <div className="text-[10px] font-black uppercase tracking-[3px] text-white/35 mb-1">
                  Trip Name
                </div>
                <div
                  className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {trip.name}
                </div>
                {hasDates && (
                  <div
                    className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
                    style={{ backgroundColor: "rgba(0,168,204,0.12)", border: "1px solid rgba(0,168,204,0.25)" }}
                  >
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Depart</div>
                      <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                        {formatTripDate(trip.startDate)}
                      </div>
                    </div>
                    <div className="text-white/25 text-sm">→</div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Return</div>
                      <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                        {formatTripDate(trip.endDate)}
                      </div>
                    </div>
                  </div>
                )}
                {!hasDates && (
                  <p className="text-xs font-semibold text-white/30 italic">Dates not set yet</p>
                )}
              </div>
            </div>

            {/* ── DURATION (only when computable) ───────────────── */}
            {durationDays != null && (
              <div
                className="sg-duration rounded-[20px] p-5 md:p-6 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: "#00A8CC" }}
              >
                <div
                  className="font-semibold text-[#1a1a1a] leading-none"
                  style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
                >
                  {durationDays}
                </div>
                <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">Days</div>
              </div>
            )}

            {/* ── BUDGET (only when set) ─────────────────────────── */}
            {budgetDisplay != null && (
              <div
                className="sg-budget rounded-[20px] border p-5 md:p-6 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
              >
                <div className="text-[11px] font-black uppercase tracking-[2px] text-white/35 mb-2">Budget</div>
                <div
                  className="font-semibold text-[#00C96B] leading-none"
                  style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(32px, 4.5vw, 68px)" }}
                >
                  {budgetDisplay}
                </div>
                {trip.budgetNotes && (
                  <div className="text-[12px] font-semibold text-white/35 mt-2 text-center leading-snug max-w-[120px]">
                    {trip.budgetNotes}
                  </div>
                )}
              </div>
            )}

            {/* ── TRAVELERS ─────────────────────────────────────── */}
            <div
              className="sg-travelers rounded-[20px] p-5 md:p-6 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: "#FFD600" }}
            >
              <div
                className="font-semibold text-[#1a1a1a] leading-none"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
              >
                {memberCount}
              </div>
              <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">
                {memberCount === 1 ? "Traveler" : "Travelers"}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
