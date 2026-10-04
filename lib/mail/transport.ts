import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { contact } from "@/data/site";

/**
 * One SMTP transport, shared by every outbound message the site sends —
 * contact enquiries (lib/contact/mailer.ts) and new-feedback notices
 * (lib/feedback/notify.ts).
 *
 * Credentials come from the environment only, never from the repository. See
 * `.env.example` for the variables this needs. If any are missing,
 * `isMailerConfigured()` returns false and callers report that honestly rather
 * than pretending a message was sent.
 */

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

/** Port 465 is implicit TLS; 587 upgrades with STARTTLS. */
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : SMTP_PORT === 465;

/** Where site mail lands. Defaults to the published inbox. */
export const MAIL_TO = process.env.CONTACT_TO_EMAIL ?? contact.email.display;

/**
 * Envelope sender. Must be an address the SMTP account is allowed to send as,
 * which is why it is configurable rather than reusing a visitor's address —
 * sending as the visitor would fail SPF/DKIM and land in spam.
 */
export const MAIL_FROM = process.env.CONTACT_FROM_EMAIL ?? SMTP_USER;

export function isMailerConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && MAIL_FROM && MAIL_TO);
}

let cached: Transporter | null = null;

export function transporter(): Transporter {
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
 * in a name could inject additional headers into the message.
 */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Escapes user-supplied text before it goes into an HTML mail part. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
