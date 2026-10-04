"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import type { FeedbackRecord, FeedbackStatus } from "@/lib/feedback/store";
import { cn } from "@/lib/utils/cn";

type Action = "approve" | "reject" | "feature" | "unfeature" | "delete";

const statusTone: Record<FeedbackStatus, string> = {
  pending: "bg-blue/12 text-navy border-blue/30",
  approved: "bg-cyan/25 text-navy border-cyan/50",
  rejected: "bg-navy/8 text-fg/80 border-navy/15",
};

const statusLabel: Record<FeedbackStatus, string> = {
  pending: "Waiting for you",
  approved: "Live on the site",
  rejected: "Hidden",
};

/**
 * The moderation queue.
 *
 * Shows the client's email, which the public pages never receive — this screen
 * is behind the password gate for exactly that reason.
 *
 * "Hidden" is a reversible state, not a delete: the text is kept so a decision
 * can be undone. Delete is permanent and confined to spam, so it asks first.
 */
export function FeedbackQueue({ entries }: { entries: FeedbackRecord[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeedbackStatus | "all">("all");

  const run = async (id: string, action: Action) => {
    if (busyId) return;

    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this review permanently? Use 'Hide' instead if you only want it off the site.",
      );
      if (!confirmed) return;
    }

    setBusyId(id);
    setError(null);

    try {
      const response = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && result.ok) {
        router.refresh();
        return;
      }

      setError(result.message ?? "That change could not be saved.");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusyId(null);
    }
  };

  const shown = filter === "all" ? entries : entries.filter((entry) => entry.status === filter);

  const counts = {
    all: entries.length,
    pending: entries.filter((entry) => entry.status === "pending").length,
    approved: entries.filter((entry) => entry.status === "approved").length,
    rejected: entries.filter((entry) => entry.status === "rejected").length,
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-panel border border-line/12 bg-raised p-8 text-center sm:p-12">
        <p className="text-[1.0625rem] font-medium text-navy">Nothing here yet.</p>
        <p className="mx-auto mt-3 max-w-[48ch] text-meta text-fg/80">
          Reviews submitted through <code className="text-accent">/feedback</code> land here for
          you to approve. Send the link to a client you&rsquo;ve finished with.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Filter by status"
        className="flex flex-wrap items-center gap-2"
      >
        {(["all", "pending", "approved", "rejected"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.8125rem] font-medium capitalize transition-colors duration-300",
              filter === key
                ? "border-blue-solid bg-blue-solid text-white"
                : "border-line/20 text-fg/80 hover:border-blue/40",
            )}
          >
            {key} <span className="tabular-nums opacity-80">({counts[key]})</span>
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-card border border-blue/30 bg-blue/8 px-4 py-3 text-meta text-navy">
          {error}
        </p>
      ) : null}

      {shown.length === 0 ? (
        <p className="rounded-card border border-line/12 bg-raised px-5 py-6 text-meta text-fg/80">
          Nothing with that status.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {shown.map((entry) => (
            <li
              key={entry.id}
              className="rounded-panel border border-line/12 bg-raised p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Rating value={entry.rating} />
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em]",
                        statusTone[entry.status],
                      )}
                    >
                      {statusLabel[entry.status]}
                    </span>
                    {entry.featured ? <Badge tone="solid">Featured</Badge> : null}
                    {!entry.consentToPublish ? (
                      <span className="rounded-full border border-navy/20 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-fg/80">
                        Private — no consent
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-[1.0625rem] font-semibold text-navy">
                    {entry.name}
                    {entry.role || entry.company ? (
                      <span className="font-normal text-fg/80">
                        {" — "}
                        {[entry.role, entry.company].filter(Boolean).join(", ")}
                      </span>
                    ) : null}
                  </p>

                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-accent text-[0.75rem] text-fg/80">
                    <a href={`mailto:${entry.email}`} className="text-accent underline-offset-4 hover:underline">
                      {entry.email}
                    </a>
                    {entry.website ? (
                      <a
                        href={entry.website}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        {entry.website}
                      </a>
                    ) : null}
                    {entry.projectType ? <span>{entry.projectType}</span> : null}
                    <time dateTime={entry.submittedAt} className="tabular-nums">
                      {new Date(entry.submittedAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </p>
                </div>
              </div>

              <blockquote className="mt-5 border-l-2 border-blue/30 pl-5">
                {entry.headline ? (
                  <p className="text-[1.0625rem] font-semibold text-navy">{entry.headline}</p>
                ) : null}
                <p
                  className={cn(
                    "whitespace-pre-line text-[0.9375rem] leading-[1.65] text-fg/85",
                    entry.headline && "mt-2",
                  )}
                >
                  {entry.quote}
                </p>
              </blockquote>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line/12 pt-5">
                {entry.status !== "approved" ? (
                  <ActionButton
                    onClick={() => run(entry.id, "approve")}
                    disabled={busyId === entry.id || !entry.consentToPublish}
                    title={
                      entry.consentToPublish
                        ? undefined
                        : "This client did not consent to publication."
                    }
                    variant="primary"
                  >
                    Publish
                  </ActionButton>
                ) : null}

                {entry.status === "approved" ? (
                  <ActionButton
                    onClick={() => run(entry.id, entry.featured ? "unfeature" : "feature")}
                    disabled={busyId === entry.id}
                  >
                    {entry.featured ? "Unfeature" : "Feature"}
                  </ActionButton>
                ) : null}

                {entry.status !== "rejected" ? (
                  <ActionButton
                    onClick={() => run(entry.id, "reject")}
                    disabled={busyId === entry.id}
                  >
                    Hide
                  </ActionButton>
                ) : null}

                <ActionButton
                  onClick={() => run(entry.id, "delete")}
                  disabled={busyId === entry.id}
                  variant="danger"
                >
                  Delete
                </ActionButton>

                {busyId === entry.id ? (
                  <span aria-live="polite" className="text-meta text-fg/80">
                    Saving…
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  title,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  variant?: "default" | "primary" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-blue-solid text-white hover:bg-navy",
        variant === "danger" &&
          "border border-navy/20 text-fg/80 hover:border-blue-solid hover:text-blue-solid",
        variant === "default" && "border border-line/20 text-fg/85 hover:border-blue/45",
      )}
    >
      {children}
    </button>
  );
}
