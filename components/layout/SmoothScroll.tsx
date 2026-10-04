"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, loaded lazily and only when it is safe to use.
 *
 * Guards:
 *  - Skipped entirely under `prefers-reduced-motion`, and torn down if the user
 *    changes that preference mid-session.
 *  - Skipped on coarse pointers (touch), where native momentum scrolling is
 *    better than anything a library can emulate.
 *  - Never hijacks scroll direction, length or anchor behaviour; it only
 *    smooths the interpolation.
 *
 * The import is dynamic so Lenis stays out of the initial bundle.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    let destroy: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      if (reduced.matches || coarse.matches || destroy) return;

      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 1,
        smoothWheel: true,
      });

      let frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      destroy = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
        destroy = undefined;
      };
    };

    const stop = () => destroy?.();

    const sync = () => {
      if (reduced.matches || coarse.matches) stop();
      else void start();
    };

    sync();
    reduced.addEventListener("change", sync);
    coarse.addEventListener("change", sync);

    return () => {
      cancelled = true;
      reduced.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
