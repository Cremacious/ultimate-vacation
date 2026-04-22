import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import SupporterCheckoutButton from "@/components/supporter/SupporterCheckoutButton";

const LAUNCH_PERKS = [
  "No ads across TripWave",
  "Supporter badge on your profile and expense rows",
  "20 exclusive trip color themes",
];

export default async function SupporterPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const { success } = await searchParams;

  const [row] = await db
    .select({ supporterEntitledAt: users.supporterEntitledAt })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const isSupporter = !!row?.supporterEntitledAt;

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/app/account"
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          ← Back to account
        </Link>
      </div>

      <div
        className="bg-[#1A1A1A] rounded-3xl p-8"
        style={{ boxShadow: "0 8px 32px #00A8CC20" }}
      >
        {isSupporter ? (
          <SupporterConfirmedState justPurchased={success === "1"} />
        ) : (
          <SupporterPurchaseCard />
        )}
      </div>
    </div>
  );
}

function SupporterConfirmedState({ justPurchased }: { justPurchased: boolean }) {
  return (
    <div className="text-center py-4">
      <div className="text-4xl mb-4">♥</div>
      <p className="text-sm font-bold text-[#00A8CC] uppercase tracking-widest mb-2">
        Supporter
      </p>
      <h2
        className="text-2xl font-semibold text-white mb-3"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {justPurchased ? "Thank you so much." : "You're a TripWave Supporter."}
      </h2>
      <p className="text-sm text-gray-400">
        {justPurchased
          ? "Your support keeps TripWave running. Your perks are active now."
          : "Your perks are active. Thank you for supporting TripWave."}
      </p>
    </div>
  );
}

function SupporterPurchaseCard() {
  return (
    <>
      <p className="text-sm font-bold text-[#00A8CC] uppercase tracking-widest mb-2">
        Supporter
      </p>
      <div className="flex items-end gap-1 mb-1">
        <span
          className="text-5xl font-semibold text-white"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          $4.99
        </span>
        <span className="text-gray-400 font-medium mb-1.5">/ one time</span>
      </div>
      <p className="text-sm text-gray-400 font-medium mb-8">
        Pay once, yours forever. No subscriptions, no strings.
      </p>

      <ul className="space-y-3 mb-8">
        {LAUNCH_PERKS.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-3 text-sm font-medium text-white"
          >
            <span className="w-5 h-5 rounded-full bg-[#00A8CC]/20 text-[#00A8CC] flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✓
            </span>
            {perk}
          </li>
        ))}
      </ul>

      <SupporterCheckoutButton />

      <p className="text-center text-xs text-gray-500 font-medium mt-4">
        One-time payment. Secure checkout via Stripe.
      </p>
    </>
  );
}
