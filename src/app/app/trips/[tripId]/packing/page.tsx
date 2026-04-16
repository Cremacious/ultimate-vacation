import PackingShell from "@/components/packing/PackingShell";

export default async function PackingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <PackingShell />;
}
