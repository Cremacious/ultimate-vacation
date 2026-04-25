import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { tripMembers, users } from "@/lib/db/schema";
import { listActiveInvitesForTrip } from "@/lib/invites/queries";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";
import { getTripById } from "@/lib/trips/queries";

import PreplanningShell from "@/components/preplanning/PreplanningShell";

const MOCK_TRANSPORT_MODES = ["fly", "drive"];

const MEMBER_COLORS = [
  "#FF2D8B", "#00A8CC", "#FFD600", "#00C96B",
  "#A855F7", "#FF8C00", "#14B8A6", "#EF4444",
];

export default async function PreplanningPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const [isMember, isOrganizer] = await Promise.all([
    isTripMember(user.id, tripId),
    isTripOrganizer(user.id, tripId),
  ]);
  if (!isMember) notFound();

  const [memberRows, activeInvites] = await Promise.all([
    db
      .select({ userId: tripMembers.userId, name: users.name, role: tripMembers.role })
      .from(tripMembers)
      .innerJoin(users, eq(tripMembers.userId, users.id))
      .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt))),
    listActiveInvitesForTrip(tripId),
  ]);

  return (
    <PreplanningShell
      transportModes={MOCK_TRANSPORT_MODES}
      groupData={{
        members: memberRows.map((m, i) => ({
          userId: m.userId,
          name: m.name,
          role: m.role,
          color: MEMBER_COLORS[i % MEMBER_COLORS.length],
        })),
        invites: activeInvites.map((inv) => ({
          id: inv.id,
          code: inv.code,
          usedCount: inv.usedCount,
          maxUses: inv.maxUses,
          expiresAt: inv.expiresAt ? inv.expiresAt.toISOString() : null,
          createdAt: inv.createdAt.toISOString(),
        })),
        tripId,
        currentUserId: user.id,
        isOrganizer,
        ownerId: trip.ownerId,
      }}
    />
  );
}
