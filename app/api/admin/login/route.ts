import { NextResponse } from "next/server";

import {
  adminConfigurationProblem,
  endSession,
  isAdminConfigured,
  passwordMatches,
  startSession,
} from "@/lib/admin/session";

/**
 * Sign in and out of the moderation queue.
 *
 * Attempts are throttled per IP. The failure message never distinguishes "wrong
 * password" from "no password configured", so the endpoint reveals nothing
 * about the deployment.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function throttled(key: string): boolean {
  const now = Date.now();
  const hits = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  attempts.set(key, hits);
  return hits.length > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Could not read that request." }, { status: 400 });
  }

  const body = payload as { password?: unknown; action?: unknown };

  if (body.action === "logout") {
    await endSession();
    return NextResponse.json({ ok: true });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  if (throttled(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again in fifteen minutes." },
      { status: 429 },
    );
  }

  const password = typeof body.password === "string" ? body.password : "";

  /**
   * `passwordMatches` is asked even when the deployment has no password set.
   * It does the same hashing work either way and refuses when unconfigured, so
   * the two cases take the same time to answer — returning early on
   * `isAdminConfigured()` before reaching it, as this route used to, threw that
   * property away and made an unconfigured deployment detectable by how fast it
   * said no. Throttling now covers the unconfigured case too.
   */
  if (!passwordMatches(password)) {
    if (!isAdminConfigured()) {
      console.warn(`[admin] Sign-in attempted but: ${adminConfigurationProblem()}`);
    }

    return NextResponse.json(
      { ok: false, message: "That password was not accepted." },
      { status: 401 },
    );
  }

  await startSession();
  return NextResponse.json({ ok: true });
}
