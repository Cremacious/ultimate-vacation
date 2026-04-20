import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Server-side session helpers.
 * - getServerSession: returns the session or null. Never throws on unauth.
 * - requireUser: redirects to /login if no session. Use inside server components
 *   and server actions that must run authenticated.
 */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");
  return session.user;
}
