import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  expenses,
  expenseSplits,
  itineraryEvents,
  polls,
  pollVotes,
  proposalUpvotes,
  proposals,
} from "@/lib/db/schema";

// ── Pulse data (server read) ─────────────────────────────────────────────────

export type TripPulseData = {
  nextEvent: {
    title: string;
    eventDate: string;       // "YYYY-MM-DD"
    startTime: string | null;
  } | null;
  unvotedPollsCount: number;   // 0 → hidden
  netBalanceCents: number;     // >0 = user is owed; <0 = user owes; 0 → hidden
  proposalsCount: number;      // 0 → hidden
  topProposal: { title: string; upvoteCount: number } | null;
};

export async function getTripPulse(
  tripId: string,
  userId: string,
  opts: {
    includeNextEvent: boolean; // only true when trip is within 14 days or in-progress
    isVaulted: boolean;        // skip balance for settled trips
  },
): Promise<TripPulseData> {
  const [
    nextEventRows,
    openPollsResult,
    votedPollsResult,
    paidResult,
    owedResult,
    proposalsCountResult,
    topProposalResult,
  ] = await Promise.all([
    // 1. Next itinerary event — only fetched for near/in-progress trips
    opts.includeNextEvent
      ? db
          .select({
            title: itineraryEvents.title,
            eventDate: itineraryEvents.eventDate,
            startTime: itineraryEvents.startTime,
          })
          .from(itineraryEvents)
          .where(
            and(
              eq(itineraryEvents.tripId, tripId),
              isNull(itineraryEvents.deletedAt),
              sql`${itineraryEvents.eventDate} >= CURRENT_DATE`,
            ),
          )
          .orderBy(itineraryEvents.eventDate, itineraryEvents.startTime)
          .limit(1)
      : Promise.resolve([]),

    // 2a. Total open polls for this trip
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(polls)
      .where(and(eq(polls.tripId, tripId), isNull(polls.closedAt), isNull(polls.deletedAt))),

    // 2b. Open polls this user has already voted on
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pollVotes)
      .innerJoin(polls, eq(pollVotes.pollId, polls.id))
      .where(
        and(
          eq(polls.tripId, tripId),
          isNull(polls.closedAt),
          isNull(polls.deletedAt),
          eq(pollVotes.userId, userId),
        ),
      ),

    // 3a. Total paid by this user across all trip expenses
    opts.isVaulted
      ? Promise.resolve([{ total: 0 }])
      : db
          .select({ total: sql<number>`coalesce(sum(${expenses.amountCents}), 0)::int` })
          .from(expenses)
          .where(
            and(
              eq(expenses.tripId, tripId),
              isNull(expenses.deletedAt),
              eq(expenses.payerId, userId),
            ),
          ),

    // 3b. Total owed by this user across all expense splits
    opts.isVaulted
      ? Promise.resolve([{ total: 0 }])
      : db
          .select({ total: sql<number>`coalesce(sum(${expenseSplits.amountCents}), 0)::int` })
          .from(expenseSplits)
          .innerJoin(expenses, eq(expenseSplits.expenseId, expenses.id))
          .where(
            and(
              eq(expenses.tripId, tripId),
              isNull(expenses.deletedAt),
              eq(expenseSplits.userId, userId),
            ),
          ),

    // 4a. Total non-deleted proposals
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(proposals)
      .where(and(eq(proposals.tripId, tripId), isNull(proposals.deletedAt))),

    // 4b. Top proposal by upvote count
    db
      .select({
        title: proposals.title,
        upvoteCount: sql<number>`count(${proposalUpvotes.id})::int`,
      })
      .from(proposals)
      .leftJoin(proposalUpvotes, eq(proposalUpvotes.proposalId, proposals.id))
      .where(and(eq(proposals.tripId, tripId), isNull(proposals.deletedAt)))
      .groupBy(proposals.id, proposals.title)
      .orderBy(sql`count(${proposalUpvotes.id}) desc`, proposals.createdAt)
      .limit(1),
  ]);

  const openPollsCount = openPollsResult[0]?.count ?? 0;
  const votedCount = votedPollsResult[0]?.count ?? 0;

  const totalPaidCents = (paidResult[0] as { total: number } | undefined)?.total ?? 0;
  const totalOwedCents = (owedResult[0] as { total: number } | undefined)?.total ?? 0;

  const nextEventRow = nextEventRows[0] ?? null;
  const topRow = topProposalResult[0] ?? null;

  return {
    nextEvent: nextEventRow
      ? {
          title: nextEventRow.title,
          eventDate: String(nextEventRow.eventDate),
          startTime: nextEventRow.startTime ?? null,
        }
      : null,
    unvotedPollsCount: Math.max(0, openPollsCount - votedCount),
    netBalanceCents: totalPaidCents - totalOwedCents,
    proposalsCount: proposalsCountResult[0]?.count ?? 0,
    topProposal: topRow ? { title: topRow.title, upvoteCount: topRow.upvoteCount } : null,
  };
}

// ── Right-now rows (merged lifecycle + live signals) ─────────────────────────

export type RightNowSeverity =
  | "blocking"        // lifecycle gap on the spine the user must clear
  | "time-sensitive"  // near-future event or open vote
  | "financial"       // money owed or owing
  | "collaborative";  // group input / proposals

export type RightNowRow = {
  key: string;
  severity: RightNowSeverity;
  text: string;
  href: string;
};

const SEVERITY_RANK: Record<RightNowSeverity, number> = {
  blocking: 0,
  "time-sensitive": 1,
  financial: 2,
  collaborative: 3,
};

function formatCents(cents: number, currency: string): string {
  const abs = Math.abs(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(cents) % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(abs);
}

function formatEventDate(eventDate: string): string {
  const [year, month, day] = eventDate.split("-").map(Number);
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const eventUtc = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((eventUtc - todayUtc) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

export type RightNowContext = {
  base: string;
  displayCurrency: string;
  isOrganizer: boolean;
  isSolo: boolean;
  hasExpenses: boolean;
  hasStartDate: boolean;
  isVaulted: boolean;
};

/**
 * Builds the single ranked "Right now" row list for the trip overview.
 * Merges lifecycle gaps (no dates / solo / no expenses) with live pulse signals
 * (next event, unvoted polls, net balance, proposals) into one ordered array.
 *
 * Scope note: kept local to the overview route on purpose. This is not a
 * general-purpose cross-app signal framework.
 */
export function buildRightNowRows(
  pulse: TripPulseData,
  ctx: RightNowContext,
): RightNowRow[] {
  const rows: RightNowRow[] = [];

  // Lifecycle gaps — only meaningful while the trip is still active.
  if (!ctx.isVaulted) {
    if (!ctx.hasStartDate && ctx.isOrganizer) {
      rows.push({
        key: "no-dates",
        severity: "blocking",
        text: "Set trip dates",
        href: `${ctx.base}/setup/edit`,
      });
    }
    if (ctx.isSolo && ctx.isOrganizer) {
      rows.push({
        key: "solo",
        severity: "blocking",
        text: "Invite your first traveler",
        href: `${ctx.base}/invite`,
      });
    }
    if (!ctx.hasExpenses && !ctx.isSolo) {
      rows.push({
        key: "no-expenses",
        severity: "blocking",
        text: ctx.isOrganizer ? "Log the first expense" : "Log an expense",
        href: `${ctx.base}/expenses`,
      });
    }
  }

  // Live signals.
  if (pulse.nextEvent) {
    const dateLabel = formatEventDate(pulse.nextEvent.eventDate);
    const timeLabel = pulse.nextEvent.startTime
      ? `, ${formatTime(pulse.nextEvent.startTime)}`
      : "";
    rows.push({
      key: "next-event",
      severity: "time-sensitive",
      text: `${dateLabel} · ${pulse.nextEvent.title}${timeLabel}`,
      href: `${ctx.base}/itinerary`,
    });
  }

  if (pulse.unvotedPollsCount > 0) {
    rows.push({
      key: "polls",
      severity: "time-sensitive",
      text:
        pulse.unvotedPollsCount === 1
          ? "1 open poll — your vote needed"
          : `${pulse.unvotedPollsCount} open polls — your vote needed`,
      href: `${ctx.base}/polls`,
    });
  }

  if (!ctx.isVaulted && Math.abs(pulse.netBalanceCents) >= 100) {
    rows.push({
      key: "balance",
      severity: "financial",
      text:
        pulse.netBalanceCents < 0
          ? `You owe ${formatCents(pulse.netBalanceCents, ctx.displayCurrency)}`
          : `You're owed ${formatCents(pulse.netBalanceCents, ctx.displayCurrency)}`,
      href: `${ctx.base}/expenses`,
    });
  }

  if (pulse.proposalsCount > 0) {
    const { proposalsCount: count, topProposal: top } = pulse;
    let text: string;
    if (count === 1 && top) {
      text =
        top.upvoteCount > 0
          ? `1 proposal: ${top.title} (${top.upvoteCount} upvote${top.upvoteCount === 1 ? "" : "s"})`
          : `1 proposal: ${top.title}`;
    } else if (top && top.upvoteCount > 0) {
      text = `${count} proposals · top: ${top.title} (${top.upvoteCount} upvote${top.upvoteCount === 1 ? "" : "s"})`;
    } else {
      text = `${count} proposal${count === 1 ? "" : "s"} — add your support`;
    }
    rows.push({
      key: "proposals",
      severity: "collaborative",
      text,
      href: `${ctx.base}/proposals`,
    });
  }

  // Stable sort: severity first, original push order preserved inside a tier.
  rows.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);

  return rows;
}
