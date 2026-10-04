import type { Metadata } from "next";

import { LogoLockup } from "@/components/brand/Logo";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { credentials, links, site, socialLinks } from "@/data/site";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Sabih Ul Ebad — Full-Stack Developer with 8+ years of experience. Tell me what you're building and I'll come back with questions and next steps.",
  path: "/contact",
});

const helpful = [
  "What you want the site to do, in your own words.",
  "Roughly when you need it live, and anything fixed around that date.",
  "Whether design, content and assets already exist or need creating.",
];

export default function ContactPage() {
  const social = socialLinks();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        lines={["Tell me what", "you're building."]}
        lead="A few sentences is enough to start. I'll come back with questions, a view on scope, and an honest read on timeline."
        aside={
          <div className="flex flex-col gap-3">
            <Label>Availability</Label>
            <p className="max-w-[26ch] text-meta text-fg/70">
              {site.availability}. Working remotely with clients worldwide.
            </p>
          </div>
        }
      />

      <Section tone="light" className="pt-4 sm:pt-6 lg:pt-8" aria-labelledby="inquiry-heading">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="inquiry-heading" className="sr-only">
              Project inquiry form
            </h2>
            <div className="rounded-panel border border-line/12 bg-raised p-6 sm:p-9 lg:p-10">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-4">
            <Reveal distance={14}>
              <Label rule className="mb-6">
                What helps
              </Label>
              <ul className="border-t border-line/12">
                {helpful.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-b border-line/12 py-4 text-[0.9375rem] text-fg/75"
                  >
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-blue/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <Label rule className="mb-6">
                Elsewhere
              </Label>
              <ul className="flex flex-col gap-4">
                {social.map((item) => (
                  <li key={item.label}>
                    <TextLink href={item.href} external={item.external}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
              {/* TODO: no verified public email address or GitHub URL has been
                  supplied. Add them in data/site.ts and they appear here, in the
                  footer and in the final CTA automatically. */}
              {!links.email ? (
                <p className="mt-5 max-w-[34ch] font-accent text-meta text-fg/65">
                  Direct email is not published yet — the form above and the profiles listed
                  here all reach me.
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <Label rule className="mb-6">
                Why work with me
              </Label>
              <dl className="grid grid-cols-2 items-start gap-x-8 gap-y-6">
                {credentials.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse gap-1.5">
                    <dt className="font-accent text-meta text-fg/65">{item.label}</dt>
                    <dd className="text-[1.375rem] leading-none font-bold tracking-[-0.02em] text-navy">
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
            </Reveal>

            <Reveal delay={0.2} className="mt-14 border-t border-line/12 pt-10">
              {/* The approved primary lockup, at a width where its subtitle
                  still reads. The header uses the monogram + live type. */}
              <LogoLockup width={260} className="opacity-90" />
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
