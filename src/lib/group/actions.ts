"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { invites, tripMembers } from "@/lib/db/schema";
import { createInviteForTrip } from "@/lib/invites/create";
import { isTripOrganizer } from "@/lib/invites/permissions";

export async function createGroupInviteAction(
  tripId: string
): Promise<{ code?: string; error?: string }> {
  const user = await requireUser();
  try {
    const invite = await createInviteForTrip(user.id, tripId);
    revalidatePath(`/app/trips/${tripId}/preplanning`);
    return { code: invite.code };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create invite." };
  }
}

export async function revokeGroupInviteAction(
  inviteId: string,
  tripId: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const canManage = await isTripOrganizer(user.id, tripId);
  if (!canManage) return { ok: false, error: "Only organizers can revoke invites." };

  await db
    .update(invites)
    .set({ revokedAt: new Date() })
    .where(eq(invites.id, inviteId));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function removeGroupMemberAction(
  targetUserId: string,
  tripId: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const canManage = await isTripOrganizer(user.id, tripId);
  if (!canManage) return { ok: false, error: "Only organizers can remove members." };

  const [target] = await db
    .select({ role: tripMembers.role })
    .from(tripMembers)
    .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)));

  if (target?.role === "organizer") {
    return { ok: false, error: "Cannot remove the trip organizer." };
  }

  await db
    .update(tripMembers)
    .set({ deletedAt: new Date() })
    .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  revalidatePath("/app");
  return { ok: true };
}
