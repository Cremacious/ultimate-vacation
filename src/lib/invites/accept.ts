import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { invites, tripMembers, trips } from "@/lib/db/schema";

import { isTripMember } from "./permissions";

export type AcceptInviteResult = {
  tripId: string;
  tripName: string;
  tripSlug: string;
  alreadyMember: boolean;
};

export type InviteErrorCode =
  | "not_found"
  | "revoked"
  | "expired"
  | "exhausted"
  | "trip_deleted";

export class InviteError extends Error {
  readonly code: InviteErrorCode;
  constructor(code: InviteErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Accept an invite and create a trip_members row for the given user.
 *
 * Validation order (fail-fast):
 *   1. invite exists
 *   2. invite not revoked
 *   3. invite not expired
 *   4. usedCount < maxUses (if maxUses set)
 *   5. parent trip not soft-deleted
 *
 * Then:
 *   - If user is already a member, no-op and return alreadyMember: true.
 *   - Otherwise insert trip_members row (role='member') and increment usedCount.
 *
 * Note: usedCount increment is best-effort (not atomic with the insert). If it
 * fails, the user is still a member. maxUses is an advisory cap at beta.
 */
export async function acceptInviteByCode(
  userId: string,
  code: string
): Promise<AcceptInviteResult> {
  const [invite] = await db
    .select()
    .from(invites)
    .where(eq(invites.code, code))
    .limit(1);

  if (!invite) throw new InviteError("not_found", "Invite code not found.");
  if (invite.revokedAt) throw new InviteError("revoked", "This invite has been revoked.");
  if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) {
    throw new InviteError("expired", "This invite has expired.");
  }
  if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
    throw new InviteError("exhausted", "This invite has reached its use limit.");
  }

  const [trip] = await db
    .select({ id: trips.id, name: trips.name, slug: trips.slug, deletedAt: trips.deletedAt })
    .from(trips)
    .where(eq(trips.id, invite.tripId))
    .limit(1);
  if (!trip || trip.deletedAt) {
    throw new InviteError("trip_deleted", "This trip is no longer available.");
  }

  const already = await isTripMember(userId, trip.id);
  if (already) {
    return { tripId: trip.id, tripName: trip.name, tripSlug: trip.slug, alreadyMember: true };
  }

  await db.insert(tripMembers).values({
    tripId: trip.id,
    userId,
    role: "member",
  });

  // Best-effort usedCount bump; don't fail the accept if this update throws.
  try {
    await db
      .update(invites)
      .set({ usedCount: sql`${invites.usedCount} + 1` })
      .where(eq(invites.id, invite.id));
  } catch {
    // swallow: membership already created, count is advisory
  }

  return { tripId: trip.id, tripName: trip.name, tripSlug: trip.slug, alreadyMember: false };
}
