import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type Tone = "light" | "ice" | "dark";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /**
   * Sets the surface, foreground, hairline and accent colours for everything
   * inside, via CSS custom properties. Components read `surface`/`fg`/`line`/
   * `accent` rather than naming a brand colour, so the light–dark composition
   * of the page is decided here and nowhere else.
   */
  tone?: Tone;
  className?: string;
  /** Inner wrapper class — pass null to opt out of the shell gutter. */
  innerClassName?: string | null;
  /** Hairline divider at the top. Only meaningful between same-tone sections. */
  divider?: boolean;
  /** Set when the section above shares this tone, to avoid double padding. */
  flush?: "top" | "bottom" | "both";
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const padding = {
  none: "",
  top: "pt-0",
  bottom: "pb-0",
  both: "py-0",
} as const;

/** Consistent vertical rhythm and tone for every band on the site. */
export function Section({
  children,
  id,
  tone = "light",
  className,
  innerClassName,
  divider = false,
  flush,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      {...aria}
      className={cn(
        "relative bg-surface text-fg",
        tone === "dark" && "grain-dark",
        "py-20 sm:py-24 lg:py-32",
        flush ? padding[flush] : null,
        divider && "border-t border-line/12",
        className,
      )}
    >
      {innerClassName === null ? (
        children
      ) : (
        <div className={cn("shell relative", innerClassName)}>{children}</div>
      )}
    </section>
  );
}
