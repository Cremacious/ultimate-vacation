import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { pollOptions, polls, pollVotes } from "@/lib/db/schema";

export type PollOption = {
  id: string;
  text: string;
  position: number;
  voteCount: number;
};

export type Poll = {
  id: string;
  question: string;
  createdById: string;
  closedAt: string | null;
  createdAt: string;
  options: PollOption[];
  myVotedOptionId: string | null;
  totalVotes: number;
};

export async function listPollsForTrip(
  tripId: string,
  userId: string,
): Promise<Poll[]> {
  const rawPolls = await db
    .select({
      id: polls.id,
      question: polls.question,
      createdById: polls.createdById,
      closedAt: polls.closedAt,
      createdAt: polls.createdAt,
    })
    .from(polls)
    .where(and(eq(polls.tripId, tripId), isNull(polls.deletedAt)))
    .orderBy(polls.createdAt);

  if (rawPolls.length === 0) return [];

  const pollIds = rawPolls.map((p) => p.id);

  const optionsWithCounts = await db
    .select({
      id: pollOptions.id,
      pollId: pollOptions.pollId,
      text: pollOptions.text,
      position: pollOptions.position,
      voteCount: sql<number>`count(${pollVotes.id})::int`,
    })
    .from(pollOptions)
    .leftJoin(pollVotes, eq(pollVotes.optionId, pollOptions.id))
    .where(inArray(pollOptions.pollId, pollIds))
    .groupBy(
      pollOptions.id,
      pollOptions.pollId,
      pollOptions.text,
      pollOptions.position,
    )
    .orderBy(pollOptions.pollId, pollOptions.position);

  const myVoteRows = await db
    .select({ pollId: pollVotes.pollId, optionId: pollVotes.optionId })
    .from(pollVotes)
    .where(
      and(
        eq(pollVotes.userId, userId),
        inArray(pollVotes.pollId, pollIds),
      ),
    );

  const myVoteMap = new Map(myVoteRows.map((v) => [v.pollId, v.optionId]));

  const optionsByPollId = new Map<string, PollOption[]>();
  for (const o of optionsWithCounts) {
    const arr = optionsByPollId.get(o.pollId) ?? [];
    arr.push({ id: o.id, text: o.text, position: o.position, voteCount: o.voteCount });
    optionsByPollId.set(o.pollId, arr);
  }

  return rawPolls.map((p) => {
    const options = optionsByPollId.get(p.id) ?? [];
    const totalVotes = options.reduce((sum, o) => sum + o.voteCount, 0);
    return {
      id: p.id,
      question: p.question,
      createdById: p.createdById,
      closedAt: p.closedAt ? p.closedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      options,
      myVotedOptionId: myVoteMap.get(p.id) ?? null,
      totalVotes,
    };
  });
}
