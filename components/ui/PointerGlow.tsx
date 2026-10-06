"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * A soft brand-coloured light that follows the pointer across its parent
 * section.
 *
 * Written straight to the DOM through a ref and a single rAF, never through
 * React state: this updates on every pointer move, and re-rendering a section
 * at that rate to move one gradient would be wasteful. Only `transform` and
 * `opacity` are touched, so it stays on the compositor and never triggers
 * layout.
 *
 * Deliberately restrained — a wash, not a torch. At rest it is invisible and
 * the section looks exactly as it did; it fades in when the pointer enters and
 * back out when it leaves, which is the "minimal at rest, impressive in
 * motion" rule.
 *
 * Only mounts where there is a real pointer to follow, and never under
 * `prefers-reduced-motion`. Touch and reduced-motion users get the static
 * section, losing nothing — this carries no information.
 *
 * Positions itself against its parent element, so it must be rendered as a
 * direct child of the `relative` section it lights.
 */

type PointerGlowProps = {
  /** Wash variant and size — e.g. "wash-cyan-soft size-[34rem]". */
  className?: string;
};

export function PointerGlow({ className }: PointerGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = ref.current;
    const section = light?.parentElement;
    if (!light || !section) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      frame = 0;
      // Centred on the pointer; the element is sized by `className`.
      light.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      light.style.opacity = "1";
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      light.style.opacity = "0";
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "wash pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-700 ease-out",
        className,
      )}
    />
  );
}
