"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { Proposal } from "@/lib/proposals/queries";

interface Props {
  proposal: Proposal;
  userId: string;
  canManage: boolean;
  toggleUpvoteAction: () => Promise<{ ok: boolean; hasUpvoted: boolean; error?: string }>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function ProposalCard({
  proposal,
  canManage,
  toggleUpvoteAction,
  deleteAction,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [upvoteCount, setUpvoteCount] = useState(proposal.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(proposal.hasUpvoted);

  function handleUpvote() {
    const optimisticHasUpvoted = !hasUpvoted;
    setHasUpvoted(optimisticHasUpvoted);
    setUpvoteCount((c) => c + (optimisticHasUpvoted ? 1 : -1));

    startTransition(async () => {
      const result = await toggleUpvoteAction();
      if (!result.ok) {
        setHasUpvoted(hasUpvoted);
        setUpvoteCount(proposal.upvoteCount);
      }
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-[#2A2B45] bg-[#15162A] p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleUpvote}
          disabled={isPending}
          className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5"
          aria-label={hasUpvoted ? "Remove upvote" : "Upvote this proposal"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: hasUpvoted ? "#00E5FF" : "rgba(255,255,255,0.3)" }}
            className="transition-colors"
          >
            <path
              d="M8 2L14 10H2L8 2Z"
              fill={hasUpvoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-xs font-bold tabular-nums transition-colors"
            style={{ color: hasUpvoted ? "#00E5FF" : "rgba(255,255,255,0.3)" }}
          >
            {upvoteCount}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{proposal.title}</p>
          {proposal.description && (
            <p className="text-xs text-white/40 mt-1 leading-relaxed">{proposal.description}</p>
          )}
        </div>
      </div>

      {canManage && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-[#2A2B45]">
          <form action={deleteAction}>
            <input type="hidden" name="proposalId" value={proposal.id} />
            <button
              type="submit"
              className="text-xs text-[#FF3DA7]/60 hover:text-[#FF3DA7] transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
