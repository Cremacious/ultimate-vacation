import PreplanningShell from "@/components/preplanning/PreplanningShell";

// Mock data — replace with DB fetch
const mockSetup = {
  transportModes: ["fly", "drive"],
};

export default async function PreplanningPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;

  return (
    <PreplanningShell
      transportModes={mockSetup.transportModes}
    />
  );
}
