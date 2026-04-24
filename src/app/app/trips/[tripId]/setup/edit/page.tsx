import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { requireUser } from "@/lib/auth/session";
import { getTripById } from "@/lib/trips/queries";
import { updateTripAction } from "@/lib/trips/actions";
import { isTripOrganizer, isTripMember } from "@/lib/invites/permissions";
import SetupForm from "@/components/setup/SetupForm";

export default async function SetupEditPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const [canView, canEdit] = await Promise.all([
    isTripMember(user.id, tripId),
    isTripOrganizer(user.id, tripId),
  ]);

  if (!canView) notFound();

  const boundAction = updateTripAction.bind(null, tripId);

  return (
    <div>
      {/* Page header */}
      <div
        className="border-b border-[#3A3A3A] px-4 py-4 md:px-7 md:py-6 flex items-center gap-3 md:gap-4 flex-shrink-0"
        style={{ backgroundColor: "#2E2E2E" }}
      >
        <Link
          href={`/app/trips/${tripId}/setup`}
          className="w-9 h-9 rounded-full border border-[#3A3A3A] flex items-center justify-center text-white transition-colors hover:border-[#00A8CC] hover:text-[#00A8CC] flex-shrink-0"
          style={{ backgroundColor: "#252525" }}
        >
          <ArrowLeft size={16} weight="bold" />
        </Link>
        <div>
          <h1
            className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Edit Setup
          </h1>
          <p className="text-xs font-semibold text-white/80 uppercase tracking-widest">
            {trip.name} · Changes saved on submit
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 md:p-6">
        {canEdit ? (
          <SetupForm
            tripId={tripId}
            action={boundAction}
            initialData={{
              name: trip.name,
              startDate: trip.startDate,
              endDate: trip.endDate,
              budgetCents: trip.budgetCents ?? null,
              budgetNotes: trip.budgetNotes ?? null,
              ballColor: trip.ballColor,
            }}
          />
        ) : (
          <div
            className="rounded-2xl border border-[#3A3A3A] p-6 text-center"
            style={{ backgroundColor: "#252525" }}
          >
            <p className="text-sm font-semibold text-white/80">
              Only trip organizers can edit setup details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
