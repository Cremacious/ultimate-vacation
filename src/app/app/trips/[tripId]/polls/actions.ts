"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { pollOptions, polls, pollVotes, tripMembers, users } from "@/lib/db/schema";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";
import { emitNotificationBulk } from "@/lib/notifications/emit";

export type CreatePollState = { error?: string; ok?: boolean };

export async function createPollAction(
  tripId: string,
  _prev: CreatePollState,
  formData: FormData,
): Promise<CreatePollState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to create a poll." };

  const question = (formData.get("question") as string | null)?.trim() ?? "";
  if (!question) return { error: "A question is required." };
  if (question.length > 300) return { error: "Question must be 300 characters or fewer." };

  const optionTexts = (formData.getAll("option") as string[])
    .map((o) => o.trim())
    .filter(Boolean);

  if (optionTexts.length < 2) return { error: "At least 2 options are required." };
  if (optionTexts.length > 6) return { error: "Maximum 6 options allowed." };

  for (const t of optionTexts) {
    if (t.length > 100) return { error: "Each option must be 100 characters or fewer." };
  }

  const [poll] = await db
    .insert(polls)
    .values({ tripId, createdById: user.id, question })
    .returning({ id: polls.id });

  await db.insert(pollOptions).values(
    optionTexts.map((text, i) => ({ pollId: poll.id, text, position: i })),
  );

  // Notify other members a poll needs their vote. Best-effort.
  try {
    const [creatorRow, memberRows] = await Promise.all([
      db.select({ name: users.name }).from(users).where(eq(users.id, user.id)).limit(1),
      db
        .select({ userId: tripMembers.userId })
        .from(tripMembers)
        .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt))),
    ]);
    const recipients = memberRows.filter((m) => m.userId !== user.id);
    if (creatorRow[0] && recipients.length > 0) {
      await emitNotificationBulk(
        recipients.map((m) => ({
          userId: m.userId,
          tripId,
          type: "poll_created",
          payload: { creatorName: creatorRow[0].name, question },
        })),
      );
    }
  } catch {
    // swallow — notifications are non-critical
  }

  revalidatePath(`/app/trips/${tripId}/polls`);
  return { ok: true };
}

export async function voteAction(
  tripId: string,
  pollId: string,
  optionId: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { ok: false, error: "Not a trip member." };

  const [poll] = await db
    .select({ closedAt: polls.closedAt, tripId: polls.tripId })
    .from(polls)
    .where(and(eq(polls.id, pollId), isNull(polls.deletedAt)))
    .limit(1);

  if (!poll || poll.tripId !== tripId) return { ok: false, error: "Poll not found." };
  if (poll.closedAt !== null) return { ok: false, error: "This poll is closed." };

  const [option] = await db
    .select({ id: pollOptions.id })
    .from(pollOptions)
    .where(and(eq(pollOptions.id, optionId), eq(pollOptions.pollId, pollId)))
    .limit(1);

  if (!option) return { ok: false, error: "Option not found." };

  await db
    .insert(pollVotes)
    .values({ pollId, optionId, userId: user.id })
    .onConflictDoUpdate({
      target: [pollVotes.pollId, pollVotes.userId],
      set: { optionId, createdAt: new Date() },
    });

  revalidatePath(`/app/trips/${tripId}/polls`);
  return { ok: true };
}

export async function closePollAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;

  const pollId = (formData.get("pollId") as string | null) ?? "";
  if (!pollId) return;

  const [poll] = await db
    .select({ createdById: polls.createdById, tripId: polls.tripId, closedAt: polls.closedAt })
    .from(polls)
    .where(and(eq(polls.id, pollId), isNull(polls.deletedAt)))
    .limit(1);

  if (!poll || poll.tripId !== tripId || poll.closedAt !== null) return;

  const isOrganizer = await isTripOrganizer(user.id, tripId);
  if (poll.createdById !== user.id && !isOrganizer) return;

  await db.update(polls).set({ closedAt: new Date() }).where(eq(polls.id, pollId));

  revalidatePath(`/app/trips/${tripId}/polls`);
}

export async function deletePollAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;

  const pollId = (formData.get("pollId") as string | null) ?? "";
  if (!pollId) return;

  const [poll] = await db
    .select({ createdById: polls.createdById, tripId: polls.tripId })
    .from(polls)
    .where(and(eq(polls.id, pollId), isNull(polls.deletedAt)))
    .limit(1);

  if (!poll || poll.tripId !== tripId) return;

  const isOrganizer = await isTripOrganizer(user.id, tripId);
  if (poll.createdById !== user.id && !isOrganizer) return;

  await db.update(polls).set({ deletedAt: new Date() }).where(eq(polls.id, pollId));

  revalidatePath(`/app/trips/${tripId}/polls`);
}
