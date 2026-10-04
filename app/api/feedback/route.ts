import { NextResponse } from "next/server";

import { notifyNewFeedback } from "@/lib/feedback/notify";
import { MIN_ELAPSED_MS, feedbackSchema, fieldErrorsFrom } from "@/lib/feedback/schema";
import { addFeedback } from "@/lib/feedback/store";

/**
 * Client feedback endpoint.
 *
 * A submission is stored first and notified second, so a mail outage can never
 * lose a review. Nothing submitted here is published: every entry lands as
 * `pending` and appears on the site only after it is approved in
 * /admin/feedback.
 *
 * Unlike the contact route, this one does not depend on SMTP being configured —
 * the store is the system of record, and the notice is a convenience.
 */

export const runtime = "nodejs";
/** Never cache a mutation endpoint. */
export const dynamic = "force-dynamic";

/** Very small in-memory throttle. Per-instance only — fine for a portfolio. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "bad_request", message: "Could not read that request." },
      { status: 400 },
    );
  }

  const parsed = feedbackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields.",
        fieldErrors: fieldErrorsFrom(parsed.error),
      },
      { status: 422 },
    );
  }

  const { honeypot, elapsedMs, ...data } = parsed.data;

  // Spam gates. The honeypot answers generically so a bot learns nothing.
  if (honeypot) {
    return NextResponse.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  if (elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json(
      {
        ok: false,
        code: "too_fast",
        message: "That submission arrived unusually fast. Please try again.",
      },
      { status: 429 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "Thanks — a review has already come through from here recently.",
      },
      { status: 429 },
    );
  }

  let stored;

  try {
    stored = await addFeedback(data);
  } catch (error) {
    console.error(
      "[feedback] Could not store the submission:",
      error instanceof Error ? error.message : "unknown error",
    );

    return NextResponse.json(
      {
        ok: false,
        code: "store_failed",
        message: "Something went wrong saving that. Please try again in a moment.",
      },
      { status: 500 },
    );
  }

  // Already stored, so a failed notice is logged rather than surfaced.
  await notifyNewFeedback(stored);

  return NextResponse.json({
    ok: true,
    // So the form can set expectations honestly about the review step.
    pendingReview: true,
    willBePublished: stored.consentToPublish,
  });
}
