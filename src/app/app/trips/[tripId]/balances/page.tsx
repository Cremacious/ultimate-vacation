import { redirect } from "next/navigation";

export default async function BalancesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  redirect(`/app/trips/${tripId}/expenses`);
}
