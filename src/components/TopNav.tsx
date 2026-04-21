"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, User } from "@phosphor-icons/react";
import { useAppShell } from "./AppShellProvider";
import NotificationBell from "./NotificationBell";
import TripSwitcher from "./TripSwitcher";

export default function TopNav() {
  const pathname = usePathname();
  const inTrip = pathname.includes("/trips/") && !pathname.endsWith("/trips/new");
  const { sidebarOpen, toggleSidebar, currentTrip } = useAppShell();

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

      {/* Trip switcher -- desktop only, shown once context is populated */}
      {inTrip && currentTrip && <TripSwitcher currentTrip={currentTrip} />}

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        <Link href="/app/account" aria-label="Account">
          <div className="w-9 h-9 rounded-full bg-[#00A8CC] flex items-center justify-center hover:bg-[#0096b8] transition-colors">
            <User size={16} weight="fill" className="text-white" aria-hidden="true" />
          </div>
        </Link>
      </div>
    </header>
  );
}
