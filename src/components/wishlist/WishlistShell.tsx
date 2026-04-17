"use client";

import { useState } from "react";
import {
  Star, Plus, ThumbsUp, ThumbsDown, ChatCircle, ArrowRight, ChartBar, X,
  Mountains, ForkKnife, MapPin, Sparkle, PaperPlaneTilt, CheckCircle,
  Confetti, ArrowCounterClockwise, CalendarBlank,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProposalStatus = "must_do" | "proposed" | "approved";
type ProposalCategory = "activity" | "restaurant" | "place" | "experience";

interface Opinion {
  id: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  ago: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  status: ProposalStatus;
  addedBy: string;
  addedByInitials: string;
  addedByColor: string;
  addedAgo: string;
  upvotes: number;
  downvotes: number;
  myVote: "up" | "down" | null;
  opinions: Opinion[];
  promoted: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<ProposalCategory, { label: string; color: string; Icon: PhosphorIcon }> = {
  activity:   { label: "Activity",   color: "#FF2D8B", Icon: Mountains },
  restaurant: { label: "Restaurant", color: "#FFD600", Icon: ForkKnife },
  place:      { label: "Place",      color: "#00A8CC", Icon: MapPin    },
  experience: { label: "Experience", color: "#A855F7", Icon: Sparkle   },
};

const STATUS_META: Record<ProposalStatus, { label: string; color: string; Icon: PhosphorIcon }> = {
  must_do:  { label: "Must Do",  color: "#FFD600", Icon: Star         },
  proposed: { label: "Proposed", color: "#9CA3AF", Icon: ChatCircle   },
  approved: { label: "Approved", color: "#00C96B", Icon: CheckCircle  },
};

const OPINION_CHIPS = ["I'm in!", "Love it", "Too expensive", "Not sure", "Let's vote on it"];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: Proposal[] = [
  {
    id: "w1", status: "must_do",
    title: "Fushimi Inari — sunrise hike through the torii gates",
    description: "Go before 7 AM to avoid the crowds. The gates turn into a tunnel of orange light. Sarah found a blog post with the exact route.",
    category: "place",
    addedBy: "Sarah", addedByInitials: "SA", addedByColor: "#FF2D8B", addedAgo: "3d ago",
    upvotes: 4, downvotes: 0, myVote: "up",
    opinions: [
      { id: "o1", author: "Tom",  initials: "TM", color: "#00A8CC", text: "Non-negotiable. This is going in the itinerary.", ago: "2d ago" },
      { id: "o2", author: "Emma", initials: "EM", color: "#A855F7", text: "Takes about 2 hours to reach the top. Worth it.", ago: "1d ago" },
    ],
    promoted: false,
  },
  {
    id: "w3", status: "must_do",
    title: "teamLab Planets — immersive digital art",
    description: "You walk through water and light rooms barefoot. Completely surreal. Tickets sell out fast so we should book in advance.",
    category: "experience",
    addedBy: "Mike", addedByInitials: "MI", addedByColor: "#00A8CC", addedAgo: "5d ago",
    upvotes: 3, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
  {
    id: "w7", status: "must_do",
    title: "Philosopher's Path in cherry blossom season",
    description: "A stone path along a canal lined with cherry trees. Peak bloom is usually late March to early April — we might hit it perfectly.",
    category: "place",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC", addedAgo: "6d ago",
    upvotes: 3, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
  {
    id: "w4", status: "approved",
    title: "Sushi Saito — if we can get a reservation",
    description: "3 Michelin stars. Practically impossible to book, but Tom says he knows someone. Omakase only, around ¥30,000 per person.",
    category: "restaurant",
    addedBy: "Sarah", addedByInitials: "SA", addedByColor: "#FF2D8B", addedAgo: "6d ago",
    upvotes: 3, downvotes: 1, myVote: "up",
    opinions: [
      { id: "o3", author: "Tom",  initials: "TM", color: "#00A8CC", text: "Working on it. No promises.", ago: "5d ago" },
      { id: "o4", author: "Emma", initials: "EM", color: "#A855F7", text: "If Tom pulls this off he is MVP of the trip.", ago: "5d ago" },
    ],
    promoted: false,
  },
  {
    id: "w2", status: "proposed",
    title: "Cycling through Nara park with the deer",
    description: "Rent bikes near Kintetsu Nara Station and spend a morning weaving through the free-roaming deer. Under $10 per person.",
    category: "activity",
    addedBy: "Emma", addedByInitials: "EM", addedByColor: "#A855F7", addedAgo: "4d ago",
    upvotes: 4, downvotes: 0, myVote: "up",
    opinions: [
      { id: "o5", author: "You", initials: "ME", color: "#00A8CC", text: "Can we feed them? I need to feed one.", ago: "3d ago" },
    ],
    promoted: false,
  },
  {
    id: "w5", status: "proposed",
    title: "Traditional tea ceremony in Kyoto",
    description: "There's a small teahouse in Higashiyama that does private ceremonies for groups. About 90 minutes, includes matcha and wagashi sweets.",
    category: "experience",
    addedBy: "Emma", addedByInitials: "EM", addedByColor: "#A855F7", addedAgo: "5d ago",
    upvotes: 2, downvotes: 0, myVote: "up",
    opinions: [],
    promoted: false,
  },
  {
    id: "w6", status: "proposed",
    title: "Karaoke night in Shinjuku — private room",
    description: "Book a private karaoke room in Kabukicho for 3 hours. It's louder and weirder than you expect and that's exactly the point.",
    category: "activity",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC", addedAgo: "4d ago",
    upvotes: 2, downvotes: 1, myVote: null,
    opinions: [
      { id: "o6", author: "You", initials: "ME", color: "#00A8CC", text: "Tom is already practicing ABBA. I've seen the texts.", ago: "3d ago" },
    ],
    promoted: false,
  },
  {
    id: "w8", status: "proposed",
    title: "Standing sushi bar at Tsukiji outer market",
    description: "Show up early (7–8 AM), grab a spot at one of the counter stalls. Freshest fish in the city, standing next to actual chefs.",
    category: "restaurant",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC", addedAgo: "3d ago",
    upvotes: 2, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
  {
    id: "w9", status: "proposed",
    title: "Sumo stable morning practice (keiko)",
    description: "A few stables in Tokyo allow tourists to watch morning training. Rare and surreal.",
    category: "experience",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC", addedAgo: "2d ago",
    upvotes: 2, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
  {
    id: "w10", status: "proposed",
    title: "Ichiran Ramen — solo booth experience",
    description: "Order alone in your own private booth, no small talk required. It sounds antisocial but it's actually deeply meditative.",
    category: "restaurant",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC", addedAgo: "7d ago",
    upvotes: 1, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
  {
    id: "w11", status: "proposed",
    title: "Capsule hotel for one night (just for the experience)",
    description: "Stay one night in a well-reviewed capsule hotel. Tokyo has some genuinely nice ones.",
    category: "experience",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC", addedAgo: "8d ago",
    upvotes: 1, downvotes: 2, myVote: null,
    opinions: [
      { id: "o7", author: "Sarah", initials: "SA", color: "#FF2D8B", text: "Hard no. I need a real bed.", ago: "7d ago" },
    ],
    promoted: false,
  },
  {
    id: "w12", status: "proposed",
    title: "Osaka food tour with a local guide",
    description: "A few operators run evening walking food tours of Dotonbori and Namba. About 3 hours, 6–8 stops.",
    category: "activity",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC", addedAgo: "1d ago",
    upvotes: 1, downvotes: 0, myVote: null,
    opinions: [],
    promoted: false,
  },
];

// ─── Promote Modal ────────────────────────────────────────────────────────────

function PromoteModal({ title, onClose, onConfirm }: {
  title: string;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState("2025-04-03");
  const [time, setTime] = useState("10:00");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-sm rounded-[20px] border p-6" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35">Add to Itinerary</div>
          <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#3a3a3a]" style={{ color: "#9CA3AF" }}>
            <X size={13} weight="bold" />
          </button>
        </div>
        <p className="text-sm font-bold text-white mb-4 leading-snug">{title}</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-1.5 block">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", colorScheme: "dark" }} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-1.5 block">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", colorScheme: "dark" }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(date, time)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-[#1a1a1a]"
            style={{ backgroundColor: "#00C96B", boxShadow: "0 3px 0 #00944f" }}
          >
            <CalendarBlank size={14} weight="fill" />
            Add to itinerary
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Item Form ────────────────────────────────────────────────────────────

function AddItemForm({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Proposal) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProposalCategory>("activity");
  const [status, setStatus] = useState<ProposalStatus>("proposed");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: `w${Date.now()}`, title: title.trim(), description: description.trim(),
      category, status,
      addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC", addedAgo: "Just now",
      upvotes: 0, downvotes: 0, myVote: null,
      opinions: [], promoted: false,
    });
  };

  return (
    <div className="rounded-[20px] border p-5" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: "#00A8CC" }}>New Proposal</p>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a]" style={{ color: "#9CA3AF" }}>
          <X size={14} weight="bold" />
        </button>
      </div>
      <div className="space-y-4">
        {/* Status */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-2">Type</div>
          <div className="flex gap-2">
            {(["proposed", "must_do"] as ProposalStatus[]).map(s => {
              const meta = STATUS_META[s];
              const sel = status === s;
              return (
                <button key={s} onClick={() => setStatus(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{ backgroundColor: sel ? meta.color + "25" : "#3a3a3a", color: sel ? meta.color : "#9CA3AF", border: `1px solid ${sel ? meta.color + "55" : "transparent"}` }}>
                  <meta.Icon size={11} weight="fill" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Category */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-2">Category</div>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(CATEGORY_META) as [ProposalCategory, (typeof CATEGORY_META)[ProposalCategory]][]).map(([key, meta]) => {
              const sel = category === key;
              return (
                <button key={key} onClick={() => setCategory(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{ backgroundColor: sel ? meta.color + "25" : "#3a3a3a", color: sel ? meta.color : "#9CA3AF", border: `1px solid ${sel ? meta.color + "55" : "transparent"}` }}>
                  <meta.Icon size={11} weight="fill" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's the idea?" autoFocus
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }} />
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Any details? (optional)"
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }} />
        <div className="flex gap-3">
          <button onClick={handleAdd} disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-[#1a1a1a] disabled:opacity-40 transition-all"
            style={{ backgroundColor: "#00A8CC", boxShadow: "0 3px 0 #0087a3" }}>
            Add proposal
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({ item, onVote, onAddOpinion, onPromote, onStartPoll, onApprove }: {
  item: Proposal;
  onVote: (id: string, dir: "up" | "down") => void;
  onAddOpinion: (id: string, text: string) => void;
  onPromote: (id: string) => void;
  onStartPoll: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const [opinionsOpen, setOpinionsOpen] = useState(false);
  const [opinionText, setOpinionText] = useState("");
  const catMeta = CATEGORY_META[item.category];
  const statusMeta = STATUS_META[item.status];
  const score = item.upvotes - item.downvotes;

  const submitOpinion = (text: string) => {
    if (!text.trim()) return;
    onAddOpinion(item.id, text.trim());
    setOpinionText("");
  };

  const borderColor = item.status === "must_do" ? "#FFD600"
    : item.status === "approved" ? "#00C96B"
    : catMeta.color;

  return (
    <div className="rounded-[18px] overflow-hidden" style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a", borderLeft: `3px solid ${borderColor}` }}>
      <div className="p-4">
        {/* Top row: category + status badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: catMeta.color + "20" }}>
            <catMeta.Icon size={11} weight="fill" color={catMeta.color} />
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: catMeta.color }}>{catMeta.label}</span>
          </div>
          {item.status !== "proposed" && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: statusMeta.color + "20" }}>
              <statusMeta.Icon size={11} weight="fill" color={statusMeta.color} />
              <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: statusMeta.color }}>{statusMeta.label}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug mb-1">{item.title}</h3>

        {/* Description */}
        {item.description && (
          <p className="text-xs font-medium leading-relaxed mb-3 line-clamp-2" style={{ color: "#9CA3AF" }}>{item.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: item.addedByColor + "30", color: item.addedByColor }}>
              {item.addedByInitials[0]}
            </div>
            <span className="text-xs font-medium" style={{ color: "#555" }}>
              {item.addedBy} · {item.addedAgo}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Voting */}
            <div className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5" style={{ backgroundColor: "#1e1e1e" }}>
              <button onClick={() => onVote(item.id, "up")}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold transition-colors"
                style={{ color: item.myVote === "up" ? "#00C96B" : "#9CA3AF" }}>
                <ThumbsUp size={12} weight={item.myVote === "up" ? "fill" : "regular"} />
                {item.upvotes > 0 && <span>{item.upvotes}</span>}
              </button>
              <span className="text-white/20 text-xs">|</span>
              <button onClick={() => onVote(item.id, "down")}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold transition-colors"
                style={{ color: item.myVote === "down" ? "#FF2D8B" : "#9CA3AF" }}>
                <ThumbsDown size={12} weight={item.myVote === "down" ? "fill" : "regular"} />
                {item.downvotes > 0 && <span>{item.downvotes}</span>}
              </button>
            </div>

            {/* Opinions toggle */}
            <button onClick={() => setOpinionsOpen(v => !v)}
              className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full hover:bg-[#3a3a3a] transition-colors"
              style={{ color: opinionsOpen ? "#00A8CC" : "#9CA3AF" }}>
              <ChatCircle size={13} weight={opinionsOpen ? "fill" : "regular"} />
              {item.opinions.length > 0 && <span>{item.opinions.length}</span>}
            </button>

            {/* Poll */}
            <button onClick={() => onStartPoll(item.id)}
              className="px-2 py-1 rounded-full text-xs font-bold hover:bg-[#FFD60015] transition-colors"
              style={{ color: "#9CA3AF" }} title="Create a poll from this">
              <ChartBar size={13} weight="fill" />
            </button>

            {/* Approve (if not already) */}
            {item.status === "proposed" && score >= 2 && (
              <button onClick={() => onApprove(item.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black transition-all"
                style={{ backgroundColor: "#00C96B20", color: "#00C96B", border: "1px solid #00C96B30" }}>
                <CheckCircle size={12} weight="fill" />
                <span className="hidden sm:inline">Approve</span>
              </button>
            )}

            {/* Add to itinerary */}
            {(item.status === "approved" || item.status === "must_do") && (
              <button onClick={() => onPromote(item.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black transition-all"
                style={{ backgroundColor: "#00C96B22", color: "#00C96B", border: "1px solid #00C96B33" }}>
                <ArrowRight size={11} weight="bold" />
                <span className="hidden sm:inline">Schedule</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Opinions section */}
      {opinionsOpen && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "#333333" }}>
          {item.opinions.length === 0 && (
            <p className="text-xs font-medium" style={{ color: "#555" }}>No opinions yet.</p>
          )}
          {item.opinions.map(o => (
            <div key={o.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black" style={{ backgroundColor: o.color + "30", color: o.color }}>
                {o.initials[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-white">{o.author}</span>
                  <span className="text-xs font-medium" style={{ color: "#555" }}>{o.ago}</span>
                </div>
                <p className="text-xs font-medium mt-0.5 leading-snug" style={{ color: "#d1d5db" }}>{o.text}</p>
              </div>
            </div>
          ))}

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {OPINION_CHIPS.map(chip => (
              <button key={chip} onClick={() => submitOpinion(chip)}
                className="px-2.5 py-1 rounded-full text-xs font-bold transition-colors hover:bg-[#3a3a3a]"
                style={{ backgroundColor: "#252525", color: "#9CA3AF", border: "1px solid #3a3a3a" }}>
                {chip}
              </button>
            ))}
          </div>

          {/* Text input */}
          <div className="flex items-center gap-2">
            <input type="text" value={opinionText} onChange={e => setOpinionText(e.target.value.slice(0, 100))}
              onKeyDown={e => e.key === "Enter" && submitOpinion(opinionText)}
              placeholder="Say something... (100 chars max)"
              className="flex-1 rounded-xl px-3 py-2 text-xs font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] transition-colors"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }} />
            <div className="text-[10px] font-bold flex-shrink-0" style={{ color: opinionText.length > 85 ? "#FF2D8B" : "#555" }}>
              {opinionText.length}/100
            </div>
            <button onClick={() => submitOpinion(opinionText)} disabled={!opinionText.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40"
              style={{ backgroundColor: "#00A8CC" }}>
              <PaperPlaneTilt size={13} weight="fill" color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export default function WishlistShell() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ProposalStatus | "all">("all");
  const [filterCat, setFilterCat] = useState<ProposalCategory | "all">("all");
  const [sort, setSort] = useState<"popular" | "newest">("popular");
  const [promoted, setPromoted] = useState<Proposal | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<Proposal | null>(null);
  const [pollCreated, setPollCreated] = useState<string | null>(null);

  const active = items.filter(i => !i.promoted);
  const mustDos = active.filter(i => i.status === "must_do");
  const approved = active.filter(i => i.status === "approved");
  const proposed = active.filter(i => i.status === "proposed");

  const visible = active
    .filter(i => filterStatus === "all" || i.status === filterStatus)
    .filter(i => filterCat === "all" || i.category === filterCat)
    .sort((a, b) => sort === "popular" ? (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes) : 0);

  const handleVote = (id: string, dir: "up" | "down") => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const same = i.myVote === dir;
      return {
        ...i,
        myVote: same ? null : dir,
        upvotes: dir === "up" ? (same ? i.upvotes - 1 : i.upvotes + 1) : (i.myVote === "up" ? i.upvotes - 1 : i.upvotes),
        downvotes: dir === "down" ? (same ? i.downvotes - 1 : i.downvotes + 1) : (i.myVote === "down" ? i.downvotes - 1 : i.downvotes),
      };
    }));
  };

  const handleAddOpinion = (itemId: string, text: string) => {
    setItems(prev => prev.map(i => i.id !== itemId ? i : {
      ...i,
      opinions: [...i.opinions, { id: `o${Date.now()}`, author: "You", initials: "ME", color: "#00A8CC", text, ago: "Just now" }],
    }));
  };

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "approved" as ProposalStatus } : i));
  };

  const handlePromote = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) setPromoteTarget(item);
  };

  const confirmPromote = (_date: string, _time: string) => {
    if (!promoteTarget) return;
    setItems(prev => prev.map(i => i.id === promoteTarget.id ? { ...i, promoted: true } : i));
    setPromoted(promoteTarget);
    setPromoteTarget(null);
    setTimeout(() => setPromoted(null), 5000);
  };

  const handleUndo = () => {
    if (!promoted) return;
    setItems(prev => prev.map(i => i.id === promoted.id ? { ...i, promoted: false } : i));
    setPromoted(null);
  };

  const handleStartPoll = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setPollCreated(item.title);
    setTimeout(() => setPollCreated(null), 4000);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#1e1e1e" }}>

      {promoteTarget && (
        <PromoteModal title={promoteTarget.title} onClose={() => setPromoteTarget(null)} onConfirm={confirmPromote} />
      )}

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="border-b flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-7 md:py-6"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-none mb-1" style={{ fontFamily: "var(--font-fredoka)" }}>
            Proposals
          </h1>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {mustDos.length} Must Dos · {approved.length} approved · {proposed.length} proposed
          </p>
        </div>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-[#1a1a1a] flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#00A8CC", boxShadow: "0 3px 0 #0087a3" }}>
          <Plus size={14} weight="bold" />
          Add idea
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">

          {/* Add form */}
          {adding && <AddItemForm onClose={() => setAdding(false)} onAdd={item => { setItems(prev => [item, ...prev]); setAdding(false); }} />}

          {/* Toasts */}
          {promoted && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#00C96B22", border: "1px solid #00C96B55" }}>
              <div className="flex items-center gap-2">
                <Confetti size={15} weight="fill" color="#00C96B" />
                <span className="text-sm font-bold" style={{ color: "#00C96B" }}>
                  &quot;{promoted.title.slice(0, 40)}{promoted.title.length > 40 ? "…" : ""}&quot; added to itinerary
                </span>
              </div>
              <button onClick={handleUndo} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#00C96B22]" style={{ color: "#00C96B" }}>
                <ArrowCounterClockwise size={12} weight="bold" />
                Undo
              </button>
            </div>
          )}
          {pollCreated && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: "#FFD60022", border: "1px solid #FFD60055" }}>
              <ChartBar size={14} weight="fill" color="#FFD600" />
              <span className="text-sm font-bold" style={{ color: "#FFD600" }}>
                Poll created — check the Polls page.
              </span>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Must Dos",   value: mustDos.length,  color: "#FFD600" },
              { label: "Approved",   value: approved.length, color: "#00C96B" },
              { label: "Proposed",   value: proposed.length, color: "#9CA3AF" },
            ].map(s => (
              <div key={s.label} className="rounded-[16px] border p-4 text-center"
                style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
                <div className="font-semibold leading-none mb-1" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 44px)", color: s.color }}>
                  {s.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {([
                { key: "all" as const,      label: `All (${active.length})`,       color: "#9CA3AF" },
                { key: "must_do" as const,  label: `Must Dos (${mustDos.length})`, color: "#FFD600" },
                { key: "approved" as const, label: `Approved (${approved.length})`,color: "#00C96B" },
                { key: "proposed" as const, label: `Proposed (${proposed.length})`,color: "#9CA3AF" },
              ]).map(f => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    backgroundColor: filterStatus === f.key ? f.color + "22" : "#2e2e2e",
                    color: filterStatus === f.key ? f.color : "#9CA3AF",
                    border: `1px solid ${filterStatus === f.key ? f.color + "55" : "#3a3a3a"}`,
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a" }}>
              {[{ val: "popular" as const, label: "Popular" }, { val: "newest" as const, label: "Newest" }].map(s => (
                <button key={s.val} onClick={() => setSort(s.val)}
                  className="px-3 py-1.5 text-xs font-bold transition-all"
                  style={{ backgroundColor: sort === s.val ? "#3a3a3a" : "transparent", color: sort === s.val ? "white" : "#9CA3AF" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          {visible.length === 0 ? (
            <div className="rounded-[20px] border p-12 text-center" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ border: "2px dashed #3a3a3a" }}>
                <Star size={22} weight="fill" style={{ color: "#3a3a3a" }} />
              </div>
              <p className="text-base font-bold text-white mb-1">Nothing here yet.</p>
              <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Add your first proposal and get the group inspired.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visible.map(item => (
                <ProposalCard key={item.id} item={item}
                  onVote={handleVote}
                  onAddOpinion={handleAddOpinion}
                  onPromote={handlePromote}
                  onStartPoll={handleStartPoll}
                  onApprove={handleApprove} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
