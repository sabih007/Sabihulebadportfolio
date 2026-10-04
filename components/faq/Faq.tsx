"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/data/faq";
import { editorialEase } from "@/lib/animations/motion";
import { cn } from "@/lib/utils/cn";

/**
 * FAQ accordion.
 *
 * Accessibility: every question is a real button carrying aria-expanded and
 * aria-controls; each answer is a region labelled by its question; the icon is
 * decorative. Multiple panels may be open at once, which is the less surprising
 * behaviour when someone is comparing two answers.
 */
export function Faq() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <Section id="faq" tone="light" aria-labelledby="faq-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            lines={["Questions?", "Let's clear", "things up."]}
            align="start"
          />
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-line/14">
            {faq.map((item, index) => {
              const expanded = open.includes(item.id);
              const triggerId = `faq-trigger-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <Reveal
                  as="li"
                  key={item.id}
                  delay={index * 0.04}
                  distance={14}
                  className="border-b border-line/14"
                >
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="group flex w-full items-start gap-5 py-6 text-left"
                    >
                      <span className="font-accent text-label tabular-nums text-accent/70 pt-1.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[1.0625rem] font-medium text-navy transition-colors duration-300 group-hover:text-blue sm:text-[1.1875rem]">
                        {item.question}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line/18 transition-colors duration-500 group-hover:border-blue/45",
                          expanded && "border-blue/50 bg-blue/10",
                        )}
                      >
                        <span className="absolute h-px w-3 bg-navy/80" />
                        <span
                          className={cn(
                            "absolute h-3 w-px bg-navy/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            expanded && "scale-y-0",
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.45, ease: editorialEase }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pr-10 pb-7 pl-10">
                          {item.answer.map((paragraph, answerIndex) => (
                            <p
                              key={answerIndex}
                              className="max-w-[58ch] text-body text-fg/70 text-pretty-safe"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
