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
  return <ItineraryShell tripId={tripId} initialDate={date} />;
}
