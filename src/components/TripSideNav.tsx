"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Gear,
  Checks,
  CalendarBlank,
  Backpack,
  Airplane,
  Sun,
  Receipt,
  ChartBar,
  ListChecks,
  Note,
  Wrench,
  Vault,
  Star,
  Users,
} from "@phosphor-icons/react";
import TripBall from "./TripBall";

interface Phase {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface TripSideNavProps {
  tripId: string;
  tripName?: string;
  fillPct?: number;
  ballColor?: string;
  daysUntil?: number | null;
}

const phaseColor: Record<string, string> = {
  setup: "#00A8CC",
  preplanning: "#00A8CC",
  itinerary: "#00A8CC",
  packing: "#FFD600",
  "travel-days": "#FF2D8B",
  "vacation-days": "#00A8CC",
  expenses: "#00C96B",
  polls: "#FFD600",
  wishlist: "#00A8CC",
  notes: "#FFD600",
  tools: "#00A8CC",
  vault: "#FF2D8B",
  memory: "#FF2D8B",
};

export default function TripSideNav({
  tripId,
  tripName = "My Trip",
  fillPct = 0,
  ballColor = "#00A8CC",
  daysUntil,
}: TripSideNavProps) {
  const pathname = usePathname();
  const base = `/app/trips/${tripId}`;

  const mainPhases: Phase[] = [
    { key: "overview", label: "Overview", href: base, icon: <House size={14} weight="fill" />, color: "#00A8CC" },
    { key: "setup", label: "Setup", href: `${base}/setup`, icon: <Gear size={14} weight="fill" />, color: phaseColor.setup },
    { key: "preplanning", label: "Preplanning", href: `${base}/preplanning`, icon: <Checks size={14} weight="fill" />, color: phaseColor.preplanning },
    { key: "itinerary", label: "Itinerary", href: `${base}/itinerary`, icon: <CalendarBlank size={14} weight="fill" />, color: phaseColor.itinerary },
    { key: "packing", label: "Packing", href: `${base}/packing`, icon: <Backpack size={14} weight="fill" />, color: phaseColor.packing },
    { key: "travel-days", label: "Travel Day", href: `${base}/travel-days`, icon: <Airplane size={14} weight="fill" />, color: phaseColor["travel-days"] },
    { key: "vacation-days", label: "Vacation Day", href: `${base}/vacation-days`, icon: <Sun size={14} weight="fill" />, color: phaseColor["vacation-days"] },
    { key: "expenses", label: "Expenses", href: `${base}/expenses`, icon: <Receipt size={14} weight="fill" />, color: phaseColor.expenses },
  ];

  const extraPhases: Phase[] = [
    { key: "polls", label: "Polls", href: `${base}/polls`, icon: <ChartBar size={14} weight="fill" />, color: phaseColor.polls },
    { key: "wishlist", label: "Wishlist", href: `${base}/wishlist`, icon: <Star size={14} weight="fill" />, color: phaseColor.wishlist },
    { key: "notes", label: "Notes", href: `${base}/notes`, icon: <Note size={14} weight="fill" />, color: phaseColor.notes },
    { key: "tools", label: "Tools", href: `${base}/tools`, icon: <Wrench size={14} weight="fill" />, color: phaseColor.tools },
    { key: "vault", label: "Vault", href: `${base}/vault`, icon: <Vault size={14} weight="fill" />, color: phaseColor.vault },
    { key: "memory", label: "Memory", href: `${base}/memory`, icon: <ListChecks size={14} weight="fill" />, color: phaseColor.memory },
  ];

  const isActive = (href: string, key: string) => {
    if (key === "overview") return pathname === base;
    return pathname.startsWith(href);
  };

  const renderPhase = (phase: Phase) => {
    const active = isActive(phase.href, phase.key);
    return (
      <Link key={phase.key} href={phase.href}>
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
            active
              ? "bg-[#F0FAFE] border border-[#00A8CC]/20"
              : "hover:bg-gray-50"
          }`}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: active ? phase.color : "#E5E7EB" }}
          >
            <span style={{ color: active ? "white" : "#9CA3AF" }}>
              {phase.icon}
            </span>
          </div>
          <span
            className={`text-sm truncate ${
              active ? "font-bold text-[#1A1A1A]" : "font-semibold text-gray-500"
            }`}
          >
            {phase.label}
          </span>
        </div>
      </Link>
    );
  };

  const countdownLabel = () => {
    if (daysUntil === null || daysUntil === undefined) return null;
    if (daysUntil === 0) return "Today";
    if (daysUntil === 1) return "Tomorrow";
    if (daysUntil < 0) return "In progress";
    return `${daysUntil} days away`;
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-100 flex flex-col overflow-y-auto z-40">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <TripBall fillPct={fillPct} color={ballColor} size={40} pulse />
          <div className="min-w-0">
            <p
              className="font-semibold text-[#1A1A1A] truncate text-sm leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {tripName}
            </p>
            {countdownLabel() && (
              <p className="text-xs text-gray-400 font-medium">{countdownLabel()}</p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {mainPhases.map(renderPhase)}

        <div className="border-t border-gray-100 my-2" />

        {extraPhases.map(renderPhase)}
      </nav>

      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        <Link href={`${base}/settings/members`}>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users size={14} weight="fill" className="text-gray-400" />
            </div>
            <span className="text-sm font-semibold text-gray-500">Members</span>
          </div>
        </Link>
        <Link href={`${base}/settings`}>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Gear size={14} weight="fill" className="text-gray-400" />
            </div>
            <span className="text-sm font-semibold text-gray-500">Settings</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
