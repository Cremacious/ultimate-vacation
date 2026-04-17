import MembersShell from "@/components/members/MembersShell";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <MembersShell />;
}
