"use client";

import { useState } from "react";
import {
  Star,
  Plus,
  Heart,
  ChatCircle,
  ArrowRight,
  ChartBar,
  X,
  Mountains,
  ForkKnife,
  MapPin,
  Sparkle,
  PaperPlaneTilt,
  Confetti,
  ArrowCounterClockwise,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type WishlistCategory = "activity" | "restaurant" | "place" | "experience";

interface WishlistComment {
  id: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  ago: string;
  likes: number;
  myLike: boolean;
}

interface WishlistItem {
  id: string;
  title: string;
  description: string;
  category: WishlistCategory;
  addedBy: string;
  addedByInitials: string;
  addedByColor: string;
  addedAgo: string;
  likes: number;
  myLike: boolean;
  comments: WishlistComment[];
  promoted: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  WishlistCategory,
  { label: string; color: string; Icon: PhosphorIcon }
> = {
  activity:   { label: "Activity",   color: "#FF2D8B", Icon: Mountains },
  restaurant: { label: "Restaurant", color: "#FFD600", Icon: ForkKnife },
  place:      { label: "Place",      color: "#00A8CC", Icon: MapPin },
  experience: { label: "Experience", color: "#A855F7", Icon: Sparkle },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: WishlistItem[] = [
  {
    id: "w1",
    title: "Fushimi Inari — sunrise hike through the torii gates",
    description: "Go before 7 AM to avoid the crowds. The gates turn into a tunnel of orange light. Sarah found a blog post with the exact route.",
    category: "place",
    addedBy: "Sarah", addedByInitials: "SA", addedByColor: "#FF2D8B",
    addedAgo: "3d ago",
    likes: 4, myLike: true,
    comments: [
      { id: "c1", author: "Tom", initials: "TM", color: "#00A8CC", text: "Yes. Non-negotiable. This is going in the itinerary.", ago: "2d ago", likes: 2, myLike: false },
      { id: "c2", author: "Emma", initials: "EM", color: "#A855F7", text: "I read it takes about 2 hours to reach the top. Worth it.", ago: "1d ago", likes: 1, myLike: true },
    ],
    promoted: false,
  },
  {
    id: "w2",
    title: "Cycling through Nara park with the deer",
    description: "Rent bikes near Kintetsu Nara Station and spend a morning weaving through the free-roaming deer. Under $10 per person.",
    category: "activity",
    addedBy: "Emma", addedByInitials: "EM", addedByColor: "#A855F7",
    addedAgo: "4d ago",
    likes: 4, myLike: true,
    comments: [
      { id: "c3", author: "You", initials: "ME", color: "#00A8CC", text: "Can we feed them? I need to feed one.", ago: "3d ago", likes: 1, myLike: false },
    ],
    promoted: false,
  },
  {
    id: "w3",
    title: "teamLab Planets — immersive digital art",
    description: "You walk through water and light rooms barefoot. Completely surreal. Tickets sell out fast so we should book in advance.",
    category: "experience",
    addedBy: "Sarah", addedByInitials: "SA", addedByColor: "#FF2D8B",
    addedAgo: "5d ago",
    likes: 3, myLike: false,
    comments: [],
    promoted: false,
  },
  {
    id: "w4",
    title: "Sushi Saito — if we can get a reservation",
    description: "3 Michelin stars. Practically impossible to book, but Tom says he knows someone. Omakase only, around ¥30,000 per person.",
    category: "restaurant",
    addedBy: "Sarah", addedByInitials: "SA", addedByColor: "#FF2D8B",
    addedAgo: "6d ago",
    likes: 3, myLike: true,
    comments: [
      { id: "c4", author: "Tom", initials: "TM", color: "#00A8CC", text: "Working on it. No promises.", ago: "5d ago", likes: 3, myLike: true },
      { id: "c5", author: "Emma", initials: "EM", color: "#A855F7", text: "If Tom pulls this off he is MVP of the trip.", ago: "5d ago", likes: 2, myLike: false },
    ],
    promoted: false,
  },
  {
    id: "w5",
    title: "Traditional tea ceremony in Kyoto",
    description: "There's a small teahouse in Higashiyama that does private ceremonies for groups. About 90 minutes, includes matcha and wagashi sweets.",
    category: "experience",
    addedBy: "Emma", addedByInitials: "EM", addedByColor: "#A855F7",
    addedAgo: "5d ago",
    likes: 2, myLike: true,
    comments: [],
    promoted: false,
  },
  {
    id: "w6",
    title: "Karaoke night in Shinjuku — private room",
    description: "Book a private karaoke room in Kabukicho for 3 hours. It's louder and weirder than you expect and that's exactly the point.",
    category: "activity",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC",
    addedAgo: "4d ago",
    likes: 2, myLike: false,
    comments: [
      { id: "c6", author: "You", initials: "ME", color: "#00A8CC", text: "Tom is already practicing ABBA. I've seen the texts.", ago: "3d ago", likes: 2, myLike: false },
    ],
    promoted: false,
  },
  {
    id: "w7",
    title: "Philosopher's Path in cherry blossom season",
    description: "A stone path along a canal lined with cherry trees. Peak bloom is usually late March to early April — we might hit it perfectly.",
    category: "place",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC",
    addedAgo: "6d ago",
    likes: 3, myLike: false,
    comments: [],
    promoted: false,
  },
  {
    id: "w8",
    title: "Standing sushi bar at Tsukiji outer market",
    description: "Show up early (7–8 AM), grab a spot at one of the counter stalls. Freshest fish in the city, and you're standing next to actual chefs ordering the same thing.",
    category: "restaurant",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC",
    addedAgo: "3d ago",
    likes: 2, myLike: false,
    comments: [],
    promoted: false,
  },
  {
    id: "w9",
    title: "Sumo stable morning practice (keiko)",
    description: "A few stables in Tokyo allow tourists to watch morning training. You need to arrange it through the stable's oyakata or a travel contact. Rare and surreal.",
    category: "experience",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC",
    addedAgo: "2d ago",
    likes: 2, myLike: false,
    comments: [],
    promoted: false,
  },
  {
    id: "w10",
    title: "Ichiran Ramen — solo booth experience",
    description: "Order alone in your own private booth, no small talk required. It sounds antisocial but it's actually deeply meditative. Multiple locations in Tokyo.",
    category: "restaurant",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC",
    addedAgo: "7d ago",
    likes: 1, myLike: false,
    comments: [],
    promoted: false,
  },
  {
    id: "w11",
    title: "Capsule hotel for one night (just for the experience)",
    description: "Stay one night in a well-reviewed capsule hotel. It's more comfortable than it sounds. Tokyo has some genuinely nice ones.",
    category: "experience",
    addedBy: "Tom", addedByInitials: "TM", addedByColor: "#00A8CC",
    addedAgo: "8d ago",
    likes: 1, myLike: false,
    comments: [
      { id: "c7", author: "Sarah", initials: "SA", color: "#FF2D8B", text: "Hard no. I need a real bed.", ago: "7d ago", likes: 0, myLike: false },
    ],
    promoted: false,
  },
  {
    id: "w12",
    title: "Osaka food tour with a local guide",
    description: "A few operators run evening walking food tours of Dotonbori and Namba. About 3 hours, 6–8 stops, someone who actually knows what everything is.",
    category: "activity",
    addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC",
    addedAgo: "1d ago",
    likes: 1, myLike: false,
    comments: [],
    promoted: false,
  },
];

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
      {children}
    </div>
  );
}

// ─── Add Item Form ────────────────────────────────────────────────────────────

function AddItemForm({ onClose, onAdd }: { onClose: () => void; onAdd: (item: WishlistItem) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WishlistCategory>("activity");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: `w${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      addedBy: "You", addedByInitials: "ME", addedByColor: "#00A8CC",
      addedAgo: "Just now",
      likes: 0, myLike: false,
      comments: [],
      promoted: false,
    });
  };

  return (
    <DarkCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black uppercase tracking-widest" style={{ color: "#00A8CC" }}>Add to wishlist</p>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
          <X size={14} weight="bold" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div className="flex gap-2">
          {(Object.entries(CATEGORY_META) as [WishlistCategory, typeof CATEGORY_META[WishlistCategory]][]).map(([key, meta]) => {
            const Icon = meta.Icon;
            const sel = category === key;
            return (
              <button key={key} onClick={() => setCategory(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ backgroundColor: sel ? meta.color + "33" : "#3a3a3a", color: sel ? meta.color : "#9CA3AF", border: `1px solid ${sel ? meta.color + "55" : "transparent"}` }}
              >
                <Icon size={12} weight="fill" />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's the idea?"
          autoFocus
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Any details? (optional)"
          rows={2}
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] resize-none transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
        />

        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#00A8CC", color: "white" }}
          >
            Add it
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── Wishlist Item Card ───────────────────────────────────────────────────────

function ItemCard({
  item,
  onLike,
  onCommentLike,
  onAddComment,
  onPromote,
  onStartPoll,
}: {
  item: WishlistItem;
  onLike: (id: string) => void;
  onCommentLike: (itemId: string, commentId: string) => void;
  onAddComment: (itemId: string, text: string) => void;
  onPromote: (id: string) => void;
  onStartPoll: (id: string) => void;
}) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const meta = CATEGORY_META[item.category];
  const Icon = meta.Icon;

  const submitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(item.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#2e2e2e",
        border: "1px solid #3a3a3a",
        borderLeft: `3px solid ${meta.color}`,
      }}
    >
      <div className="p-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.color + "22" }}>
            <Icon size={11} weight="fill" color={meta.color} />
            <span className="text-xs font-black uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug mb-1">{item.title}</h3>

        {/* Description */}
        {item.description && (
          <p className="text-xs font-medium leading-relaxed mb-3 line-clamp-3" style={{ color: "#9CA3AF" }}>
            {item.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: item.addedByColor + "33", color: item.addedByColor }}>
              {item.addedByInitials[0]}
            </div>
            <span className="text-xs font-medium" style={{ color: "#555" }}>
              {item.addedBy === "You" ? "You" : item.addedBy} · {item.addedAgo}
            </span>
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-2">
            {/* Like */}
            <button
              onClick={() => onLike(item.id)}
              className="flex items-center gap-1 text-xs font-bold transition-all px-2 py-1 rounded-full"
              style={{ color: item.myLike ? "#FF2D8B" : "#9CA3AF", backgroundColor: item.myLike ? "#FF2D8B15" : "transparent" }}
            >
              <Heart size={13} weight={item.myLike ? "fill" : "regular"} />
              {item.likes > 0 && <span>{item.likes}</span>}
            </button>

            {/* Comments toggle */}
            <button
              onClick={() => setCommentsOpen(v => !v)}
              className="flex items-center gap-1 text-xs font-bold transition-colors px-2 py-1 rounded-full hover:bg-[#3a3a3a]"
              style={{ color: commentsOpen ? "#00A8CC" : "#9CA3AF" }}
            >
              <ChatCircle size={13} weight={commentsOpen ? "fill" : "regular"} />
              {item.comments.length > 0 && <span>{item.comments.length}</span>}
            </button>

            {/* Start poll */}
            <button
              onClick={() => onStartPoll(item.id)}
              className="flex items-center gap-1 text-xs font-bold transition-colors px-2 py-1 rounded-full hover:bg-[#FFD60015]"
              style={{ color: "#9CA3AF" }}
              title="Start a poll from this"
            >
              <ChartBar size={13} weight="fill" />
            </button>

            {/* Promote to itinerary */}
            <button
              onClick={() => onPromote(item.id)}
              className="flex items-center gap-1 text-xs font-bold transition-all px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#00C96B22", color: "#00C96B", border: "1px solid #00C96B33" }}
              title="Add to itinerary"
            >
              <ArrowRight size={11} weight="bold" />
              <span className="hidden sm:inline">Itinerary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "#333333" }}>
          {/* Existing comments */}
          {item.comments.length === 0 && (
            <p className="text-xs font-medium" style={{ color: "#555" }}>No comments yet. Say something.</p>
          )}
          {item.comments.map(c => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ backgroundColor: c.color + "33", color: c.color }}>
                {c.initials[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{c.author}</span>
                  <span className="text-xs font-medium" style={{ color: "#555" }}>{c.ago}</span>
                </div>
                <p className="text-xs font-medium mt-0.5 leading-snug" style={{ color: "#d1d5db" }}>{c.text}</p>
              </div>
              <button
                onClick={() => onCommentLike(item.id, c.id)}
                className="flex items-center gap-1 text-xs flex-shrink-0 px-1.5 py-0.5 rounded-full transition-colors"
                style={{ color: c.myLike ? "#FF2D8B" : "#555" }}
              >
                <Heart size={10} weight={c.myLike ? "fill" : "regular"} />
                {c.likes > 0 && c.likes}
              </button>
            </div>
          ))}

          {/* Add comment */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()}
              placeholder="Add a comment..."
              className="flex-1 rounded-xl px-3 py-2 text-xs font-medium text-white outline-none border focus:border-[#00A8CC]/50 placeholder-[#555] transition-colors"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
              style={{ backgroundColor: "#00A8CC" }}
            >
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
  const [filterCat, setFilterCat] = useState<WishlistCategory | "all">("all");
  const [sort, setSort] = useState<"popular" | "newest">("popular");
  const [promoted, setPromoted] = useState<WishlistItem | null>(null);
  const [pollCreated, setPollCreated] = useState<string | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────

  const visible = items
    .filter(i => !i.promoted)
    .filter(i => filterCat === "all" || i.category === filterCat)
    .sort((a, b) =>
      sort === "popular"
        ? b.likes + b.comments.length - (a.likes + a.comments.length)
        : 0 // newest = INITIAL_ITEMS order (already newest-first by addedAgo for mock)
    );

  const counts = {
    all:        items.filter(i => !i.promoted).length,
    activity:   items.filter(i => !i.promoted && i.category === "activity").length,
    restaurant: items.filter(i => !i.promoted && i.category === "restaurant").length,
    place:      items.filter(i => !i.promoted && i.category === "place").length,
    experience: items.filter(i => !i.promoted && i.category === "experience").length,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLike = (id: string) => {
    setItems(prev => prev.map(i =>
      i.id !== id ? i : { ...i, myLike: !i.myLike, likes: i.myLike ? i.likes - 1 : i.likes + 1 }
    ));
  };

  const handleCommentLike = (itemId: string, commentId: string) => {
    setItems(prev => prev.map(i =>
      i.id !== itemId ? i : {
        ...i,
        comments: i.comments.map(c =>
          c.id !== commentId ? c : { ...c, myLike: !c.myLike, likes: c.myLike ? c.likes - 1 : c.likes + 1 }
        ),
      }
    ));
  };

  const handleAddComment = (itemId: string, text: string) => {
    setItems(prev => prev.map(i =>
      i.id !== itemId ? i : {
        ...i,
        comments: [...i.comments, {
          id: `c${Date.now()}`, author: "You", initials: "ME", color: "#00A8CC",
          text, ago: "Just now", likes: 0, myLike: false,
        }],
      }
    ));
  };

  const handleAdd = (item: WishlistItem) => {
    setItems(prev => [item, ...prev]);
    setAdding(false);
  };

  const handlePromote = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, promoted: true } : i));
    setPromoted(item);
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto scrollbar-dark" style={{ backgroundColor: "#1e1e1e" }}>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-fredoka)" }}>
              Wishlist
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
              All those "we should go here" ideas? They live here now.
            </p>
          </div>
          <button
            onClick={() => setAdding(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
            style={{
              backgroundColor: adding ? "#00A8CC" : "#00A8CC22",
              color: adding ? "white" : "#00A8CC",
              border: "1px solid #00A8CC55",
            }}
          >
            <Plus size={14} weight="bold" />
            Add idea
          </button>
        </div>

        {/* Add form */}
        {adding && <AddItemForm onClose={() => setAdding(false)} onAdd={handleAdd} />}

        {/* Promoted toast */}
        {promoted && (
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "#00C96B22", border: "1px solid #00C96B55" }}
          >
            <div className="flex items-center gap-2">
              <Confetti size={16} weight="fill" color="#00C96B" />
              <span className="text-sm font-bold" style={{ color: "#00C96B" }}>
                "{promoted.title.slice(0, 40)}{promoted.title.length > 40 ? "…" : ""}" added to itinerary
              </span>
            </div>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-[#00C96B22]"
              style={{ color: "#00C96B" }}
            >
              <ArrowCounterClockwise size={12} weight="bold" />
              Undo
            </button>
          </div>
        )}

        {/* Poll created toast */}
        {pollCreated && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "#FFD60022", border: "1px solid #FFD60055" }}
          >
            <ChartBar size={15} weight="fill" color="#FFD600" />
            <span className="text-sm font-bold" style={{ color: "#FFD600" }}>
              Poll created from "{pollCreated.slice(0, 40)}{pollCreated.length > 40 ? "…" : ""}" — check the Polls page.
            </span>
          </div>
        )}

        {/* Filter + sort bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Category filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { key: "all" as const,        label: `All (${counts.all})`,              color: "#9CA3AF" },
              { key: "activity" as const,   label: `Activity (${counts.activity})`,   color: CATEGORY_META.activity.color },
              { key: "restaurant" as const, label: `Restaurant (${counts.restaurant})`, color: CATEGORY_META.restaurant.color },
              { key: "place" as const,      label: `Place (${counts.place})`,         color: CATEGORY_META.place.color },
              { key: "experience" as const, label: `Experience (${counts.experience})`, color: CATEGORY_META.experience.color },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilterCat(f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: filterCat === f.key ? f.color + "22" : "#2e2e2e",
                  color: filterCat === f.key ? f.color : "#9CA3AF",
                  border: `1px solid ${filterCat === f.key ? f.color + "55" : "#3a3a3a"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort toggle */}
          <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#2e2e2e", border: "1px solid #3a3a3a" }}>
            {[
              { val: "popular" as const, label: "Popular" },
              { val: "newest" as const,  label: "Newest"  },
            ].map(s => (
              <button
                key={s.val}
                onClick={() => setSort(s.val)}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: sort === s.val ? "#3a3a3a" : "transparent",
                  color: sort === s.val ? "white" : "#9CA3AF",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item count line */}
        <p className="text-xs font-bold" style={{ color: "#555" }}>
          {visible.length} {visible.length === 1 ? "idea" : "ideas"}
          {filterCat !== "all" ? ` in ${CATEGORY_META[filterCat].label}` : ""}
        </p>

        {/* Grid */}
        {visible.length === 0 ? (
          <DarkCard className="p-12 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ border: "2px dashed #3a3a3a" }}>
              <Star size={22} weight="fill" style={{ color: "#3a3a3a" }} />
            </div>
            <p className="text-base font-bold text-white mb-1">Nothing here yet.</p>
            <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
              {filterCat === "all"
                ? "Add your first idea and get the group inspired."
                : `No ${CATEGORY_META[filterCat as WishlistCategory]?.label.toLowerCase()} ideas yet.`}
            </p>
          </DarkCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onLike={handleLike}
                onCommentLike={handleCommentLike}
                onAddComment={handleAddComment}
                onPromote={handlePromote}
                onStartPoll={handleStartPoll}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
