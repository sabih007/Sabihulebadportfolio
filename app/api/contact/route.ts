import { NextResponse } from "next/server";

import { CONTACT_TO, isMailerConfigured, plainTextBody, sendEnquiry } from "@/lib/contact/mailer";
import { MIN_ELAPSED_MS, contactSchema, fieldErrorsFrom } from "@/lib/contact/schema";

/**
 * Contact endpoint.
 *
 * Enquiries are delivered over SMTP with Nodemailer to CONTACT_TO_EMAIL
 * (defaults to info@sabihulebad.com). Credentials live in the environment
 * only — see `.env.example`.
 *
 * If SMTP is not configured the route still refuses to pretend: it validates,
 * rejects spam, logs the enquiry so nothing is lost, and answers HTTP 503 with
 * `code: "not_configured"` so the form can tell the visitor the truth and offer
 * the direct email and phone instead.
 */

export const runtime = "nodejs";
/** Never cache a mutation endpoint. */
export const dynamic = "force-dynamic";

/** Very small in-memory throttle. Per-instance only — fine for a portfolio. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;

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

  const parsed = contactSchema.safeParse(payload);

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
        message: "A few messages have already come through from here. Please try again later.",
      },
      { status: 429 },
    );
  }

  if (!isMailerConfigured()) {
    // Logged rather than dropped, so an enquiry sent during this window is
    // still recoverable from the server output.
    console.warn(
      `[contact] SMTP is not configured; enquiry was NOT delivered to ${CONTACT_TO}.\n` +
        plainTextBody(data),
    );

    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message:
          "Email delivery is not connected yet, so this message was not sent. Please email or call directly in the meantime.",
      },
      { status: 503 },
    );
  }

  try {
    await sendEnquiry(data);
  } catch (error) {
    // Never log the error object wholesale — SMTP errors can echo credentials.
    console.error(
      "[contact] Delivery failed:",
      error instanceof Error ? error.message : "unknown error",
    );

    return NextResponse.json(
      {
        ok: false,
        code: "delivery_failed",
        message: "Something went wrong sending that. Please try again, or use the details below.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
