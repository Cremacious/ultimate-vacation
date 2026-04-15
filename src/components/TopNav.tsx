"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CaretDown, User } from "@phosphor-icons/react";

interface TopNavProps {
  tripName?: string;
}

export default function TopNav({ tripName }: TopNavProps) {
  const pathname = usePathname();
  const inTrip = pathname.includes("/trips/") && !pathname.endsWith("/trips/new");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-4">
      {/* Logo */}
      <Link href="/app" className="flex-shrink-0">
        <span
          className="text-2xl font-semibold text-[#00A8CC]"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          TripWave
        </span>
      </Link>

      {/* Trip switcher (shows when inside a trip) */}
      {inTrip && tripName && (
        <button className="flex items-center gap-1.5 bg-[#F8F8FA] border border-gray-100 rounded-full px-3.5 py-1.5 hover:border-[#00A8CC] transition-colors max-w-[200px]">
          <span className="text-sm font-bold text-[#1A1A1A] truncate">{tripName}</span>
          <CaretDown size={12} weight="bold" className="text-gray-400 flex-shrink-0" />
        </button>
      )}

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-full bg-[#F8F8FA] hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Bell size={18} weight="bold" className="text-[#1A1A1A]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2D8B]" />
        </button>

        <Link href="/app/account">
          <div className="w-9 h-9 rounded-full bg-[#00A8CC] flex items-center justify-center hover:bg-[#0096b8] transition-colors">
            <User size={16} weight="fill" className="text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
