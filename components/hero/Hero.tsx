"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { HeroComposition } from "@/components/hero/HeroComposition";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayText } from "@/components/ui/DisplayText";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { PointerGlow } from "@/components/ui/PointerGlow";
import { heroTrust, site } from "@/data/site";
import { editorialEase } from "@/lib/animations/motion";

/**
 * Hero — composed on the light end of the palette.
 *
 * The page opens on near-white so the navy bands further down land as
 * deliberate moments rather than as the default, and so the approved logo sits
 * on the ground it was drawn for. The brand gradient appears exactly once here:
 * on "Experiences". It runs navy → royal blue only, because soft cyan on a
 * light ground measures 1.6:1 and would fail even large-text contrast.
 *
 * The headline reveals line by line through CSS masks driven by a single GSAP
 * timeline (see DisplayText); everything below waits for that timeline and then
 * fades up together, so the section resolves in two clear beats.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const [headlineDone, setHeadlineDone] = useState(false);
  const revealed = headlineDone || reduceMotion;

  // `initial` is unconditional so the server and the browser render the same
  // markup; only `animate` waits on the headline. MotionConfig (see
  // components/layout/MotionProvider) applies the reduced-motion preference
  // when the animation runs, which is the part the server cannot predict.
  const supporting = {
    initial: { opacity: 0, y: 18 },
    animate: revealed ? { opacity: 1, y: 0 } : undefined,
  };

  return (
    <section
      data-tone="light"
      className="relative overflow-hidden bg-surface pt-[7.5rem] pb-16 text-fg sm:pt-32 lg:pt-40 lg:pb-24"
    >
      {/* Editorial column grid, faded out towards the bottom. */}
      <div
        aria-hidden
        className="rule-grid pointer-events-none absolute inset-x-0 top-0 h-[70%] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      {/* Two very low-opacity brand washes — warmth, not a SaaS gradient. */}
      <div
        aria-hidden
        className="wash wash-cyan -top-56 right-[-12%] size-[46rem]"
      />
      <div
        aria-hidden
        className="wash wash-blue -top-72 left-[-10%] size-[38rem]"
      />
      <PointerGlow className="wash-cyan-soft size-[34rem]" />

      <div className="shell relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: editorialEase }}
          >
            <Label rule>Hi, I&rsquo;m Sabih Ul Ebad</Label>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: editorialEase }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line/14 bg-white/70 px-4 py-2 font-accent text-meta text-fg/85 backdrop-blur-sm"
          >
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-blue" />
              <span className="absolute inset-0 animate-ping rounded-full bg-blue/60 motion-reduce:hidden" />
            </span>
            {site.availability}
          </motion.p>
        </div>

        <DisplayText
          as="h1"
          delay={0.22}
          onComplete={() => setHeadlineDone(true)}
          className="mt-8 text-display font-bold text-navy uppercase sm:mt-10"
          lines={[
            "I Design & Build",
            <>
              Digital <span className="gradient-text">Experiences</span>
            </>,
            "That Deliver Results.",
          ]}
        />

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-20">
          <div>
            <motion.p
              {...supporting}
              transition={{ duration: 0.8, delay: 0.05, ease: editorialEase }}
              className="max-w-[48ch] text-lead text-fg/85 text-pretty-safe"
            >
              {site.shortBio}
            </motion.p>

            <motion.div
              {...supporting}
              transition={{ duration: 0.8, delay: 0.14, ease: editorialEase }}
              className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Magnetic>
                <ButtonLink href="/work" variant="primary" arrow="ne">
                  View My Work
                </ButtonLink>
              </Magnetic>
              <Magnetic strength={7}>
                <ButtonLink href="/contact" variant="outline">
                  Let&rsquo;s Work Together
                </ButtonLink>
              </Magnetic>
            </motion.div>

            <motion.ul
              {...supporting}
              transition={{ duration: 0.8, delay: 0.24, ease: editorialEase }}
              className="mt-12 flex flex-col gap-px border-t border-line/12 pt-6 sm:flex-row sm:flex-wrap sm:gap-x-9 sm:gap-y-3"
            >
              {heroTrust.map((item) => (
                <li key={item.label} className="py-1.5 sm:py-0">
                  {"href" in item && item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="arrow"
                      className="group inline-flex items-center gap-2 font-accent text-label uppercase tracking-[0.18em] text-fg/80 transition-colors duration-300 hover:text-navy"
                    >
                      <span
                        aria-hidden
                        className="size-1 rounded-full bg-blue/60 transition-colors duration-300 group-hover:bg-blue"
                      />
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-accent text-label uppercase tracking-[0.18em] text-fg/80">
                      <span aria-hidden className="size-1 rounded-full bg-blue/60" />
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* The composition is decorative; small screens get the headline and copy alone. */}
          <div className="relative hidden h-[22rem] lg:block lg:h-[25rem]">
            <HeroComposition />
          </div>
        </div>
      </div>
    </section>
  );
}
