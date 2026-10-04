import { z } from "zod";

import { budgetRanges, projectTypes } from "@/data/services";

/**
 * Shared between the form and the API route, so the client and the server agree
 * on exactly what a valid inquiry is. The server always revalidates — client
 * validation is a convenience, never the gate.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is longer than expected."),
  email: z.email("Please enter a valid email address.").max(160),
  company: z.string().trim().max(120, "That is longer than expected.").optional().or(z.literal("")),
  projectType: z.enum(projectTypes, { message: "Please choose a project type." }),
  budget: z.enum(budgetRanges).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(30, "A little more detail helps — 30 characters or more.")
    .max(4000, "Please keep this under 4000 characters."),

  /**
   * Spam protection, both checked server-side:
   *  - `honeypot` is a hidden field no human ever fills in.
   *  - `elapsedMs` is how long the form was open; bots submit near-instantly.
   */
  honeypot: z.string().max(200).optional(),
  elapsedMs: z.number().int().nonnegative(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Field-level errors keyed by field name, for inline display. */
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Minimum time a genuine submission takes to compose. */
export const MIN_ELAPSED_MS = 3000;

export function fieldErrorsFrom(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof ContactInput] = issue.message;
    }
  }

  return errors;
}
