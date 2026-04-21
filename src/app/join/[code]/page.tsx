import Link from "next/link";
import { CalendarBlank, WarningCircle } from "@phosphor-icons/react/dist/ssr";

import { getServerSession } from "@/lib/auth/session";
import { getInviteByCode, getMemberCountForTrip } from "@/lib/invites/queries";
import { isTripMember } from "@/lib/invites/permissions";
import TripBall from "@/components/TripBall";

import JoinCTA from "./JoinCTA";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return "Dates TBD";
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };
  if (start && end) {
    const s = new Date(Date.UTC(...(start.split("-").map(Number) as [number, number, number])));
    const e = new Date(Date.UTC(...(end.split("-").map(Number) as [number, number, number])));
    const sMonth = s.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    const eMonth = e.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    const sDay = s.getUTCDate();
    const eDay = e.getUTCDate();
    const year = e.getUTCFullYear();
    if (sMonth === eMonth) return `${sMonth} ${sDay}–${eDay}, ${year}`;
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${year}`;
  }
  return fmt(start ?? end!);
}

// ─── Error card ───────────────────────────────────────────────────────────────

const ERROR_COPY: Record<string, { heading: string; body: string }> = {
  not_found: {
    heading: "This link isn't valid.",
    body: "The invite code wasn't found. Double-check the link or ask for a new one.",
  },
  revoked: {
    heading: "This invite was revoked.",
    body: "The organizer has disabled this link. Ask them to send a new one.",
  },
  expired: {
    heading: "This invite has expired.",
    body: "The link is no longer active. Ask the organizer for a fresh one.",
  },
  exhausted: {
    heading: "This invite is full.",
    body: "The link has reached its limit. Ask the organizer for a new one.",
  },
  trip_deleted: {
    heading: "This trip is no longer available.",
    body: "The trip may have been removed by the organizer.",
  },
};

function ErrorCard({ kind }: { kind: string }) {
  const copy = ERROR_COPY[kind] ?? ERROR_COPY.not_found;
  return (
    <div
      role="alert"
      className="w-full max-w-sm mx-auto rounded-3xl p-8 flex flex-col items-center"
      style={{ backgroundColor: "#15162A", border: "1px solid #2A2B45" }}
    >
      <WarningCircle size={40} color="#FFEB00" className="mb-4" aria-hidden="true" />
      <h2
        className="text-xl font-semibold text-white text-center mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {copy.heading}
      </h2>
      <p className="text-sm text-white/60 text-center mb-6">{copy.body}</p>
      <Link
        href="/"
        className="text-sm text-white/50 hover:text-white text-center block underline transition-colors"
      >
        Go to TripWave →
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [invite, session] = await Promise.all([
    getInviteByCode(code),
    getServerSession(),
  ]);

  const userId = session?.user?.id ?? null;

  // Determine invite validity state
  const errorKind = (() => {
    if (!invite) return "not_found";
    if (invite.revokedAt) return "revoked";
    if (invite.tripDeletedAt) return "trip_deleted";
    if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) return "expired";
    if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) return "exhausted";
    return null;
  })();

  if (errorKind) {
    return <PageShell><ErrorCard kind={errorKind} /></PageShell>;
  }

  // invite is valid — narrow type
  const validInvite = invite!;

  const [memberCount, alreadyMember] = await Promise.all([
    getMemberCountForTrip(validInvite.tripId),
    userId ? isTripMember(userId, validInvite.tripId) : Promise.resolve(false),
  ]);

  const ctaVariant = !userId
    ? ({ variant: "unauth", code, tripName: validInvite.tripName } as const)
    : alreadyMember
    ? ({ variant: "already_member", tripId: validInvite.tripId } as const)
    : ({ variant: "accept", code, tripId: validInvite.tripId } as const);

  const inviterName = validInvite.inviterName ?? "Someone";
  const otherCount = Math.max(0, memberCount - 1);
  const socialProof =
    otherCount === 0
      ? `Just ${inviterName} so far — be the first to join`
      : `${inviterName} and ${otherCount} other${otherCount === 1 ? "" : "s"} are already planning`;

  return (
    <PageShell>
      <div
        className="w-full max-w-sm mx-auto rounded-3xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "#15162A", border: "1px solid #2A2B45" }}
      >
        {/* Section 1 — Trip identity */}
        <div className="flex items-center gap-4">
          <TripBall
            color={validInvite.tripBallColor}
            fillPct={0}
            size={80}
            glow
            aria-hidden={true}
            className="flex-shrink-0"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <h1
              className="text-3xl font-semibold text-white leading-tight line-clamp-2"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {validInvite.tripName}
            </h1>
            <p className="text-sm text-white/50">a group trip</p>
          </div>
        </div>

        {/* Section 2 — Inviter (BEFORE dates — locked decision 1) */}
        <div>
          <p className="text-sm text-white/60">
            invited by <span className="font-semibold text-white">{inviterName}</span>
          </p>
          <p className="text-xs text-white/40 mt-0.5">{socialProof}</p>
        </div>

        {/* Section 3 — Dates */}
        <p className="text-sm text-white/60 flex items-center gap-1.5">
          <CalendarBlank size={14} className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} aria-hidden="true" />
          {formatDateRange(validInvite.tripStartDate, validInvite.tripEndDate)}
        </p>

        {/* Section 4 — Permissions preview (ABOVE CTA — locked decision 2) */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2">
            What you can do on this trip
          </p>
          <div className="flex flex-wrap gap-2">
            {["Log expenses", "Check packing"].map((label) => (
              <span
                key={label}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Section 5 — CTA */}
        <JoinCTA {...ctaVariant} />
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col px-4 py-10"
      style={{ backgroundColor: "#0A0A12" }}
    >
      <div className="mb-8">
        <Link href="/">
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-fredoka)", color: "#00A8CC" }}
          >
            TripWave
          </span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        {children}
      </div>
    </div>
  );
}
