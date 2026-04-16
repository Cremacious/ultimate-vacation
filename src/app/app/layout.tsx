import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <TopNav />
      <main className="pt-14">{children}</main>
    </div>
  );
}
