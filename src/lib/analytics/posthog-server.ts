import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

/**
 * Singleton PostHog server client.
 * Returns null when POSTHOG_API_KEY is absent so all emit() calls silently
 * fall back to console.log — no crash on local dev or misconfigured deploys.
 *
 * flushAt/flushInterval=0 forces immediate flush, which is critical on
 * serverless (Next.js route handler exits before a batched flush fires).
 */
export function getPostHogClient(): PostHog | null {
  if (!process.env.POSTHOG_API_KEY) return null;
  if (!_client) {
    _client = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return _client;
}
