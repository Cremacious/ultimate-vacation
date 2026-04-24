import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { isTripMember } from "@/lib/invites/permissions";
import { getTripById } from "@/lib/trips/queries";

import PreplanningShell from "@/components/preplanning/PreplanningShell";

// Hardcoded for UI restore — transport modes will be reattached from DB/setup later
const MOCK_TRANSPORT_MODES = ["fly", "drive"];

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

  return (
    <PreplanningShell transportModes={MOCK_TRANSPORT_MODES} />
  );
}
