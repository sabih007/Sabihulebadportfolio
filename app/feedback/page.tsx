import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/components/layout/StructuredData";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { contact, links } from "@/data/site";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Leave Feedback",
  description:
    "Worked with Sabih Ul Ebad? Leave a short review of the project — how it went, what was delivered and whether you'd recommend the work. Published only with your permission.",
  path: "/feedback",
});

const prompts = [
  "What you needed built, in your own words.",
  "How the work went — communication, timeline, anything that stood out.",
  "Whether you'd recommend it to someone weighing up the same decision.",
];

export default function FeedbackPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Leave Feedback", path: "/feedback" },
        ])}
      />

      <PageHeader
        eyebrow="Your feedback"
        lines={["How was it", "to work with me?"]}
        lead="If we've worked together, a few honest sentences help more than anything else on this site. It takes a minute, and nothing is published without your say-so."
        aside={
          <div className="flex flex-col gap-3">
            <Label>Already reviewed?</Label>
            <p className="max-w-[28ch] text-meta text-fg/80">
              Reviews from past Upwork contracts are collected on the{" "}
              <TextLink href="/reviews" arrow={false}>
                reviews page
              </TextLink>
              .
            </p>
          </div>
        }
      />

      <Section tone="light" className="pt-4 sm:pt-6 lg:pt-8" aria-labelledby="feedback-heading">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="feedback-heading" className="sr-only">
              Client feedback form
            </h2>
            <div className="rounded-panel border border-line/12 bg-raised p-6 sm:p-9 lg:p-10">
              <FeedbackForm />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-4">
            <Reveal distance={14}>
              <Label rule className="mb-6">
                Worth mentioning
              </Label>
              <ul className="border-t border-line/12">
                {prompts.map((item) => (
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
                How this works
              </Label>
              <dl className="flex flex-col gap-6">
                <div>
                  <dt className="text-[0.9375rem] font-semibold text-navy">
                    Nothing goes live on its own
                  </dt>
                  <dd className="mt-1.5 max-w-[42ch] text-meta text-fg/80">
                    Every review reaches me first. I check it, then publish it — or leave it
                    unpublished if you asked me to.
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.9375rem] font-semibold text-navy">
                    Your email is never shown
                  </dt>
                  <dd className="mt-1.5 max-w-[42ch] text-meta text-fg/80">
                    It stays on the server and is used only to confirm the review is genuine
                    and to reply to you.
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.9375rem] font-semibold text-navy">
                    Nothing is edited
                  </dt>
                  <dd className="mt-1.5 max-w-[42ch] text-meta text-fg/80">
                    Published reviews appear as written. If something needs changing or taking
                    down, email me and it&rsquo;s done.
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.14} className="mt-12 border-t border-line/12 pt-10">
              <Label rule className="mb-6">
                Rather do it elsewhere?
              </Label>
              <ul className="flex flex-col gap-4">
                <li>
                  <TextLink href={links.upwork} external>
                    Review the contract on Upwork
                  </TextLink>
                </li>
                <li>
                  <TextLink href={contact.email.href} arrow={false}>
                    Email it to {contact.email.display}
                  </TextLink>
                </li>
              </ul>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
