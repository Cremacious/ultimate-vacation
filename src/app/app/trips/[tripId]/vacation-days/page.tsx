import VacationDayShell from "@/components/vacation-days/VacationDayShell";

export default async function VacationDaysPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { tripId } = await params;
  const { date } = await searchParams;
  return <VacationDayShell tripId={tripId} initialDate={date} />;
}
