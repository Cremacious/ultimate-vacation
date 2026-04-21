import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { tripMembers, users } from "@/lib/db/schema";
import { getTripById } from "@/lib/trips/queries";
import { isTripMember, isTripOrganizer } from "@/lib/invites/permissions";

const MEMBER_COLORS = [
  "#FF2D8B", "#00A8CC", "#FFD600", "#00C96B",
  "#A855F7", "#FF8C00", "#00E5FF", "#FF3DA7",
];

export default async function MembersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const [canView, isOrganizer] = await Promise.all([
    isTripMember(user.id, tripId),
    isTripOrganizer(user.id, tripId),
  ]);

  if (!canView) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/app" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view its members.
        </p>
      </div>
    );
  }

  const memberRows = await db
    .select({ userId: tripMembers.userId, name: users.name, role: tripMembers.role })
    .from(tripMembers)
    .innerJoin(users, eq(tripMembers.userId, users.id))
    .where(and(eq(tripMembers.tripId, tripId), isNull(tripMembers.deletedAt)));

  return (
    <div className="px-6 py-8 max-w-2xl">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Members
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        {memberRows.length} traveler{memberRows.length !== 1 ? "s" : ""} on {trip.name}.
      </p>

      <ul className="space-y-2 mb-8">
        {memberRows.map((m, i) => (
          <li
            key={m.userId}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-[#1a1a1a] flex-shrink-0"
              style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }}
            >
              {m.name.trim().charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-[#1A1A1A] flex-1 truncate">{m.name}</span>
            {m.role === "organizer" && (
              <span className="text-xs font-bold text-[#1A1A1A] bg-[#FFD600] px-2.5 py-1 rounded-full flex-shrink-0">
                Organizer
              </span>
            )}
          </li>
        ))}
      </ul>

      {isOrganizer && (
        <Link
          href={`/app/trips/${tripId}/invite`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#00A8CC" }}
        >
          Invite more people
        </Link>
      )}
    </div>
  );
}
