"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useRef } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Maximum travel in px. Kept small — the effect should be felt, not seen. */
  strength?: number;
};

/**
 * Magnetic wrapper for primary CTAs. Pointer-only: it binds nothing on touch
 * devices (no hover) and is skipped entirely under reduced-motion, so the
 * button keeps its exact hit area.
 */
export function Magnetic({ children, className, strength = 10 }: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.4 });

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (event.pointerType !== "mouse") return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      rawX.set(Math.max(-1, Math.min(1, offsetX)) * strength);
      rawY.set(Math.max(-1, Math.min(1, offsetY)) * strength);
    },
    [rawX, rawY, strength],
  );

  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  if (reduceMotion) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
