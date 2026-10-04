import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentication for the feedback moderation queue.
 *
 * One operator, one password, no user table. A signed cookie rather than HTTP
 * Basic so the login can be a real styled page, and rather than Edge middleware
 * so the secret is read from the runtime environment — Edge bundles inline
 * `process.env` at build time, which would bake the password into the output.
 *
 * Set ADMIN_PASSWORD to enable the queue. While it is unset every admin surface
 * reports itself as not configured instead of being open.
 */

const COOKIE = "sabih_admin";
/** Sessions are short: this is a queue you visit, not an app you live in. */
const TTL_MS = 12 * 60 * 60 * 1000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Signing key for the session cookie. Defaults to the password: the cookie is
 * httpOnly and the password is already the only secret in play, so a separate
 * key buys nothing unless you want sessions to survive a password change.
 */
const SECRET = process.env.ADMIN_SESSION_SECRET ?? ADMIN_PASSWORD;

export function isAdminConfigured(): boolean {
  return Boolean(ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 12 && SECRET);
}

/** Why the admin area is unavailable, for an honest message on screen. */
export function adminConfigurationProblem(): string | null {
  if (!ADMIN_PASSWORD) {
    return "ADMIN_PASSWORD is not set, so the moderation queue is disabled.";
  }
  if (ADMIN_PASSWORD.length < 12) {
    return "ADMIN_PASSWORD is shorter than 12 characters. Set a longer one and restart.";
  }
  return null;
}

/** Constant-time comparison that does not leak length through an early return. */
function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  // timingSafeEqual throws on length mismatch, so compare fixed-width digests
  // of both sides instead of the raw values.
  const digest = (value: Buffer) => createHmac("sha256", "compare").update(value).digest();

  return timingSafeEqual(digest(left), digest(right));
}

function sign(expiresAt: number): string {
  return createHmac("sha256", SECRET as string).update(`admin:${expiresAt}`).digest("hex");
}

/** Verifies the password. Always does the hash work, even when unconfigured. */
export function passwordMatches(candidate: string): boolean {
  if (!isAdminConfigured()) {
    // Burn equivalent work so an unconfigured deployment is not detectable by
    // response timing, then refuse.
    sameSecret(candidate, randomBytes(24).toString("hex"));
    return false;
  }

  return sameSecret(candidate, ADMIN_PASSWORD as string);
}

/** Issues the session cookie. Call only after `passwordMatches`. */
export async function startSession(): Promise<void> {
  const expiresAt = Date.now() + TTL_MS;
  const jar = await cookies();

  jar.set(COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    sameSite: "strict",
    // Over plain HTTP in local development the cookie must not be Secure or it
    // is dropped; in production it always is.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** True when the request carries a valid, unexpired session cookie. */
export async function hasAdminSession(): Promise<boolean> {
  if (!isAdminConfigured()) return false;

  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;

  const [rawExpiry, signature] = value.split(".");
  const expiresAt = Number(rawExpiry);

  if (!signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return sameSecret(signature, sign(expiresAt));
}
