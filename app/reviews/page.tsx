import type { Metadata } from "next";

import { ClientReviews } from "@/components/feedback/ClientReviews";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema, reviewsSchema } from "@/components/layout/StructuredData";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { links } from "@/data/site";
import type { Testimonial } from "@/data/testimonials";
import {
  endorsementSummary,
  ratingOnlyWork,
  testimonials,
} from "@/data/testimonials";
import { listPublishedFeedback, ratingSummary } from "@/lib/feedback/store";
import { pageMetadata } from "@/lib/utils/metadata";

/**
 * The canonical home for every review on the site.
 *
 * The homepage shows a short selection and links here; the full set — Upwork
 * contracts and reviews left directly on this site — lives on this page, so the
 * two never read as duplicate content.
 *
 * Revalidated hourly as a backstop. Approving a review calls `revalidatePath`
 * on this route, so in practice a new review appears immediately.
 */
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Client Reviews",
  description:
    "Verified client reviews for Sabih Ul Ebad — Top Rated on Upwork with 100% job success across 20+ completed contracts, plus feedback left directly on this site. Quoted exactly as clients wrote it.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const published = await listPublishedFeedback();
  const siteSummary = ratingSummary(published);

  const written = testimonials.filter((entry) => entry.quote);
  const allRated = [...testimonials, ...ratingOnlyWork, ...published];
  const overall =
    allRated.reduce((sum, entry) => sum + entry.rating, 0) / Math.max(1, allRated.length);

  const endorsements = endorsementSummary();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Client Reviews", path: "/reviews" },
        ])}
      />
      <JsonLd
        data={reviewsSchema({
          upwork: testimonials,
          website: published,
          ratingOnly: ratingOnlyWork,
        })}
      />

      <PageHeader
        eyebrow="Client reviews"
        lines={["What clients", "actually said."]}
        lead="Every review below is real and reproduced as written — nothing paraphrased, nothing trimmed to sound better. Upwork reviews come from the public profile; the rest were left directly on this site."
        aside={
          <div className="flex flex-col gap-4">
            <Label>Across all contracts</Label>
            <div className="flex items-baseline gap-3">
              <span className="text-[2.5rem] leading-none font-bold tracking-[-0.03em] text-navy">
                {(Math.round(overall * 10) / 10).toFixed(1)}
              </span>
              <span className="text-meta text-fg/80">
                from {allRated.length} rated {allRated.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <Rating value={overall} showValue={false} />
          </div>
        }
      />

      {/* Reviews left on this site. Renders nothing until one is approved. */}
      <ClientReviews entries={published} tone="ice" />

      <Section tone="light" aria-labelledby="upwork-reviews-heading">
        <SectionHeading
          id="upwork-reviews-heading"
          eyebrow="From Upwork"
          lines={["Verified", "contracts."]}
          lead="Reviews left by clients on Sabih's public Upwork profile. Client names are not shown — none were supplied as publicly verified — so each review is attributed by project, rating and date."
          aside={
            <TextLink href={links.upwork} external>
              Read every review on Upwork
            </TextLink>
          }
        />

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-20">
          {written.map((entry, index) => (
            <UpworkReview key={entry.project} entry={entry} delay={index * 0.04} />
          ))}
        </ul>

        {/* Rating-only contracts: counted honestly, never given invented quotes. */}
        {ratingOnlyWork.length > 0 ? (
          <Reveal delay={0.08} className="mt-14 border-t border-line/14 pt-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-[46ch]">
                <Label>Also completed</Label>
                <p className="mt-3 text-meta text-fg/80">
                  Further contracts the client rated without writing a review. Listed for
                  completeness; no quotes are attributed to them.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl lg:flex-1">
                {ratingOnlyWork.map((entry) => (
                  <li
                    key={entry.project}
                    className="rounded-card border border-line/14 bg-raised p-4"
                  >
                    <Rating value={entry.rating} />
                    <p className="mt-3 text-[0.8125rem] leading-snug font-medium text-navy">
                      {entry.project}
                    </p>
                    {entry.date ? (
                      <p className="mt-1.5 font-accent text-[0.75rem] tabular-nums text-fg/75">
                        {entry.date}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </Section>

      {endorsements.length > 0 ? (
        <Section tone="ice" aria-labelledby="endorsements-heading">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Label rule className="mb-6">
                Endorsed for
              </Label>
              <h2
                id="endorsements-heading"
                className="text-title font-semibold text-navy text-balance-safe"
              >
                The same things, project after project.
              </h2>
              <p className="mt-5 max-w-[44ch] text-body text-fg/85">
                Upwork asks clients to tag what stood out. These are the tags across all
                completed contracts, most frequent first.
              </p>
            </div>

            <ul className="flex flex-wrap content-start gap-2.5 lg:col-span-7">
              {endorsements.map((item) => (
                <li key={item.label}>
                  <Badge tone="outline" className="bg-raised">
                    {item.label}
                    {item.count > 1 ? (
                      <span className="text-accent tabular-nums">×{item.count}</span>
                    ) : null}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section tone="dark" aria-labelledby="leave-review-heading">
        <div
          aria-hidden
          className="wash wash-blue-strong -top-32 right-[-6%] size-[36rem]"
        />

        <Reveal className="relative max-w-[52ch]">
          <Label rule>Worked together?</Label>
          <h2
            id="leave-review-heading"
            className="mt-6 text-title font-semibold text-ice text-balance-safe"
          >
            {siteSummary
              ? "Add yours to the list."
              : "Yours could be the first one here."}
          </h2>
          <p className="mt-5 text-body text-ice/85">
            A few honest sentences help the next person decide far more than anything I could
            write about myself. It takes a minute, and nothing is published without your
            permission.
          </p>

          <div className="mt-9">
            <Magnetic>
              <ButtonLink href="/feedback" variant="contrast" arrow="e">
                Leave Your Feedback
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function UpworkReview({ entry, delay }: { entry: Testimonial; delay: number }) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="flex h-full flex-col rounded-panel border border-line/14 bg-raised p-7 transition-colors duration-500 hover:border-blue/35 sm:p-8"
    >
      <figure className="flex h-full flex-col">
        <Rating value={entry.rating} />

        <blockquote className="mt-5 flex-1">
          <p className="text-[0.9375rem] leading-[1.65] text-fg/85 text-pretty-safe">
            {entry.quote}
          </p>
        </blockquote>

        <figcaption className="mt-7 border-t border-line/14 pt-5">
          <p className="text-[0.9375rem] font-medium text-navy">{entry.project}</p>
          <p className="mt-1.5 font-accent text-[0.75rem] tabular-nums text-fg/75">
            {entry.date} <span aria-hidden>·</span> Upwork review
          </p>

          {entry.endorsements?.length ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {entry.endorsements.map((item) => (
                <li key={item}>
                  <span className="inline-flex rounded-full border border-line/20 px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.08em] text-fg/80 uppercase">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  );
}
