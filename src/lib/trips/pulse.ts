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
