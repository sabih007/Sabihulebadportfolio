import type { ReactNode } from "react";

import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  /** Eyebrow label. */
  eyebrow?: string;
  /** Each entry is one rendered line of the heading. */
  lines: ReactNode[];
  /** Supporting paragraph. */
  lead?: ReactNode;
  /** Right-hand slot — typically a link or small meta block. */
  aside?: ReactNode;
  id?: string;
  as?: "h2" | "h1" | "h3";
  className?: string;
  align?: "start" | "between";
};

/**
 * The site's one heading pattern: eyebrow, oversized multi-line headline,
 * optional lead, optional aside. Reused by every section so the typographic
 * rhythm never drifts.
 */
export function SectionHeading({
  eyebrow,
  lines,
  lead,
  aside,
  id,
  as: Tag = "h2",
  className,
  align = "between",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-10",
        // A 12-column grid rather than flex + ch widths: `ch` on a wrapper
        // resolves against the wrapper's 16px font size, not the display size
        // inside it, which collapses oversized headings into narrow stacks.
        align === "between" && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-12",
        className,
      )}
    >
      <div className={cn(align === "between" && "lg:col-span-8")}>
        {eyebrow ? (
          <Reveal distance={12}>
            <Label rule className="mb-6 sm:mb-8">
              {eyebrow}
            </Label>
          </Reveal>
        ) : null}

        <Reveal delay={0.05}>
          <Tag
            id={id}
            className="text-headline font-semibold text-fg text-balance-safe"
          >
            {lines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </Tag>
        </Reveal>
      </div>

      {lead || aside ? (
        <div
          className={cn(
            "flex max-w-xl flex-col gap-6",
            align === "between" && "lg:col-span-4 lg:pb-2",
          )}
        >
          {lead ? (
            <Reveal delay={0.12}>
              <p className="max-w-[46ch] text-lead text-fg/70 text-pretty-safe">{lead}</p>
            </Reveal>
          ) : null}
          {aside ? <Reveal delay={0.18}>{aside}</Reveal> : null}
        </div>
      ) : null}
    </div>
  );
}
