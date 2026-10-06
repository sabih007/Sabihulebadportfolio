"use client";

import { useEffect, useRef } from "react";

/**
 * A 2px reading-progress rule across the top of the viewport.
 *
 * Written to the DOM imperatively rather than through React state: this
 * updates on every frame of a scroll, and routing it through a re-render
 * would re-run the component tree hundreds of times on the way down a case
 * study for a value nothing else reads.
 *
 * Only `transform` is animated, so the browser can keep it on the compositor
 * and it never triggers layout. The element is `aria-hidden` — it reports
 * nothing a scrollbar does not already tell assistive technology.
 *
 * `scaleX` needs no transition: it is already tied frame-for-frame to the
 * scroll position, so it moves exactly as smoothly as the scroll does. That
 * also means there is nothing here for `prefers-reduced-motion` to turn off —
 * the bar never animates on its own.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const { scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      // A page shorter than the viewport has no progress to report.
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;

      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      // Coalesce to one write per frame — scroll fires far more often.
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        ref={ref}
        className="gradient-rule h-full w-full origin-left scale-x-0 will-change-transform"
      />
    </div>
  );
}
