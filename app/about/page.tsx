import type { Metadata } from "next";

import { AboutIntro } from "@/components/about/AboutIntro";
import { Philosophy } from "@/components/about/Philosophy";
import { FinalCta } from "@/components/contact/FinalCta";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Expertise } from "@/components/expertise/Expertise";
import { Marquee } from "@/components/expertise/Marquee";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, aboutSchema, breadcrumbSchema } from "@/components/layout/StructuredData";
import { TextLink } from "@/components/ui/TextLink";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { credentials, links } from "@/data/site";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Sabih Ul Ebad is a Full-Stack Developer with 8+ years of experience across design, development and digital strategy — building websites, eCommerce platforms and custom web applications.",
  path: "/about",
});

/** How a project actually runs. Process, not autobiography. */
const process = [
  {
    index: "01",
    title: "Understand the goal",
    body: "Before anything is designed, we agree what the site is for and how you will know it worked. Scope decisions get much easier after that.",
  },
  {
    index: "02",
    title: "Structure before surface",
    body: "Information architecture and the component system come first. Interfaces built on a clear structure stay consistent as the project grows.",
  },
  {
    index: "03",
    title: "Design it to be built",
    body: "I design and develop, so the interface is resolved with the implementation in mind. Nothing gets drawn that quietly cannot ship.",
  },
  {
    index: "04",
    title: "Build, review, refine",
    body: "You see real screens on real devices, not only static mockups. Feedback lands while changing things is still cheap.",
  },
  {
    index: "05",
    title: "Hand over properly",
    body: "A site you can run. Clear structure, maintainable editing where a CMS is involved, and a straight answer when something needs changing later.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        eyebrow="About"
        lines={["Design, development", "and the thinking", "in between."]}
        lead="I'm a Full-Stack Developer. In practice that means I take responsibility for how a project looks, how it is built, and whether it does what the business needed it to do."
        aside={
          <dl className="grid grid-cols-2 items-start gap-x-10 gap-y-6 sm:grid-cols-4 lg:gap-x-12">
            {credentials.map((item) => (
              <div key={item.label} className="flex flex-col-reverse gap-2">
                <dt className="font-accent text-meta text-fg/80">{item.label}</dt>
                <dd className="text-[1.5rem] leading-none font-bold tracking-[-0.02em] text-navy">
                  {"href" in item && item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="arrow"
                      className="transition-opacity duration-300 hover:opacity-75"
                    >
                      {item.value}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <AboutIntro withLink={false} id="about-detail" />

      <Section tone="light" aria-labelledby="process-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal distance={12}>
              <Label rule className="mb-7">
                Process
              </Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="process-heading"
                className="text-title font-semibold text-navy text-balance-safe"
              >
                How a project actually runs.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-[42ch] text-body text-fg/80">
                Every project is different, but the order of decisions rarely is. This is the
                sequence that keeps timelines honest and avoids expensive rework.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8">
              <TextLink href="/contact" arrow="e">
                Start a conversation
              </TextLink>
            </Reveal>
          </div>

          <ol className="lg:col-span-8">
            {process.map((step, index) => (
              <Reveal
                as="li"
                key={step.index}
                delay={index * 0.05}
                distance={16}
                className="flex flex-col gap-3 border-t border-line/12 py-7 sm:flex-row sm:gap-10 last:border-b last:border-line/12"
              >
                <span className="font-accent text-label uppercase tracking-[0.2em] text-fg/80 sm:w-16 sm:shrink-0 sm:pt-1.5">
                  {step.index}
                </span>
                <div className="flex-1">
                  <h3 className="text-subtitle font-semibold text-navy">{step.title}</h3>
                  <p className="mt-3 max-w-[58ch] text-body text-fg/80 text-pretty-safe">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Philosophy />
      <ExperienceSection />
      <Expertise />
      <Marquee />

      <Section tone="light" aria-labelledby="working-together-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal distance={12}>
              <Label rule className="mb-7">
                Working together
              </Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="working-together-heading"
                className="text-title font-semibold text-navy text-balance-safe"
              >
                Remote, and used to it.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="max-w-[56ch] text-lead text-fg/90 text-pretty-safe">
                Client work has been delivered remotely across time zones for years. That only
                works when communication is deliberate rather than occasional.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-[56ch] text-body text-fg/80 text-pretty-safe">
                You will know what is in progress, what is blocked and what I need from you. If
                something is going to take longer than expected, you hear it from me before it
                becomes a problem — which is the part clients mention most in their feedback.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <TextLink href={links.upwork} external>
                Upwork profile
              </TextLink>
              <TextLink href={links.linkedin} external>
                LinkedIn
              </TextLink>
            </Reveal>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
