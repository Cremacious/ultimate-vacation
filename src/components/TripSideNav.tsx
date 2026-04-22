"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Airplane,
  Backpack,
  CalendarBlank,
  ChartBar,
  Checks,
  Compass,
  Gear,
  House,
  ListChecks,
  Note,
  Receipt,
  Star,
  Sun,
  Users,
  Vault,
  Wrench,
} from "@phosphor-icons/react";
import TripBall from "./TripBall";
import { useAppShell } from "./AppShellProvider";

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
  overview: "#6d6d6d",
  setup: "#8b8f98",
  preplanning: "#92a7c8",
  itinerary: "#8aa6d9",
  packing: "#ffd400",
  "travel-days": "#b7bac4",
  "vacation-days": "#8f939b",
  expenses: "#00d26a",
  polls: "#ffd400",
  proposals: "#12b8e8",
  "scavenger-hunt": "#ff8f1f",
  notes: "#8f939b",
  tools: "#8f939b",
  vault: "#8f939b",
  memory: "#8f939b",
  members: "#8f939b",
  settings: "#8f939b",
};

export default function TripSideNav({
  tripId,
  tripName = "My Trip",
  fillPct = 0,
  ballColor = "#ff2d8b",
  daysUntil,
}: TripSideNavProps) {
  const pathname = usePathname();
  const base = `/app/trips/${tripId}`;
  const { sidebarOpen, closeSidebar } = useAppShell();

  const mainPhases: Phase[] = [
    { key: "overview", label: "Overview", href: base, icon: <House size={14} weight="fill" />, color: phaseColor.overview },
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
    { key: "proposals", label: "Proposals", href: `${base}/proposals`, icon: <Star size={14} weight="fill" />, color: phaseColor.proposals },
    { key: "scavenger-hunt", label: "Scavenger Hunt", href: `${base}/scavenger-hunt`, icon: <Compass size={14} weight="fill" />, color: phaseColor["scavenger-hunt"] },
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
      <Link key={phase.key} href={phase.href} onClick={closeSidebar} aria-current={active ? "page" : undefined}>
        <div
          className={[
            "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
            active
              ? "border-[#d6ecf3] bg-[#2b2b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
              : "border-transparent bg-transparent hover:border-white/6 hover:bg-[#2b2b2b]",
          ].join(" ")}
        >
          {active && <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-[#11c3ef]" />}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: active ? phase.color : "#3a3a3a" }}
          >
            <span style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.62)" }}>{phase.icon}</span>
          </div>
          <span
            className={[
              "truncate text-[15px] leading-none",
              active ? "font-bold text-white" : "font-semibold text-[#b7bcc6] group-hover:text-white",
            ].join(" ")}
          >
            {phase.label}
          </span>
        </div>
      </Link>
    );
  };

  const renderUtilityLink = (href: string, label: string, icon: React.ReactNode) => {
    const active = pathname.startsWith(href);
    return (
      <Link href={href} onClick={closeSidebar} aria-current={active ? "page" : undefined}>
        <div
          className={[
            "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
            active ? "border-[#d6ecf3] bg-[#2b2b2b]" : "border-transparent hover:border-white/6 hover:bg-[#2b2b2b]",
          ].join(" ")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a] text-white/60">
            {icon}
          </div>
          <span className={active ? "text-[15px] font-bold text-white" : "text-[15px] font-semibold text-[#b7bcc6] group-hover:text-white"}>
            {label}
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
    <>
      {sidebarOpen && (
        <div className="fixed inset-x-0 bottom-0 top-17 z-40 bg-black/70 md:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={[
          "fixed bottom-0 left-0 top-17 z-50 flex flex-col overflow-y-auto border-r border-white/8 bg-[#262626] scrollbar-dark",
          "transition-transform duration-300 ease-in-out",
          "w-[82vw] max-w-[302px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:w-[270px]",
        ].join(" ")}
      >
        <div className="border-b border-white/8 px-4 py-6">
          <div className="flex items-center gap-3">
            <TripBall
              fillPct={fillPct}
              color={ballColor}
              size={44}
              pulse
              surfaceColor="#262626"
              emptyArcColor="#3d3d3d"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-bold leading-tight text-white" style={{ fontFamily: "var(--font-fredoka)" }}>
                {tripName}
              </p>
              {countdownLabel() && <p className="mt-0.5 text-sm font-semibold text-[#aeb5c2]">{countdownLabel()}</p>}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {mainPhases.map(renderPhase)}
          <div className="my-3 border-t border-white/8" />
          {extraPhases.map(renderPhase)}
        </nav>

        <div className="space-y-1 border-t border-white/8 px-3 py-4">
          {renderUtilityLink(`${base}/settings/members`, "Members", <Users size={14} weight="fill" />)}
          {renderUtilityLink(`${base}/settings`, "Settings", <Gear size={14} weight="fill" />)}
        </div>
      </aside>
    </>
  );
}
