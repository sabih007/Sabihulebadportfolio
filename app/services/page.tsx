import type { Metadata } from "next";

import { FinalCta } from "@/components/contact/FinalCta";
import { Faq } from "@/components/faq/Faq";
import { PageHeader } from "@/components/layout/PageHeader";
import { Marquee } from "@/components/expertise/Marquee";
import { Expertise } from "@/components/expertise/Expertise";
import { Services } from "@/components/services/Services";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Web development, web design and UI/UX, eCommerce, and custom WordPress development by Sabih Ul Ebad — a Full-Stack Developer with 8+ years of experience.",
  path: "/services",
});

/** What an engagement includes regardless of which service it starts as. */
const engagement = [
  {
    index: "01",
    title: "Scope before estimate",
    body: "We establish what the project includes and what it deliberately does not, so the estimate means something.",
  },
  {
    index: "02",
    title: "One point of contact",
    body: "You work with me directly, from the first conversation through to handover.",
  },
  {
    index: "03",
    title: "Built responsive",
    body: "Mobile, tablet and desktop are part of the build rather than a pass at the end.",
  },
  {
    index: "04",
    title: "Handover you can run",
    body: "Clear structure, maintainable editing where a CMS is involved, and documentation of anything non-obvious.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        lines={["Development,", "design, and the", "bit in between."]}
        lead="Four ways projects usually start. Most end up as some combination of them, which is the advantage of working with one person across design and development."
        aside={
          <div className="flex flex-col gap-3">
            <Label>Engagements</Label>
            <p className="max-w-[28ch] text-meta text-fg/70">
              New builds, redesigns, and ongoing development after launch.
            </p>
          </div>
        }
      />

      <Services withLink={false} id="services-detail" />

      <Section tone="dark" aria-labelledby="engagement-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal distance={12}>
              <Label rule className="mb-7">
                What&rsquo;s included
              </Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="engagement-heading"
                className="text-title font-semibold text-ice text-balance-safe"
              >
                The same standard, whichever service you start with.
              </h2>
            </Reveal>
            <Reveal delay={0.14} className="mt-8">
              <TextLink href="/contact" arrow="e">
                Tell me about your project
              </TextLink>
            </Reveal>
          </div>

          <ol className="lg:col-span-8">
            {engagement.map((item, index) => (
              <Reveal
                as="li"
                key={item.index}
                delay={index * 0.05}
                distance={16}
                className="flex flex-col gap-3 border-t border-line/16 py-7 last:border-b last:border-line/16 sm:flex-row sm:gap-10"
              >
                <span className="font-accent text-label uppercase tracking-[0.2em] text-cyan/85 sm:w-16 sm:shrink-0 sm:pt-1.5">
                  {item.index}
                </span>
                <div className="flex-1">
                  <h3 className="text-subtitle font-semibold text-ice">{item.title}</h3>
                  <p className="mt-3 max-w-[58ch] text-body text-fg/70 text-pretty-safe">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Expertise />
      <Marquee />
      <Faq />
      <FinalCta />
    </>
  );
}
