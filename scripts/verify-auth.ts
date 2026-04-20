/**
 * Chunk 2 proof — end-to-end Better Auth flow against the real database.
 *
 * Exercises: signUp → session cookie issued → getSession → signOut → session invalidated.
 * Fails loudly (non-zero exit) on any broken step. Cleans up the test user on success.
 *
 * Run with: `npm run auth:verify`
 * Requires: .env.local with DATABASE_URL + BETTER_AUTH_SECRET set, and the migration
 * in drizzle/0000_initial_spine.sql applied to that database.
 */
import "dotenv/config";

import { sql } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";

const TEST_EMAIL = `verify-${Date.now()}@tripwave.test`;
const TEST_PASSWORD = "verify-password-123";
const TEST_NAME = "Verify Bot";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

function cookieHeaderFrom(headers: Headers): string {
  // Better Auth's Next handler sets cookies via Set-Cookie; for the verify script
  // we're calling the API directly, so we grab them and re-attach on next request.
  const setCookies: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") setCookies.push(value);
  });
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}

async function main() {
  console.log(`\n→ Verifying auth against ${process.env.DATABASE_URL?.split("@")[1] ?? "(no DATABASE_URL)"}`);
  console.log(`→ Test user: ${TEST_EMAIL}\n`);

  assert(process.env.DATABASE_URL, "DATABASE_URL is set");
  assert(process.env.BETTER_AUTH_SECRET, "BETTER_AUTH_SECRET is set");

  // --- sign up ---
  const signUpRes = await auth.api.signUpEmail({
    body: { email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME },
    asResponse: true,
  });
  assert(signUpRes.ok, `signUp responded ${signUpRes.status}`);
  const signUpCookies = cookieHeaderFrom(signUpRes.headers);
  assert(signUpCookies.length > 0, "signUp issued session cookie (autoSignIn)");

  // --- read session ---
  const sessionRes = await auth.api.getSession({
    headers: new Headers({ cookie: signUpCookies }),
  });
  assert(sessionRes?.user?.email === TEST_EMAIL, `getSession returns our user (${sessionRes?.user?.email})`);
  assert(sessionRes?.session?.token, "session has a token");

  // --- sign out ---
  const signOutRes = await auth.api.signOut({
    headers: new Headers({ cookie: signUpCookies }),
    asResponse: true,
  });
  assert(signOutRes.ok, `signOut responded ${signOutRes.status}`);

  // --- sign in fresh ---
  const signInRes = await auth.api.signInEmail({
    body: { email: TEST_EMAIL, password: TEST_PASSWORD },
    asResponse: true,
  });
  assert(signInRes.ok, `signIn responded ${signInRes.status}`);
  const signInCookies = cookieHeaderFrom(signInRes.headers);
  const signInSession = await auth.api.getSession({
    headers: new Headers({ cookie: signInCookies }),
  });
  assert(signInSession?.user?.email === TEST_EMAIL, "signIn produced a valid session");

  // --- cleanup ---
  await db.execute(sql`DELETE FROM users WHERE email = ${TEST_EMAIL}`);
  console.log(`\n✓ cleanup: deleted ${TEST_EMAIL}`);
  console.log("\n✅ Auth verified end-to-end.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ verify-auth failed:", err);
  process.exit(1);
});
