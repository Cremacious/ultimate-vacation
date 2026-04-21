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
  Compass,
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
  setup: "#00A8CC",
  preplanning: "#00A8CC",
  itinerary: "#00A8CC",
  packing: "#FFD600",
  "travel-days": "#FF2D8B",
  "vacation-days": "#00A8CC",
  expenses: "#00C96B",
  polls: "#FFD600",
  proposals: "#00A8CC",
  "scavenger-hunt": "#FF8C00",
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
  const { sidebarOpen, closeSidebar } = useAppShell();

  const mainPhases: Phase[] = [
    { key: "overview",      label: "Overview",     href: base,                      icon: <House size={14} weight="fill" />,        color: "#00A8CC" },
    { key: "setup",         label: "Setup",        href: `${base}/setup`,           icon: <Gear size={14} weight="fill" />,         color: phaseColor.setup },
    { key: "preplanning",   label: "Preplanning",  href: `${base}/preplanning`,     icon: <Checks size={14} weight="fill" />,       color: phaseColor.preplanning },
    { key: "itinerary",     label: "Itinerary",    href: `${base}/itinerary`,       icon: <CalendarBlank size={14} weight="fill" />,color: phaseColor.itinerary },
    { key: "packing",       label: "Packing",      href: `${base}/packing`,         icon: <Backpack size={14} weight="fill" />,     color: phaseColor.packing },
    { key: "travel-days",   label: "Travel Day",   href: `${base}/travel-days`,     icon: <Airplane size={14} weight="fill" />,     color: phaseColor["travel-days"] },
    { key: "vacation-days", label: "Vacation Day", href: `${base}/vacation-days`,   icon: <Sun size={14} weight="fill" />,          color: phaseColor["vacation-days"] },
    { key: "expenses",      label: "Expenses",     href: `${base}/expenses`,        icon: <Receipt size={14} weight="fill" />,      color: phaseColor.expenses },
  ];

  const extraPhases: Phase[] = [
    { key: "polls",           label: "Polls",         href: `${base}/polls`,          icon: <ChartBar size={14} weight="fill" />,  color: phaseColor.polls },
    { key: "proposals",       label: "Proposals",     href: `${base}/proposals`,      icon: <Star size={14} weight="fill" />,      color: phaseColor.proposals },
    { key: "scavenger-hunt",  label: "Scavenger Hunt",href: `${base}/scavenger-hunt`, icon: <Compass size={14} weight="fill" />,   color: phaseColor["scavenger-hunt"] },
    { key: "notes",    label: "Notes",   href: `${base}/notes`,   icon: <Note size={14} weight="fill" />,      color: phaseColor.notes },
    { key: "tools",    label: "Tools",   href: `${base}/tools`,   icon: <Wrench size={14} weight="fill" />,    color: phaseColor.tools },
    { key: "vault",    label: "Vault",   href: `${base}/vault`,   icon: <Vault size={14} weight="fill" />,     color: phaseColor.vault },
    { key: "memory",   label: "Memory",  href: `${base}/memory`,  icon: <ListChecks size={14} weight="fill" />,color: phaseColor.memory },
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
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
            active
              ? "bg-[#333333] border border-[#00A8CC]/25"
              : "hover:bg-[#333333]/60"
          }`}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: active ? phase.color : "#3a3a3a" }}
          >
            <span style={{ color: active ? "white" : "#9CA3AF" }}>
              {phase.icon}
            </span>
          </div>
          <span
            className={`text-sm truncate ${
              active ? "font-bold text-white" : "font-semibold text-[#9CA3AF]"
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
    <>
      {/* Mobile backdrop overlay -- tap to close */}
      {sidebarOpen && (
        <div
          className="fixed top-14 inset-x-0 bottom-0 z-40 bg-black/75 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-14 left-0 bottom-0 z-50",
          "bg-[#252525] border-r border-[#333333]",
          "flex flex-col overflow-y-auto scrollbar-dark",
          "transition-transform duration-300 ease-in-out",
          // Mobile: 80vw wide, slide in/out
          "w-[80vw] max-w-[300px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, fixed 224px wide
          "md:translate-x-0 md:w-56",
        ].join(" ")}
      >
        {/* Trip header */}
        <div className="px-4 py-4 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <TripBall
              fillPct={fillPct}
              color={ballColor}
              size={40}
              pulse
              surfaceColor="#252525"
              emptyArcColor="#404040"
            />
            <div className="min-w-0">
              <p
                className="font-semibold text-white truncate text-sm leading-tight"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {tripName}
              </p>
              {countdownLabel() && (
                <p className="text-xs font-medium text-[#9CA3AF]">
                  {countdownLabel()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phase navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {mainPhases.map(renderPhase)}
          <div className="border-t border-[#333333] my-2" />
          {extraPhases.map(renderPhase)}
        </nav>

        {/* Bottom: Members + Settings */}
        <div className="px-2 py-3 border-t border-[#333333] space-y-0.5">
          <Link href={`${base}/settings/members`} onClick={closeSidebar}>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#333333]/60 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0">
                <Users size={14} weight="fill" className="text-[#9CA3AF]" />
              </div>
              <span className="text-sm font-semibold text-[#9CA3AF]">Members</span>
            </div>
          </Link>
          <Link href={`${base}/settings`} onClick={closeSidebar}>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#333333]/60 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0">
                <Gear size={14} weight="fill" className="text-[#9CA3AF]" />
              </div>
              <span className="text-sm font-semibold text-[#9CA3AF]">Settings</span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
