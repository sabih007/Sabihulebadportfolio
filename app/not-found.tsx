import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      data-tone="light"
      className="relative overflow-hidden bg-surface pt-[9rem] pb-28 text-fg sm:pt-40 sm:pb-36"
    >
      <div
        aria-hidden
        className="rule-grid pointer-events-none absolute inset-x-0 top-0 h-2/3 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden
        className="wash wash-cyan-soft -top-40 left-1/2 size-[36rem] -translate-x-1/2"
      />

      <div className="shell relative">
        <Label rule>404</Label>
        <h1 className="mt-8 max-w-[20ch] text-headline font-bold text-navy uppercase text-balance-safe">
          This page doesn&rsquo;t <span className="gradient-text">exist.</span>
        </h1>
        <p className="mt-7 max-w-[46ch] text-lead text-fg/75">
          The link may be out of date, or the page may have moved. The work and the contact
          form are both a click away.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <Magnetic>
            <ButtonLink href="/" variant="primary" arrow="e">
              Back to home
            </ButtonLink>
          </Magnetic>
          <Magnetic strength={7}>
            <ButtonLink href="/work" variant="outline">
              View selected work
            </ButtonLink>
          </Magnetic>
        </div>

        <div className="mt-12 border-t border-line/12 pt-7">
          <TextLink href="/contact" arrow="e">
            Or get in touch
          </TextLink>
        </div>
      </div>
    </section>
  );
}
