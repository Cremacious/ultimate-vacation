import { createAuthClient } from "better-auth/react";

/**
 * Better Auth — React client.
 * Used from Client Components for signUp/signIn/signOut/useSession hooks.
 *
 * baseURL resolves from NEXT_PUBLIC_BETTER_AUTH_URL; falls back to same-origin
 * during dev so "http://localhost:3000" Just Works.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
