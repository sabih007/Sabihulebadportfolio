import type { Metadata } from "next";

import { LogoLockup } from "@/components/brand/Logo";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema, contactSchema } from "@/components/layout/StructuredData";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { contact, credentials, site, socialLinks } from "@/data/site";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Sabih Ul Ebad — Full-Stack Developer with 8+ years of experience. Tell me what you're building and I'll come back with questions and next steps.",
  path: "/contact",
});

function MailIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue-solid"
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-[1.05rem]">
        <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="m3.5 6 6.5 4.5L16.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PhoneIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue-solid"
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-[1.05rem]">
        <path
          d="M6.6 3.5H4.3c-.6 0-1.1.5-1 1.1.3 3 1.6 5.8 3.7 7.9 2.1 2.1 4.9 3.4 7.9 3.7.6.1 1.1-.4 1.1-1v-2.3c0-.5-.4-1-.9-1.1l-2-.3c-.4-.1-.8.1-1 .4l-.7 1a10.6 10.6 0 0 1-4.5-4.5l1-.7c.3-.2.5-.6.4-1l-.3-2c-.1-.5-.5-.9-1.1-.9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const helpful = [
  "What you want the site to do, in your own words.",
  "Roughly when you need it live, and anything fixed around that date.",
  "Whether design, content and assets already exist or need creating.",
];

export default function ContactPage() {
  const social = socialLinks();

  return (
    <>
      <JsonLd data={contactSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        eyebrow="Contact"
        lines={["Tell me what", "you're building."]}
        lead="A few sentences is enough to start. I'll come back with questions, a view on scope, and an honest read on timeline."
        aside={
          <div className="flex flex-col gap-3">
            <Label>Availability</Label>
            <p className="max-w-[26ch] text-meta text-fg/80">
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
            <Reveal distance={14} className="mb-12">
              <Label rule className="mb-6">
                Direct
              </Label>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={contact.email.href}
                    className="group flex items-center gap-3.5 rounded-card border border-line/12 bg-raised px-4 py-3.5 transition-colors duration-300 hover:border-blue/40"
                  >
                    <MailIcon />
                    <span className="min-w-0">
                      <span className="block font-accent text-label uppercase tracking-[0.16em] text-fg/80">
                        Email
                      </span>
                      <span className="mt-1 block truncate text-[0.9375rem] font-medium text-navy transition-colors duration-300 group-hover:text-blue">
                        {contact.email.display}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={contact.phone.href}
                    className="group flex items-center gap-3.5 rounded-card border border-line/12 bg-raised px-4 py-3.5 transition-colors duration-300 hover:border-blue/40"
                  >
                    <PhoneIcon />
                    <span className="min-w-0">
                      <span className="block font-accent text-label uppercase tracking-[0.16em] text-fg/80">
                        Phone
                      </span>
                      <span className="mt-1 block text-[0.9375rem] font-medium text-navy transition-colors duration-300 group-hover:text-blue">
                        {contact.phone.display}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal distance={14}>
              <Label rule className="mb-6">
                What helps
              </Label>
              <ul className="border-t border-line/12">
                {helpful.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-b border-line/12 py-4 text-[0.9375rem] text-fg/85"
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
              {/* TODO: no verified GitHub URL has been supplied. Add it in
                  data/site.ts and it appears here, in the footer and in the
                  final CTA automatically. */}
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <Label rule className="mb-6">
                Why work with me
              </Label>
              <dl className="grid grid-cols-2 items-start gap-x-8 gap-y-6">
                {credentials.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse gap-1.5">
                    <dt className="font-accent text-meta text-fg/80">{item.label}</dt>
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
