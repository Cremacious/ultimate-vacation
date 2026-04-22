import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";
import { listPollsForTrip } from "@/lib/polls/queries";
import {
  closePollAction,
  createPollAction,
  deletePollAction,
  voteAction,
} from "./actions";
import CreatePollForm from "./CreatePollForm";
import PollCard from "./PollCard";

export default async function PollsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const member = await isTripMember(user.id, tripId);
  if (!member) redirect("/app");

  const isOrganizer = await isTripOrganizer(user.id, tripId);
  const polls = await listPollsForTrip(tripId, user.id);

  const openPolls = polls.filter((p) => p.closedAt === null);
  const closedPolls = polls.filter((p) => p.closedAt !== null);

  const boundClose = closePollAction.bind(null, tripId);
  const boundDelete = deletePollAction.bind(null, tripId);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl">
      <h1
        className="text-3xl font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Polls
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Put decisions to a vote so the whole group has a say.
      </p>

      <CreatePollForm tripId={tripId} action={createPollAction.bind(null, tripId)} />

      {openPolls.length > 0 && (
        <section className="mt-10">
          <h2
            className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4"
          >
            Open
          </h2>
          <div className="flex flex-col gap-4">
            {openPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userId={user.id}
                canManage={poll.createdById === user.id || isOrganizer}
                voteAction={voteAction.bind(null, tripId, poll.id)}
                closeAction={boundClose}
                deleteAction={boundDelete}
              />
            ))}
          </div>
        </section>
      )}

      {closedPolls.length > 0 && (
        <section className="mt-10">
          <h2
            className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4"
          >
            Closed
          </h2>
          <div className="flex flex-col gap-4">
            {closedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userId={user.id}
                canManage={poll.createdById === user.id || isOrganizer}
                voteAction={voteAction.bind(null, tripId, poll.id)}
                closeAction={boundClose}
                deleteAction={boundDelete}
              />
            ))}
          </div>
        </section>
      )}

      {polls.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-[#2A2B45] text-center py-16">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 border-2 border-dashed border-[#2A2B45]"
          />
          <p className="text-sm font-semibold text-white/30">No polls yet — create one above.</p>
        </div>
      )}
    </div>
  );
}
