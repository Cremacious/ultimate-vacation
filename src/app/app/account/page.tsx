import Link from "next/link";
import { eq } from "drizzle-orm";

import SignOutButton from "@/components/SignOutButton";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function AccountPage() {
  const user = await requireUser();

  const [row] = await db
    .select({ supporterEntitledAt: users.supporterEntitledAt })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const isSupporter = !!row?.supporterEntitledAt;

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
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-[#1A1A1A] truncate">{displayName}</p>
                {isSupporter && (
                  <span className="text-xs font-bold text-[#00A8CC] bg-[#00A8CC]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    ♥ Supporter
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-medium truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Supporter status */}
        {isSupporter ? (
          <div className="bg-[#1A1A1A] rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">TripWave Supporter ♥</p>
                <p className="text-sm text-[#00A8CC] font-medium mt-0.5">Thank you. Your perks are active.</p>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/app/account/premium">
            <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#1A1A1A] hover:opacity-90 transition-opacity">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Free plan</p>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">Support TripWave — $4.99 one-time</p>
                </div>
                <div className="bg-[#00A8CC] text-white text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">
                  Details
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Sign out */}
        <SignOutButton />
      </div>
    </div>
  );
}
