import { randomBytes } from "node:crypto";

/**
 * 10-char hex invite code — URL-safe, ~1T space.
 * Hex (not base64url) so no "-" or "_" slip in and break pattern matching.
 */
export function buildInviteCode(): string {
  return randomBytes(5).toString("hex");
}
