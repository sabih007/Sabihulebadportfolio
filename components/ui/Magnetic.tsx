"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Maximum travel in px. Kept small — the effect should be felt, not seen. */
  strength?: number;
  /**
   * Distance in px from the button's centre at which it starts reaching for
   * the pointer. Unset, the button only answers a pointer already over it;
   * set, it leans toward one approaching from across the section, which is
   * what makes a closing CTA feel like it wants to be pressed.
   */
  radius?: number;
};

/**
 * Magnetic wrapper for primary CTAs. Pointer-only: it binds nothing on touch
 * devices (no hover) and is skipped entirely under reduced-motion, so the
 * button keeps its exact hit area.
 */
export function Magnetic({ children, className, strength = 10, radius }: MagneticProps) {
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

  /**
   * Distance-based pull.
   *
   * Listens on the window so the button can answer a pointer that has not
   * reached it yet, and falls off linearly to nothing at `radius` — so the
   * button is still at rest everywhere outside it, and the pull builds as the
   * pointer closes rather than snapping on. The spring above does the
   * smoothing, so this only sets a target.
   *
   * Skipped entirely without `radius`, on touch, and under reduced motion.
   */
  useEffect(() => {
    if (!radius || reduceMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        rawX.set(0);
        rawY.set(0);
        return;
      }

      // 1 at the centre, 0 at the edge of the radius.
      const pull = 1 - distance / radius;
      rawX.set((dx / radius) * strength * pull * 2);
      rawY.set((dy / radius) * strength * pull * 2);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [radius, reduceMotion, rawX, rawY, strength]);

  if (reduceMotion) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={radius ? undefined : handleMove}
      onPointerLeave={radius ? undefined : reset}
      onBlur={reset}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
