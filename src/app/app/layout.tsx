import AppShellProvider from "@/components/AppShellProvider";
import TopNav from "@/components/TopNav";
import { requireUser } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every /app route requires an authenticated user. requireUser redirects to
  // /login when no session cookie is present.
  await requireUser();

  return (
    <AppShellProvider>
      <div className="min-h-screen" style={{ backgroundColor: "#404040" }}>
        <TopNav />
        <main className="pt-14">{children}</main>
      </div>
    </AppShellProvider>
  );
}
