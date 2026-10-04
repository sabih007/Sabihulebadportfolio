import Link from "next/link";
import type { ReactNode } from "react";

import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/utils/cn";

/**
 * `primary`  — Royal Blue fill. Uses `blue-solid` (Royal Blue nudged toward
 *              navy) so white label text measures 5.64:1 rather than 4.44:1.
 * `contrast` — For navy surfaces: ice fill with navy text, 8.4:1.
 * `outline`  — Hairline in the current tone; fills with the accent on hover.
 */
type Variant = "primary" | "contrast" | "outline";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 sm:py-4";

const variants: Record<Variant, string> = {
  primary: "bg-blue-solid text-white hover:bg-navy",
  contrast: "bg-ice text-navy hover:bg-white",
  outline: "border border-line/25 text-fg hover:border-line/45 hover:bg-line/6",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Appends the arrow glyph. "ne" marks an outbound or new-surface action. */
  arrow?: "ne" | "e" | false;
};

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

export function ButtonLink({
  children,
  href,
  external = false,
  variant = "primary",
  className,
  arrow = false,
  onClick,
}: ButtonLinkProps) {
  const content = (
    <>
      <span className="relative">{children}</span>
      {arrow ? (
        <Arrow
          direction={arrow}
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
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
        rel="noopener noreferrer"
        data-cursor="arrow"
        onClick={onClick}
        className={cn(base, variants[variant], className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}

type ButtonProps = CommonProps & {
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  className,
  arrow = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        base,
        variants[variant],
        "disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
    >
      <span className="relative">{children}</span>
      {arrow ? (
        <Arrow
          direction={arrow}
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      ) : null}
    </button>
  );
}
