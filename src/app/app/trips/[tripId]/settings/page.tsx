import SettingsShell from "@/components/settings/SettingsShell";

export default async function TripSettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <SettingsShell />;
}
