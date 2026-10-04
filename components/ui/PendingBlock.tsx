import { cn } from "@/lib/utils/cn";

type PendingBlockProps = {
  /** What is missing, in plain language. */
  title: string;
  /** Why it is missing and what will replace it. */
  body: string;
  className?: string;
};

/**
 * Explicit placeholder for information that has not been verified.
 *
 * The specification forbids inventing results, metrics, feature inventories and
 * employment history, so where that content is required the site says so
 * instead of filling the gap with plausible fiction. Each usage has a matching
 * TODO in the data layer; supplying the data removes the block automatically.
 */
export function PendingBlock({ title, body, className }: PendingBlockProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-line/25 bg-line/4 p-6 sm:p-8",
        className,
      )}
    >
      <p className="font-accent text-label uppercase tracking-[0.18em] text-fg/70">
        To be confirmed
      </p>
      <p className="mt-4 text-subtitle font-medium text-fg/95">{title}</p>
      <p className="mt-3 max-w-[52ch] text-body text-fg/80">{body}</p>
    </div>
  );
}
