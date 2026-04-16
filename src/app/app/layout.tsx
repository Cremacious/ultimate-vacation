import AppShellProvider from "@/components/AppShellProvider";
import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <div className="min-h-screen bg-[#F5F7FA]">
        <TopNav />
        <main className="pt-14">{children}</main>
      </div>
    </AppShellProvider>
  );
}
