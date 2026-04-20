import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "./db";
import * as schema from "./db/schema";

/**
 * Better Auth — server instance.
 *
 * Wired to the existing Drizzle schema (Chunk 1). No schema redesign.
 *
 * Key config decisions:
 *   - usePlural: true — maps Better Auth's singular table names (user/session/account/verification)
 *     to our plural tables (users/sessions/accounts/verifications).
 *   - advanced.database.generateId: false — our schema uses `uuid DEFAULT gen_random_uuid()`;
 *     letting Postgres generate the id means we don't need Better Auth's string-id generator.
 *   - emailAndPassword.enabled: true — the only auth strategy at beta.
 *     OAuth (Google, Apple) is a Public-MVP / Post-MVP lever.
 *   - nextCookies() plugin — must be LAST in plugin list per Better Auth docs;
 *     lets Next.js server actions set cookies correctly.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // Pass the full Drizzle schema module. With usePlural: true, Better Auth
    // resolves its internal models (user/session/account/verification) to the
    // plural exports we already have: users/sessions/accounts/verifications.
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Password reset wiring is Chunk 2+: email-send handler is a stub until mailer lands.
    sendResetPassword: async ({ user, url }) => {
      // Beta: no email provider configured; log the reset URL so the solo dev can
      // hand it off manually. Replace with a real mail handler in the email-send chunk.
      console.log(`[auth] password reset for ${user.email} → ${url}`);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
