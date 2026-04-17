"use client";

import { useState } from "react";
import {
  TShirt, Drop, DeviceMobile, IdentificationCard, FirstAidKit, Headphones, Backpack,
  LockSimple, LockSimpleOpen, Eye, EyeSlash, Crown,
  Plus, X, Check, CaretDown, CaretUp,
} from "@phosphor-icons/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PackingCategory =
  | "clothing" | "toiletries" | "tech" | "documents" | "health" | "entertainment" | "misc";

interface PackingItem {
  id: string;
  text: string;
  category: PackingCategory;
  packed: boolean;
  isPrivate: boolean;
  quantity?: number;
}

interface PackingList {
  id: string;
  name: string;
  isVisibleToGroup: boolean;
  items: PackingItem[];
}

interface GroupMemberList {
  memberId: string;
  memberName: string;
  initials: string;
  color: string;
  isShared: boolean;
  items: (PackingItem & { isHiddenFromOthers?: boolean })[];
  hiddenCount: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_META: Record<PackingCategory, { label: string; Icon: React.ElementType; color: string }> = {
  clothing:      { label: "Clothing",       Icon: TShirt,             color: "#FF2D8B" },
  toiletries:    { label: "Toiletries",     Icon: Drop,               color: "#00A8CC" },
  tech:          { label: "Tech & Gadgets", Icon: DeviceMobile,       color: "#FFD600" },
  documents:     { label: "Documents",      Icon: IdentificationCard, color: "#A855F7" },
  health:        { label: "Health",         Icon: FirstAidKit,        color: "#00C96B" },
  entertainment: { label: "Entertainment",  Icon: Headphones,         color: "#FF8C00" },
  misc:          { label: "Misc",           Icon: Backpack,           color: "#9CA3AF" },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META) as PackingCategory[];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MY_LISTS: PackingList[] = [
  {
    id: "list-main",
    name: "Main Bag",
    isVisibleToGroup: true,
    items: [
      // Clothing
      { id: "c1",  text: "T-shirts",               category: "clothing",   packed: true,  isPrivate: false, quantity: 7 },
      { id: "c2",  text: "Jeans / pants",           category: "clothing",   packed: true,  isPrivate: false, quantity: 2 },
      { id: "c3",  text: "Rain jacket (lightweight)",category: "clothing",  packed: true,  isPrivate: false },
      { id: "c4",  text: "Light hoodie / sweater",  category: "clothing",   packed: false, isPrivate: false },
      { id: "c5",  text: "Nice button-down (dinners)",category:"clothing",  packed: false, isPrivate: true  },
      { id: "c6",  text: "Comfortable walking shoes",category: "clothing",  packed: false, isPrivate: false },
      { id: "c7",  text: "Slip-on shoes (temples)", category: "clothing",   packed: false, isPrivate: false },
      { id: "c8",  text: "Compression socks (flight)",category:"clothing",  packed: true,  isPrivate: false, quantity: 2 },
      { id: "c9",  text: "Underwear",               category: "clothing",   packed: true,  isPrivate: false, quantity: 7 },
      // Toiletries
      { id: "t1",  text: "Toothbrush + toothpaste", category: "toiletries", packed: true,  isPrivate: false },
      { id: "t2",  text: "Deodorant",               category: "toiletries", packed: true,  isPrivate: false },
      { id: "t3",  text: "Shampoo + conditioner (travel-size)", category: "toiletries", packed: false, isPrivate: false },
      { id: "t4",  text: "Face wash",               category: "toiletries", packed: false, isPrivate: false },
      { id: "t5",  text: "Sunscreen SPF 50",        category: "toiletries", packed: true,  isPrivate: false },
      { id: "t6",  text: "Lip balm",                category: "toiletries", packed: false, isPrivate: false },
      { id: "t7",  text: "Prescription skincare",   category: "toiletries", packed: false, isPrivate: true  },
      // Tech
      { id: "x1",  text: "iPhone + cable",          category: "tech",       packed: true,  isPrivate: false },
      { id: "x2",  text: "Universal adapter (Type A — same as US)", category: "tech", packed: true, isPrivate: false },
      { id: "x3",  text: "Portable charger (20,000mAh)", category: "tech", packed: true,  isPrivate: false },
      { id: "x4",  text: "AirPods + case",          category: "tech",       packed: true,  isPrivate: false },
      { id: "x5",  text: "Camera + 35mm lens",      category: "tech",       packed: false, isPrivate: true  },
      { id: "x6",  text: "Laptop + charger",        category: "tech",       packed: false, isPrivate: false },
      // Documents
      { id: "d1",  text: "Passport",                category: "documents",  packed: true,  isPrivate: false },
      { id: "d2",  text: "Travel insurance card (World Nomads)", category: "documents", packed: true, isPrivate: false },
      { id: "d3",  text: "Boarding passes (saved offline)", category: "documents", packed: true, isPrivate: false },
      { id: "d4",  text: "Emergency contacts card", category: "documents",  packed: false, isPrivate: false },
      // Health
      { id: "h1",  text: "Ibuprofen + Tylenol",     category: "health",     packed: true,  isPrivate: false },
      { id: "h2",  text: "Melatonin (jet lag)",      category: "health",     packed: false, isPrivate: false },
      { id: "h3",  text: "Allergy medication",       category: "health",     packed: false, isPrivate: false },
      { id: "h4",  text: "Band-aids + antiseptic wipes", category: "health", packed: false, isPrivate: false },
      // Misc
      { id: "m1",  text: "Luggage lock",             category: "misc",       packed: true,  isPrivate: false },
      { id: "m2",  text: "Reusable shopping bags",   category: "misc",       packed: false, isPrivate: false },
      { id: "m3",  text: "Small day pack",           category: "misc",       packed: false, isPrivate: false },
      { id: "m4",  text: "Yen cash (¥30,000 to start)", category: "misc",   packed: false, isPrivate: false },
      { id: "m5",  text: "Japan Suica / IC card",    category: "misc",       packed: false, isPrivate: false },
    ],
  },
  {
    id: "list-carryon",
    name: "Carry-On",
    isVisibleToGroup: false,
    items: [
      { id: "ca1", text: "Passport (physical copy)", category: "documents", packed: true,  isPrivate: false },
      { id: "ca2", text: "Neck pillow",              category: "misc",       packed: true,  isPrivate: false },
      { id: "ca3", text: "Eye mask + earplugs",      category: "misc",       packed: false, isPrivate: false },
      { id: "ca4", text: "Flight snacks",            category: "misc",       packed: false, isPrivate: false },
      { id: "ca5", text: "Change of clothes (lost luggage backup)", category: "clothing", packed: false, isPrivate: true  },
      { id: "ca6", text: "Sleep aid for long-haul",  category: "health",     packed: false, isPrivate: true  },
      { id: "ca7", text: "Kindle / book",            category: "entertainment", packed: true, isPrivate: false },
    ],
  },
];

const MOCK_GROUP_LISTS: GroupMemberList[] = [
  {
    memberId: "sarah",
    memberName: "Sarah M.",
    initials: "SM",
    color: "#00A8CC",
    isShared: true,
    hiddenCount: 2,
    items: [
      { id: "s1",  text: "Outfits (5 days)",    category: "clothing",   packed: true,  isPrivate: false },
      { id: "s2",  text: "Sun hat",             category: "clothing",   packed: false, isPrivate: false },
      { id: "s3",  text: "Light cardigan",      category: "clothing",   packed: false, isPrivate: false },
      { id: "s4",  text: "Sandals",             category: "clothing",   packed: false, isPrivate: false },
      { id: "s5",  text: "Travel toiletries kit", category: "toiletries", packed: true, isPrivate: false },
      { id: "s6",  text: "Dry shampoo",         category: "toiletries", packed: false, isPrivate: false },
      { id: "s7",  text: "Passport",            category: "documents",  packed: true,  isPrivate: false },
      { id: "s8",  text: "Travel insurance",    category: "documents",  packed: true,  isPrivate: false },
      { id: "s9",  text: "Vitamins",            category: "health",     packed: false, isPrivate: false },
      { id: "s10", text: "Antihistamines",      category: "health",     packed: false, isPrivate: false },
      { id: "s11", text: "Hidden item",         category: "clothing",   packed: false, isPrivate: false, isHiddenFromOthers: true },
      { id: "s12", text: "Hidden item",         category: "toiletries", packed: false, isPrivate: false, isHiddenFromOthers: true },
    ],
  },
  {
    memberId: "tom",
    memberName: "Tom K.",
    initials: "TK",
    color: "#FF8C00",
    isShared: false,
    hiddenCount: 0,
    items: [],
  },
  {
    memberId: "emma",
    memberName: "Emma R.",
    initials: "ER",
    color: "#00C96B",
    isShared: true,
    hiddenCount: 0,
    items: [
      { id: "e1",  text: "Casual outfits",      category: "clothing",   packed: true,  isPrivate: false, quantity: 4 },
      { id: "e2",  text: "Cardigan / layer",    category: "clothing",   packed: false, isPrivate: false },
      { id: "e3",  text: "Sneakers",            category: "clothing",   packed: true,  isPrivate: false },
      { id: "e4",  text: "Sony A7 + 35mm lens", category: "tech",       packed: true,  isPrivate: false },
      { id: "e5",  text: "Extra batteries × 3", category: "tech",       packed: true,  isPrivate: false },
      { id: "e6",  text: "GoPro + mounts",      category: "tech",       packed: false, isPrivate: false },
      { id: "e7",  text: "ND filters kit",      category: "tech",       packed: false, isPrivate: false },
      { id: "e8",  text: "Passport",            category: "documents",  packed: true,  isPrivate: false },
      { id: "e9",  text: "Journal + pens",      category: "entertainment", packed: false, isPrivate: false },
      { id: "e10", text: "Japanese phrasebook", category: "entertainment", packed: false, isPrivate: false },
      { id: "e11", text: "Travel sketchbook",   category: "entertainment", packed: false, isPrivate: false },
      { id: "e12", text: "Portable charger",    category: "tech",       packed: true,  isPrivate: false },
    ],
  },
];

const SMART_SUGGESTIONS = [
  { icon: "🌧️", text: "Compact umbrella or packable rain jacket", reason: "Spring showers common in April" },
  { icon: "👟", text: "Comfortable walking shoes with solid arch support", reason: "Avg 12,000+ steps/day sightseeing" },
  { icon: "🧥", text: "Lightweight layers — hoodie + light jacket", reason: "April temps 10–20°C in Tokyo" },
  { icon: "🔌", text: "Portable battery bank (10,000mAh+)", reason: "Long days out with heavy phone use" },
  { icon: "👡", text: "Slip-on shoes for easy removal at temples", reason: "Shoes off required at most shrines" },
  { icon: "💊", text: "Motion sickness tablets", reason: "Shinkansen + mountain roads + possible seasickness" },
  { icon: "🎒", text: "Packable day bag for exploring", reason: "Avoid hauling full luggage each day" },
  { icon: "💴", text: "Cash — many places are still cash-only in Japan", reason: "Especially local restaurants and markets" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function DarkCard({ children, className = "", style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}>
      {children}
    </div>
  );
}

function FieldInput({ className = "", style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }} />
  );
}

// ─── PackingItemRow ───────────────────────────────────────────────────────────

function PackingItemRow({ item, onTogglePacked, onTogglePrivate, onRemove }: {
  item: PackingItem;
  onTogglePacked: (id: string) => void;
  onTogglePrivate: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5 group px-1 py-1.5 rounded-[10px] transition-colors hover:bg-white/[0.03]">
      {/* Packed checkbox */}
      <button type="button" onClick={() => onTogglePacked(item.id)}
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          backgroundColor: item.packed ? "#00C96B"            : "transparent",
          borderColor:     item.packed ? "#00C96B"            : "rgba(255,255,255,0.25)",
        }}>
        {item.packed && <Check size={9} weight="bold" color="#fff" />}
      </button>

      {/* Item text */}
      <span className="flex-1 text-sm font-semibold leading-snug transition-colors"
        style={{
          color:          item.packed ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)",
          textDecoration: item.packed ? "line-through"          : "none",
        }}>
        {item.text}
        {item.quantity && item.quantity > 1 && (
          <span className="ml-1.5 text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            ×{item.quantity}
          </span>
        )}
      </span>

      {/* Private badge — always visible when private */}
      {item.isPrivate && (
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black flex-shrink-0"
          style={{ backgroundColor: "rgba(255,45,139,0.15)", color: "#FF2D8B", border: "1px solid rgba(255,45,139,0.3)" }}>
          <LockSimple size={9} weight="fill" />
          Private
        </span>
      )}

      {/* Hover actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button type="button" onClick={() => onTogglePrivate(item.id)}
          className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          title={item.isPrivate ? "Make visible to group" : "Hide from group"}
          style={{ color: item.isPrivate ? "#FF2D8B" : "rgba(255,255,255,0.3)" }}>
          {item.isPrivate
            ? <LockSimple size={13} weight="fill" />
            : <LockSimpleOpen size={13} weight="fill" />}
        </button>
        <button type="button" onClick={() => onRemove(item.id)}
          className="rounded-lg p-1.5 transition-colors hover:text-[#FF2D8B]"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          <X size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}

// ─── CategorySection ──────────────────────────────────────────────────────────

function CategorySection({ category, items, onTogglePacked, onTogglePrivate, onRemoveItem, onAddItem }: {
  category: PackingCategory;
  items: PackingItem[];
  onTogglePacked: (id: string) => void;
  onTogglePrivate: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (category: PackingCategory, text: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [addText, setAddText] = useState("");
  const meta = CATEGORY_META[category];
  const packedCount = items.filter(i => i.packed).length;
  const pct = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  function commit() {
    if (addText.trim()) { onAddItem(category, addText.trim()); setAddText(""); }
  }

  return (
    <DarkCard className="overflow-hidden">
      {/* Category header */}
      <button type="button" onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
        {/* Icon */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${meta.color}22` }}>
          <meta.Icon size={14} weight="fill" style={{ color: meta.color }} />
        </div>
        {/* Label */}
        <span className="text-[13px] font-black text-white flex-1 text-left">{meta.label}</span>
        {/* Progress */}
        {items.length > 0 && (
          <span className="text-[11px] font-black flex-shrink-0"
            style={{ color: pct === 100 ? "#00C96B" : "rgba(255,255,255,0.3)" }}>
            {packedCount}/{items.length}
          </span>
        )}
        {items.length > 0 && (
          <div className="w-16 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: "#3a3a3a" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#00C96B" : meta.color }} />
          </div>
        )}
        {/* Caret */}
        <span style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
          {collapsed ? <CaretDown size={13} weight="bold" /> : <CaretUp size={13} weight="bold" />}
        </span>
      </button>

      {/* Items + add row */}
      {!collapsed && (
        <div className="px-3 pb-3 pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {items.length === 0 && (
            <p className="text-center text-[11px] font-bold py-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              No items yet
            </p>
          )}
          <div className="flex flex-col pt-1">
            {items.map(item => (
              <PackingItemRow key={item.id} item={item}
                onTogglePacked={onTogglePacked}
                onTogglePrivate={onTogglePrivate}
                onRemove={onRemoveItem} />
            ))}
          </div>
          {/* Add item row */}
          <div className="flex items-center gap-2 mt-2 pt-2"
            style={{ borderTop: items.length > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <button type="button" onClick={commit}
              className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
              style={{ borderColor: `${meta.color}60`, backgroundColor: "transparent" }}>
              <Plus size={9} weight="bold" style={{ color: `${meta.color}90` }} />
            </button>
            <input type="text" value={addText}
              onChange={e => setAddText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commit(); }}
              placeholder="Add item… press Enter"
              className="flex-1 bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-white/20 transition-colors placeholder-white/20 pb-0.5"
            />
          </div>
        </div>
      )}
    </DarkCard>
  );
}

// ─── GroupMemberCard ──────────────────────────────────────────────────────────

function GroupMemberCard({ member }: { member: GroupMemberList }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = member.items.filter(i => !i.isHiddenFromOthers);
  const packedCount  = visibleItems.filter(i => i.packed).length;

  // Group visible items by category
  const byCategory = ALL_CATEGORIES.reduce((acc, cat) => {
    const catItems = visibleItems.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Partial<Record<PackingCategory, typeof visibleItems>>);

  return (
    <DarkCard className="overflow-hidden">
      {/* Member header */}
      <div className="p-4 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm text-white"
          style={{ backgroundColor: member.color + "33", border: `2px solid ${member.color}55` }}>
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white leading-tight">{member.memberName}</p>
          {member.isShared ? (
            <p className="text-[11px] font-bold mt-0.5" style={{ color: "#00C96B" }}>
              Shared · {visibleItems.length} visible item{visibleItems.length !== 1 ? "s" : ""}
              {member.hiddenCount > 0 && (
                <span style={{ color: "rgba(255,255,255,0.3)" }}> · {member.hiddenCount} private</span>
              )}
            </p>
          ) : (
            <p className="text-[11px] font-bold mt-0.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              <LockSimple size={10} weight="fill" />
              Private list
            </p>
          )}
        </div>
        {member.isShared && visibleItems.length > 0 && (
          <>
            <div className="text-right flex-shrink-0">
              <div className="font-semibold leading-none"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "20px", color: packedCount === visibleItems.length ? "#00C96B" : "rgba(255,255,255,0.4)" }}>
                {packedCount}<span className="text-white/20" style={{ fontSize: "14px" }}>/{visibleItems.length}</span>
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mt-0.5">packed</div>
            </div>
            <button type="button" onClick={() => setExpanded(e => !e)}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
              {expanded ? <CaretUp size={13} weight="bold" /> : <CaretDown size={13} weight="bold" />}
            </button>
          </>
        )}
      </div>

      {/* Expanded items */}
      {member.isShared && expanded && visibleItems.length > 0 && (
        <div className="px-4 pb-4 pt-0 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {member.hiddenCount > 0 && (
            <div className="flex items-center gap-2 mt-3 rounded-[10px] px-3 py-2"
              style={{ backgroundColor: "rgba(255,45,139,0.08)", border: "1px solid rgba(255,45,139,0.2)" }}>
              <LockSimple size={11} weight="fill" style={{ color: "#FF2D8B" }} />
              <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                {member.hiddenCount} item{member.hiddenCount !== 1 ? "s" : ""} hidden — marked private by {member.memberName.split(" ")[0]}
              </span>
            </div>
          )}
          {(Object.entries(byCategory) as [PackingCategory, typeof visibleItems][]).map(([cat, catItems]) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}22` }}>
                    <meta.Icon size={10} weight="fill" style={{ color: meta.color }} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.35)" }}>{meta.label}</span>
                </div>
                <div className="flex flex-col gap-1.5 pl-1">
                  {catItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: item.packed ? "#00C96B" : "transparent",
                          borderColor:     item.packed ? "#00C96B" : "rgba(255,255,255,0.2)",
                        }}>
                        {item.packed && <Check size={8} weight="bold" color="#fff" />}
                      </div>
                      <span className="text-sm font-semibold"
                        style={{
                          color:          item.packed ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                          textDecoration: item.packed ? "line-through" : "none",
                        }}>
                        {item.text}
                        {item.quantity && item.quantity > 1 && (
                          <span className="ml-1 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>×{item.quantity}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Private empty state */}
      {!member.isShared && (
        <div className="px-4 pb-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[12px] font-bold pt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
            {member.memberName.split(" ")[0]} hasn&apos;t shared their packing list.
          </p>
        </div>
      )}
    </DarkCard>
  );
}

// ─── PackingShell ─────────────────────────────────────────────────────────────

export default function PackingShell() {
  const [activeListId, setActiveListId] = useState("list-main");
  const [myLists, setMyLists]       = useState<PackingList[]>(MOCK_MY_LISTS);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);

  const activeList = myLists.find(l => l.id === activeListId) ?? myLists[0];
  const activeItems = activeList?.items ?? [];

  // Overall progress (my main list)
  const mainList = myLists.find(l => l.id === "list-main");
  const totalItems  = mainList?.items.length ?? 0;
  const packedItems = mainList?.items.filter(i => i.packed).length ?? 0;
  const overallPct  = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // ── List mutations ─────────────────────────────────────────────────────────
  function togglePacked(itemId: string) {
    setMyLists(prev => prev.map(list =>
      list.id !== activeListId ? list : {
        ...list,
        items: list.items.map(i => i.id === itemId ? { ...i, packed: !i.packed } : i),
      }
    ));
  }

  function togglePrivate(itemId: string) {
    setMyLists(prev => prev.map(list =>
      list.id !== activeListId ? list : {
        ...list,
        items: list.items.map(i => i.id === itemId ? { ...i, isPrivate: !i.isPrivate } : i),
      }
    ));
  }

  function removeItem(itemId: string) {
    setMyLists(prev => prev.map(list =>
      list.id !== activeListId ? list : {
        ...list,
        items: list.items.filter(i => i.id !== itemId),
      }
    ));
  }

  function addItem(category: PackingCategory, text: string) {
    const newItem: PackingItem = {
      id: Date.now().toString(), text, category, packed: false, isPrivate: false,
    };
    setMyLists(prev => prev.map(list =>
      list.id !== activeListId ? list : { ...list, items: [...list.items, newItem] }
    ));
  }

  function toggleListVisibility() {
    setMyLists(prev => prev.map(list =>
      list.id !== activeListId ? list : { ...list, isVisibleToGroup: !list.isVisibleToGroup }
    ));
  }

  function addNewList() {
    if (!newListName.trim()) return;
    const newList: PackingList = {
      id: Date.now().toString(), name: newListName.trim(),
      isVisibleToGroup: false, items: [],
    };
    setMyLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    setNewListName("");
    setAddingList(false);
  }

  // Per-list progress
  const listPacked = activeItems.filter(i => i.packed).length;
  const listPct    = activeItems.length > 0 ? Math.round((listPacked / activeItems.length) * 100) : 0;

  // Stats row
  const categoriesDone = ALL_CATEGORIES.filter(cat => {
    const catItems = mainList?.items.filter(i => i.category === cat) ?? [];
    return catItems.length > 0 && catItems.every(i => i.packed);
  }).length;
  const privateCount = mainList?.items.filter(i => i.isPrivate).length ?? 0;

  // Items grouped by category for active list
  const itemsByCategory = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = activeItems.filter(i => i.category === cat);
    return acc;
  }, {} as Record<PackingCategory, PackingItem[]>);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-dark" style={{ backgroundColor: "#1e1e1e" }}>

      <style>{`
        .packing-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .packing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: "#282828", borderBottom: "1px solid #333" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-fredoka)", fontSize: "2rem", color: "white", lineHeight: 1.1, margin: 0 }}>
              Packing
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Personal by default · Share when you&apos;re ready
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.5rem", color: overallPct === 100 ? "#00C96B" : "#00A8CC", lineHeight: 1 }}>
              {packedItems}<span style={{ fontSize: "1rem", color: "#555" }}>/{totalItems}</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a3a" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallPct}%`, backgroundColor: overallPct === 100 ? "#00C96B" : "#00A8CC" }} />
              </div>
              <span className="text-xs font-black" style={{ color: overallPct === 100 ? "#00C96B" : "#9CA3AF" }}>{overallPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", color: "#00A8CC", lineHeight: 1, fontWeight: 900 }}>
              {packedItems}<span style={{ fontSize: "1rem", color: "#555" }}>/{totalItems}</span>
            </p>
            <p className="text-xs font-bold mt-1 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Items packed</p>
          </div>
          <div className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", color: "#00C96B", lineHeight: 1, fontWeight: 900 }}>{categoriesDone}</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Categories done</p>
          </div>
          <div className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: "1.75rem", color: "#FF2D8B", lineHeight: 1, fontWeight: 900 }}>{privateCount}</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Private items</p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="packing-grid">

          {/* Left: category sections */}
          <div className="space-y-4">

            {/* List selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {myLists.map(list => (
                <button key={list.id} type="button" onClick={() => setActiveListId(list.id)}
                  className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
                  style={{
                    padding: "6px 14px",
                    backgroundColor: activeListId === list.id ? "#00A8CC" : "rgba(255,255,255,0.05)",
                    borderColor:     activeListId === list.id ? "#00A8CC" : "rgba(255,255,255,0.12)",
                    color:           activeListId === list.id ? "#fff" : "#9CA3AF",
                  }}>
                  {list.name}
                  {!list.isVisibleToGroup && (
                    <LockSimple size={10} weight="fill"
                      style={{ color: activeListId === list.id ? "rgba(255,255,255,0.6)" : "#FF2D8B" }} />
                  )}
                </button>
              ))}
              {addingList ? (
                <div className="flex items-center gap-2">
                  <input autoFocus type="text" value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addNewList(); if (e.key === "Escape") setAddingList(false); }}
                    placeholder="List name…"
                    className="rounded-full px-3 py-1.5 text-sm font-bold text-white outline-none border focus:border-[#00A8CC] placeholder-white/20"
                    style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", width: "120px" }} />
                  <button onClick={addNewList} className="text-[11px] font-black text-white/50 hover:text-white">Save</button>
                  <button onClick={() => setAddingList(false)} className="text-[11px] font-black text-white/30 hover:text-white">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setAddingList(true)}
                  className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all"
                  style={{ padding: "6px 14px", borderStyle: "dashed", borderColor: "rgba(0,168,204,0.4)", color: "#00A8CC", backgroundColor: "transparent" }}>
                  <Plus size={11} weight="bold" /> New list
                </button>
              )}
            </div>

            {/* Private warning */}
            {activeList.isVisibleToGroup && activeItems.some(i => i.isPrivate) && (
              <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                style={{ backgroundColor: "rgba(255,45,139,0.08)", border: "1px solid rgba(255,45,139,0.2)" }}>
                <LockSimple size={12} weight="fill" style={{ color: "#FF2D8B" }} />
                <span className="text-[11px] font-black" style={{ color: "#FF2D8B" }}>
                  {activeItems.filter(i => i.isPrivate).length} item{activeItems.filter(i => i.isPrivate).length !== 1 ? "s" : ""} marked private — hidden from the group
                </span>
              </div>
            )}

            {/* Category sections */}
            {ALL_CATEGORIES.map(cat => (
              <CategorySection key={cat} category={cat} items={itemsByCategory[cat]}
                onTogglePacked={togglePacked} onTogglePrivate={togglePrivate}
                onRemoveItem={removeItem} onAddItem={addItem} />
            ))}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-4">

            {/* Active list card */}
            <DarkCard className="overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #3a3a3a" }}>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>{activeList.name}</p>
                <button type="button" onClick={toggleListVisibility}
                  className="flex items-center gap-1.5 rounded-full text-xs font-black border transition-all px-2.5 py-1"
                  style={{
                    backgroundColor: activeList.isVisibleToGroup ? "rgba(0,201,107,0.12)" : "rgba(255,45,139,0.10)",
                    borderColor:     activeList.isVisibleToGroup ? "rgba(0,201,107,0.35)" : "rgba(255,45,139,0.3)",
                    color:           activeList.isVisibleToGroup ? "#00C96B" : "#FF2D8B",
                  }}>
                  {activeList.isVisibleToGroup
                    ? <><Eye size={11} weight="fill" /> Shared</>
                    : <><EyeSlash size={11} weight="fill" /> Private</>}
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>Progress</span>
                  <span className="text-xs font-black" style={{ color: listPct === 100 ? "#00C96B" : "#9CA3AF" }}>
                    {listPacked}/{activeItems.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a3a" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${listPct}%`, backgroundColor: listPct === 100 ? "#00C96B" : "#00A8CC" }} />
                </div>
                <p className="text-[10px] font-bold mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {activeList.isVisibleToGroup
                    ? "Group can see your non-private items."
                    : "Only you can see this list."}
                </p>
              </div>
            </DarkCard>

            {/* Group packing status */}
            <DarkCard className="overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #3a3a3a" }}>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Group packing</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>4 people</span>
              </div>
              {/* You */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #333" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: "#FF2D8B33", border: "2px solid #FF2D8B55" }}>CM</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">You</p>
                  <p className="text-xs font-bold" style={{ color: mainList?.isVisibleToGroup ? "#00C96B" : "#9CA3AF" }}>
                    {mainList?.isVisibleToGroup ? `${packedItems}/${totalItems} packed · shared` : "Private"}
                  </p>
                </div>
                {mainList?.isVisibleToGroup && (
                  <div className="w-12 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: "#3a3a3a" }}>
                    <div className="h-full rounded-full" style={{ width: `${overallPct}%`, backgroundColor: overallPct === 100 ? "#00C96B" : "#00A8CC" }} />
                  </div>
                )}
              </div>
              {/* Other members */}
              {MOCK_GROUP_LISTS.map((member, i) => {
                const visible = member.items.filter(it => !it.isHiddenFromOthers);
                const packed  = visible.filter(it => it.packed).length;
                const pct     = visible.length > 0 ? Math.round((packed / visible.length) * 100) : 0;
                return (
                  <div key={member.memberId} className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: i < MOCK_GROUP_LISTS.length - 1 ? "1px solid #333" : "none" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ backgroundColor: member.color + "33", border: `2px solid ${member.color}55` }}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{member.memberName}</p>
                      {member.isShared ? (
                        <p className="text-xs font-bold" style={{ color: "#00C96B" }}>{packed}/{visible.length} · shared</p>
                      ) : (
                        <p className="text-xs font-bold flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                          <LockSimple size={9} weight="fill" /> Private
                        </p>
                      )}
                    </div>
                    {member.isShared && visible.length > 0 && (
                      <div className="w-12 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: "#3a3a3a" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#00C96B" : "#00A8CC" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </DarkCard>

            {/* Japan trip tips */}
            <DarkCard className="overflow-hidden" style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "18px", background: "radial-gradient(ellipse at 50% 0%, rgba(255,214,0,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #3a3a3a" }}>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Japan tips</p>
                <span className="flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,214,0,0.12)", color: "#FFD600", border: "1px solid rgba(255,214,0,0.3)" }}>
                  <Crown size={9} weight="fill" /> Premium
                </span>
              </div>
              <div className="p-3 space-y-2">
                {SMART_SUGGESTIONS.slice(0, 2).map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl p-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-base flex-shrink-0 leading-none mt-0.5">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white leading-snug">{s.text}</p>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.reason}</p>
                    </div>
                    <button type="button"
                      className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black flex-shrink-0"
                      style={{ backgroundColor: "rgba(0,168,204,0.15)", color: "#00A8CC", border: "1px solid rgba(0,168,204,0.3)" }}>
                      <Plus size={8} weight="bold" /> Add
                    </button>
                  </div>
                ))}
                <div className="relative rounded-xl overflow-hidden">
                  <div className="p-3 space-y-2" style={{ filter: "blur(2px)", userSelect: "none", pointerEvents: "none" }}>
                    {SMART_SUGGESTIONS.slice(2, 4).map((s, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-xl p-2.5"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="text-sm">{s.icon}</span>
                        <p className="text-xs font-black text-white">{s.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl"
                    style={{ backgroundColor: "rgba(30,30,30,0.80)", backdropFilter: "blur(2px)" }}>
                    <Crown size={20} weight="fill" style={{ color: "#FFD600" }} />
                    <p className="text-xs font-black text-white">6 more suggestions</p>
                    <button type="button"
                      className="flex items-center gap-1.5 rounded-full font-black text-xs px-4 py-2"
                      style={{ backgroundColor: "#FFD600", color: "#1a1a1a", boxShadow: "0 3px 0 #b39a00" }}>
                      <Crown size={10} weight="fill" /> Unlock · $5
                    </button>
                  </div>
                </div>
              </div>
            </DarkCard>

          </div>
        </div>
      </div>
    </div>
  );
}
