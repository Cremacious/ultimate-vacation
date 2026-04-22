import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { proposalUpvotes, proposals } from "@/lib/db/schema";

export type Proposal = {
  id: string;
  title: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  upvoteCount: number;
  hasUpvoted: boolean;
};

export async function listProposalsForTrip(
  tripId: string,
  userId: string,
): Promise<Proposal[]> {
  const withCounts = await db
    .select({
      id: proposals.id,
      title: proposals.title,
      description: proposals.description,
      createdById: proposals.createdById,
      createdAt: proposals.createdAt,
      upvoteCount: sql<number>`count(${proposalUpvotes.id})::int`,
    })
    .from(proposals)
    .leftJoin(proposalUpvotes, eq(proposalUpvotes.proposalId, proposals.id))
    .where(and(eq(proposals.tripId, tripId), isNull(proposals.deletedAt)))
    .groupBy(
      proposals.id,
      proposals.title,
      proposals.description,
      proposals.createdById,
      proposals.createdAt,
    )
    .orderBy(sql`count(${proposalUpvotes.id}) desc`, proposals.createdAt);

  if (withCounts.length === 0) return [];

  const proposalIds = withCounts.map((p) => p.id);

  const myUpvoteRows = await db
    .select({ proposalId: proposalUpvotes.proposalId })
    .from(proposalUpvotes)
    .where(
      and(
        eq(proposalUpvotes.userId, userId),
        inArray(proposalUpvotes.proposalId, proposalIds),
      ),
    );

  const upvotedSet = new Set(myUpvoteRows.map((u) => u.proposalId));

  return withCounts.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    createdById: p.createdById,
    createdAt: p.createdAt.toISOString(),
    upvoteCount: p.upvoteCount,
    hasUpvoted: upvotedSet.has(p.id),
  }));
}
