import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type LabelProps = {
  children: ReactNode;
  className?: string;
  /** Prefixes a short brand-gradient rule, used for section eyebrows. */
  rule?: boolean;
};

/**
 * Small metadata label. Set in Neral Soft — one of the accent typeface's few
 * jobs on the site, where its softer character separates metadata from the
 * Matimo-led hierarchy. The leading rule carries the brand gradient, which is
 * one of the places the spec reserves it for.
 */
export function Label({ children, className, rule = false }: LabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-accent text-label font-normal tracking-[0.18em] uppercase text-fg/60",
        className,
      )}
    >
      {rule ? <span aria-hidden className="gradient-rule h-px w-8 shrink-0 rounded-full" /> : null}
      {children}
    </span>
  );
}
