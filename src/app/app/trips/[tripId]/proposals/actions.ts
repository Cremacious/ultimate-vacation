"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { proposalUpvotes, proposals } from "@/lib/db/schema";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";

export type CreateProposalState = { error?: string; ok?: boolean };

export async function createProposalAction(
  tripId: string,
  _prev: CreateProposalState,
  formData: FormData,
): Promise<CreateProposalState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to add a proposal." };

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  if (!title) return { error: "A title is required." };
  if (title.length > 200) return { error: "Title must be 200 characters or fewer." };

  const description = (formData.get("description") as string | null)?.trim() || null;
  if (description && description.length > 500) {
    return { error: "Description must be 500 characters or fewer." };
  }

  await db.insert(proposals).values({ tripId, createdById: user.id, title, description });

  revalidatePath(`/app/trips/${tripId}/proposals`);
  return { ok: true };
}

export async function toggleUpvoteAction(
  tripId: string,
  proposalId: string,
): Promise<{ ok: boolean; hasUpvoted: boolean; error?: string }> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { ok: false, hasUpvoted: false, error: "Not a trip member." };

  const [proposal] = await db
    .select({ tripId: proposals.tripId })
    .from(proposals)
    .where(and(eq(proposals.id, proposalId), isNull(proposals.deletedAt)))
    .limit(1);

  if (!proposal || proposal.tripId !== tripId) {
    return { ok: false, hasUpvoted: false, error: "Proposal not found." };
  }

  const [existing] = await db
    .select({ id: proposalUpvotes.id })
    .from(proposalUpvotes)
    .where(
      and(
        eq(proposalUpvotes.proposalId, proposalId),
        eq(proposalUpvotes.userId, user.id),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .delete(proposalUpvotes)
      .where(
        and(
          eq(proposalUpvotes.proposalId, proposalId),
          eq(proposalUpvotes.userId, user.id),
        ),
      );
    revalidatePath(`/app/trips/${tripId}/proposals`);
    return { ok: true, hasUpvoted: false };
  } else {
    await db.insert(proposalUpvotes).values({ proposalId, userId: user.id });
    revalidatePath(`/app/trips/${tripId}/proposals`);
    return { ok: true, hasUpvoted: true };
  }
}

export async function deleteProposalAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;

  const proposalId = (formData.get("proposalId") as string | null) ?? "";
  if (!proposalId) return;

  const [proposal] = await db
    .select({ createdById: proposals.createdById, tripId: proposals.tripId })
    .from(proposals)
    .where(and(eq(proposals.id, proposalId), isNull(proposals.deletedAt)))
    .limit(1);

  if (!proposal || proposal.tripId !== tripId) return;

  const isOrganizer = await isTripOrganizer(user.id, tripId);
  if (proposal.createdById !== user.id && !isOrganizer) return;

  await db.update(proposals).set({ deletedAt: new Date() }).where(eq(proposals.id, proposalId));

  revalidatePath(`/app/trips/${tripId}/proposals`);
}
