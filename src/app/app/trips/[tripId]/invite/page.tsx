import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { isTripOrganizer } from "@/lib/invites/permissions";
import { listActiveInvitesForTrip } from "@/lib/invites/queries";

import InviteClient from "./InviteClient";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [trip] = await db
    .select({ id: trips.id, name: trips.name })
    .from(trips)
    .where(eq(trips.id, tripId))
    .limit(1);
  if (!trip) notFound();

  const canInvite = await isTripOrganizer(user.id, trip.id);
  const active = canInvite ? await listActiveInvitesForTrip(trip.id) : [];

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href={`/app/trips/${trip.id}`}
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Back to trip
        </Link>
      </div>

      <h1
        className="text-3xl font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Invite members
      </h1>
      <p className="text-sm text-gray-400 mb-8">Trip: {trip.name}</p>

      {!canInvite ? (
        <p className="text-sm text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          Only organizers can create invites for this trip.
        </p>
      ) : (
        <InviteClient tripId={trip.id} existing={active} />
      )}
    </div>
  );
}
