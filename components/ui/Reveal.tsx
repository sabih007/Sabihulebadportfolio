"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { editorialEase, inViewOnce } from "@/lib/animations/motion";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Travel distance in px; 0 for a pure fade. */
  distance?: number;
  as?: "div" | "span" | "li" | "section" | "article" | "figure";
};

/**
 * Scroll-triggered entrance. Respects `prefers-reduced-motion` by rendering the
 * final state immediately rather than disabling content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 22,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.75, delay, ease: editorialEase }}
    >
      {children}
    </Component>
  );
}
