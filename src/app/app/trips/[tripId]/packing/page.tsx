import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import { ensurePackingListBaseline } from "@/lib/packing/lists";
import { getPackingPageData } from "@/lib/packing/queries";

import PackingClient from "./PackingClient";
import {
  addPackingItemAction,
  claimSharedPackingItemAction,
  createPackingListAction,
  deletePackingItemAction,
  movePackingItemToSharedAction,
  setPackingItemVisibilityAction,
  setPackingListVisibilityAction,
  togglePackingItemAction,
  unassignSharedPackingItemAction,
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

  await ensurePackingListBaseline(trip.id, user.id);
  const packingData = await getPackingPageData(trip.id, user.id);

  const boundAdd = addPackingItemAction.bind(null, trip.id);
  const boundCreateList = createPackingListAction.bind(null, trip.id);
  const boundToggle = togglePackingItemAction.bind(null, trip.id);
  const boundDelete = deletePackingItemAction.bind(null, trip.id);
  const boundSetListVisibility = setPackingListVisibilityAction.bind(null, trip.id);
  const boundSetItemVisibility = setPackingItemVisibilityAction.bind(null, trip.id);
  const boundMoveToShared = movePackingItemToSharedAction.bind(null, trip.id);
  const boundClaimSharedItem = claimSharedPackingItemAction.bind(null, trip.id);
  const boundUnassignSharedItem = unassignSharedPackingItemAction.bind(null, trip.id);

  return (
    <PackingClient
      currentUserId={user.id}
      tripName={trip.name}
      packingData={packingData}
      addAction={boundAdd}
      createListAction={boundCreateList}
      toggleAction={boundToggle}
      deleteAction={boundDelete}
      setListVisibilityAction={boundSetListVisibility}
      setItemVisibilityAction={boundSetItemVisibility}
      moveToSharedAction={boundMoveToShared}
      claimSharedItemAction={boundClaimSharedItem}
      unassignSharedItemAction={boundUnassignSharedItem}
    />
  );
}
