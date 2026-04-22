import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips, tripMembers } from "@/lib/db/schema";

export default async function TripSettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [[trip], [member]] = await Promise.all([
    db
      .select({ id: trips.id, name: trips.name })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1),
    db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(
        and(
          eq(tripMembers.userId, user.id),
          eq(tripMembers.tripId, tripId),
          isNull(tripMembers.deletedAt),
        ),
      )
      .limit(1),
  ]);

  if (!trip) notFound();
  if (!member) notFound();

  const isOrganizer = member.role === "organizer";

  return (
    <div className="px-6 py-8 max-w-xl">
      <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
        Settings
      </p>
      <h1
        className="text-3xl font-semibold text-white mb-8"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {trip.name}
      </h1>

      {/* Trip management */}
      <section aria-label="Trip management" className="mb-8">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-3">
          Trip
        </p>
        <div className="flex flex-col gap-2">
          {isOrganizer && (
            <Link
              href={`/app/trips/${tripId}/setup/edit`}
              className="flex items-center justify-between rounded-2xl border border-[#2A2B45] px-5 py-4 hover:border-[#00E5FF]/30 transition-colors"
              style={{ backgroundColor: "#15162A" }}
            >
              <div>
                <p className="text-sm font-semibold text-white">Edit trip</p>
                <p className="text-xs text-white/40 mt-0.5">Name, dates, budget, ball color</p>
              </div>
              <span className="text-white/30 text-lg">›</span>
            </Link>
          )}

          <Link
            href={`/app/trips/${tripId}/settings/members`}
            className="flex items-center justify-between rounded-2xl border border-[#2A2B45] px-5 py-4 hover:border-[#00E5FF]/30 transition-colors"
            style={{ backgroundColor: "#15162A" }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Members</p>
              <p className="text-xs text-white/40 mt-0.5">View the group and manage invites</p>
            </div>
            <span className="text-white/30 text-lg">›</span>
          </Link>
        </div>
      </section>

      {/* Danger zone — organizer only, deferred */}
      {isOrganizer && (
        <section aria-label="Danger zone">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-3">
            Danger zone
          </p>
          <div
            className="rounded-2xl border border-[#FF2D8B]/20 px-5 py-4"
            style={{ backgroundColor: "#15162A" }}
          >
            <p className="text-sm font-semibold text-white mb-0.5">Delete trip</p>
            <p className="text-xs text-white/40">
              Trip deletion is not yet available. Email{" "}
              <a
                href="mailto:support@tripwave.app"
                className="text-[#FF2D8B]/70 hover:text-[#FF2D8B] transition-colors"
              >
                support@tripwave.app
              </a>{" "}
              if you need a trip removed.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
