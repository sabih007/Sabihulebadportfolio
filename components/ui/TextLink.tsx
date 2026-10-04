import Link from "next/link";
import type { ReactNode } from "react";

import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/utils/cn";

type TextLinkProps = {
  children: ReactNode;
  href: string;
  external?: boolean;
  className?: string;
  arrow?: "ne" | "e" | false;
  /** Tones the link down for footers and fine print. */
  muted?: boolean;
  /**
   * Set for any URL a visitor supplied — a client's site on their review, say.
   * Adds `ugc nofollow`, so the review form can never be used to pass link
   * equity to an arbitrary destination.
   */
  ugc?: boolean;
};

/**
 * Inline link with an underline that wipes in on hover. The underline is a
 * pseudo-free span so it animates without layout shift, and the label keeps a
 * visible focus ring from the global :focus-visible rule.
 */
export function TextLink({
  children,
  href,
  external = false,
  className,
  arrow = "ne",
  muted = false,
  ugc = false,
}: TextLinkProps) {
  const classes = cn(
    "group/link inline-flex items-baseline gap-1.5 text-[0.9375rem] font-medium transition-colors duration-300",
    muted ? "text-fg/80 hover:text-fg" : "text-accent hover:text-fg",
    className,
  );

  const inner = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
        />
      </span>
      {arrow ? (
        <Arrow
          direction={arrow}
          className="translate-y-[0.1em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-[0.05em]"
        />
      ) : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel={ugc ? "noopener noreferrer ugc nofollow" : "noopener noreferrer"}
        data-cursor="arrow"
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
