import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { isTripMember } from "@/lib/invites/permissions";
import { getTripById } from "@/lib/trips/queries";
import CurrentTripSync from "@/components/CurrentTripSync";
import TripSideNav from "@/components/TripSideNav";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [trip, member] = await Promise.all([
    getTripById(tripId),
    isTripMember(user.id, tripId),
  ]);

  if (!trip || !member) redirect("/app");

  const daysUntilStart = (() => {
    if (!trip.startDate) return null;
    const start = new Date(`${trip.startDate}T00:00:00Z`).getTime();
    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    return Math.round((start - todayUtc) / (1000 * 60 * 60 * 24));
  })();

  return (
    <>
      <CurrentTripSync id={trip.id} name={trip.name} ballColor={trip.ballColor} />
      <TripSideNav
        tripId={tripId}
        tripName={trip.name}
        fillPct={0}
        ballColor={trip.ballColor}
        daysUntil={daysUntilStart}
      />
      <div className="md:pl-[270px]">{children}</div>
    </>
  );
}
