import { z } from "zod";

import { projectTypes } from "@/data/services";

/**
 * Client feedback — the public-facing review form.
 *
 * Shared between the form and the API route so client and server agree on what
 * a valid submission is. The server always revalidates; client validation is a
 * convenience, never the gate.
 *
 * Nothing submitted here is published automatically. Every entry lands as
 * `pending` and only appears on the site once it is approved in the moderation
 * queue — see lib/feedback/store.ts and app/admin/feedback.
 */
export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is longer than expected."),

  /** Never published. Used only to verify the review and reply to it. */
  email: z.email("Please enter a valid email address.").max(160),

  /** Published beside the name when given, e.g. "Founder, Northwind". */
  role: z.string().trim().max(90, "That is longer than expected.").optional().or(z.literal("")),

  company: z.string().trim().max(120, "That is longer than expected.").optional().or(z.literal("")),

  /** Optional link to the client's site, shown as attribution when approved. */
  website: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .max(200)
        .refine(
          (value) => /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(value),
          "Please enter a full URL, starting with https://",
        ),
    ])
    .optional(),

  projectType: z.enum(projectTypes).optional().or(z.literal("")),

  rating: z
    .number({ message: "Please choose a rating." })
    .int("Please choose a whole-star rating.")
    .min(1, "Please choose a rating.")
    .max(5, "Please choose a rating."),

  /** Optional short summary, used as the review's bold opening line. */
  headline: z
    .string()
    .trim()
    .max(90, "Please keep the headline under 90 characters.")
    .optional()
    .or(z.literal("")),

  quote: z
    .string()
    .trim()
    .min(40, "A little more detail helps — 40 characters or more.")
    .max(2000, "Please keep this under 2000 characters."),

  /**
   * Explicit, unticked-by-default permission to publish. Without it the entry
   * is stored as private feedback and is never eligible for the site.
   */
  consentToPublish: z.boolean(),

  /**
   * Spam protection, both checked server-side:
   *  - `honeypot` is a hidden field no human ever fills in.
   *  - `elapsedMs` is how long the form was open; bots submit near-instantly.
   */
  honeypot: z.string().max(200).optional(),
  elapsedMs: z.number().int().nonnegative(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/** Field-level errors keyed by field name, for inline display. */
export type FeedbackFieldErrors = Partial<Record<keyof FeedbackInput, string>>;

/** Minimum time a genuine submission takes to compose. */
export const MIN_ELAPSED_MS = 4000;

export function fieldErrorsFrom(error: z.ZodError<FeedbackInput>): FeedbackFieldErrors {
  const errors: FeedbackFieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof FeedbackInput] = issue.message;
    }
  }

  return errors;
}

/** Moderation actions the admin endpoint accepts. */
export const moderationSchema = z.object({
  id: z.string().min(1).max(64),
  action: z.enum(["approve", "reject", "feature", "unfeature", "delete"]),
});

export type ModerationInput = z.infer<typeof moderationSchema>;
