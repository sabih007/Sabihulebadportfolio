"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import type { ExperienceEntry } from "@/data/experience";
import { editorialEase } from "@/lib/animations/motion";
import { cn } from "@/lib/utils/cn";

type TimelineProps = {
  entries: ExperienceEntry[];
};

/**
 * Interactive experience timeline.
 *
 * Data-driven and currently unused on the live site because no verified
 * employment history has been supplied (see data/experience.ts). Adding entries
 * there renders this component in place of the pending panel — no markup
 * changes needed.
 *
 * Accessibility: each row is a real <button> with aria-expanded and
 * aria-controls, the panel is labelled by its trigger, and the chevron is
 * decorative because the state is already announced.
 */
export function Timeline({ entries }: TimelineProps) {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  return (
    <ul className="border-t border-line/16">
      {entries.map((entry) => {
        const open = openId === entry.id;
        const triggerId = `timeline-trigger-${entry.id}`;
        const panelId = `timeline-panel-${entry.id}`;

        return (
          <li key={entry.id} className="border-b border-line/14">
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : entry.id)}
                className="group flex w-full items-start gap-5 py-6 text-left sm:gap-10"
              >
                <span className="font-accent text-meta tabular-nums text-accent sm:w-36 sm:shrink-0">
                  {entry.range}
                </span>

                <span className="flex-1">
                  <span className="block text-subtitle font-semibold text-fg transition-colors duration-300">
                    {entry.role}
                  </span>
                  <span className="mt-1 block text-meta text-fg/80">
                    {entry.organisation}
                    {entry.locationType ? (
                      <>
                        <span aria-hidden> · </span>
                        {entry.locationType}
                      </>
                    ) : null}
                  </span>
                </span>

                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/20 text-fg/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-line/45 group-hover:text-fg",
                    open && "rotate-180 border-accent/60 bg-accent/15 text-fg",
                  )}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                    <path
                      d="M4 6.5 8 10.5l4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: editorialEase }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 sm:pl-[11.5rem]">
                    <p className="max-w-[60ch] text-body text-fg/90">{entry.summary}</p>

                    {entry.detail?.map((paragraph, index) => (
                      <p key={index} className="mt-4 max-w-[60ch] text-body text-fg/80">
                        {paragraph}
                      </p>
                    ))}

                    {entry.technologies?.length ? (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {entry.technologies.map((tech) => (
                          <li key={tech}>
                            <span className="inline-flex rounded-full border border-line/18 px-3 py-1.5 text-[0.75rem] font-medium text-fg/90">
                              {tech}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
