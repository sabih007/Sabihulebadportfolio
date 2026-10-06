"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

import { Icon } from "@/components/ui/IconBox";
import type { IconName } from "@/lib/icons";
import { editorialEase } from "@/lib/animations/motion";
import { cn } from "@/lib/utils/cn";

/**
 * The hero's floating "workspace": the stack and the credentials, as cards
 * suspended at different depths.
 *
 * Every card states something already true elsewhere on the page — the
 * technologies come from the expertise data, the figures from the verified
 * Upwork profile — so this is `aria-hidden` and carries no unique information.
 * Small screens do not render it at all (see Hero), which is why nothing here
 * needs a mobile layout.
 *
 * Interaction: the cluster parallaxes with the pointer, each card by its own
 * `depth`, which is what separates it from a flat illustration. The pointer is
 * tracked once on the container and written to CSS custom properties through a
 * single rAF; each card then positions itself from those variables in CSS.
 * That means one listener and one write per frame no matter how many cards
 * there are, and no React re-render at pointer rate.
 */

type Card = {
  label: string;
  icon?: IconName;
  /** Larger drifts further with the pointer — the illusion of depth. */
  depth: number;
  /** Position within the composition box. */
  className: string;
  /** The credential cards are set apart from the stack chips. */
  accent?: boolean;
};

const cards: Card[] = [
  { label: "Next.js", icon: "development", depth: 1.5, className: "top-[4%] left-[6%]" },
  { label: "TypeScript", depth: 2.6, className: "top-[20%] right-[4%]" },
  { label: "React", depth: 1, className: "top-[37%] left-[0%]" },
  {
    label: "8+ Years",
    icon: "experience",
    depth: 3.2,
    className: "top-[52%] right-[10%]",
    accent: true,
  },
  { label: "WordPress", icon: "cms", depth: 1.8, className: "top-[69%] left-[8%]" },
  { label: "UI/UX", icon: "design", depth: 2.2, className: "top-[86%] right-[20%]" },
  {
    label: "100% Job Success",
    icon: "jobSuccess",
    depth: 2.8,
    className: "top-[2%] right-[22%]",
    accent: true,
  },
];

export function HeroComposition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    let frame = 0;
    let offsetX = 0;
    let offsetY = 0;

    const render = () => {
      frame = 0;
      box.style.setProperty("--px", offsetX.toFixed(3));
      box.style.setProperty("--py", offsetY.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      // -0.5 … 0.5 from the centre of the composition, so the cluster leans
      // toward the pointer rather than chasing its absolute position.
      offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    const reset = () => {
      offsetX = 0;
      offsetY = 0;
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    // Listening on the window rather than the box: the cards should answer the
    // pointer as it approaches, not only once it is over them.
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-full w-full [--px:0] [--py:0]"
    >
      <div className="wash wash-blue top-[10%] -right-[16%] size-[26rem]" />

      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5 + index * 0.08, ease: editorialEase }}
          className={cn("absolute", card.className)}
        >
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-sm transition-transform duration-500 ease-out will-change-transform",
              card.accent
                ? "border-blue/25 bg-white/85 shadow-[0_16px_34px_-22px_rgba(41,54,129,0.55)]"
                : "border-line/12 bg-white/70 shadow-[0_12px_28px_-22px_rgba(41,54,129,0.45)]",
            )}
            style={{
              // Each card reads the shared pointer offset and scales it by its
              // own depth, so one rAF write moves the whole cluster.
              transform: `translate3d(calc(var(--px) * ${card.depth * 16}px), calc(var(--py) * ${card.depth * 12}px), 0)`,
            }}
          >
            {card.icon ? (
              <Icon
                name={card.icon}
                size={15}
                className={card.accent ? "text-accent" : "text-fg/60"}
              />
            ) : (
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  card.accent ? "bg-blue" : "bg-blue/45",
                )}
              />
            )}
            <span
              className={cn(
                "font-accent text-[0.8125rem] leading-none whitespace-nowrap",
                card.accent ? "font-semibold text-navy" : "text-fg/85",
              )}
            >
              {card.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Specimen rule: a typographic detail rather than an abstract blob. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.15 }}
        className="absolute bottom-0 left-0 flex items-center gap-3"
      >
        <span className="gradient-rule h-px w-16 rounded-full" />
        <span className="font-accent text-[0.5625rem] uppercase tracking-[0.22em] text-navy/70">
          The stack
        </span>
      </motion.div>
    </div>
  );
}
