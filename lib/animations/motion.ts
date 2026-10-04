import type { Transition, Variants } from "motion/react";

/** One easing curve and one duration family across the whole site. */
export const editorialEase = [0.22, 1, 0.36, 1] as const;

export const baseTransition: Transition = {
  duration: 0.7,
  ease: editorialEase,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: baseTransition },
};

/** Parent that staggers its direct children's `hidden` → `shown` transition. */
export function staggerParent(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    shown: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Shared viewport config so sections all trigger at the same point. */
export const inViewOnce = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
