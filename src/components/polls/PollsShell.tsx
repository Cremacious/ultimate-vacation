"use client";

import { useState } from "react";
import {
  ChartBar, Plus, X, Check, Trophy,
  ArrowRight, Lock, Users, Timer, Sparkle,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PollStatus = "open" | "closed" | "expired";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
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
  fromProposals?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_POLLS: Poll[] = [
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
      { id: "o1", text: "Kappo Tamura — omakase splurge 💳",       votes: 2, voters: ["Sarah", "Emma"], promotedToItinerary: false },
      { id: "o2", text: "Mizuno — legendary okonomiyaki 🥞",        votes: 1, voters: ["Tom"],           promotedToItinerary: false },
      { id: "o3", text: "Dotonbori food crawl — eat everything 🦑", votes: 0, voters: [],               promotedToItinerary: false },
      { id: "o4", text: "Kura Sushi — budget-friendly, no shame 🍣", votes: 0, voters: [],              promotedToItinerary: false },
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
    fromProposals: "Nara day trip",
    options: [
      { id: "o5", text: "Nara — free-roaming deer 🦌",             votes: 2, voters: ["You", "Sarah"], promotedToItinerary: false },
      { id: "o6", text: "Hiroshima + Miyajima island ⛩",           votes: 1, voters: ["Tom"],          promotedToItinerary: false },
      { id: "o7", text: "Uji — matcha everything 🍵",               votes: 0, voters: [],               promotedToItinerary: false },
    ],
  },
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
      { id: "o8",  text: "Early morning (7 AM) — get home sooner ✈️", votes: 3, voters: ["You", "Sarah", "Emma"], promotedToItinerary: false },
      { id: "o9",  text: "Afternoon (2 PM) — sleep in one last time", votes: 1, voters: ["Tom"],                  promotedToItinerary: false },
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
      { id: "o10", text: "Shinjuku — central, everything nearby 🏙",  votes: 2, voters: ["You", "Tom"],   promotedToItinerary: true  },
      { id: "o11", text: "Shibuya — trendy, great nightlife 🌆",       votes: 1, voters: ["Sarah"],        promotedToItinerary: false },
      { id: "o12", text: "Asakusa — traditional, near Senso-ji 🏮",   votes: 1, voters: ["Emma"],         promotedToItinerary: false },
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
      { id: "o13", text: "Shared total budget ($8,000 for the group)", votes: 1, voters: ["Tom"],                   promotedToItinerary: false },
      { id: "o14", text: "Per-person target ($2,000 each, own pace)",  votes: 3, voters: ["You", "Sarah", "Emma"], promotedToItinerary: false },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWinner(poll: Poll): PollOption | null {
  if (poll.status === "open") return null;
  const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
  if (sorted[0].votes === 0) return null;
  return sorted[0];
}

function totalVotes(poll: Poll) {
  return poll.options.reduce((s, o) => s + o.votes, 0);
}

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}>
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
    { val: "24h", label: "24 hrs"   },
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
        .map((text, i) => ({ id: `new-o${i}`, text: text.trim(), votes: 0, voters: [], promotedToItinerary: false })),
    };
    onSubmit(newPoll);
  };

  return (
    <DarkCard className="overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #3a3a3a" }}>
        <p className="text-sm font-black uppercase tracking-widest" style={{ color: "#FFD600" }}>New poll</p>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
          <X size={14} weight="bold" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="What does the group need to decide?"
          rows={2}
          autoFocus
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#FFD600]/50 placeholder-[#555] resize-none transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
        />

        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Options</p>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
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
                  <button onClick={() => setOptions(prev => prev.filter((_, j) => j !== i))} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] flex-shrink-0" style={{ color: "#9CA3AF" }}>
                    <X size={11} weight="bold" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 5 && (
            <button onClick={() => setOptions(prev => [...prev, ""])} className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
              <Plus size={10} weight="bold" /> Add option
            </button>
          )}
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Expires</p>
          <div className="grid grid-cols-4 gap-1.5">
            {EXPIRY_OPTS.map(o => (
              <button
                key={String(o.val)}
                onClick={() => setExpiry(o.val)}
                className="py-2 rounded-xl text-xs font-bold transition-all"
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

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#FFD600", color: "#1a1a1a" }}
          >
            Launch poll
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── Poll Card ────────────────────────────────────────────────────────────────

function PollCard({
  poll, onVote, onClose, onPromote,
}: {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onClose: (pollId: string) => void;
  onPromote: (pollId: string, optionId: string) => void;
}) {
  const votes = totalVotes(poll);
  const winner = getWinner(poll);
  const isClosed = poll.status !== "open";
  const allVoters = [...new Set(poll.options.flatMap(o => o.voters))];
  const allVoted = allVoters.length >= poll.totalMembers;

  return (
    <DarkCard className="overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid #333" }}>
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-semibold text-white leading-snug" style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.1rem" }}>
            {poll.question}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            {poll.status === "open" ? (
              <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "#FFD60022", color: "#FFD600" }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#FFD600" }} />
                Open
              </span>
            ) : (
              <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                <Lock size={9} weight="fill" />
                Closed
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium flex-wrap" style={{ color: "#666" }}>
          <span>{poll.createdBy} · {poll.createdAgo}</span>
          {poll.expiresLabel && poll.status === "open" && (
            <span className="flex items-center gap-1" style={{ color: "#9CA3AF" }}>
              <Timer size={10} weight="fill" /> Expires in {poll.expiresLabel}
            </span>
          )}
          {poll.fromProposals && (
            <span className="flex items-center gap-1" style={{ color: "#A855F7" }}>
              <Sparkle size={10} weight="fill" /> From proposals
            </span>
          )}
          {poll.closedAgo && <span>· closed {poll.closedAgo}</span>}
        </div>
      </div>

      {/* Options */}
      <div className="p-3 space-y-2">
        {poll.options.map(option => {
          const pct = votes > 0 ? Math.round((option.votes / votes) * 100) : 0;
          const isMyVote = poll.myVote === option.id;
          const isWinner = winner?.id === option.id;

          return (
            <div
              key={option.id}
              className="relative overflow-hidden rounded-xl"
              style={{ cursor: isClosed ? "default" : "pointer" }}
              onClick={() => !isClosed && onVote(poll.id, option.id)}
            >
              {/* Background fill */}
              <div
                className="absolute inset-0 rounded-xl transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isWinner ? "#FFD60018" : isMyVote ? "#FFD60010" : "#ffffff06",
                }}
              />

              <div
                className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  border: `1px solid ${isMyVote ? "#FFD60050" : isWinner ? "#FFD60030" : "#3a3a3a"}`,
                }}
              >
                {/* Vote indicator */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isMyVote ? "#FFD600" : isWinner ? "#FFD600" : "transparent",
                    border: isMyVote || isWinner ? "none" : "2px solid #4a4a4a",
                  }}
                >
                  {isMyVote && <Check size={11} weight="bold" color="#1a1a1a" />}
                  {isWinner && !isMyVote && <Trophy size={11} weight="fill" color="#1a1a1a" />}
                </div>

                {/* Text */}
                <span className="flex-1 text-sm font-semibold leading-snug" style={{ color: isMyVote || isWinner ? "white" : "#c9cdd4" }}>
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
                  <span className="text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
                    <Check size={9} weight="bold" /> In itinerary
                  </span>
                )}

                {/* Percentage */}
                <span
                  className="text-sm font-black flex-shrink-0 min-w-[36px] text-right"
                  style={{ fontFamily: "var(--font-fredoka)", color: isWinner ? "#FFD600" : "#555", fontSize: "1rem" }}
                >
                  {votes > 0 ? `${pct}%` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderTop: "1px solid #333" }}>
        {/* Voters */}
        <div className="flex items-center gap-2">
          <Users size={13} style={{ color: "#9CA3AF" }} />
          <span className="text-xs font-bold" style={{ color: allVoted ? "#00C96B" : "#9CA3AF" }}>
            {votes} / {poll.totalMembers} voted
          </span>
          {allVoters.length > 0 && (
            <div className="flex">
              {allVoters.slice(0, 4).map((v, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black border"
                  style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF", borderColor: "#2e2e2e", marginLeft: i > 0 ? "-4px" : "4px", fontSize: "0.6rem" }}
                  title={v}
                >
                  {v[0]}
                </div>
              ))}
            </div>
          )}
          {allVoted && poll.status === "open" && (
            <span className="text-xs font-semibold" style={{ color: "#FFD600" }}>Everyone in!</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
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
          {poll.status === "open" && poll.createdBy === "You" && (
            <button
              onClick={() => onClose(poll.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#3a3a3a] transition-colors"
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
  const inItinerary = polls.filter(p => p.status !== "open" && getWinner(p)?.promotedToItinerary).length;

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

  const handleClosePoll = (pollId: string) => {
    setPolls(prev => prev.map(p =>
      p.id === pollId ? { ...p, status: "closed" as PollStatus, closedAgo: "Just now" } : p
    ));
    setTab("closed");
  };

  const handlePromote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p =>
      p.id !== pollId ? p : { ...p, options: p.options.map(o => o.id === optionId ? { ...o, promotedToItinerary: true } : o) }
    ));
  };

  const handleCreate = (poll: Poll) => {
    setPolls(prev => [poll, ...prev]);
    setCreating(false);
    setTab("open");
  };

  const shown = tab === "open" ? openPolls : closedPolls;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-dark" style={{ backgroundColor: "#404040" }}>

      <style>{`
        .polls-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .polls-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header band */}
      <div style={{ backgroundColor: "#282828", borderBottom: "1px solid #333" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-fredoka)", fontSize: "2rem", color: "white", lineHeight: 1.1, margin: 0 }}>
              Polls
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Stop the group chat spiral. Put it to a vote.
            </p>
          </div>
          <button
            onClick={() => setCreating(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
            style={{
              backgroundColor: "#FFD600",
              color: "#1a1a1a",
              boxShadow: creating ? "none" : "0 4px 0 #b39a00",
              transform: creating ? "translateY(2px)" : "none",
            }}
          >
            <Plus size={14} weight="bold" />
            New poll
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <DarkCard className="p-4 text-center">
            <p className="text-3xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#FFD600" }}>{openPolls.length}</p>
            <p className="text-xs font-bold mt-0.5 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Active</p>
          </DarkCard>
          <DarkCard className="p-4 text-center">
            <p className="text-3xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#9CA3AF" }}>{closedPolls.length}</p>
            <p className="text-xs font-bold mt-0.5 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Closed</p>
          </DarkCard>
          <DarkCard className="p-4 text-center">
            <p className="text-3xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#00C96B" }}>{inItinerary}</p>
            <p className="text-xs font-bold mt-0.5 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>In itinerary</p>
          </DarkCard>
        </div>

        {/* Bento grid */}
        <div className="polls-grid">

          {/* Left column — main poll list */}
          <div className="space-y-4">
            {/* Tab bar */}
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

            {/* Polls */}
            {shown.length === 0 ? (
              <DarkCard className="p-10 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ border: "2px dashed #3a3a3a" }}>
                  <ChartBar size={20} weight="fill" style={{ color: "#3a3a3a" }} />
                </div>
                <p className="text-base font-bold text-white mb-1">
                  {tab === "open" ? "No active polls." : "No closed polls yet."}
                </p>
                <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                  {tab === "open"
                    ? "Need a group decision? Start a poll."
                    : "Closed polls land here once the group has spoken."}
                </p>
              </DarkCard>
            ) : (
              shown.map(poll => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                  onClose={handleClosePoll}
                  onPromote={handlePromote}
                />
              ))
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-4">

            {/* Create poll card */}
            {creating ? (
              <CreatePollForm onClose={() => setCreating(false)} onSubmit={handleCreate} />
            ) : (
              <DarkCard
                className="p-5 text-center"
                style={{ border: "1px dashed #3a3a3a" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "#FFD60015", border: "1px solid #FFD60030" }}
                >
                  <Plus size={18} weight="bold" style={{ color: "#FFD600" }} />
                </div>
                <p className="text-sm font-bold text-white mb-1">New poll</p>
                <p className="text-xs font-medium mb-4" style={{ color: "#9CA3AF" }}>
                  Put a question to the group and let everyone vote.
                </p>
                <button
                  onClick={() => setCreating(true)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: "#FFD600", color: "#1a1a1a", boxShadow: "0 4px 0 #b39a00" }}
                >
                  Create poll
                </button>
              </DarkCard>
            )}

            {/* Closed decisions */}
            {closedPolls.length > 0 && (
              <DarkCard className="overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #333" }}>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Decisions made</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                    {closedPolls.length}
                  </span>
                </div>
                {closedPolls.map((poll, i) => {
                  const winner = getWinner(poll);
                  return (
                    <div
                      key={poll.id}
                      className="px-4 py-3"
                      style={{ borderBottom: i < closedPolls.length - 1 ? "1px solid #333" : "none" }}
                    >
                      <p className="text-xs font-semibold text-white leading-snug mb-1" style={{ lineHeight: 1.4 }}>
                        {poll.question}
                      </p>
                      {winner ? (
                        <div className="flex items-center gap-1.5">
                          <Trophy size={10} weight="fill" style={{ color: "#FFD600", flexShrink: 0 }} />
                          <span className="text-xs font-medium truncate" style={{ color: "#9CA3AF" }}>
                            {winner.text}
                          </span>
                          {winner.promotedToItinerary && (
                            <span className="text-xs font-bold flex-shrink-0 ml-auto px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
                              ✓ Added
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: "#555" }}>No clear winner</span>
                      )}
                    </div>
                  );
                })}
              </DarkCard>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
