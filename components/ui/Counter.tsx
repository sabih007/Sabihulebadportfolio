"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Counts a statistic up once, the first time it is scrolled into view.
 *
 * Takes the value as it is written in the data — "100%", "8+", "20+",
 * "Top Rated" — and animates only the number inside it, keeping whatever
 * prefix and suffix came with it. Anything without a number ("Top Rated")
 * renders as-is rather than being forced into a shape it does not have, so
 * the credential row can mix figures and words without the data layer having
 * to describe which is which.
 *
 * Accessibility: the animating text is `aria-hidden` and the true value is
 * exposed separately, so a screen reader is never read a half-counted figure.
 * Under `prefers-reduced-motion`, and with JavaScript off, the final value is
 * what renders — the count is an enhancement, never the source of the number.
 */

/**
 * Before hydration there is no count to show, so the server renders the final
 * figure. Zeroing it in a layout effect means that swap happens before the
 * browser paints, rather than as a visible jump from "100%" back to "0%".
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Splits "100%" into "", 100, "%". Returns null when there is no number. */
function parse(value: string): { prefix: string; target: number; suffix: string } | null {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
}

/** Decelerating curve — fast first, settling onto the final figure. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type CounterProps = {
  value: string;
  /** Milliseconds for the full count. */
  duration?: number;
  className?: string;
};

export function Counter({ value, duration = 1400, className }: CounterProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // `once` — a statistic that re-counts every time it scrolls past is a
  // distraction, not a flourish.
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const parsed = parse(value);
  // Held as a primitive so the effect below can depend on it honestly —
  // `parsed` is a fresh object every render and would restart the count.
  const target = parsed?.target ?? null;
  const animatable = target !== null && !reduceMotion;

  /** `null` means "not counting" — render the real figure. */
  const [shown, setShown] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (animatable) setShown(0);
  }, [animatable]);

  useEffect(() => {
    if (target === null || !animatable || !inView) return;

    const start = performance.now();

    let frame = requestAnimationFrame(function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(target * easeOut(progress)));
      if (progress < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [target, animatable, inView, duration]);

  // No number in this value — render it as the words it is.
  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span aria-hidden>
        {parsed.prefix}
        {shown === null ? parsed.target : shown}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
