import type { ReactNode } from "react";

import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  eyebrow: string;
  /** One entry per rendered line. */
  lines: ReactNode[];
  lead?: ReactNode;
  /** Right-hand slot for metadata or an action. */
  aside?: ReactNode;
  className?: string;
  /** Case-study titles keep their brand casing (e.g. "BuySellOX"). */
  uppercase?: boolean;
};

/**
 * Shared hero band for the secondary pages. Lighter than the homepage hero on
 * purpose — no GSAP timeline, no composition — so inner pages stay fast.
 */
export function PageHeader({
  eyebrow,
  lines,
  lead,
  aside,
  className,
  uppercase = true,
}: PageHeaderProps) {
  return (
    <section
      data-tone="light"
      className={cn(
        "relative overflow-hidden bg-surface pt-[7.5rem] pb-16 text-fg sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="rule-grid pointer-events-none absolute inset-x-0 top-0 h-[80%] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden
        className="wash wash-cyan -top-56 right-[-10%] size-[42rem]"
      />

      <div className="shell relative">
        <Reveal distance={12}>
          <Label rule>{eyebrow}</Label>
        </Reveal>

        <Reveal delay={0.06}>
          <h1
            className={cn(
              "mt-8 text-headline font-bold text-navy text-balance-safe",
              uppercase && "uppercase",
            )}
          >
            {lines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>

        {lead || aside ? (
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            {lead ? (
              <Reveal delay={0.12}>
                <p className="max-w-[52ch] text-lead text-fg/85 text-pretty-safe">{lead}</p>
              </Reveal>
            ) : (
              <span />
            )}
            {aside ? <Reveal delay={0.18}>{aside}</Reveal> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
