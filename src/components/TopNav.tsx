"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, User, CaretDown } from "@phosphor-icons/react";
import { useAppShell } from "./AppShellProvider";
import NotificationBell from "./NotificationBell";

interface TopNavProps {
  tripName?: string;
}

export default function TopNav({ tripName }: TopNavProps) {
  const pathname = usePathname();
  const inTrip = pathname.includes("/trips/") && !pathname.endsWith("/trips/new");
  const { sidebarOpen, toggleSidebar } = useAppShell();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#1e1e1e] border-b border-[#333333] flex items-center px-4 gap-3">
      {/* Hamburger toggle -- mobile only, inside trip workspace */}
      {inTrip && (
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#333333] transition-colors flex-shrink-0"
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {sidebarOpen ? (
            <X size={20} weight="bold" className="text-white" />
          ) : (
            <List size={20} weight="bold" className="text-white" />
          )}
        </button>
      )}

      {/* Logo */}
      <Link href="/app" className="flex-shrink-0">
        <span
          className="text-2xl font-semibold text-[#00A8CC]"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          TripWave
        </span>
      </Link>

      {/* Trip switcher -- desktop only */}
      {inTrip && tripName && (
        <button className="hidden md:flex items-center gap-1.5 bg-[#2a2a2a] border border-[#404040] rounded-full px-3.5 py-1.5 hover:border-[#00A8CC]/50 transition-colors max-w-[200px]">
          <span className="text-sm font-bold text-white truncate">{tripName}</span>
          <CaretDown size={12} weight="bold" className="text-gray-400 flex-shrink-0" />
        </button>
      )}

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        <Link href="/app/account">
          <div className="w-9 h-9 rounded-full bg-[#00A8CC] flex items-center justify-center hover:bg-[#0096b8] transition-colors">
            <User size={16} weight="fill" className="text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
