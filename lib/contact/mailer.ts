import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { contact } from "@/data/site";
import type { ContactInput } from "@/lib/contact/schema";

/**
 * SMTP delivery for contact-form enquiries.
 *
 * Credentials come from the environment only — never from the repository. See
 * `.env.example` for the five variables this needs. If any are missing,
 * `isMailerConfigured()` returns false and the API route answers honestly
 * instead of pretending the message was sent.
 */

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

/** Port 465 is implicit TLS; 587 upgrades with STARTTLS. */
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : SMTP_PORT === 465;

/** Where enquiries land. Defaults to the published inbox. */
export const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? contact.email.display;

/**
 * Envelope sender. Must be an address the SMTP account is allowed to send as,
 * which is why it is configurable rather than reusing the enquirer's address —
 * sending as the visitor would fail SPF/DKIM and land in spam.
 */
const CONTACT_FROM = process.env.CONTACT_FROM_EMAIL ?? SMTP_USER;

export function isMailerConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_FROM && CONTACT_TO);
}

let cached: Transporter | null = null;

function transporter(): Transporter {
  if (cached) return cached;

  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // A hung SMTP server must not hold the request open indefinitely.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    // One connection reused across submissions on a warm instance.
    pool: true,
    maxConnections: 1,
    maxMessages: 50,
  });

  return cached;
}

/**
 * Strips CR/LF before a value is used in a mail header. Without this a newline
 * in `name` could inject additional headers into the message.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Escapes user-supplied text before it goes into the HTML part. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    from: { name: `${name} (via sabihulebad.com)`, address: CONTACT_FROM as string },
    to: CONTACT_TO,
    // Replying in the mail client goes straight back to the enquirer.
    replyTo: { name, address: data.email },
    subject: headerSafe(`New enquiry — ${data.projectType} — ${name}`),
    text: plainTextBody(data),
    html: htmlBody(data),
  });
}
