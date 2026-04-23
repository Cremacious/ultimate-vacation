import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import { getPackingPageData } from "@/lib/packing/queries";

import PackingClient from "./PackingClient";
import {
  addPackingItemAction,
  deletePackingItemAction,
  togglePackingItemAction,
} from "./actions";

export default async function PackingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [trip, canView] = await Promise.all([
    db
      .select({ id: trips.id, name: trips.name })
      .from(trips)
      .where(eq(trips.id, tripId))
      .limit(1)
      .then((rows) => rows[0]),
    isTripMember(user.id, tripId),
  ]);
  if (!trip) notFound();
  if (!canView) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view the packing list.
        </p>
      </div>
    );
  }

  const packingData = await getPackingPageData(trip.id, user.id);

  const boundAdd = addPackingItemAction.bind(null, trip.id);
  const boundToggle = togglePackingItemAction.bind(null, trip.id);
  const boundDelete = deletePackingItemAction.bind(null, trip.id);

  return (
    <PackingClient
      tripName={trip.name}
      packingData={packingData}
      addAction={boundAdd}
      toggleAction={boundToggle}
      deleteAction={boundDelete}
    />
  );
}
