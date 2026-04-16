import TravelDayShell from "@/components/travel-days/TravelDayShell";

export default async function TravelDaysPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <TravelDayShell />;
}
