import ScavengerHuntShell from "@/components/scavenger-hunt/ScavengerHuntShell";

export default async function ScavengerHuntPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <ScavengerHuntShell />;
}
