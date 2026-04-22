"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { Poll } from "@/lib/polls/queries";

interface VoteOptionProps {
  option: Poll["options"][number];
  isSelected: boolean;
  isClosed: boolean;
  isWinner: boolean;
  totalVotes: number;
  onVote: () => void;
  isPending: boolean;
}

function VoteOption({
  option,
  isSelected,
  isClosed,
  isWinner,
  totalVotes,
  onVote,
  isPending,
}: VoteOptionProps) {
  const pct = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
  const barColor = isWinner && isClosed ? "#00C96B" : "#00E5FF";
  const ringColor = isSelected ? "#00E5FF" : "#2A2B45";

  return (
    <button
      type="button"
      disabled={isClosed || isPending}
      onClick={onVote}
      className="relative w-full text-left rounded-xl border overflow-hidden transition-all hover:border-[#00E5FF]/50 disabled:cursor-default"
      style={{ borderColor: ringColor }}
    >
      {/* Vote bar */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: barColor, opacity: 0.15 }}
      />
      <div className="relative flex items-center justify-between px-3 py-2.5 gap-2">
        <span className="text-sm text-white font-medium">{option.text}</span>
        <span className="text-xs text-white/40 shrink-0">
          {pct}%{option.voteCount > 0 ? ` · ${option.voteCount}` : ""}
        </span>
      </div>
    </button>
  );
}

interface Props {
  poll: Poll;
  userId: string;
  canManage: boolean;
  voteAction: (optionId: string) => Promise<{ ok: boolean; error?: string }>;
  closeAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function PollCard({
  poll,
  canManage,
  voteAction,
  closeAction,
  deleteAction,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isClosed = poll.closedAt !== null;
  const winnerVotes = isClosed ? Math.max(...poll.options.map((o) => o.voteCount)) : -1;

  function handleVote(optionId: string) {
    startTransition(async () => {
      await voteAction(optionId);
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-[#2A2B45] bg-[#15162A] p-5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <p className="text-sm font-semibold text-white leading-snug">{poll.question}</p>
        <span
          className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border"
          style={
            isClosed
              ? { color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.15)" }
              : { color: "#00E5FF", borderColor: "rgba(0,229,255,0.3)" }
          }
        >
          {isClosed ? "Closed" : "Open"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {poll.options.map((option) => (
          <VoteOption
            key={option.id}
            option={option}
            isSelected={poll.myVotedOptionId === option.id}
            isClosed={isClosed}
            isWinner={isClosed && option.voteCount === winnerVotes && winnerVotes > 0}
            totalVotes={poll.totalVotes}
            onVote={() => handleVote(option.id)}
            isPending={isPending}
          />
        ))}
      </div>

      {poll.totalVotes > 0 && (
        <p className="text-xs text-white/30 mt-3">
          {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
        </p>
      )}

      {canManage && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-[#2A2B45]">
          {!isClosed && (
            <form action={closeAction}>
              <input type="hidden" name="pollId" value={poll.id} />
              <button
                type="submit"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Close poll
              </button>
            </form>
          )}
          <form action={deleteAction}>
            <input type="hidden" name="pollId" value={poll.id} />
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
