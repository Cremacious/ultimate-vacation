import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull, or } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { itineraryEvents, trips, tripMembers } from "@/lib/db/schema";
import { listTravelDays } from "@/lib/travel-days/queries";
import TravelDayShell from "@/components/travel-days/TravelDayShell";

export default async function TravelDaysPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [[trip], [member]] = await Promise.all([
    db
      .select({ id: trips.id, name: trips.name })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1),
    db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(
        and(
          eq(tripMembers.userId, user.id),
          eq(tripMembers.tripId, tripId),
          isNull(tripMembers.deletedAt)
        )
      )
      .limit(1),
  ]);

  if (!trip) notFound();

  if (!member) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            ← Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view travel days.
        </p>
      </div>
    );
  }

  const canEdit = member.role === "organizer" || member.role === "trusted";

  const [days, [transportEvent]] = await Promise.all([
    listTravelDays(tripId),
    db
      .select({ id: itineraryEvents.id })
      .from(itineraryEvents)
      .where(
        and(
          eq(itineraryEvents.tripId, tripId),
          isNull(itineraryEvents.deletedAt),
          or(
            eq(itineraryEvents.category, "flight"),
            eq(itineraryEvents.category, "transport")
          )
        )
      )
      .limit(1),
  ]);

  return (
    <TravelDayShell
      tripId={tripId}
      initialDays={days}
      canEdit={canEdit}
      hasItineraryTransportEvents={!!transportEvent}
    />
  );
}
