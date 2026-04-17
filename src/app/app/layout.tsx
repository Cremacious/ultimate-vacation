import AppShellProvider from "@/components/AppShellProvider";
import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <div className="min-h-screen" style={{ backgroundColor: "#404040" }}>
        <TopNav />
        <main className="pt-14">{children}</main>
      </div>
    </AppShellProvider>
  );
}
