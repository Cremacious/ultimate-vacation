import { notFound } from "next/navigation";
import { and, count, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { invites, tripMembers, users } from "@/lib/db/schema";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";
import { getTripById } from "@/lib/trips/queries";
import { listFlights, listLodgings, listTransports } from "@/lib/preplanning/queries";

import PreplanningShell from "@/components/preplanning/PreplanningShell";
import {
  createFlightAction,
  updateFlightAction,
  deleteFlightAction,
  createTransportAction,
  updateTransportAction,
  deleteTransportAction,
  createLodgingAction,
  updateLodgingAction,
  deleteLodgingAction,
  updateTripNotesAction,
  updateChecklistAction,
} from "./actions";
import type { ChecklistItem } from "@/lib/preplanning/queries";

export default async function PreplanningPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const member = await isTripMember(user.id, tripId);
  if (!member) notFound();

  const [isOrganizer, flights, transports, lodgings, notesEditor, memberRows, inviteCountRows] = await Promise.all([
    isTripOrganizer(user.id, tripId),
    listFlights(tripId),
    listTransports(tripId),
    listLodgings(tripId),
    trip.preplanNotesUpdatedBy
      ? db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, trip.preplanNotesUpdatedBy))
          .limit(1)
      : Promise.resolve([]),
    db
      .select({ userId: tripMembers.userId, name: users.name, role: tripMembers.role })
      .from(tripMembers)
      .innerJoin(users, eq(tripMembers.userId, users.id))
      .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt))),
    db
      .select({ value: count() })
      .from(invites)
      .where(and(eq(invites.tripId, tripId), isNull(invites.revokedAt), isNull(invites.deletedAt))),
  ]);

  const inviteCount = inviteCountRows[0]?.value ?? 0;

  const notesMeta = {
    updatedAt: trip.preplanNotesUpdatedAt
      ? trip.preplanNotesUpdatedAt.toISOString()
      : null,
    updatedByName: notesEditor[0]?.name ?? null,
  };

  // Bind tripId onto server actions so the client shell stays simple.
  const createFlightBound = createFlightAction.bind(null, tripId);
  const updateFlightBound = updateFlightAction.bind(null, tripId);
  const deleteFlightBound = deleteFlightAction.bind(null, tripId);
  const createTransportBound = createTransportAction.bind(null, tripId);
  const updateTransportBound = updateTransportAction.bind(null, tripId);
  const deleteTransportBound = deleteTransportAction.bind(null, tripId);
  const createStayAction = createLodgingAction.bind(null, tripId);
  const updateStayAction = updateLodgingAction.bind(null, tripId);
  const deleteStayAction = deleteLodgingAction.bind(null, tripId);
  const updateNotesAction = updateTripNotesAction.bind(null, tripId);
  const updateChecklistBound = updateChecklistAction.bind(null, tripId);

  return (
    <div className="px-0 py-0">
      <PreplanningShell
        tripId={tripId}
        members={memberRows}
        isOrganizer={isOrganizer}
        inviteCount={inviteCount}
        flights={flights}
        transports={transports}
        lodgings={lodgings}
        tripNotes={trip.preplanNotes ?? ""}
        notesMeta={notesMeta}
        initialChecklist={(trip.preplanChecklist as ChecklistItem[] | null) ?? []}
        createFlightAction={createFlightBound}
        updateFlightAction={updateFlightBound}
        deleteFlightAction={deleteFlightBound}
        createTransportAction={createTransportBound}
        updateTransportAction={updateTransportBound}
        deleteTransportAction={deleteTransportBound}
        createStayAction={createStayAction}
        updateStayAction={updateStayAction}
        deleteStayAction={deleteStayAction}
        updateNotesAction={updateNotesAction}
        updateChecklistAction={updateChecklistBound}
      />
    </div>
  );
}
