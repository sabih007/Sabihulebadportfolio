"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { budgetRanges, projectTypes } from "@/data/services";
import { links } from "@/data/site";
import { contactSchema } from "@/lib/contact/schema";
import type { ContactFieldErrors } from "@/lib/contact/schema";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-card border bg-white px-4 py-3.5 text-[0.9375rem] text-navy placeholder:text-navy/35 transition-colors duration-300 focus:outline-none focus-visible:border-blue";

/**
 * Inquiry form.
 *
 * Validation runs on the client for fast feedback and again on the server,
 * which is the authority. Spam is handled without a third-party script: a hidden
 * honeypot field plus the time the form was open, both checked server-side.
 *
 * Until email delivery is configured the API returns `not_configured` and this
 * form says so plainly instead of showing a false success — see
 * app/api/contact/route.ts.
 */
export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
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
      company: String(form.get("company") ?? ""),
      projectType: String(form.get("projectType") ?? ""),
      budget: String(form.get("budget") ?? ""),
      message: String(form.get("message") ?? ""),
      honeypot: String(form.get("website") ?? ""),
      elapsedMs: Date.now() - openedAt.current,
    };

    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      const next: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof ContactFieldErrors] = issue.message;
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: ContactFieldErrors;
      };

      if (response.ok && result.ok) {
        setStatus("success");
        setMessage(null);
        formRef.current?.reset();
        openedAt.current = Date.now();
        return;
      }

      setStatus("error");
      setErrors(result.fieldErrors ?? {});
      setMessage(
        result.message ?? "That didn't go through. Please try again in a moment.",
      );
    } catch {
      setStatus("error");
      setMessage(
        "The request could not be sent — check your connection and try again.",
      );
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
          Message sent
        </p>
        <h3 className="mt-5 text-title font-semibold text-navy">Thanks — it&rsquo;s through.</h3>
        <p className="mt-4 max-w-[46ch] text-body text-fg/75">
          I read every inquiry personally and will come back to you with questions or next
          steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 text-[0.9375rem] font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-300 hover:text-navy"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} required>
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

        <Field label="Email" name="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(fieldBase, errors.email ? "border-blue/70" : "border-navy/15")}
          />
        </Field>

        <Field label="Company / Brand" name="company" error={errors.company} optional>
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

        <Field label="Project Type" name="projectType" error={errors.projectType} required>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
            className={cn(
              fieldBase,
              "appearance-none bg-[length:0.75rem] bg-[right_1rem_center] bg-no-repeat pr-10",
              errors.projectType ? "border-blue/70" : "border-navy/15",
            )}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%23293681' stroke-opacity='0.6' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Select one
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-white text-navy">
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Budget Range" name="budget" error={errors.budget} optional>
        <select
          id="budget"
          name="budget"
          defaultValue=""
          className={cn(
            fieldBase,
            "appearance-none bg-[length:0.75rem] bg-[right_1rem_center] bg-no-repeat pr-10 border-navy/15",
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%23293681' stroke-opacity='0.6' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="">Prefer not to say</option>
          {budgetRanges.map((range) => (
            <option key={range} value={range} className="bg-white text-navy">
              {range}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Project Description" name="message" error={errors.message} required>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="What are you building, who is it for, and what does success look like?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            fieldBase,
            "resize-y",
            errors.message ? "border-blue/70" : "border-navy/15",
          )}
        />
      </Field>

      {/* Honeypot: visually and programmatically hidden, never focusable. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
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
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-meta text-fg/70">
              <TextLink href={links.linkedin} external muted>
                LinkedIn
              </TextLink>
              <TextLink href={links.upwork} external muted>
                Upwork
              </TextLink>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" arrow="ne" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Inquiry"}
        </Button>
        <p className="max-w-[34ch] font-accent text-meta text-fg/60">
          Your details are used only to reply to this inquiry.
        </p>
      </div>

      {/* Politely announces the in-flight state to assistive technology. */}
      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your inquiry." : ""}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required = false,
  optional = false,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="flex items-baseline gap-2 font-accent text-label uppercase tracking-[0.16em] text-navy/70"
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
        {optional ? <span className="normal-case tracking-normal text-fg/50">optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-[0.8125rem] font-medium text-blue-solid">
          {error}
        </p>
      ) : null}
    </div>
  );
}
