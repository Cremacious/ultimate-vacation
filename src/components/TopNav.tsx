"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellSimple, List, User, X } from "@phosphor-icons/react";
import { useAppShell } from "./AppShellProvider";
import NotificationBell from "./NotificationBell";
import TripSwitcher from "./TripSwitcher";

export default function TopNav() {
  const pathname = usePathname();
  const inTrip = pathname.includes("/trips/") && !pathname.endsWith("/trips/new");
  const { sidebarOpen, toggleSidebar, currentTrip } = useAppShell();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-17 border-b border-white/8 bg-[#171717]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-3 px-4 md:px-5">
        {inTrip && (
          <button
            onClick={toggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[#2a2a2a] text-white transition-colors hover:bg-[#333333] md:hidden"
            style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          >
            {sidebarOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        )}

        <Link href="/app" className="flex shrink-0 items-center">
          <span
            className="text-[2rem] font-semibold leading-none text-[#00b8e6]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            TripWave
          </span>
        </Link>

        {inTrip && currentTrip && <TripSwitcher currentTrip={currentTrip} />}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <NotificationBell />
          </div>
          <button
            type="button"
            aria-label="Quick alerts"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[#2a2a2a] text-white transition-colors hover:bg-[#333333] sm:hidden"
            style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
          >
            <BellSimple size={18} weight="bold" />
            <span className="absolute mt-[-18px] ml-[18px] h-2.5 w-2.5 rounded-full bg-[#ff2d8b]" />
          </button>

          <Link href="/app/account" aria-label="Account">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12b8e8] transition-colors hover:bg-[#0ea8d4]"
              style={{ boxShadow: "0 3px 0 #007a99" }}
            >
              <User size={17} weight="fill" style={{ color: "#171717" }} aria-hidden="true" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
