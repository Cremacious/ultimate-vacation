import AppShellProvider from "@/components/AppShellProvider";
import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at center, #d4d4d4 0%, #a8a8a8 50%, #787878 100%)" }}>
        <TopNav />
        <main className="pt-14">{children}</main>
      </div>
    </AppShellProvider>
  );
}
