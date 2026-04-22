import Link from "next/link";

import { requireUser } from "@/lib/auth/session";
import { deleteAccountAction } from "./actions";

export default async function DeleteAccountPage() {
  const user = await requireUser();
  const displayName = user.name?.trim() || user.email;

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
        className="rounded-3xl border border-[#FF2D8B]/30 p-8"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <p className="text-sm font-bold text-[#FF2D8B] uppercase tracking-widest mb-3">
          Danger zone
        </p>
        <h1
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Delete account
        </h1>
        <p className="text-sm text-gray-400 font-medium mb-6">
          Deleting <span className="text-white font-semibold">{displayName}</span> is permanent
          and cannot be undone.
        </p>

        <div className="space-y-3 mb-8">
          <div className="rounded-xl bg-[#FF2D8B]/8 border border-[#FF2D8B]/15 px-4 py-3">
            <p className="text-xs font-semibold text-[#FF2D8B] mb-1">Trips you own</p>
            <p className="text-xs text-white/60 leading-relaxed">
              If other members are on the trip, ownership transfers to the earliest-joined
              member. If you&apos;re the only member, the trip is permanently deleted.
            </p>
          </div>
          <div className="rounded-xl bg-[#FF2D8B]/8 border border-[#FF2D8B]/15 px-4 py-3">
            <p className="text-xs font-semibold text-[#FF2D8B] mb-1">Expenses and records</p>
            <p className="text-xs text-white/60 leading-relaxed">
              Your expense contributions remain in your trip members&apos; records so their
              balances stay accurate. Your name will no longer be visible.
            </p>
          </div>
          <div className="rounded-xl bg-[#FF2D8B]/8 border border-[#FF2D8B]/15 px-4 py-3">
            <p className="text-xs font-semibold text-[#FF2D8B] mb-1">Your login</p>
            <p className="text-xs text-white/60 leading-relaxed">
              You will be signed out immediately. You cannot log back in with this email.
            </p>
          </div>
        </div>

        <form action={deleteAccountAction}>
          <button
            type="submit"
            className="w-full font-bold py-3.5 rounded-full text-sm transition-opacity hover:opacity-90 active:opacity-75"
            style={{ backgroundColor: "#FF2D8B", color: "#fff" }}
          >
            Permanently delete my account
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/app/account"
            className="text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel — keep my account
          </Link>
        </div>
      </div>
    </div>
  );
}
