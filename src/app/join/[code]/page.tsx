import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { getInviteByCode } from "@/lib/invites/queries";

import JoinClient from "./JoinClient";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Unauthenticated visitors: bounce to login, then back here.
  // (Better Auth doesn't do a redirectTo param for us; we pass it manually.)
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/join/${code}`)}`);
  }

  const invite = await getInviteByCode(code);

  const state = (() => {
    if (!invite) return { kind: "not_found" as const };
    if (invite.revokedAt) return { kind: "revoked" as const };
    if (invite.tripDeletedAt) return { kind: "trip_deleted" as const };
    if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) {
      return { kind: "expired" as const };
    }
    if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
      return { kind: "exhausted" as const };
    }
    return { kind: "ok" as const, tripName: invite.tripName };
  })();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#404040" }}>
      <div className="w-full max-w-md bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl p-8">
        <h1
          className="text-3xl font-semibold text-white mb-2"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Join a trip
        </h1>

        {state.kind === "ok" ? (
          <>
            <p className="text-sm text-gray-400 mb-6">
              You have been invited to join <span className="font-bold text-white">{state.tripName}</span>.
            </p>
            <JoinClient code={code} />
          </>
        ) : (
          <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
            {state.kind === "not_found" && "This invite code is not valid."}
            {state.kind === "revoked" && "This invite has been revoked."}
            {state.kind === "expired" && "This invite has expired."}
            {state.kind === "exhausted" && "This invite has reached its use limit."}
            {state.kind === "trip_deleted" && "This trip is no longer available."}
          </p>
        )}
      </div>
    </div>
  );
}
