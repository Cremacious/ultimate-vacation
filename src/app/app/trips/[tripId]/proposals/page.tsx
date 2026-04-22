import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";
import { listProposalsForTrip } from "@/lib/proposals/queries";
import {
  createProposalAction,
  deleteProposalAction,
  toggleUpvoteAction,
} from "./actions";
import CreateProposalForm from "./CreateProposalForm";
import ProposalCard from "./ProposalCard";

export default async function ProposalsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const member = await isTripMember(user.id, tripId);
  if (!member) redirect("/app");

  const isOrganizer = await isTripOrganizer(user.id, tripId);
  const proposals = await listProposalsForTrip(tripId, user.id);

  const boundDelete = deleteProposalAction.bind(null, tripId);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl">
      <h1
        className="text-3xl font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Proposals
      </h1>
      <p className="text-white/40 text-sm mb-8">
        Suggest activities, restaurants, and ideas — upvote what you want to do.
      </p>

      <CreateProposalForm action={createProposalAction.bind(null, tripId)} />

      {proposals.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
            Ideas · {proposals.length}
          </h2>
          <div className="flex flex-col gap-4">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                userId={user.id}
                canManage={proposal.createdById === user.id || isOrganizer}
                toggleUpvoteAction={toggleUpvoteAction.bind(null, tripId, proposal.id)}
                deleteAction={boundDelete}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-[#2A2B45] text-center py-16">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 border-2 border-dashed border-[#2A2B45]" />
          <p className="text-sm font-semibold text-white/30">No proposals yet — add one above.</p>
        </div>
      )}
    </div>
  );
}
