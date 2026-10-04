import "server-only";

import { SITE_URL } from "@/data/site";
import type { FeedbackRecord } from "@/lib/feedback/store";
import {
  MAIL_FROM,
  MAIL_TO,
  escapeHtml,
  headerSafe,
  isMailerConfigured,
  transporter,
} from "@/lib/mail/transport";

/**
 * "New feedback is waiting" notice.
 *
 * Sent after the entry is already stored, and deliberately best-effort: a
 * notification that fails to send must never make the visitor think their
 * review was lost, because it wasn't — it is in the store and in the queue.
 */

function rows(entry: FeedbackRecord): [string, string][] {
  const out: [string, string][] = [
    ["From", entry.name],
    ["Email", entry.email],
  ];
  if (entry.role) out.push(["Role", entry.role]);
  if (entry.company) out.push(["Company", entry.company]);
  if (entry.website) out.push(["Website", entry.website]);
  if (entry.projectType) out.push(["Project", entry.projectType]);
  out.push(["Rating", `${entry.rating} / 5`]);
  out.push(["Publish consent", entry.consentToPublish ? "Yes" : "No — private feedback"]);
  return out;
}

function plainTextBody(entry: FeedbackRecord): string {
  return [
    ...rows(entry).map(([label, value]) => `${label}: ${value}`),
    "",
    entry.headline ? `Headline: ${entry.headline}` : null,
    "",
    "Feedback",
    "--------",
    entry.quote,
    "",
    entry.consentToPublish
      ? `Approve or hide it here: ${SITE_URL}/admin/feedback`
      : "The client did not consent to publication, so this entry cannot be approved.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function htmlBody(entry: FeedbackRecord): string {
  const cells = rows(entry)
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 16px 6px 0;color:#5a6180;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
           <td style="padding:6px 0;color:#141b3d;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join("");

  const quote = escapeHtml(entry.quote).replace(/\n/g, "<br>");
  const stars = "★".repeat(entry.rating) + "☆".repeat(5 - entry.rating);

  const action = entry.consentToPublish
    ? `<div style="margin-top:24px">
         <a href="${SITE_URL}/admin/feedback"
            style="display:inline-block;background:#3762c6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:999px">
           Review it in the queue
         </a>
       </div>`
    : `<div style="margin-top:24px;padding:12px 14px;border-radius:10px;background:rgba(41,54,129,0.06);color:#5a6180;font-size:13px">
         The client did not tick publish consent, so this stays private and cannot be approved.
       </div>`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7fafb;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid rgba(41,54,129,0.12);border-radius:14px;overflow:hidden">
      <div style="background:#293681;padding:18px 24px">
        <div style="color:#d0e7e6;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">New client feedback</div>
        <div style="color:#ffffff;font-size:18px;font-weight:700;margin-top:4px">${stars} &nbsp;${entry.rating}.0</div>
      </div>
      <div style="padding:24px">
        <table style="border-collapse:collapse;width:100%">${cells}</table>
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(41,54,129,0.12)">
          ${
            entry.headline
              ? `<div style="color:#141b3d;font-size:16px;font-weight:700;margin-bottom:10px">${escapeHtml(entry.headline)}</div>`
              : ""
          }
          <div style="color:#141b3d;font-size:14px;line-height:1.65">${quote}</div>
        </div>
        ${action}
        <div style="margin-top:20px">
          <a href="mailto:${escapeHtml(entry.email)}" style="color:#3762c6;font-size:13px">Reply to ${escapeHtml(entry.name)}</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Best-effort notification. Resolves either way; returns whether a message
 * actually went out, so the route can log the difference.
 */
export async function notifyNewFeedback(entry: FeedbackRecord): Promise<boolean> {
  if (!isMailerConfigured()) {
    console.warn(
      `[feedback] SMTP is not configured, so no notice was sent. The entry IS stored ` +
        `(id ${entry.id}) and is waiting at /admin/feedback.`,
    );
    return false;
  }

  const name = headerSafe(entry.name);

  try {
    await transporter().sendMail({
      from: { name: "sabihulebad.com", address: MAIL_FROM as string },
      to: MAIL_TO,
      replyTo: { name, address: entry.email },
      subject: headerSafe(`New ${entry.rating}★ feedback — ${name}`),
      text: plainTextBody(entry),
      html: htmlBody(entry),
    });
    return true;
  } catch (error) {
    // Never log the error object wholesale — SMTP errors can echo credentials.
    console.error(
      `[feedback] Notice for entry ${entry.id} could not be sent (the entry is stored):`,
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}
