import ItineraryShell from "@/components/itinerary/ItineraryShell";

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <ItineraryShell />;
}
