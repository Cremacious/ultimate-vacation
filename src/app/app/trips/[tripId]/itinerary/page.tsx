import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips, tripMembers } from "@/lib/db/schema";
import { listItineraryEvents } from "@/lib/itinerary/queries";
import ItineraryShell from "@/components/itinerary/ItineraryShell";

export default async function ItineraryPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { tripId } = await params;
  const { date } = await searchParams;
  const user = await requireUser();

  const [[trip], [member]] = await Promise.all([
    db
      .select({
        id: trips.id,
        name: trips.name,
        startDate: trips.startDate,
        endDate: trips.endDate,
      })
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
          You must be a member of this trip to view the itinerary.
        </p>
      </div>
    );
  }

  if (!trip.startDate || !trip.endDate) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href={`/app/trips/${tripId}`}
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            ← Back to trip
          </Link>
        </div>
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-6">
          <h1
            className="text-xl font-semibold text-white mb-2"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            No dates set yet
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Set your trip dates to start building the itinerary.
          </p>
          <Link
            href={`/app/trips/${tripId}/setup/edit`}
            className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-full transition-colors text-sm"
            style={{ backgroundColor: "#00E5FF", color: "#0a0a12" }}
          >
            Set trip dates
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = member.role === "organizer" || member.role === "trusted";
  const eventRows = await listItineraryEvents(tripId);

  // Serialize Date → ISO string for client boundary.
  const events = eventRows.map((e) => ({
    ...e,
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <ItineraryShell
      tripId={tripId}
      startDate={trip.startDate}
      endDate={trip.endDate}
      initialEvents={events}
      canEdit={canEdit}
      initialDate={date}
    />
  );
}
