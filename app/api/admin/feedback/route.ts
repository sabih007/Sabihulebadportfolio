import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/admin/session";
import { moderationSchema } from "@/lib/feedback/schema";
import {
  approveFeedback,
  deleteFeedback,
  rejectFeedback,
  setFeatured,
} from "@/lib/feedback/store";

/**
 * Moderation actions. Session-gated — see lib/admin/session.ts.
 *
 * Any change to what is published revalidates the cached pages that render
 * reviews, so an approval is live immediately rather than on the next ISR tick.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read that request." },
      { status: 400 },
    );
  }

  const parsed = moderationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Unknown action." }, { status: 422 });
  }

  const { id, action } = parsed.data;

  try {
    const result =
      action === "approve"
        ? await approveFeedback(id)
        : action === "reject"
          ? await rejectFeedback(id)
          : action === "feature"
            ? await setFeatured(id, true)
            : action === "unfeature"
              ? await setFeatured(id, false)
              : await deleteFeedback(id);

    if (!result.ok) {
      const message =
        result.reason === "no_consent"
          ? "That client did not consent to publication, so it cannot be approved."
          : "That entry no longer exists.";

      return NextResponse.json({ ok: false, message }, { status: 409 });
    }
  } catch (error) {
    console.error(
      `[admin] Moderation action "${action}" failed:`,
      error instanceof Error ? error.message : "unknown error",
    );

    return NextResponse.json(
      { ok: false, message: "That change could not be saved. Please try again." },
      { status: 500 },
    );
  }

  // Both surfaces render published reviews, so both are now stale.
  revalidatePath("/");
  revalidatePath("/reviews");

  return NextResponse.json({ ok: true });
}
