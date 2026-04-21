import Link from "next/link";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  ArrowRight, CalendarBlank, Receipt, Backpack, ChartBar,
} from "@phosphor-icons/react/dist/ssr";

import { db } from "@/lib/db";
import { expenses, tripMembers, trips, users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/session";
import { getTripById } from "@/lib/trips/queries";
import { notFound } from "next/navigation";

// Deterministic palette for member initials — cycles if there are more members than colors.
const MEMBER_COLORS = [
  "#FF2D8B", "#00A8CC", "#FFD600", "#00C96B",
  "#A855F7", "#FF8C00", "#00E5FF", "#FF3DA7",
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function daysUntilDate(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
}

function tripPhaseLabel(lifecycle: string, startDate: string | null, endDate: string | null): string {
  if (lifecycle === "vaulted") return "Settled";
  const daysUntil = daysUntilDate(startDate);
  const daysUntilEnd = daysUntilDate(endDate);
  if (daysUntil === null) return "Planning";
  if (daysUntil > 0) return "Planning";
  if (daysUntilEnd !== null && daysUntilEnd >= 0) return "In Progress";
  return "Completed";
}

const QUICK_ACTIONS = [
  { label: "Log an expense",   href: "expenses",  color: "#00C96B", shadow: "#00944f", Icon: Receipt       },
  { label: "Check packing",    href: "packing",   color: "#FFD600", shadow: "#c9aa00", Icon: Backpack      },
  { label: "View polls",       href: "polls",     color: "#A855F7", shadow: "#7c3aed", Icon: ChartBar      },
  { label: "Itinerary",        href: "itinerary", color: "#00A8CC", shadow: "#0087a3", Icon: CalendarBlank },
];

// ─── Next-step state ──────────────────────────────────────────────────────────

type OverviewState = "settled" | "no-dates" | "solo" | "no-expenses" | "has-expenses";

function NextStepContent({
  state,
  isOrganizer,
  base,
}: {
  state: OverviewState;
  isOrganizer: boolean;
  base: string;
}) {
  const label = (text: string) => (
    <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-2">
      {text}
    </div>
  );
  const actionLink = (href: string, text: string) => (
    <Link
      href={href}
      className="text-[11px] font-black text-[#00A8CC] hover:underline flex items-center gap-1"
    >
      {text} <ArrowRight size={10} weight="bold" />
    </Link>
  );
  const muted = (text: string) => (
    <p className="text-[11px] font-semibold text-white/25">{text}</p>
  );

  if (state === "settled") {
    return (
      <>
        {label("Trip Status")}
        <p className="text-[11px] font-black" style={{ color: "#00C96B" }}>Settled ✓</p>
      </>
    );
  }

  if (state === "no-dates") {
    if (isOrganizer) {
      return (
        <>
          {label("Set Dates")}
          {actionLink(`${base}/setup/edit`, "Edit setup")}
          <div className="mt-3">{label("Add People")}</div>
          {actionLink(`${base}/invite`, "Invite link")}
        </>
      );
    }
    return (
      <>
        {label("Dates")}
        {muted("Not set yet")}
        <div className="mt-3">{label("Expenses")}</div>
        {actionLink(`${base}/expenses`, "Log an expense")}
      </>
    );
  }

  if (state === "solo") {
    return (
      <>
        {label("Add People")}
        {actionLink(`${base}/invite`, "Invite first traveler")}
        <div className="mt-3">{label("Expenses")}</div>
        {muted("Invite a traveler first")}
      </>
    );
  }

  if (state === "no-expenses") {
    if (isOrganizer) {
      return (
        <>
          {label("Expenses")}
          {actionLink(`${base}/expenses`, "Log first expense")}
          <div className="mt-3">{label("Add People")}</div>
          {actionLink(`${base}/invite`, "Invite link")}
        </>
      );
    }
    return (
      <>
        {label("Expenses")}
        {actionLink(`${base}/expenses`, "Log an expense")}
        <div className="mt-3">{label("Status")}</div>
        {muted("No expenses yet")}
      </>
    );
  }

  // has-expenses
  if (isOrganizer) {
    return (
      <>
        {label("Settle Up")}
        {actionLink(`${base}/expenses`, "View expenses")}
        <div className="mt-3">{label("Add People")}</div>
        {actionLink(`${base}/invite`, "Invite link")}
      </>
    );
  }
  return (
    <>
      {label("Settle Up")}
      {actionLink(`${base}/expenses`, "See who owes what")}
      <div className="mt-3">{label("Status")}</div>
      {muted("Expenses logged")}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const [memberRows, expenseCountRow] = await Promise.all([
    db
      .select({ userId: tripMembers.userId, name: users.name, role: tripMembers.role })
      .from(tripMembers)
      .innerJoin(users, eq(tripMembers.userId, users.id))
      .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt))),
    db
      .select({ n: sql<string>`count(*)` })
      .from(expenses)
      .where(and(eq(expenses.tripId, tripId), isNull(expenses.deletedAt))),
  ]);

  const isOrganizer = memberRows.some(
    (m) => m.userId === user.id && m.role === "organizer",
  );
  const hasExpenses = Number(expenseCountRow[0]?.n ?? 0) > 0;
  const isSolo = memberRows.length === 1 && isOrganizer;

  let overviewState: OverviewState;
  if (trip.lifecycle === "vaulted") {
    overviewState = "settled";
  } else if (!trip.startDate) {
    overviewState = "no-dates";
  } else if (isSolo) {
    overviewState = "solo";
  } else if (!hasExpenses) {
    overviewState = "no-expenses";
  } else {
    overviewState = "has-expenses";
  }

  const base = `/app/trips/${tripId}`;
  const daysUntil = daysUntilDate(trip.startDate);
  const phase = tripPhaseLabel(trip.lifecycle, trip.startDate, trip.endDate);

  // Countdown display: days remaining, "Today", "In Progress", or "Completed"
  let countdownNumber: string;
  let countdownLabel: string;
  if (daysUntil === null) {
    countdownNumber = "—";
    countdownLabel = "No dates set";
  } else if (daysUntil > 0) {
    countdownNumber = String(daysUntil);
    countdownLabel = daysUntil === 1 ? "Day Away" : "Days Away";
  } else if (daysUntil === 0) {
    countdownNumber = "🎉";
    countdownLabel = "Trip Day!";
  } else {
    countdownNumber = String(Math.abs(daysUntil));
    countdownLabel = "Days Ago";
  }

  return (
    <>
      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .og-hero     { grid-column: 1 / 3; }
        .og-members  { grid-column: 1 / 3; }
        .og-actions  { grid-column: 1 / 3; }

        @media (min-width: 768px) {
          .overview-grid  { grid-template-columns: 2fr 1fr 1fr; }
          .og-hero        { grid-column: 1;     grid-row: 1 / 3; }
          .og-countdown   { grid-column: 2;     grid-row: 1;     }
          .og-members     { grid-column: 3;     grid-row: 1;     }
          .og-progress    { grid-column: 2;     grid-row: 2;     }
          .og-nextaction  { grid-column: 3;     grid-row: 2;     }
          .og-actions     { grid-column: 1 / 4; grid-row: 3;     }
        }

        .action-btn {
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .action-btn:hover  { transform: translateY(2px); }
        .action-btn:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div
        className="border-b flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-7 md:py-6"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div>
          <h1
            className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {trip.name}
          </h1>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {phase}{daysUntil !== null && daysUntil > 0 ? ` · ${daysUntil} days away` : ""}
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-black text-[#1a1a1a]"
          style={{ backgroundColor: trip.ballColor }}
        >
          {phase}
        </div>
      </div>

      {/* ── Bento grid ───────────────────────────────────────────────── */}
      <div className="p-3 md:p-6">
        <div className="overview-grid">

          {/* ── HERO ─────────────────────────────────────────────────── */}
          <div
            className="og-hero rounded-[20px] border flex flex-col justify-end relative overflow-hidden p-5 md:p-7"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", minHeight: "200px" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 15% 65%, ${trip.ballColor}26 0%, transparent 60%)` }}
            />
            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[3px] text-white/30 mb-1">Your Trip</div>
              <div
                className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {trip.name}
              </div>
              {(trip.startDate || trip.endDate) && (
                <div
                  className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
                  style={{ backgroundColor: "rgba(0,168,204,0.10)", border: "1px solid rgba(0,168,204,0.22)" }}
                >
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Depart</div>
                    <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                      {formatDate(trip.startDate)}
                    </div>
                  </div>
                  <div className="text-white/25 text-sm">→</div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Return</div>
                    <div className="font-semibold text-base text-white leading-none" style={{ fontFamily: "var(--font-fredoka)" }}>
                      {formatDate(trip.endDate)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── COUNTDOWN ────────────────────────────────────────────── */}
          <div
            className="og-countdown rounded-[20px] flex flex-col items-center justify-center text-center p-5"
            style={{ backgroundColor: trip.ballColor }}
          >
            <div
              className="font-semibold text-[#1a1a1a] leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 6vw, 88px)" }}
            >
              {countdownNumber}
            </div>
            <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50 mt-2">{countdownLabel}</div>
          </div>

          {/* ── MEMBERS ──────────────────────────────────────────────── */}
          <div
            className="og-members rounded-[20px] flex flex-col items-center justify-center text-center gap-3 p-5"
            style={{ backgroundColor: "#FFD600" }}
          >
            <div
              className="font-semibold text-[#1a1a1a] leading-none"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              {memberRows.length}
            </div>
            <div className="text-[13px] font-black uppercase tracking-[2px] text-black/50">
              {memberRows.length === 1 ? "Traveler" : "Travelers"}
            </div>
            <div className="flex gap-1.5 flex-wrap justify-center">
              {memberRows.slice(0, 8).map((m, i) => (
                <div
                  key={m.userId}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-[#1a1a1a]"
                  style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length], boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                  title={m.name}
                >
                  {m.name.trim().charAt(0).toUpperCase()}
                </div>
              ))}
              {memberRows.length > 8 && (
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black text-[#1a1a1a]"
                  style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                >
                  +{memberRows.length - 8}
                </div>
              )}
            </div>
          </div>

          {/* ── NEXT STEP (role + state aware) ───────────────────────── */}
          <div
            className="og-progress rounded-[20px] border p-5 flex flex-col justify-center"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <NextStepContent
              state={overviewState}
              isOrganizer={isOrganizer}
              base={base}
            />
          </div>

          {/* ── MEMBERS LIST ─────────────────────────────────────────── */}
          <div
            className="og-nextaction rounded-[20px] border p-5 flex flex-col justify-center"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-3">Who&apos;s in</div>
            <div className="flex flex-col gap-2">
              {memberRows.slice(0, 4).map((m, i) => (
                <div key={m.userId} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-[#1a1a1a]"
                    style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }}
                  >
                    {m.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-white/80 truncate">{m.name}</span>
                  {m.role === "organizer" && (
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-wide ml-auto">Org</span>
                  )}
                </div>
              ))}
              {memberRows.length > 4 && (
                <p className="text-[10px] text-white/30 font-semibold">+{memberRows.length - 4} more</p>
              )}
            </div>
          </div>

          {/* ── QUICK ACTIONS ────────────────────────────────────────── */}
          <div
            className="og-actions rounded-[20px] border p-5"
            style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-4">Quick Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={`${base}/${action.href}`}
                  className="action-btn flex items-center justify-center gap-2 rounded-[12px] py-3 px-4 text-sm font-black text-[#1a1a1a] hover:opacity-95"
                  style={{
                    backgroundColor: action.color,
                    boxShadow: `0 4px 0 ${action.shadow}`,
                  }}
                >
                  <action.Icon size={15} weight="fill" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
