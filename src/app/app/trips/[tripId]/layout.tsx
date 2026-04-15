import TripSideNav from "@/components/TripSideNav";

// params is a Promise in Next.js 15+
export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  // Placeholder trip data -- replace with real DB fetch
  const trip = {
    name: "Japan Spring 2025",
    fillPct: 72,
    color: "#FF2D8B",
    daysUntil: 42,
  };

  return (
    <>
      <TripSideNav
        tripId={tripId}
        tripName={trip.name}
        fillPct={trip.fillPct}
        ballColor={trip.color}
        daysUntil={trip.daysUntil}
      />
      <div className="md:pl-56">
        {children}
      </div>
    </>
  );
}
