"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DisplayTextProps = {
  /** One entry per visual line. Real text, server-rendered — not split at runtime. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Seconds before the first line starts. */
  delay?: number;
  /** Fires after the last line lands — used to chain the hero's supporting copy. */
  onComplete?: () => void;
};

/**
 * Line-by-line clipped headline reveal.
 *
 * This is the one place GSAP earns its weight: a single timeline drives the
 * stagger, the per-line overshoot and the completion callback with frame
 * accuracy that chained CSS transitions cannot match cleanly.
 *
 * The pre-animation state is set by the `.line-mask` CSS class, so the
 * reduced-motion media query and the <noscript> fallback below can override it
 * without JavaScript ever running.
 */
export function DisplayText({
  lines,
  as: Tag = "h1",
  className,
  lineClassName,
  delay = 0.1,
  onComplete,
}: DisplayTextProps) {
  const root = useRef<HTMLElement>(null);
  const completeRef = useRef(onComplete);

  // Kept in a ref so an inline callback at the call site cannot restart the
  // timeline on every parent render.
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const targets = node.querySelectorAll<HTMLElement>(".line-mask > span");
    if (targets.length === 0) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(targets, { clearProps: "all", y: 0, opacity: 1 });
      completeRef.current?.();
      return;
    }

    const context = gsap.context(() => {
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.085,
        delay,
        onComplete: () => completeRef.current?.(),
      });
    }, node);

    return () => context.revert();
  }, [delay]);

  return (
    <>
      <Tag ref={root} className={cn(className)}>
        {lines.map((line, index) => (
          <span key={index} className={cn("line-mask", lineClassName)}>
            <span>{line}</span>
          </span>
        ))}
      </Tag>
      <noscript>
        {/* Without JavaScript the masks never animate, so reveal them up front. */}
        <style>{`.line-mask > span{transform:none!important;opacity:1!important}`}</style>
      </noscript>
    </>
  );
}
