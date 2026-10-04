"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { projectTypes } from "@/data/services";
import { contact } from "@/data/site";
import { feedbackSchema } from "@/lib/feedback/schema";
import type { FeedbackFieldErrors } from "@/lib/feedback/schema";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-card border bg-white px-4 py-3.5 text-[0.9375rem] text-navy placeholder:text-navy/55 transition-colors duration-300 focus:outline-none focus-visible:border-blue";

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%23293681' stroke-opacity='0.6' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

/**
 * Client feedback form.
 *
 * Nothing submitted here goes live on its own. The success state says so
 * plainly, because a client who expects their words to appear instantly and
 * finds nothing has been misled.
 *
 * Publication consent is a real, unticked checkbox. Unticked, the feedback is
 * still delivered and still read — it simply stays private, and the server
 * refuses to approve it for the site.
 *
 * Spam is handled without a third-party script: a hidden honeypot plus the time
 * the form was open, both checked server-side.
 */
export function FeedbackForm() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FeedbackFieldErrors>({});
  const [rating, setRating] = useState<number>(0);
  const [consent, setConsent] = useState(false);
  const [published, setPublished] = useState(false);
  // Set on mount rather than during render: the time the form opened is the
  // baseline for the server-side "submitted too fast" spam check.
  const openedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? ""),
      company: String(form.get("company") ?? ""),
      website: String(form.get("clientWebsite") ?? ""),
      projectType: String(form.get("projectType") ?? ""),
      rating,
      headline: String(form.get("headline") ?? ""),
      quote: String(form.get("quote") ?? ""),
      consentToPublish: consent,
      honeypot: String(form.get("nickname") ?? ""),
      elapsedMs: Date.now() - openedAt.current,
    };

    const parsed = feedbackSchema.safeParse(payload);

    if (!parsed.success) {
      const next: FeedbackFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof FeedbackFieldErrors] = issue.message;
        }
      }
      setErrors(next);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        willBePublished?: boolean;
        fieldErrors?: FeedbackFieldErrors;
      };

      if (response.ok && result.ok) {
        setPublished(Boolean(result.willBePublished));
        setStatus("success");
        setMessage(null);
        formRef.current?.reset();
        setRating(0);
        setConsent(false);
        openedAt.current = Date.now();
        return;
      }

      setStatus("error");
      setErrors(result.fieldErrors ?? {});
      setMessage(result.message ?? "That didn't go through. Please try again in a moment.");
    } catch {
      setStatus("error");
      setMessage("The request could not be sent — check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-panel border border-navy/12 bg-white p-8 sm:p-10"
        role="status"
      >
        <p className="font-accent text-label uppercase tracking-[0.18em] text-accent">
          Feedback received
        </p>
        <h3 className="mt-5 text-title font-semibold text-navy">Thank you — genuinely.</h3>
        <p className="mt-4 max-w-[48ch] text-body text-fg/85">
          {published
            ? "I read every review myself. Yours will appear on the site once I've checked it over — usually within a day or two."
            : "I read every review myself. You didn't tick the permission box, so this stays private between us and won't appear anywhere on the site."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 text-[0.9375rem] font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-300 hover:text-navy"
        >
          Leave another review
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* `group` rather than `label`: the control below is a radiogroup, which
          labels itself — a <label for> would point at no single input. */}
      <Field label="How did it go?" name="rating" error={errors.rating} required labelAs="span">
        <StarPicker value={rating} onChange={setRating} invalid={Boolean(errors.rating)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name} required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(fieldBase, errors.name ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field
          label="Email"
          name="email"
          error={errors.email}
          required
          hint="Never published — it only lets me verify the review and reply."
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={cn(errors.email ? "email-error" : "", "email-hint")}
            className={cn(fieldBase, errors.email ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field label="Role / title" name="role" error={errors.role} optional>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="e.g. Founder"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? "role-error" : undefined}
            className={cn(fieldBase, errors.role ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field label="Company / brand" name="company" error={errors.company} optional>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={cn(fieldBase, errors.company ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field label="Your website" name="clientWebsite" error={errors.website} optional>
          <input
            id="clientWebsite"
            name="clientWebsite"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? "clientWebsite-error" : undefined}
            className={cn(fieldBase, errors.website ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field label="What did we build?" name="projectType" error={errors.projectType} optional>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={cn(
              fieldBase,
              "appearance-none bg-[length:0.75rem] bg-[right_1rem_center] bg-no-repeat pr-10 border-navy/15",
            )}
            style={{ backgroundImage: selectChevron }}
          >
            <option value="">Prefer not to say</option>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-white text-navy">
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Headline"
        name="headline"
        error={errors.headline}
        optional
        hint="One line that sums it up. Used as the review's opening sentence."
      >
        <input
          id="headline"
          name="headline"
          type="text"
          maxLength={90}
          placeholder="e.g. Delivered early and did exactly what we asked"
          aria-invalid={Boolean(errors.headline)}
          aria-describedby={cn(errors.headline ? "headline-error" : "", "headline-hint")}
          className={cn(fieldBase, errors.headline ? "border-blue/70" : "border-navy/15")}
        />
      </Field>

      <Field label="Your feedback" name="quote" error={errors.quote} required>
        <textarea
          id="quote"
          name="quote"
          rows={6}
          maxLength={2000}
          placeholder="What was the project, how did the work go, and what would you tell someone considering it?"
          aria-invalid={Boolean(errors.quote)}
          aria-describedby={errors.quote ? "quote-error" : undefined}
          className={cn(fieldBase, "resize-y", errors.quote ? "border-blue/70" : "border-navy/15")}
        />
      </Field>

      {/* Consent is a real decision, not a pre-ticked formality. */}
      <div
        className={cn(
          "rounded-card border bg-white p-4 transition-colors duration-300 sm:p-5",
          errors.consentToPublish ? "border-blue/70" : "border-navy/15",
        )}
      >
        <label htmlFor="consentToPublish" className="flex cursor-pointer items-start gap-3.5">
          <input
            id="consentToPublish"
            name="consentToPublish"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 size-[1.125rem] shrink-0 cursor-pointer accent-blue-solid"
          />
          <span className="text-[0.9375rem] leading-relaxed text-fg/85">
            You may publish this review on the website, with my name
            {" "}
            <span className="text-fg/75">(and role, company or site link if I gave them).</span>
            <span className="mt-1.5 block text-meta text-fg/75">
              My email address is never shown. Leave this unticked to send private feedback
              instead — it still reaches {contact.email.display} and nothing is published.
            </span>
          </span>
        </label>
      </div>

      {/* Honeypot: visually and programmatically hidden, never focusable. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="nickname">Nickname</label>
        <input id="nickname" name="nickname" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <AnimatePresence initial={false}>
        {status === "error" && message ? (
          <motion.div
            key="error"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            role="alert"
            className="rounded-card border border-blue/30 bg-blue/8 px-4 py-3.5"
          >
            <p className="text-meta text-navy">{message}</p>
            <p className="mt-2 text-meta text-fg/80">
              If it keeps failing, email it to{" "}
              <TextLink href={contact.email.href} arrow={false} muted>
                {contact.email.display}
              </TextLink>{" "}
              and I&rsquo;ll add it myself.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" arrow="e" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Feedback"}
        </Button>
        <p className="max-w-[36ch] font-accent text-meta text-fg/75">
          Reviews are read and checked before they appear. Nothing is published automatically.
        </p>
      </div>

      {/* Politely announces the in-flight state to assistive technology. */}
      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your feedback." : ""}
      </p>
    </form>
  );
}

/**
 * Star rating input.
 *
 * A radio group rather than buttons, so it arrives as one labelled control with
 * native arrow-key behaviour and a single tab stop. The stars are decorative;
 * every option carries its value as text for assistive technology.
 */
function StarPicker({
  value,
  onChange,
  invalid,
}: {
  value: number;
  onChange: (next: number) => void;
  invalid: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label="Rating out of five"
      aria-invalid={invalid}
      aria-describedby={invalid ? "rating-error" : undefined}
      className="flex flex-wrap items-center gap-4"
    >
      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            onMouseEnter={() => setHovered(star)}
            className="cursor-pointer rounded-sm p-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className="sr-only"
            />
            <span className="sr-only">
              {star} {star === 1 ? "star" : "stars"}
            </span>
            <svg
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden
              className={cn(
                "size-7 transition-colors duration-200",
                star <= shown ? "text-blue-solid" : "text-navy/20",
              )}
            >
              <path d="M6 0.75l1.62 3.3 3.63.53-2.63 2.57.62 3.62L6 9.06 2.76 10.77l.62-3.62L0.75 4.58l3.63-.53L6 0.75z" />
            </svg>
          </label>
        ))}
      </div>

      <span aria-hidden className="text-meta font-medium text-fg/80">
        {value ? `${value} of 5` : "Tap a star"}
      </span>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  required = false,
  optional = false,
  /** "span" for composite controls that label themselves, e.g. a radiogroup. */
  labelAs = "label",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  labelAs?: "label" | "span";
  children: React.ReactNode;
}) {
  const LabelTag = labelAs;

  return (
    <div className="flex flex-col gap-2">
      <LabelTag
        htmlFor={labelAs === "label" ? name : undefined}
        className="flex items-baseline gap-2 font-accent text-label uppercase tracking-[0.16em] text-navy/80"
      >
        {label}
        {/* blue-solid rather than blue: #4274D9 measures 4.44:1 on white,
            just under AA for a glyph this small. */}
        {required ? (
          <span className="text-blue-solid">
            <span aria-hidden>*</span>
            <span className="sr-only">required</span>
          </span>
        ) : null}
        {optional ? <span className="normal-case tracking-normal text-fg/70">optional</span> : null}
      </LabelTag>
      {children}
      {hint ? (
        <p id={`${name}-hint`} className="text-meta text-fg/75">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="text-[0.8125rem] font-medium text-blue-solid">
          {error}
        </p>
      ) : null}
    </div>
  );
}
