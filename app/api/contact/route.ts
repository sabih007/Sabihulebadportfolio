import { NextResponse } from "next/server";

import {
  MIN_ELAPSED_MS,
  contactSchema,
  fieldErrorsFrom,
} from "@/lib/contact/schema";

/**
 * Contact endpoint.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  TODO — EMAIL DELIVERY IS NOT YET CONFIGURED
 *
 *  This route deliberately does NOT pretend to send. Until a provider is wired
 *  up it validates the submission, rejects spam, and returns HTTP 503 with
 *  `code: "not_configured"` so the form can tell the visitor honestly that the
 *  message was not delivered and offer the LinkedIn / Upwork links instead.
 *  Nothing is ever silently discarded.
 *
 *  To go live, set these environment variables:
 *    CONTACT_PROVIDER_API_KEY   provider API key (e.g. Resend)
 *    CONTACT_TO_EMAIL          the inbox inquiries should arrive in
 *    CONTACT_FROM_EMAIL        a verified sender on your domain
 *
 *  …then replace the `deliver()` body below with the provider call. A Resend
 *  implementation, for reference:
 *
 *    const response = await fetch("https://api.resend.com/emails", {
 *      method: "POST",
 *      headers: {
 *        Authorization: `Bearer ${process.env.CONTACT_PROVIDER_API_KEY}`,
 *        "Content-Type": "application/json",
 *      },
 *      body: JSON.stringify({
 *        from: process.env.CONTACT_FROM_EMAIL,
 *        to: process.env.CONTACT_TO_EMAIL,
 *        reply_to: data.email,
 *        subject: `New inquiry — ${data.projectType}`,
 *        text: summary,
 *      }),
 *    });
 *    if (!response.ok) throw new Error(await response.text());
 * ─────────────────────────────────────────────────────────────────────────────
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

function isConfigured(): boolean {
  return Boolean(
    process.env.CONTACT_PROVIDER_API_KEY &&
      process.env.CONTACT_TO_EMAIL &&
      process.env.CONTACT_FROM_EMAIL,
  );
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

  const data = parsed.data;

  // Spam gates. Both respond as success-shaped rejections so a bot learns nothing.
  if (data.honeypot) {
    return NextResponse.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  if (data.elapsedMs < MIN_ELAPSED_MS) {
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

  const summary = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Project type: ${data.projectType}`,
    data.budget ? `Budget: ${data.budget}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!isConfigured()) {
    // Logged rather than dropped, so a submission during this window is recoverable.
    console.warn(
      "[contact] Email delivery is not configured; inquiry was NOT sent.\n" + summary,
    );

    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message:
          "Email delivery is not connected yet, so this message was not sent. Please reach out on LinkedIn or Upwork in the meantime.",
      },
      { status: 503 },
    );
  }

  try {
    await deliver(summary);
  } catch (error) {
    console.error("[contact] Delivery failed", error);
    return NextResponse.json(
      {
        ok: false,
        code: "delivery_failed",
        message: "Something went wrong sending that. Please try again, or use the links below.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

/** TODO: replace with the provider call documented at the top of this file. */
async function deliver(summary: string): Promise<void> {
  throw new Error(
    `No delivery implementation. Wire up a provider in app/api/contact/route.ts.\n${summary}`,
  );
}
