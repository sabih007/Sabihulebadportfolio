"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Logo } from "@/components/brand/Logo";
import { Arrow } from "@/components/ui/Arrow";
import { navigation, socialLinks } from "@/data/site";
import { editorialEase } from "@/lib/animations/motion";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-screen mobile navigation, set on deep navy so opening it reads as a
 * deliberate shift rather than a white overlay on a white page.
 *
 * Accessibility: rendered as a modal dialog, labelled, focus moved to the panel
 * on open and returned to the trigger on close, Escape closes, Tab is trapped
 * inside the panel, and background scrolling is locked while it is open.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const social = socialLinks();

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const start = items[0];
      const end = items[items.length - 1];

      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault();
        start.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          data-tone="dark"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="fixed inset-0 z-[80] text-fg lg:hidden"
        >
          <div className="absolute inset-0 bg-navy" />
          <div
            aria-hidden
            className="wash wash-blue-strong -top-24 -right-20 size-96"
          />

          <div
            ref={panelRef}
            className="relative flex h-full flex-col overflow-y-auto overscroll-contain"
          >
            <div className="shell flex h-[4.5rem] shrink-0 items-center justify-between">
              <Link href="/" onClick={onClose} aria-label="Sabih Ul Ebad — home">
                <Logo tone="dark" size={32} responsive={false} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line/20 text-ice transition-colors duration-300 hover:border-line/45"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-4">
                  <path
                    d="M3.5 3.5l9 9m0-9l-9 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav aria-label="Primary" className="shell flex flex-1 flex-col justify-center py-10">
              <ul className="flex flex-col">
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: reduceMotion ? 0 : 0.06 + index * 0.05,
                      ease: editorialEase,
                    }}
                    className="border-b border-line/14 last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-baseline justify-between gap-6 py-5 text-[2rem] font-semibold tracking-[-0.025em] text-ice/95 transition-colors duration-300 hover:text-ice"
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden
                        className="font-accent text-label text-cyan/80 transition-colors duration-300 group-hover:text-cyan"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shell shrink-0 pb-10">
              <Link
                href="/contact"
                onClick={onClose}
                className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-ice px-6 py-4 text-[0.9375rem] font-semibold text-navy"
              >
                Let&rsquo;s Talk
                <Arrow className="transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>

              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                {social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-meta font-medium tracking-[0.04em] text-ice/85 transition-colors duration-300 hover:text-cyan"
                    >
                      {item.label}
                      {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
