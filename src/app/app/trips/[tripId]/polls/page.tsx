import PollsShell from "@/components/polls/PollsShell";

export default async function PollsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <PollsShell />;
}
