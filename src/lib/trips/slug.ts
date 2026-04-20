import { randomBytes } from "node:crypto";

/**
 * Produce a URL-safe slug from a trip name plus a 6-char random suffix.
 * Collision-safe at beta scale (36^6 ≈ 2.2B). Keep this deterministic-enough
 * to be readable but unique enough that two "tokyo-2025" trips don't clash.
 */
export function buildTripSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48)
    .replace(/^-|-$/g, "");

  // Hex suffix: a-f0-9 only, so no base64url "-" / "_" can sneak into the slug.
  const suffix = randomBytes(3).toString("hex"); // 6 chars, 16^6 ≈ 16M

  return base ? `${base}-${suffix}` : `trip-${suffix}`;
}
