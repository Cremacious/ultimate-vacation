import VacationDayShell from "@/components/vacation-days/VacationDayShell";

export default async function VacationDaysPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <VacationDayShell />;
}
