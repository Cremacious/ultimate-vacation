import { invites } from "@/lib/db/schema";
import { db } from "@/lib/db";

import { buildInviteCode } from "./code";
import { isTripOrganizer } from "./permissions";

export type CreateInviteInput = {
  expiresAt?: Date | null;
  maxUses?: number | null;
  requiresApproval?: boolean;
};

export type CreatedInvite = {
  id: string;
  code: string;
  tripId: string;
};

/**
 * Create an invite for a trip. Beta rules:
 *   - Only organizers of the trip may create invites.
 *   - Defaults are "unlimited, no-expiry" — simplest working model. Organizers
 *     can pass expiresAt / maxUses for tighter scopes.
 *   - No approval gate at beta (requiresApproval defaults false).
 */
export async function createInviteForTrip(
  userId: string,
  tripId: string,
  input: CreateInviteInput = {}
): Promise<CreatedInvite> {
  const authorized = await isTripOrganizer(userId, tripId);
  if (!authorized) {
    throw new Error("Only organizers can create invites for this trip.");
  }

  const code = buildInviteCode();

  const [invite] = await db
    .insert(invites)
    .values({
      tripId,
      code,
      createdBy: userId,
      expiresAt: input.expiresAt ?? null,
      maxUses: input.maxUses ?? null,
      requiresApproval: input.requiresApproval ?? false,
    })
    .returning({ id: invites.id, code: invites.code, tripId: invites.tripId });

  return invite;
}
