"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type CursorMode = "default" | "view" | "arrow";
type CursorTone = "light" | "dark";

/** Deep Navy on light grounds, Ice on navy — so the ring is always visible. */
const PALETTE = {
  light: { ring: "rgba(41,54,129,0.55)", fill: "#3762C6", label: "#FFFFFF" },
  dark: { ring: "rgba(208,231,230,0.65)", fill: "#D0E7E6", label: "#293681" },
} as const;

/**
 * Subtle custom cursor.
 *
 * Rules it must never break:
 *  - The native pointer is never hidden, so usability is unaffected if this
 *    component fails to mount.
 *  - It only mounts where the pointer is fine and can hover, ruling out touch.
 *  - It is skipped under `prefers-reduced-motion`.
 *
 * Both the mode and the colour are read declaratively off the DOM under the
 * pointer: `data-cursor="view" | "arrow"` for the mode, and the nearest
 * `data-tone` ancestor for the palette, so sections opt in without registering
 * listeners of their own.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [tone, setTone] = useState<CursorTone>("light");

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 700, damping: 42, mass: 0.28 });
  const y = useSpring(rawY, { stiffness: 700, damping: 42, mass: 0.28 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(finePointer.matches && !reduced.matches);
    sync();

    finePointer.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      finePointer.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;

      const host = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = host?.dataset.cursor;
      setMode(next === "view" || next === "arrow" ? next : "default");

      const toned = target?.closest?.("[data-tone]") as HTMLElement | null;
      setTone(toned?.dataset.tone === "dark" ? "dark" : "light");
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const expanded = mode !== "default";
  const colours = PALETTE[tone];

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden lg:block"
    >
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          width: expanded ? 76 : 12,
          height: expanded ? 76 : 12,
          backgroundColor: mode === "view" ? colours.fill : "rgba(0,0,0,0)",
          borderColor: expanded ? "rgba(0,0,0,0)" : colours.ring,
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mode === "view" ? (
            <motion.span
              key="view"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              style={{ color: colours.label }}
              className="text-[0.625rem] font-semibold tracking-[0.2em] uppercase"
            >
              View
            </motion.span>
          ) : null}
          {mode === "arrow" ? (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              style={{ borderColor: colours.ring, color: colours.fill }}
              className="flex size-full items-center justify-center rounded-full border"
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-4">
                <path
                  d="M4.5 11.5 11.5 4.5M11.5 4.5H5.75M11.5 4.5v5.75"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
