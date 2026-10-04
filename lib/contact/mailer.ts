import "server-only";

import type { ContactInput } from "@/lib/contact/schema";
import {
  MAIL_FROM,
  MAIL_TO,
  escapeHtml,
  headerSafe,
  isMailerConfigured,
  transporter,
} from "@/lib/mail/transport";

/**
 * SMTP delivery for contact-form enquiries.
 *
 * The transport, credentials and escaping helpers are shared with the feedback
 * notifier — see lib/mail/transport.ts. This module owns only the shape of an
 * enquiry message.
 */

/** Where enquiries land. Re-exported so the API route's wording stays truthful. */
export const CONTACT_TO = MAIL_TO;

export { isMailerConfigured };

type Enquiry = Omit<ContactInput, "honeypot" | "elapsedMs">;

function rows(data: Enquiry): [string, string][] {
  const entries: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
  ];
  if (data.company) entries.push(["Company", data.company]);
  entries.push(["Project type", data.projectType]);
  if (data.budget) entries.push(["Budget", data.budget]);
  return entries;
}

export function plainTextBody(data: Enquiry): string {
  return [
    ...rows(data).map(([label, value]) => `${label}: ${value}`),
    "",
    "Project description",
    "-------------------",
    data.message,
  ].join("\n");
}

function htmlBody(data: Enquiry): string {
  const cells = rows(data)
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 16px 6px 0;color:#5a6180;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
           <td style="padding:6px 0;color:#141b3d;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join("");

  // `message` is the only multi-line field, so newlines become <br> after escaping.
  const message = escapeHtml(data.message).replace(/\n/g, "<br>");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7fafb;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid rgba(41,54,129,0.12);border-radius:14px;overflow:hidden">
      <div style="background:#293681;padding:18px 24px">
        <div style="color:#d0e7e6;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">New project enquiry</div>
        <div style="color:#ffffff;font-size:18px;font-weight:700;margin-top:4px">sabihulebad.com</div>
      </div>
      <div style="padding:24px">
        <table style="border-collapse:collapse;width:100%">${cells}</table>
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(41,54,129,0.12)">
          <div style="color:#5a6180;font-size:13px;margin-bottom:8px">Project description</div>
          <div style="color:#141b3d;font-size:14px;line-height:1.65">${message}</div>
        </div>
        <div style="margin-top:24px">
          <a href="mailto:${escapeHtml(data.email)}"
             style="display:inline-block;background:#3762c6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:999px">
            Reply to ${escapeHtml(data.name)}
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

/** Sends the enquiry. Throws on failure so the route can report it honestly. */
export async function sendEnquiry(data: Enquiry): Promise<void> {
  const name = headerSafe(data.name);

  await transporter().sendMail({
    from: { name: `${name} (via sabihulebad.com)`, address: MAIL_FROM as string },
    to: MAIL_TO,
    // Replying in the mail client goes straight back to the enquirer.
    replyTo: { name, address: data.email },
    subject: headerSafe(`New enquiry — ${data.projectType} — ${name}`),
    text: plainTextBody(data),
    html: htmlBody(data),
  });
}
