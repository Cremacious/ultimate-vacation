import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import { getTripById } from "@/lib/trips/queries";
import { listLodgings } from "@/lib/preplanning/queries";

import PreplanningShell from "@/components/preplanning/PreplanningShell";
import {
  createLodgingAction,
  updateLodgingAction,
  deleteLodgingAction,
  updateTripNotesAction,
} from "./actions";

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

  const [lodgings, notesEditor] = await Promise.all([
    listLodgings(tripId),
    trip.preplanNotesUpdatedBy
      ? db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, trip.preplanNotesUpdatedBy))
          .limit(1)
      : Promise.resolve([]),
  ]);

  const notesMeta = {
    updatedAt: trip.preplanNotesUpdatedAt
      ? trip.preplanNotesUpdatedAt.toISOString()
      : null,
    updatedByName: notesEditor[0]?.name ?? null,
  };

  // Bind tripId onto the server actions so the client shell stays simple.
  const createStayAction = createLodgingAction.bind(null, tripId);
  const updateStayAction = updateLodgingAction.bind(null, tripId);
  const deleteStayAction = deleteLodgingAction.bind(null, tripId);
  const updateNotesAction = updateTripNotesAction.bind(null, tripId);

  return (
    <div className="px-4 py-6 md:px-6 md:py-8 max-w-3xl">
      <header className="mb-6">
        <h1
          className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Preplanning
        </h1>
        <p className="text-sm text-white/50">
          Where you&apos;re staying, plus anything the group should know before you leave.
        </p>
      </header>

      <PreplanningShell
        tripId={tripId}
        lodgings={lodgings}
        tripNotes={trip.preplanNotes ?? ""}
        notesMeta={notesMeta}
        createStayAction={createStayAction}
        updateStayAction={updateStayAction}
        deleteStayAction={deleteStayAction}
        updateNotesAction={updateNotesAction}
      />
    </div>
  );
}
