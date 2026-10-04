import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";

type NarrativeBlock = {
  index: string;
  heading: string;
  /** Optional one-line framing shown under the heading. */
  note?: string;
  body: ReactNode;
};

/**
 * The narrative spine of a case study: Challenge → Approach → Design →
 * Development. Rendered as an editorial two-column list so the reasoning reads
 * like an article rather than a bulleted deck.
 */
export function CaseStudyNarrative({ blocks }: { blocks: NarrativeBlock[] }) {
  return (
    <ol className="border-t border-line/14">
      {blocks.map((block, index) => (
        <Reveal
          as="li"
          key={block.index}
          delay={index * 0.04}
          distance={16}
          className="grid gap-5 border-b border-line/14 py-10 sm:py-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-4">
            <div className="flex items-baseline gap-4">
              <span className="font-accent text-label uppercase tracking-[0.2em] text-accent">
                {block.index}
              </span>
              <h2 className="text-subtitle font-semibold text-navy sm:text-[1.625rem]">
                {block.heading}
              </h2>
            </div>
            {block.note ? (
              <p className="mt-3 max-w-[30ch] font-accent text-meta text-fg/75 lg:ml-[2.75rem]">
                {block.note}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-8">
            <div className="max-w-[64ch] space-y-5 text-lead text-fg/90 text-pretty-safe">
              {block.body}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
