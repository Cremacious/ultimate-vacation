import { and, count, eq, isNull, lt, ne, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { tripMembers, trips, users } from "@/lib/db/schema";

export type MetricStatus = "on-target" | "watch" | "alert" | "no-data";

export type MetricResult = {
  numerator: number;
  denominator: number;
  pct: number;
  status: MetricStatus;
  value: string;
  rawCounts: string;
};

export type RetentionMetrics = {
  activationRate: MetricResult;
  tripCompletionRate: MetricResult;
  secondTripRate: MetricResult;
  participantToOrganizerRate: MetricResult;
  supporterConversionRate: MetricResult;
  unsettledTripRate: MetricResult;
};

function toResult(
  numerator: number,
  denominator: number,
  rawLabel: string,
  thresholds: (pct: number) => MetricStatus
): MetricResult {
  if (denominator === 0) {
    return {
      numerator: 0,
      denominator: 0,
      pct: 0,
      status: "no-data",
      value: "N/A",
      rawCounts: `0 of 0 ${rawLabel}`,
    };
  }
  const pct = Math.round((numerator / denominator) * 100);
  return {
    numerator,
    denominator,
    pct,
    status: thresholds(pct),
    value: `${pct}%`,
    rawCounts: `${numerator} of ${denominator} ${rawLabel}`,
  };
}

export async function computeRetentionMetrics(): Promise<RetentionMetrics> {
  // ── Shared subquery: trips that have ≥2 non-deleted members ──────────────
  // Computed as a set of tripIds for reuse across metrics.
  const memberCountRows = await db
    .select({
      tripId: tripMembers.tripId,
      memberCount: count(tripMembers.id),
    })
    .from(tripMembers)
    .where(isNull(tripMembers.deletedAt))
    .groupBy(tripMembers.tripId);

  const activatedTripIds = new Set(
    memberCountRows.filter((r) => r.memberCount >= 2).map((r) => r.tripId)
  );

  // ── Metric 1: Activation rate ─────────────────────────────────────────────
  // Numerator: users who are organizer on ≥1 trip with ≥2 members
  // Denominator: total non-deleted users
  const [totalUsersRow] = await db
    .select({ count: count() })
    .from(users)
    .where(isNull(users.deletedAt));
  const totalUsers = totalUsersRow?.count ?? 0;

  const organizerRows = await db
    .select({ userId: tripMembers.userId, tripId: tripMembers.tripId })
    .from(tripMembers)
    .where(and(eq(tripMembers.role, "organizer"), isNull(tripMembers.deletedAt)));

  const activatedOrganizerIds = new Set(
    organizerRows.filter((r) => activatedTripIds.has(r.tripId)).map((r) => r.userId)
  );

  const activationRate = toResult(
    activatedOrganizerIds.size,
    totalUsers,
    "signups",
    (p) => (p >= 40 ? "on-target" : p >= 20 ? "watch" : "alert")
  );

  // ── Metric 2: Trip completion rate ────────────────────────────────────────
  // Numerator: vaulted trips that had ≥2 members
  // Denominator: all trips that had ≥2 members
  const vaultedTripRows = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.lifecycle, "vaulted"), isNull(trips.deletedAt)));

  const vaultedIds = new Set(vaultedTripRows.map((r) => r.id));
  const vaultedActivated = [...activatedTripIds].filter((id) => vaultedIds.has(id)).length;

  const tripCompletionRate = toResult(
    vaultedActivated,
    activatedTripIds.size,
    "activated trips",
    (p) => (p >= 50 ? "on-target" : p >= 25 ? "watch" : "alert")
  );

  // ── Metric 3: 90-day second-trip rate ─────────────────────────────────────
  // Denominator: organizers with ≥1 vaulted trip
  // Numerator: subset who created a 2nd trip within 90 days of their 1st vaulted trip's endDate
  const vaultedTripDetails = await db
    .select({ id: trips.id, ownerId: trips.ownerId, endDate: trips.endDate, createdAt: trips.createdAt })
    .from(trips)
    .where(and(eq(trips.lifecycle, "vaulted"), isNull(trips.deletedAt)));

  // Group vaulted trips by organizer (owner), sorted by endDate ascending
  const vaultedByOwner = new Map<string, typeof vaultedTripDetails>();
  for (const t of vaultedTripDetails) {
    if (!vaultedByOwner.has(t.ownerId)) vaultedByOwner.set(t.ownerId, []);
    vaultedByOwner.get(t.ownerId)!.push(t);
  }

  // For the second-trip check, we look at ALL trips per owner (not just vaulted)
  const allTripRows = await db
    .select({ id: trips.id, ownerId: trips.ownerId, createdAt: trips.createdAt })
    .from(trips)
    .where(isNull(trips.deletedAt));
  const allTripsByOwner = new Map<string, typeof allTripRows>();
  for (const t of allTripRows) {
    if (!allTripsByOwner.has(t.ownerId)) allTripsByOwner.set(t.ownerId, []);
    allTripsByOwner.get(t.ownerId)!.push(t);
  }

  let secondTripNumerator = 0;
  for (const [ownerId, vaultedOwnerTrips] of vaultedByOwner) {
    const sorted = [...vaultedOwnerTrips].sort((a, b) => {
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : 0;
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : 0;
      return aEnd - bEnd;
    });
    const firstVaulted = sorted[0];
    if (!firstVaulted.endDate) continue;
    const windowEnd = new Date(firstVaulted.endDate);
    windowEnd.setDate(windowEnd.getDate() + 90);

    const ownerTrips = allTripsByOwner.get(ownerId) ?? [];
    const hasSecond = ownerTrips.some(
      (t) => t.id !== firstVaulted.id && t.createdAt <= windowEnd
    );
    if (hasSecond) secondTripNumerator++;
  }

  const secondTripRate = toResult(
    secondTripNumerator,
    vaultedByOwner.size,
    "organizers with settled trip",
    (p) => (p >= 25 ? "on-target" : p >= 12 ? "watch" : "alert")
  );

  // ── Metric 4: Participant-to-organizer conversion ─────────────────────────
  // Denominator: users who joined a vaulted trip as role=member (participant)
  // Numerator: those who are also organizer on any other trip
  const memberOnVaultedRows = await db
    .select({ userId: tripMembers.userId, tripId: tripMembers.tripId })
    .from(tripMembers)
    .innerJoin(trips, eq(tripMembers.tripId, trips.id))
    .where(
      and(
        eq(tripMembers.role, "member"),
        eq(trips.lifecycle, "vaulted"),
        isNull(tripMembers.deletedAt),
        isNull(trips.deletedAt)
      )
    );

  const participantIds = new Set(memberOnVaultedRows.map((r) => r.userId));

  const organizerOnAnyTripRows = await db
    .select({ userId: tripMembers.userId })
    .from(tripMembers)
    .where(and(eq(tripMembers.role, "organizer"), isNull(tripMembers.deletedAt)));

  const organizerSet = new Set(organizerOnAnyTripRows.map((r) => r.userId));
  const convertedCount = [...participantIds].filter((id) => organizerSet.has(id)).length;

  const participantToOrganizerRate = toResult(
    convertedCount,
    participantIds.size,
    "ex-participants",
    (p) => (p >= 5 ? "on-target" : p >= 2.5 ? "watch" : "alert")
  );

  // ── Metric 5: Supporter conversion rate ───────────────────────────────────
  // Denominator: users who participated in ≥1 vaulted trip (as organizer or member)
  // Numerator: users with supporterEntitledAt IS NOT NULL
  const participantsInVaultedRows = await db
    .select({ userId: tripMembers.userId })
    .from(tripMembers)
    .innerJoin(trips, eq(tripMembers.tripId, trips.id))
    .where(
      and(
        eq(trips.lifecycle, "vaulted"),
        isNull(tripMembers.deletedAt),
        isNull(trips.deletedAt)
      )
    );
  const settledParticipantIds = new Set(participantsInVaultedRows.map((r) => r.userId));

  const [supporterRow] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        isNull(users.deletedAt),
        sql`${users.supporterEntitledAt} IS NOT NULL`
      )
    );
  const supporterCount = supporterRow?.count ?? 0;

  const supporterConversionRate = toResult(
    supporterCount,
    settledParticipantIds.size,
    "settled participants",
    (p) => (p >= 3 ? "on-target" : p >= 1.5 ? "watch" : "alert")
  );

  // ── Metric 6: Unsettled-trip rate (lower is better) ───────────────────────
  // Denominator: trips with endDate < today - 30 days (non-deleted)
  // Numerator: same, where lifecycle != 'vaulted'
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().split("T")[0]; // YYYY-MM-DD

  const pastTripRows = await db
    .select({ lifecycle: trips.lifecycle })
    .from(trips)
    .where(
      and(
        isNull(trips.deletedAt),
        sql`${trips.endDate} IS NOT NULL`,
        sql`${trips.endDate} < ${cutoff}`
      )
    );

  const pastDenominator = pastTripRows.length;
  const unsettledCount = pastTripRows.filter((r) => r.lifecycle !== "vaulted").length;

  const unsettledTripRate = toResult(
    unsettledCount,
    pastDenominator,
    "ended trips",
    (p) => (p < 20 ? "on-target" : p < 30 ? "watch" : "alert")
  );

  return {
    activationRate,
    tripCompletionRate,
    secondTripRate,
    participantToOrganizerRate,
    supporterConversionRate,
    unsettledTripRate,
  };
}
