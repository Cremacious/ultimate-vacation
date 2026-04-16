import WishlistShell from "@/components/wishlist/WishlistShell";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <WishlistShell />;
}
