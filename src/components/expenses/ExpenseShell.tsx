"use client";

import { useState } from "react";
import {
  Airplane,
  House,
  ForkKnife,
  Ticket,
  Train,
  ShoppingBag,
  Package,
  Receipt,
  Plus,
  Crown,
  Check,
  X,
  Warning,
  ArrowUp,
  ArrowDown,
  CaretDown,
  CaretRight,
  Camera,
  DotsThreeVertical,
  ChartBar,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExpenseCategory =
  | "flights"
  | "lodging"
  | "food"
  | "activities"
  | "transport"
  | "shopping"
  | "misc";

type SplitType = "even" | "personal";
type MyStatus = "owed" | "i_owe" | "settled" | "personal";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  myShare: number;
  myStatus: MyStatus;
  includeInReport: boolean;
}

interface DateGroup {
  label: string;
  date: string;
  expenses: Expense[];
}

interface Balance {
  person: string;
  initials: string;
  color: string;
  youOwe: number;
  theyOwe: number;
  theyMarkedPaid: boolean;
}

interface BudgetCategory {
  cat: ExpenseCategory;
  budget: number;
  spent: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string; Icon: PhosphorIcon }
> = {
  flights:    { label: "Flights",    color: "#FF2D8B", Icon: Airplane },
  lodging:    { label: "Lodging",    color: "#A855F7", Icon: House },
  food:       { label: "Food",       color: "#FFD600", Icon: ForkKnife },
  activities: { label: "Activities", color: "#FF8C00", Icon: Ticket },
  transport:  { label: "Transport",  color: "#00A8CC", Icon: Train },
  shopping:   { label: "Shopping",   color: "#FF8C00", Icon: ShoppingBag },
  misc:       { label: "Misc",       color: "#9CA3AF", Icon: Package },
};

const MEMBERS = ["You", "Sarah", "Tom", "Emma"];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DATE_GROUPS: DateGroup[] = [
  {
    label: "Pre-trip",
    date: "0000-00-00",
    expenses: [
      { id: "p1", description: "Round-trip flights × 4", amount: 2800, date: "Pre-trip", category: "flights",   paidBy: "You",   splitType: "even",     myShare: 700,  myStatus: "owed",     includeInReport: true },
      { id: "p2", description: "Tokyo Airbnb · 6 nights",  amount: 1140, date: "Pre-trip", category: "lodging",  paidBy: "Sarah", splitType: "even",     myShare: 285,  myStatus: "i_owe",    includeInReport: true },
      { id: "p3", description: "Japan Rail Pass × 4",       amount: 1160, date: "Pre-trip", category: "transport",paidBy: "Tom",   splitType: "even",     myShare: 290,  myStatus: "i_owe",    includeInReport: true },
      { id: "p4", description: "Kyoto hotel · 3 nights",    amount: 612,  date: "Pre-trip", category: "lodging",  paidBy: "You",   splitType: "even",     myShare: 153,  myStatus: "owed",     includeInReport: true },
      { id: "p5", description: "Osaka hotel · 3 nights",    amount: 504,  date: "Pre-trip", category: "lodging",  paidBy: "Sarah", splitType: "even",     myShare: 126,  myStatus: "i_owe",    includeInReport: true },
      { id: "p6", description: "Group travel insurance",     amount: 240,  date: "Pre-trip", category: "misc",     paidBy: "You",   splitType: "even",     myShare: 60,   myStatus: "owed",     includeInReport: true },
    ],
  },
  {
    label: "Apr 1 · Departure Day",
    date: "2025-04-01",
    expenses: [
      { id: "a1", description: "Airport ramen dinner",     amount: 45,   date: "Apr 1",   category: "food",     paidBy: "Tom",   splitType: "even",     myShare: 11,   myStatus: "i_owe",    includeInReport: true },
      { id: "a2", description: "Airport snacks and drinks",amount: 28,   date: "Apr 1",   category: "food",     paidBy: "Emma",  splitType: "even",     myShare: 7,    myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 2 · Tokyo Day 1",
    date: "2025-04-02",
    expenses: [
      { id: "b1", description: "Shinjuku Gyoen · entry × 4", amount: 28,  date: "Apr 2",   category: "activities",paidBy: "You",   splitType: "even",     myShare: 7,    myStatus: "owed",     includeInReport: true },
      { id: "b2", description: "Izakaya dinner",              amount: 148, date: "Apr 2",   category: "food",     paidBy: "Sarah", splitType: "even",     myShare: 37,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 3 · Tokyo Day 2",
    date: "2025-04-03",
    expenses: [
      { id: "c1", description: "Asakusa street snacks",      amount: 32,  date: "Apr 3",   category: "food",     paidBy: "Tom",   splitType: "even",     myShare: 8,    myStatus: "i_owe",    includeInReport: true },
      { id: "c2", description: "Sushi lunch at Tsukiji",     amount: 112, date: "Apr 3",   category: "food",     paidBy: "You",   splitType: "even",     myShare: 28,   myStatus: "owed",     includeInReport: true },
      { id: "c3", description: "Souvenir shopping",          amount: 95,  date: "Apr 3",   category: "shopping", paidBy: "You",   splitType: "personal", myShare: 95,   myStatus: "personal", includeInReport: false },
    ],
  },
  {
    label: "Apr 4 · Tokyo Day 3",
    date: "2025-04-04",
    expenses: [
      { id: "d1", description: "teamLab Planets tickets × 4", amount: 164, date: "Apr 4",  category: "activities",paidBy: "Emma",  splitType: "even",     myShare: 41,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 5 · Tokyo Day 4",
    date: "2025-04-05",
    expenses: [
      { id: "e1", description: "Ramen at Afuri Omotesando", amount: 56,  date: "Apr 5",   category: "food",     paidBy: "Sarah", splitType: "even",     myShare: 14,   myStatus: "i_owe",    includeInReport: true },
      { id: "e2", description: "Subway IC card top-up",     amount: 28,  date: "Apr 5",   category: "transport",paidBy: "You",   splitType: "even",     myShare: 7,    myStatus: "owed",     includeInReport: true },
      { id: "e3", description: "Meiji Shrine donation",     amount: 27,  date: "Apr 5",   category: "misc",     paidBy: "Tom",   splitType: "personal", myShare: 0,    myStatus: "personal", includeInReport: false },
    ],
  },
  {
    label: "Apr 6 · Tokyo Day 5",
    date: "2025-04-06",
    expenses: [
      { id: "f1", description: "Tokyo Tower × 4",           amount: 60,  date: "Apr 6",   category: "activities",paidBy: "Tom",   splitType: "even",     myShare: 15,   myStatus: "settled",  includeInReport: true },
      { id: "f2", description: "Tonkatsu dinner",           amount: 88,  date: "Apr 6",   category: "food",     paidBy: "Emma",  splitType: "even",     myShare: 22,   myStatus: "settled",  includeInReport: true },
    ],
  },
  {
    label: "Apr 9 · Kyoto Day 1",
    date: "2025-04-09",
    expenses: [
      { id: "g1", description: "Kaiseki lunch",             amount: 220, date: "Apr 9",   category: "food",     paidBy: "You",   splitType: "even",     myShare: 55,   myStatus: "owed",     includeInReport: true },
      { id: "g2", description: "Tofu restaurant dinner",    amount: 160, date: "Apr 9",   category: "food",     paidBy: "Sarah", splitType: "even",     myShare: 40,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 10 · Kyoto Day 2",
    date: "2025-04-10",
    expenses: [
      { id: "h1", description: "Tenryu-ji + Kinkaku-ji × 4", amount: 64, date: "Apr 10",  category: "activities",paidBy: "Tom",   splitType: "even",     myShare: 16,   myStatus: "settled",  includeInReport: true },
    ],
  },
  {
    label: "Apr 12 · Osaka Day 1",
    date: "2025-04-12",
    expenses: [
      { id: "i1", description: "Dotonbori street food crawl", amount: 84, date: "Apr 12", category: "food",     paidBy: "Emma",  splitType: "even",     myShare: 21,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 13 · Osaka Day 2",
    date: "2025-04-13",
    expenses: [
      { id: "j1", description: "Osaka Castle × 4",          amount: 24,  date: "Apr 13",  category: "activities",paidBy: "You",   splitType: "even",     myShare: 6,    myStatus: "owed",     includeInReport: true },
      { id: "j2", description: "Wagyu dinner splurge",      amount: 392, date: "Apr 13",  category: "food",     paidBy: "Sarah", splitType: "even",     myShare: 98,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
  {
    label: "Apr 14 · Osaka Day 3",
    date: "2025-04-14",
    expenses: [
      { id: "k1", description: "Conveyor belt sushi lunch", amount: 84,  date: "Apr 14",  category: "food",     paidBy: "Tom",   splitType: "even",     myShare: 21,   myStatus: "i_owe",    includeInReport: true },
      { id: "k2", description: "Final trip dinner",         amount: 300, date: "Apr 14",  category: "food",     paidBy: "Emma",  splitType: "even",     myShare: 75,   myStatus: "i_owe",    includeInReport: true },
    ],
  },
];

const INITIAL_BALANCES: Balance[] = [
  { person: "Sarah", initials: "SA", color: "#FF2D8B", youOwe: 164, theyOwe: 0,   theyMarkedPaid: false },
  { person: "Tom",   initials: "TM", color: "#00A8CC", youOwe: 0,   theyOwe: 218, theyMarkedPaid: false },
  { person: "Emma",  initials: "EM", color: "#A855F7", youOwe: 0,   theyOwe: 96,  theyMarkedPaid: true },
];

const BUDGET_CATEGORIES: BudgetCategory[] = [
  { cat: "flights",    budget: 2800, spent: 2800 },
  { cat: "lodging",    budget: 2200, spent: 2256 },
  { cat: "food",       budget: 1200, spent: 1389 },
  { cat: "activities", budget: 600,  spent: 472  },
  { cat: "transport",  budget: 400,  spent: 1205 },
  { cat: "shopping",   budget: 400,  spent: 95   },
  { cat: "misc",       budget: 200,  spent: 100  },
];

const TOTAL_BUDGET = 9000;
const TOTAL_SPENT = BUDGET_CATEGORIES.reduce((s, c) => s + c.spent, 0);

// ─── DarkCard ─────────────────────────────────────────────────────────────────

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}>
      {children}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, amount }: { status: MyStatus; amount: number }) {
  if (status === "personal") return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>Personal</span>
  );
  if (status === "settled") return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
      <Check size={10} weight="bold" /> Settled
    </span>
  );
  if (status === "owed") return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#00C96B22", color: "#00C96B" }}>
      Owed ${amount}
    </span>
  );
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FF2D8B22", color: "#FF2D8B" }}>
      You owe ${amount}
    </span>
  );
}

// ─── Expense Row ──────────────────────────────────────────────────────────────

function ExpenseRow({ expense }: { expense: Expense }) {
  const meta = CATEGORY_META[expense.category];
  const Icon = meta.Icon;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#333333]/40 transition-colors group">
      {/* Category icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color + "22" }}>
        <Icon size={14} weight="fill" color={meta.color} />
      </div>

      {/* Description + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{expense.description}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
          {expense.paidBy === "You" ? "You paid" : `${expense.paidBy} paid`}
          {expense.splitType === "even" ? " · split evenly" : " · personal"}
        </p>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0">
        <StatusBadge status={expense.myStatus} amount={expense.myShare} />
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0 w-16">
        <p className="text-sm font-black" style={{ color: "#00C96B" }}>${expense.amount}</p>
        {expense.splitType === "even" && (
          <p className="text-xs font-medium" style={{ color: "#555" }}>${expense.myShare}/ea</p>
        )}
      </div>

      {/* Menu */}
      <button className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center transition-opacity hover:bg-[#3a3a3a]" style={{ color: "#9CA3AF" }}>
        <DotsThreeVertical size={14} />
      </button>
    </div>
  );
}

// ─── Add Expense Form ─────────────────────────────────────────────────────────

function AddExpenseForm({ onClose }: { onClose: () => void }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [paidBy, setPaidBy] = useState("You");
  const [splitType, setSplitType] = useState<SplitType>("even");

  return (
    <DarkCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black uppercase tracking-widest" style={{ color: "#00C96B" }}>Log expense</p>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
          <X size={14} weight="bold" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What was it?"
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00C96B]/50 placeholder-[#555] transition-colors"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
          autoFocus
        />

        {/* Amount */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00C96B]/50 placeholder-[#555] transition-colors"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Date</label>
            <input
              type="date"
              defaultValue="2025-04-05"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white outline-none border focus:border-[#00C96B]/50 transition-colors"
              style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a" }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Category</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_META) as ExpenseCategory[]).map(cat => {
              const m = CATEGORY_META[cat];
              const sel = category === cat;
              const CIcon = m.Icon;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{ backgroundColor: sel ? m.color + "33" : "#3a3a3a", color: sel ? m.color : "#9CA3AF", border: `1px solid ${sel ? m.color + "55" : "transparent"}` }}
                >
                  <CIcon size={12} weight="fill" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Paid by */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Paid by</label>
          <div className="flex gap-2">
            {MEMBERS.map(m => (
              <button key={m} onClick={() => setPaidBy(m)}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: paidBy === m ? "#00C96B22" : "#3a3a3a", color: paidBy === m ? "#00C96B" : "#9CA3AF", border: `1px solid ${paidBy === m ? "#00C96B55" : "transparent"}` }}
              >{m}</button>
            ))}
          </div>
        </div>

        {/* Split */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: "#9CA3AF" }}>Split</label>
          <div className="flex gap-2">
            {[{ val: "even" as SplitType, label: "Split evenly (4)" }, { val: "personal" as SplitType, label: "Just me" }].map(opt => (
              <button key={opt.val} onClick={() => setSplitType(opt.val)}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: splitType === opt.val ? "#00A8CC22" : "#3a3a3a", color: splitType === opt.val ? "#00A8CC" : "#9CA3AF", border: `1px solid ${splitType === opt.val ? "#00A8CC55" : "transparent"}` }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            disabled={!desc || !amount}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#00C96B", color: "white" }}
          >
            Log it
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
            Cancel
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export default function ExpenseShell() {
  const [tab, setTab] = useState<"ledger" | "balances" | "budget">("ledger");
  const [addingExpense, setAddingExpense] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const totalOwed = balances.reduce((s, b) => s + b.theyOwe, 0);
  const totalIOwe = balances.reduce((s, b) => s + b.youOwe, 0);
  const myNet = totalOwed - totalIOwe;

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleMarkPaid = (person: string) => {
    setBalances(prev => prev.map(b => b.person === person ? { ...b, youOwe: 0 } : b));
  };

  const handleConfirmReceived = (person: string) => {
    setBalances(prev => prev.map(b => b.person === person ? { ...b, theyOwe: 0, theyMarkedPaid: false } : b));
  };

  // ── Ledger Tab ──────────────────────────────────────────────────────────────

  const ledgerContent = (
    <div className="space-y-2">
      {DATE_GROUPS.map(group => {
        const groupTotal = group.expenses.filter(e => e.includeInReport).reduce((s, e) => s + e.amount, 0);
        const collapsed = collapsedGroups.has(group.label);
        return (
          <DarkCard key={group.label} className="overflow-hidden">
            {/* Group header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#333333]/40 transition-colors"
              onClick={() => toggleGroup(group.label)}
            >
              <div className="flex items-center gap-2">
                {collapsed ? <CaretRight size={12} style={{ color: "#9CA3AF" }} /> : <CaretDown size={12} style={{ color: "#9CA3AF" }} />}
                <span className="text-sm font-bold text-white">{group.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF" }}>
                  {group.expenses.length}
                </span>
              </div>
              {groupTotal > 0 && (
                <span className="text-sm font-black" style={{ color: "#00C96B" }}>${groupTotal.toLocaleString()}</span>
              )}
            </button>

            {!collapsed && (
              <div className="px-1 pb-2">
                {group.expenses.map(exp => <ExpenseRow key={exp.id} expense={exp} />)}
              </div>
            )}
          </DarkCard>
        );
      })}

      {/* Add expense prompt */}
      <button
        onClick={() => setAddingExpense(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-colors hover:bg-[#2e2e2e]"
        style={{ border: "1px dashed #3a3a3a", color: "#9CA3AF" }}
      >
        <Plus size={14} weight="bold" />
        Log another expense
      </button>
    </div>
  );

  // ── Balances Tab ────────────────────────────────────────────────────────────

  const balancesContent = (
    <div className="space-y-4">
      {/* Net summary */}
      <DarkCard className="p-4">
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>Your net balance</p>
        <div className="flex items-end gap-2">
          <span
            className="text-4xl font-black"
            style={{ fontFamily: "var(--font-fredoka)", color: myNet >= 0 ? "#00C96B" : "#FF2D8B" }}
          >
            {myNet >= 0 ? "+" : "-"}${Math.abs(myNet)}
          </span>
          <span className="text-sm font-bold pb-1" style={{ color: "#9CA3AF" }}>
            {myNet >= 0 ? "overall owed to you" : "overall you owe"}
          </span>
        </div>
        <p className="text-xs font-medium mt-2" style={{ color: "#555" }}>
          Owed ${totalOwed} · You owe ${totalIOwe}
        </p>
      </DarkCard>

      {/* Owed to you */}
      {balances.some(b => b.theyOwe > 0) && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest px-1 mb-2" style={{ color: "#00C96B" }}>
            Owed to you
          </p>
          <div className="space-y-2">
            {balances.filter(b => b.theyOwe > 0).map(b => (
              <DarkCard key={b.person} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ backgroundColor: b.color + "33", color: b.color }}>
                    {b.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{b.person}</p>
                    <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                      owes you{b.theyMarkedPaid ? " · marked as paid" : ""}
                    </p>
                  </div>
                  <div className="text-right mr-3">
                    <p className="text-lg font-black" style={{ color: "#00C96B" }}>${b.theyOwe}</p>
                  </div>
                  {b.theyMarkedPaid ? (
                    <button
                      onClick={() => handleConfirmReceived(b.person)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                      style={{ backgroundColor: "#00C96B", color: "white" }}
                    >
                      Confirm received
                    </button>
                  ) : (
                    <button
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-[#3a3a3a]"
                      style={{ border: "1px solid #3a3a3a", color: "#9CA3AF" }}
                    >
                      Remind
                    </button>
                  )}
                </div>
                {b.theyMarkedPaid && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#00C96B" }}>
                    <Check size={12} weight="bold" />
                    {b.person} says they've paid. Tap to confirm.
                  </div>
                )}
              </DarkCard>
            ))}
          </div>
        </div>
      )}

      {/* You owe */}
      {balances.some(b => b.youOwe > 0) && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest px-1 mb-2" style={{ color: "#FF2D8B" }}>
            You owe
          </p>
          <div className="space-y-2">
            {balances.filter(b => b.youOwe > 0).map(b => (
              <DarkCard key={b.person} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ backgroundColor: b.color + "33", color: b.color }}>
                    {b.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{b.person}</p>
                    <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Pay outside the app, then mark it here</p>
                  </div>
                  <div className="text-right mr-3">
                    <p className="text-lg font-black" style={{ color: "#FF2D8B" }}>${b.youOwe}</p>
                  </div>
                  <button
                    onClick={() => handleMarkPaid(b.person)}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                    style={{ backgroundColor: "#FF2D8B", color: "white" }}
                  >
                    Mark as paid
                  </button>
                </div>
              </DarkCard>
            ))}
          </div>
        </div>
      )}

      {/* All settled */}
      {balances.every(b => b.youOwe === 0 && b.theyOwe === 0) && (
        <DarkCard className="p-8 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#00C96B22" }}>
            <Check size={24} weight="bold" color="#00C96B" />
          </div>
          <p className="text-base font-bold text-white mb-1">All settled up.</p>
          <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Nobody owes anybody anything. Rare. Beautiful.</p>
        </DarkCard>
      )}

      {/* Settlement note */}
      <p className="text-xs font-medium text-center px-4 pb-2" style={{ color: "#444" }}>
        Settlement happens outside TripWave (cash, Venmo, etc.). This just tracks who's confirmed.
      </p>
    </div>
  );

  // ── Budget Tab ──────────────────────────────────────────────────────────────

  const budgetPct = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);
  const budgetOver = TOTAL_SPENT > TOTAL_BUDGET;

  const budgetContent = (
    <div className="space-y-4">
      {/* Overall budget */}
      <DarkCard className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#9CA3AF" }}>Trip budget</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "#00C96B" }}>
                ${TOTAL_SPENT.toLocaleString()}
              </span>
              <span className="text-base font-bold pb-1" style={{ color: "#9CA3AF" }}>
                / ${TOTAL_BUDGET.toLocaleString()}
              </span>
            </div>
          </div>
          <span
            className="text-sm font-black px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: budgetOver ? "#FF2D8B22" : "#00C96B22", color: budgetOver ? "#FF2D8B" : "#00C96B" }}
          >
            {budgetPct}%
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="rounded-full overflow-hidden mb-2" style={{ height: 8, backgroundColor: "#3a3a3a" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(budgetPct, 100)}%`, backgroundColor: budgetOver ? "#FF2D8B" : "#00C96B" }}
          />
        </div>
        <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
          ${(TOTAL_BUDGET - TOTAL_SPENT).toLocaleString()} {TOTAL_BUDGET > TOTAL_SPENT ? "remaining" : "over budget"}
        </p>
      </DarkCard>

      {/* Per-category */}
      <p className="text-xs font-black uppercase tracking-widest px-1" style={{ color: "#9CA3AF" }}>By category</p>

      {BUDGET_CATEGORIES.map(({ cat, budget, spent }) => {
        const meta = CATEGORY_META[cat];
        const CIcon = meta.Icon;
        const pct = Math.round((spent / budget) * 100);
        const over = spent > budget;

        return (
          <DarkCard key={cat} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color + "22" }}>
                <CIcon size={14} weight="fill" color={meta.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-white">{meta.label}</span>
                  <div className="flex items-center gap-2">
                    {over && (
                      <span className="text-xs font-bold flex items-center gap-1" style={{ color: "#FF2D8B" }}>
                        <Warning size={11} weight="fill" />
                        Over
                      </span>
                    )}
                    <span className="text-sm font-black" style={{ color: over ? "#FF2D8B" : "#00C96B" }}>
                      ${spent.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#555" }}>
                      / ${budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar */}
            <div className="rounded-full overflow-hidden" style={{ height: 5, backgroundColor: "#3a3a3a" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? "#FF2D8B" : pct > 85 ? "#FFD600" : "#00C96B" }}
              />
            </div>
            <p className="text-xs font-medium mt-1.5" style={{ color: "#555" }}>
              {pct}% used{over ? ` · $${(spent - budget).toLocaleString()} over` : ` · $${(budget - spent).toLocaleString()} left`}
            </p>
          </DarkCard>
        );
      })}
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-dark"
      style={{ backgroundColor: "#1e1e1e" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-fredoka)" }}>
              Expenses
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
              Every dollar tracked. Every debt settled. No awkward texts.
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {/* Receipt scan — premium */}
            <button
              onClick={() => setShowPremium(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: showPremium ? "#FFD60022" : "#3a3a3a",
                border: `1px solid ${showPremium ? "#FFD60055" : "transparent"}`,
                color: showPremium ? "#FFD600" : "#9CA3AF",
              }}
            >
              <Camera size={14} weight="fill" />
              <span className="hidden sm:inline">Scan</span>
              <Crown size={12} weight="fill" style={{ color: "#FFD600" }} />
            </button>

            {/* Log expense */}
            <button
              onClick={() => setAddingExpense(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: addingExpense ? "#00C96B" : "#00C96B22",
                border: "1px solid #00C96B55",
                color: addingExpense ? "white" : "#00C96B",
              }}
            >
              <Plus size={14} weight="bold" />
              Log expense
            </button>
          </div>
        </div>

        {/* Premium scan gate */}
        {showPremium && (
          <DarkCard className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FFD60022" }}>
                <Camera size={18} weight="fill" color="#FFD600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-0.5">Scan a receipt</p>
                <p className="text-xs font-medium mb-3" style={{ color: "#9CA3AF" }}>
                  Snap a photo and we'll pull out the amount, merchant, and date automatically via Azure OCR. Premium feature.
                </p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "#FFD600", color: "#1a1a1a" }}>
                    <Crown size={13} weight="fill" />
                    Unlock · $5 one-time
                  </button>
                  <button onClick={() => setShowPremium(false)} className="px-3 py-2 rounded-xl text-sm font-bold hover:bg-[#3a3a3a] transition-colors" style={{ color: "#9CA3AF" }}>
                    Not now
                  </button>
                </div>
              </div>
            </div>
          </DarkCard>
        )}

        {/* Add expense form */}
        {addingExpense && <AddExpenseForm onClose={() => setAddingExpense(false)} />}

        {/* Summary stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <DarkCard className="p-4">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Total spent</p>
            <p className="text-2xl font-black leading-tight" style={{ fontFamily: "var(--font-fredoka)", color: "#00C96B" }}>
              ${TOTAL_SPENT.toLocaleString()}
            </p>
            <p className="text-xs font-medium mt-1" style={{ color: "#555" }}>day 0 through return</p>
          </DarkCard>

          <DarkCard className="p-4">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>My share</p>
            <p className="text-2xl font-black leading-tight" style={{ fontFamily: "var(--font-fredoka)", color: "#00C96B" }}>
              $2,143
            </p>
            <p className="text-xs font-medium mt-1" style={{ color: "#9CA3AF" }}>
              of $2,250 budget
            </p>
          </DarkCard>

          <DarkCard className="p-4">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Outstanding</p>
            <div className="flex items-center gap-1 mb-0.5">
              <ArrowDown size={12} weight="bold" color="#00C96B" />
              <p className="text-sm font-black" style={{ color: "#00C96B" }}>+${totalOwed} owed</p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp size={12} weight="bold" color="#FF2D8B" />
              <p className="text-sm font-black" style={{ color: "#FF2D8B" }}>-${totalIOwe} you owe</p>
            </div>
          </DarkCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: "#2e2e2e" }}>
          {[
            { key: "ledger" as const,   label: "Ledger",   Icon: Receipt },
            { key: "balances" as const, label: "Balances", Icon: ArrowDown },
            { key: "budget" as const,   label: "Budget",   Icon: ChartBar },
          ].map(({ key, label, Icon: TIcon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: tab === key ? "#3a3a3a" : "transparent",
                color: tab === key ? "white" : "#9CA3AF",
              }}
            >
              <TIcon size={14} weight="fill" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "ledger"   && ledgerContent}
        {tab === "balances" && balancesContent}
        {tab === "budget"   && budgetContent}

      </div>
    </div>
  );
}
