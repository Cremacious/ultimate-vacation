import { redirect } from "next/navigation";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  redirect(`/app/trips/${tripId}/proposals`);
}
