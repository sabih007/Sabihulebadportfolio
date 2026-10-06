"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Teaches Motion to honour `prefers-reduced-motion` by itself.
 *
 * The alternative — asking `useReducedMotion()` in a component and branching
 * the JSX on the answer — divides the render between server and client: the
 * server has no media query and renders the animated variant, the browser
 * reads the real preference and renders the static one, and hydration fails
 * on the mismatched style attribute. That is exactly the error this fixes.
 *
 * `reducedMotion="user"` moves the decision inside Motion, which applies it
 * when the animation runs rather than when the tree is built. The server and
 * the client therefore render identical markup, and a reduced-motion visitor
 * still gets no movement.
 *
 * Children are passed through as a prop, so everything below stays a server
 * component — only this wrapper ships to the browser.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
