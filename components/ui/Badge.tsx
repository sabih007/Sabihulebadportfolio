import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: "solid" | "outline" | "accent";
  /** Renders a small filled dot — meaning is always carried by the text too. */
  dot?: boolean;
};

const tones = {
  solid: "bg-navy text-ice",
  outline: "border border-line/20 text-fg/85",
  accent: "bg-cyan/25 text-fg",
} as const;

export function Badge({ children, className, tone = "outline", dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] leading-none",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", tone === "solid" ? "bg-cyan" : "bg-accent")}
        />
      ) : null}
      {children}
    </span>
  );
}

/** The "Built from Scratch" credibility marker used across all four projects. */
export function BuiltFromScratchBadge({ className }: { className?: string }) {
  return (
    <Badge tone="solid" dot className={cn("font-semibold", className)}>
      Built from Scratch
    </Badge>
  );
}
