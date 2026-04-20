import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { getBalancesForTrip } from "@/lib/expenses/queries";

function formatMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export default async function BalancesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const user = await requireUser();

  const [trip] = await db
    .select({ id: trips.id, name: trips.name })
    .from(trips)
    .where(eq(trips.id, tripId))
    .limit(1);
  if (!trip) notFound();

  const view = await getBalancesForTrip(user.id, trip.id);
  if (!view) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Back to trips
          </Link>
        </div>
        <p className="text-sm font-semibold text-[#FFD600] bg-[#2a2416] rounded-xl px-4 py-3">
          You must be a member of this trip to view balances.
        </p>
      </div>
    );
  }

  const nameById = new Map(view.balances.map((b) => [b.userId, b.name]));
  const allSettled = view.transfers.length === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href={`/app/trips/${trip.id}/expenses`}
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          ← Back to expenses
        </Link>
      </div>

      <h1
        className="text-3xl font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Balances
      </h1>
      <p className="text-sm text-gray-400 mb-8">Trip: {trip.name}</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Per member</h2>
        <ul className="space-y-2">
          {view.balances.map((b) => {
            const tone = b.netCents > 0 ? "#00C96B" : b.netCents < 0 ? "#D9304F" : "#9CA3AF";
            const label = b.netCents > 0 ? "is owed" : b.netCents < 0 ? "owes" : "settled";
            return (
              <li
                key={b.userId}
                className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-semibold">{b.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    paid {formatMoney(b.totalPaidCents)} · share {formatMoney(b.totalOwedCents)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase" style={{ color: tone }}>
                    {label}
                  </p>
                  <p className="text-white font-bold" style={{ color: tone }}>
                    {formatMoney(Math.abs(b.netCents))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Settle up</h2>
        {allSettled ? (
          <p className="text-sm text-[#00C96B]">Everyone is settled.</p>
        ) : (
          <ul className="space-y-2">
            {view.transfers.map((t, i) => (
              <li
                key={`${t.fromUserId}-${t.toUserId}-${i}`}
                className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 text-sm text-white"
              >
                <span className="font-bold">{nameById.get(t.fromUserId) ?? "?"}</span>
                <span className="text-gray-400"> pays </span>
                <span className="font-bold">{nameById.get(t.toUserId) ?? "?"}</span>
                <span className="text-gray-400"> → </span>
                <span className="font-bold text-[#00A8CC]">{formatMoney(t.amountCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
