"use client";

import { motion, useReducedMotion } from "motion/react";

import { ProjectCover } from "@/components/work/ProjectCover";
import { featuredProjects } from "@/data/projects";
import { editorialEase } from "@/lib/animations/motion";

/**
 * Editorial hero composition: two rotated project fragments and a thin
 * specimen rule, arranged off-axis so the headline keeps the stage.
 *
 * On the light hero the leading card is navy — the first appearance of the dark
 * end of the palette, which anchors the composition and previews the rhythm of
 * the page. The leading card paints above the one behind it, so neither title
 * is ever covered.
 *
 * Decorative by intent: the same projects appear as real, linked cards further
 * down, so this is `aria-hidden` and carries no unique information. Small
 * screens do not render it at all (see Hero).
 */
export function HeroComposition() {
  const reduceMotion = useReducedMotion();
  const [first, second] = featuredProjects;

  const float = (delay: number) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -9, 0] },
          transition: { duration: 7.5, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div aria-hidden className="relative h-full w-full">
      <div className="wash wash-blue top-[6%] -right-[14%] size-[26rem]" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 32, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -3.2 }}
        transition={{ duration: 1.1, delay: 0.5, ease: editorialEase }}
        className="absolute top-[8%] right-[6%] z-10 w-[60%] max-w-[18.5rem] origin-bottom"
      >
        <motion.div {...float(0)} className="aspect-[4/3]">
          <ProjectCover
            project={first}
            tone="navy"
            variant="mini"
            className="h-full w-full shadow-[0_28px_60px_-30px_rgba(41,54,129,0.65)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 4.5 }}
        transition={{ duration: 1.1, delay: 0.68, ease: editorialEase }}
        className="absolute bottom-[6%] left-[4%] w-[56%] max-w-[17rem] origin-top"
      >
        <motion.div {...float(1.4)} className="aspect-[4/3]">
          <ProjectCover
            project={second}
            tone="ice"
            variant="mini"
            className="h-full w-full shadow-[0_24px_50px_-28px_rgba(41,54,129,0.45)]"
          />
        </motion.div>
      </motion.div>

      {/* Specimen rule: a small typographic detail rather than an abstract blob.
          Sits top-left, the one region both cards leave clear. */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.95 }}
        className="absolute top-0 right-0 flex items-center gap-3"
      >
        <span className="gradient-rule h-px w-16 rounded-full" />
        <span className="font-accent text-[0.5625rem] uppercase tracking-[0.22em] text-navy/55">
          Selected builds
        </span>
      </motion.div>
    </div>
  );
}
