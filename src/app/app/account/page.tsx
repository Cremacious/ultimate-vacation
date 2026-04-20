import Link from "next/link";

import SignOutButton from "@/components/SignOutButton";
import { requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  const user = await requireUser();
  const displayName = user.name?.trim() || user.email;
  const initial = (displayName[0] ?? "?").toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-8"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Account
      </h1>

      <div className="space-y-4">
        {/* Profile section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#00A8CC] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#1A1A1A] truncate">{displayName}</p>
              <p className="text-sm text-gray-400 font-medium truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Premium */}
        <Link href="/app/account/premium">
          <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#1A1A1A] hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Free plan</p>
                <p className="text-sm text-gray-400 font-medium mt-0.5">Support TripWave for $7.99 one-time</p>
              </div>
              <div className="bg-[#00A8CC] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Details
              </div>
            </div>
          </div>
        </Link>

        {/* Sign out */}
        <SignOutButton />
      </div>
    </div>
  );
}
