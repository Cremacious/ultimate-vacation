"use client";

import { useState } from "react";
import {
  ChartBar,
  Plus,
  X,
  Check,
  Trophy,
  Heart,
  CalendarBlank,
  ArrowRight,
  Lock,
  Users,
  Sparkle,
  Timer,
  CaretDown,
  Confetti,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PollStatus = "open" | "closed" | "expired";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
  likes: number;
  myLike: boolean;
  promotedToItinerary: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  status: PollStatus;
  createdBy: string;
  createdAgo: string;
  expiresLabel: string | null;
  totalMembers: number;
  myVote: string | null;
  closedAgo?: string;
  fromWishlist?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_POLLS: Poll[] = [
  // ── Active ─────────────────────────────────────────────────────────────────
  {
    id: "p1",
    question: "Where should we eat on our last night in Osaka?",
    status: "open",
    createdBy: "You",
    createdAgo: "2h ago",
    expiresLabel: "2 days",
    totalMembers: 4,
    myVote: null,
    options: [
      { id: "o1", text: "Kappo Tamura — omakase splurge 💳",       votes: 2, voters: ["Sarah", "Emma"], likes: 1, myLike: false, promotedToItinerary: false },
      { id: "o2", text: "Mizuno — legendary okonomiyaki 🥞",        votes: 1, voters: ["Tom"],           likes: 2, myLike: true,  promotedToItinerary: false },
      { id: "o3", text: "Dotonbori food crawl — eat everything 🦑", votes: 0, voters: [],                likes: 0, myLike: false, promotedToItinerary: false },
      { id: "o4", text: "Kura Sushi — budget-friendly, no shame 🍣", votes: 0, voters: [],               likes: 0, myLike: false, promotedToItinerary: false },
    ],
  },
  {
    id: "p2",
    question: "Day trip from Kyoto — which one?",
    status: "open",
    createdBy: "Sarah",
    createdAgo: "1d ago",
    expiresLabel: "Tomorrow",
    totalMembers: 4,
    myVote: "o5",
    fromWishlist: "Nara day trip",
    options: [
      { id: "o5", text: "Nara — free-roaming deer 🦌",             votes: 2, voters: ["You", "Sarah"], likes: 3, myLike: true,  promotedToItinerary: false },
      { id: "o6", text: "Hiroshima + Miyajima island ⛩",           votes: 1, voters: ["Tom"],          likes: 1, myLike: false, promotedToItinerary: false },
      { id: "o7", text: "Uji — matcha everything 🍵",               votes: 0, voters: [],               likes: 0, myLike: false, promotedToItinerary: false },
    ],
  },
  // ── Closed ─────────────────────────────────────────────────────────────────
  {
    id: "p3",
    question: "What time should our return flight home leave?",
    status: "closed",
    createdBy: "You",
    createdAgo: "5d ago",
    expiresLabel: null,
    totalMembers: 4,
    myVote: "o8",
    closedAgo: "3d ago",
    options: [
      { id: "o8",  text: "Early morning (7 AM) — get home sooner ✈️", votes: 3, voters: ["You", "Sarah", "Emma"], likes: 0, myLike: false, promotedToItinerary: false },
      { id: "o9",  text: "Afternoon (2 PM) — sleep in one last time", votes: 1, voters: ["Tom"],                  likes: 0, myLike: false, promotedToItinerary: false },
    ],
  },
  {
    id: "p4",
    question: "Which Tokyo neighborhood for the Airbnb?",
    status: "closed",
    createdBy: "Tom",
    createdAgo: "8d ago",
    expiresLabel: null,
    totalMembers: 4,
    myVote: "o10",
    closedAgo: "7d ago",
    options: [
      { id: "o10", text: "Shinjuku — central, everything nearby 🏙",  votes: 2, voters: ["You", "Tom"],   likes: 0, myLike: false, promotedToItinerary: true  },
      { id: "o11", text: "Shibuya — trendy, great nightlife 🌆",       votes: 1, voters: ["Sarah"],        likes: 0, myLike: false, promotedToItinerary: false },
      { id: "o12", text: "Asakusa — traditional, near Senso-ji 🏮",   votes: 1, voters: ["Emma"],         likes: 0, myLike: false, promotedToItinerary: false },
    ],
  },
  {
    id: "p5",
    question: "Trip budget style — total pot or per-person target?",
    status: "closed",
    createdBy: "Sarah",
    createdAgo: "10d ago",
    expiresLabel: null,
    totalMembers: 4,
    myVote: "o14",
    closedAgo: "9d ago",
    options: [
      { id: "o13", text: "Shared total budget ($8,000 for the group)", votes: 1, voters: ["Tom"],                   likes: 0, myLike: false, promotedToItinerary: false },
      { id: "o14", text: "Per-person target ($2,000 each, own pace)",  votes: 3, voters: ["You", "Sarah", "Emma"], likes: 0, myLike: false, promotedToItinerary: false },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWinner(poll: Poll): PollOption | null {
  if (poll.status === "open") return null;
  const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
  if (sorted[0].votes > 0 && sorted[0].votes !== sorted[1]?.votes) return sorted[0];
  return sorted[0].votes > 0 ? sorted[0] : null; // tied: return first by order
}

function totalVotes(poll: Poll) {
  return poll.options.reduce((s, o) => s + o.votes, 0);
}

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
      {children}
    </div>
  );
}

// ─── Create Poll Form ─────────────────────────────────────────────────────────

function CreatePollForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (poll: Poll) => void }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiry, setExpiry] = useState<string | null>("3d");

  const EXPIRY_OPTS = [
    { val: null,  label: "No expiry" },
    { val: "24h", label: "24 hours"  },
    { val: "3d",  label: "3 days"   },
    { val: "1w",  label: "1 week"   },
  ];

  const expiryLabel = (val: string | null) =>
    val === "24h" ? "Tomorrow" : val === "3d" ? "3 days" : val === "1w" ? "1 week" : null;

  const canSubmit = question.trim() && options.filter(o => o.trim()).length >= 2;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newPoll: Poll = {
      id: `p${Date.now()}`,
      question: question.trim(),
      status: "open",
      createdBy: "You",
      createdAgo: "Just now",
      expiresLabel: expiryLabel(expiry),
      totalMembers: 4,
      myVote: null,
      options: options
        .filter(o => o.trim())
        .map((text, i) => ({
          id: `new-o${i}`,
          text: text.trim(),
          votes: 0,
          voters: [],
          likes: 0,
          myLike: false,
          promotedToItinerary: false,
        })),
    };
    onSubmit(newPoll);
  };

  return (
    <DarkCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black uppercase tracking-widest" style={{ color: "#FFD600" }}>New poll</p>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
          <X size={14} weight="bold" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Question */}
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="What does the group need to decide?"
          rows={2}
          autoFocus
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#FFD600]/50 placeholder-[#555] resize-none transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
        />

        {/* Options */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Options</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={e => setOptions(prev => prev.map((o, j) => j === i ? e.target.value : o))}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-medium text-white outline-none border focus:border-[#FFD600]/50 placeholder-[#555] transition-colors"
                  style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
                />
                {options.length > 2 && (
                  <button onClick={() => setOptions(prev => prev.filter((_, j) => j !== i))} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors flex-shrink-0" style={{ color: "#9CA3AF" }}>
                    <X size={12} weight="bold" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 5 && (
            <button
              onClick={() => setOptions(prev => [...prev, ""])}
              className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              <Plus size={11} weight="bold" /> Add option
            </button>
          )}
        </div>

        {/* Expiry */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Expires</label>
          <div className="flex gap-2">
            {EXPIRY_OPTS.map(o => (
              <button
                key={String(o.val)}
                onClick={() => setExpiry(o.val)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  backgroundColor: expiry === o.val ? "#FFD60022" : "#3a3a3a",
                  color: expiry === o.val ? "#FFD600" : "#9CA3AF",
                  border: `1px solid ${expiry === o.val ? "#FFD60055" : "transparent"}`,
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#FFD600", color: "#1a1a1a" }}
          >
            Launch poll
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── Poll Card ────────────────────────────────────────────────────────────────

function PollCard({
  poll,
  onVote,
  onLike,
  onClose,
  onPromote,
}: {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onLike: (pollId: string, optionId: string) => void;
  onClose: (pollId: string) => void;
  onPromote: (pollId: string, optionId: string) => void;
}) {
  const votes = totalVotes(poll);
  const winner = getWinner(poll);
  const isClosed = poll.status !== "open";
  const allVoted = votes >= poll.totalMembers;

  return (
    <DarkCard className="overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-5 pb-4">
        {/* Status row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {poll.status === "open" ? (
            <span
              className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: "#FFD60022", color: "#FFD600" }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#FFD600" }} />
              Open
            </span>
          ) : (
            <span
              className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
            >
              <Lock size={10} weight="fill" />
              Closed
            </span>
          )}

          {poll.expiresLabel && poll.status === "open" && (
            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#9CA3AF" }}>
              <Timer size={11} weight="fill" />
              Expires in {poll.expiresLabel}
            </span>
          )}

          {poll.fromWishlist && (
            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#A855F7" }}>
              <Sparkle size={11} weight="fill" />
              From wishlist
            </span>
          )}
        </div>

        {/* Question */}
        <h3
          className="text-lg font-semibold text-white leading-snug mb-1"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {poll.question}
        </h3>

        <p className="text-xs font-medium" style={{ color: "#555" }}>
          {poll.createdBy === "You" ? "You" : poll.createdBy} · {poll.createdAgo}
          {poll.closedAgo ? ` · closed ${poll.closedAgo}` : ""}
        </p>
      </div>

      {/* Options */}
      <div className="px-3 pb-3 space-y-2">
        {poll.options.map(option => {
          const pct = votes > 0 ? Math.round((option.votes / votes) * 100) : 0;
          const isMyVote = poll.myVote === option.id;
          const isWinner = winner?.id === option.id && isClosed;

          return (
            <div key={option.id} className="relative overflow-hidden rounded-xl">
              {/* Background fill */}
              <div
                className="absolute inset-0 rounded-xl transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isWinner
                    ? "#FFD60015"
                    : isMyVote
                    ? "#FFD60010"
                    : "#00A8CC0A",
                }}
              />

              <div
                className="relative flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors rounded-xl"
                style={{
                  border: `1px solid ${isMyVote ? "#FFD60040" : isWinner ? "#FFD60030" : "#3a3a3a"}`,
                  backgroundColor: "transparent",
                }}
                onClick={() => !isClosed && onVote(poll.id, option.id)}
              >
                {/* Vote indicator */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: isMyVote || isWinner ? "#FFD600" : "transparent",
                    border: isMyVote || isWinner ? "none" : "2px solid #4a4a4a",
                  }}
                >
                  {isMyVote && <Check size={10} weight="bold" color="#1a1a1a" />}
                  {isWinner && !isMyVote && <Trophy size={10} weight="fill" color="#1a1a1a" />}
                </div>

                {/* Text */}
                <span
                  className="flex-1 text-sm font-semibold leading-snug"
                  style={{ color: isMyVote || isWinner ? "white" : "#d1d5db" }}
                >
                  {option.text}
                </span>

                {/* Winner badge */}
                {isWinner && (
                  <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#FFD600", color: "#1a1a1a" }}>
                    Winner
                  </span>
                )}

                {/* Promoted badge */}
                {option.promotedToItinerary && (
                  <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
                    <Check size={9} weight="bold" /> In itinerary
                  </span>
                )}

                {/* Vote count + percent */}
                <div className="text-right flex-shrink-0 min-w-[40px]">
                  <p className="text-sm font-black" style={{ color: isWinner ? "#FFD600" : "#9CA3AF" }}>{option.votes}</p>
                  {votes > 0 && <p className="text-xs font-medium" style={{ color: "#555" }}>{pct}%</p>}
                </div>
              </div>

              {/* Voters + like — shown below option row */}
              {(option.voters.length > 0 || isClosed) && (
                <div className="flex items-center justify-between px-3 pb-2">
                  {/* Voter initials */}
                  <div className="flex items-center gap-1">
                    {option.voters.map((v, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}
                        title={v}
                      >
                        {v[0]}
                      </div>
                    ))}
                    {option.voters.length === 0 && (
                      <span className="text-xs font-medium" style={{ color: "#444" }}>No votes yet</span>
                    )}
                  </div>

                  {/* Like button */}
                  <button
                    onClick={e => { e.stopPropagation(); onLike(poll.id, option.id); }}
                    className="flex items-center gap-1 text-xs font-bold transition-colors px-2 py-0.5 rounded-full"
                    style={{
                      color: option.myLike ? "#FF2D8B" : "#555",
                      backgroundColor: option.myLike ? "#FF2D8B15" : "transparent",
                    }}
                  >
                    <Heart size={11} weight={option.myLike ? "fill" : "regular"} />
                    {option.likes > 0 && option.likes}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: "#333333" }}
      >
        {/* Voter progress */}
        <div className="flex items-center gap-2">
          <Users size={13} weight="fill" style={{ color: "#9CA3AF" }} />
          <span className="text-xs font-bold" style={{ color: votes === poll.totalMembers ? "#00C96B" : "#9CA3AF" }}>
            {votes} of {poll.totalMembers} voted
          </span>
          {allVoted && poll.status === "open" && (
            <span className="text-xs font-semibold" style={{ color: "#FFD600" }}>· Everyone's in!</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Promote winner to itinerary */}
          {isClosed && winner && !winner.promotedToItinerary && (
            <button
              onClick={() => onPromote(poll.id, winner.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: "#00C96B22", color: "#00C96B", border: "1px solid #00C96B55" }}
            >
              <ArrowRight size={11} weight="bold" />
              Add to itinerary
            </button>
          )}

          {/* Close poll */}
          {poll.status === "open" && poll.createdBy === "You" && (
            <button
              onClick={() => onClose(poll.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-[#3a3a3a]"
              style={{ color: "#9CA3AF", border: "1px solid #3a3a3a" }}
            >
              <Lock size={11} weight="fill" />
              Close
            </button>
          )}
        </div>
      </div>
    </DarkCard>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export default function PollsShell() {
  const [polls, setPolls] = useState(INITIAL_POLLS);
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [creating, setCreating] = useState(false);

  const openPolls   = polls.filter(p => p.status === "open");
  const closedPolls = polls.filter(p => p.status !== "open");

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      const prevVote = p.myVote;
      return {
        ...p,
        myVote: optionId,
        options: p.options.map(o => {
          if (o.id === prevVote) return { ...o, votes: Math.max(0, o.votes - 1), voters: o.voters.filter(v => v !== "You") };
          if (o.id === optionId && prevVote !== optionId) return { ...o, votes: o.votes + 1, voters: [...o.voters, "You"] };
          return o;
        }),
      };
    }));
  };

  const handleLike = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p =>
      p.id !== pollId ? p : {
        ...p,
        options: p.options.map(o =>
          o.id !== optionId ? o : {
            ...o,
            myLike: !o.myLike,
            likes: o.myLike ? o.likes - 1 : o.likes + 1,
          }
        ),
      }
    ));
  };

  const handleClosePoll = (pollId: string) => {
    setPolls(prev => prev.map(p =>
      p.id === pollId ? { ...p, status: "closed" as PollStatus, closedAgo: "Just now" } : p
    ));
    setTab("closed");
  };

  const handlePromote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p =>
      p.id !== pollId ? p : {
        ...p,
        options: p.options.map(o =>
          o.id === optionId ? { ...o, promotedToItinerary: true } : o
        ),
      }
    ));
  };

  const handleCreate = (poll: Poll) => {
    setPolls(prev => [poll, ...prev]);
    setCreating(false);
    setTab("open");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const shown = tab === "open" ? openPolls : closedPolls;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-dark" style={{ backgroundColor: "#1e1e1e" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-fredoka)" }}>
              Polls
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
              Stop the group chat spiral. Put it to a vote.
            </p>
          </div>
          <button
            onClick={() => setCreating(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
            style={{
              backgroundColor: creating ? "#FFD600" : "#FFD60022",
              color: creating ? "#1a1a1a" : "#FFD600",
              border: "1px solid #FFD60055",
            }}
          >
            <Plus size={14} weight="bold" />
            New poll
          </button>
        </div>

        {/* Create form */}
        {creating && <CreatePollForm onClose={() => setCreating(false)} onSubmit={handleCreate} />}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <DarkCard className="p-4 text-center">
            <p className="text-2xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#FFD600" }}>{openPolls.length}</p>
            <p className="text-xs font-bold mt-1" style={{ color: "#9CA3AF" }}>Active</p>
          </DarkCard>
          <DarkCard className="p-4 text-center">
            <p className="text-2xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#9CA3AF" }}>{closedPolls.length}</p>
            <p className="text-xs font-bold mt-1" style={{ color: "#9CA3AF" }}>Closed</p>
          </DarkCard>
          <DarkCard className="p-4 text-center">
            <p className="text-2xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#00C96B" }}>
              {polls.filter(p => p.status !== "open" && getWinner(p)?.promotedToItinerary).length}
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: "#9CA3AF" }}>In itinerary</p>
          </DarkCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: "#2e2e2e" }}>
          {[
            { key: "open"   as const, label: `Active (${openPolls.length})` },
            { key: "closed" as const, label: `Closed (${closedPolls.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: tab === t.key ? "#3a3a3a" : "transparent",
                color: tab === t.key ? "white" : "#9CA3AF",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Poll list */}
        {shown.length === 0 ? (
          <DarkCard className="p-12 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ border: "2px dashed #3a3a3a" }}
            >
              <ChartBar size={22} weight="fill" style={{ color: "#3a3a3a" }} />
            </div>
            <p className="text-base font-bold text-white mb-1">
              {tab === "open" ? "No active polls." : "No closed polls yet."}
            </p>
            <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
              {tab === "open"
                ? "Something needs a group decision? Start one."
                : "Closed polls land here once the group has spoken."}
            </p>
            {tab === "open" && (
              <button
                onClick={() => setCreating(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mx-auto"
                style={{ backgroundColor: "#FFD60022", color: "#FFD600", border: "1px solid #FFD60055" }}
              >
                <Plus size={13} weight="bold" />
                Create a poll
              </button>
            )}
          </DarkCard>
        ) : (
          <div className="space-y-4">
            {shown.map(poll => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onLike={handleLike}
                onClose={handleClosePoll}
                onPromote={handlePromote}
              />
            ))}
          </div>
        )}

        {/* Tip */}
        <p className="text-xs font-medium text-center pb-4" style={{ color: "#444" }}>
          Polls are free for everyone. No login required to vote once you're in the trip.
        </p>

      </div>
    </div>
  );
}
