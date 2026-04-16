import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import SetupForm from "@/components/setup/SetupForm";

// Mock data — replace with DB fetch
const mockSetup = {
  name: "Japan Spring 2025",
  destinations: [
    { id: "1", city: "Tokyo, Japan" },
    { id: "2", city: "Kyoto, Japan" },
    { id: "3", city: "Osaka, Japan" },
  ],
  startDate: "2025-04-01",
  endDate:   "2025-04-14",
  tripTypes: ["City"],
  vibes:     ["Relaxed"],
  transportModes:  ["fly", "drive"],
  customTransport: [],
  travelers: 4,
  lodging: [
    { id: "1", name: "Hotel Gracery Shinjuku" },
    { id: "2", name: "Airbnb Gion District" },
  ],
  budget:     "5000",
  budgetType: "per-person" as const,
  currency:   "USD",
  ballColor:  "#FF2D8B",
};

export default async function SetupEditPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return (
    <div>
      {/* Page header */}
      <div
        className="border-b px-7 py-6 flex items-center gap-4 flex-shrink-0"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <Link
          href={`/app/trips/${tripId}/setup`}
          className="w-9 h-9 rounded-full border flex items-center justify-center text-white transition-colors hover:border-[#00A8CC] hover:text-[#00A8CC] flex-shrink-0"
          style={{ borderColor: "#444444", backgroundColor: "#1e1e1e" }}
        >
          <ArrowLeft size={16} weight="bold" />
        </Link>
        <div>
          <h1
            className="text-4xl font-semibold text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Edit Setup
          </h1>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            Changes are saved when you click Save
          </p>
        </div>
      </div>

      {/* Form body — full width with padding */}
      <div className="p-6">
        <SetupForm initialData={mockSetup} />
      </div>
    </div>
  );
}
