import { redirect } from "next/navigation";

import { MetricCard } from "@/components/MetricCard";
import { computeRetentionMetrics } from "@/lib/analytics/metrics";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireUser();

  if (user.email !== process.env.ADMIN_EMAIL) {
    redirect("/app");
  }

  const metrics = await computeRetentionMetrics();
  const renderTime = new Date().toLocaleString();

  return (
    <div className="min-h-screen bg-[#0A0A12] px-4 sm:px-6 pt-6 pb-12">
      <h1 className="font-['Fredoka'] text-2xl font-semibold text-white">Retention</h1>
      <p className="text-xs text-white/40 mt-0.5">DB snapshot · {renderTime}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Activation Rate"
          value={metrics.activationRate.value}
          target="40–60%"
          rawCounts={metrics.activationRate.rawCounts}
          status={metrics.activationRate.status}
        />
        <MetricCard
          label="Trip Completion Rate"
          value={metrics.tripCompletionRate.value}
          target="50–70%"
          rawCounts={metrics.tripCompletionRate.rawCounts}
          status={metrics.tripCompletionRate.status}
        />
        <MetricCard
          label="90-Day Second-Trip Rate"
          value={metrics.secondTripRate.value}
          target="25–40%"
          rawCounts={metrics.secondTripRate.rawCounts}
          status={metrics.secondTripRate.status}
        />
        <MetricCard
          label="Participant → Organizer"
          value={metrics.participantToOrganizerRate.value}
          target="5–10%"
          rawCounts={metrics.participantToOrganizerRate.rawCounts}
          status={metrics.participantToOrganizerRate.status}
        />
        <MetricCard
          label="Supporter Conversion"
          value={metrics.supporterConversionRate.value}
          target="3–8%"
          rawCounts={metrics.supporterConversionRate.rawCounts}
          status={metrics.supporterConversionRate.status}
        />
        <MetricCard
          label="Unsettled-Trip Rate"
          value={metrics.unsettledTripRate.value}
          target="<20%"
          rawCounts={metrics.unsettledTripRate.rawCounts}
          status={metrics.unsettledTripRate.status}
          lowerIsBetter
        />
      </div>
    </div>
  );
}
