import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { links } from "@/data/site";
import type { Testimonial } from "@/data/testimonials";
import { featuredTestimonial, ratingOnlyWork, supportingTestimonials } from "@/data/testimonials";

/**
 * Client reviews, reproduced verbatim from Sabih's public Upwork profile.
 *
 * No client names are shown — none were supplied as publicly verified — so each
 * review is attributed by project title, rating and date instead. Contract
 * values are never displayed.
 */
export function Testimonials() {
  const paragraphs = featuredTestimonial.quote?.split("\n\n") ?? [];

  return (
    <Section id="testimonials" tone="dark" flush="top" aria-labelledby="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Client reviews"
        lines={["In their", "own words."]}
        lead="Feedback from completed Upwork contracts, quoted exactly as clients wrote it."
        aside={
          <TextLink href={links.upwork} external>
            Read every review on Upwork
          </TextLink>
        }
      />

      {/* Featured review */}
      <Reveal as="figure" className="mt-16 sm:mt-20">
        <div className="relative overflow-hidden rounded-panel border border-line/16 bg-raised/55 px-7 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div
            aria-hidden
            className="wash wash-cyan-soft -bottom-28 -left-20 size-[28rem]"
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span
                aria-hidden
                className="block font-accent text-[5rem] leading-[0.5] font-bold text-cyan/35 select-none sm:text-[7rem]"
              >
                &ldquo;
              </span>

              <blockquote className="mt-6 space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "text-subtitle font-medium text-ice text-pretty-safe sm:text-[1.5rem] sm:leading-[1.45]"
                        : "max-w-[62ch] text-body text-ice/75 text-pretty-safe"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </blockquote>
            </div>

            <figcaption className="lg:col-span-5 lg:border-l lg:border-line/16 lg:pl-12">
              <Label rule>Client review on Upwork</Label>

              <dl className="mt-7 space-y-5">
                <div>
                  <dt className="font-accent text-label uppercase tracking-[0.16em] text-cyan/80">
                    Project
                  </dt>
                  <dd className="mt-1.5 text-[1.0625rem] font-medium text-ice">
                    {featuredTestimonial.project}
                  </dd>
                </div>
                <div>
                  <dt className="font-accent text-label uppercase tracking-[0.16em] text-cyan/80">
                    Rating
                  </dt>
                  <dd className="mt-2">
                    <Rating value={featuredTestimonial.rating} />
                  </dd>
                </div>
                {featuredTestimonial.date ? (
                  <div>
                    <dt className="font-accent text-label uppercase tracking-[0.16em] text-cyan/80">
                      Dates
                    </dt>
                    <dd className="mt-1.5 text-meta tabular-nums text-ice/80">
                      {featuredTestimonial.date}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {featuredTestimonial.endorsements?.length ? (
                <div className="mt-8">
                  <p className="font-accent text-label uppercase tracking-[0.16em] text-cyan/80">
                    Endorsed for
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {featuredTestimonial.endorsements.map((item) => (
                      <li key={item}>
                        <Badge>{item}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </figcaption>
          </div>
        </div>
      </Reveal>

      {/* Supporting reviews — asymmetric editorial grid */}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supportingTestimonials.map((testimonial, index) => (
          <ReviewCard key={testimonial.project} testimonial={testimonial} delay={index * 0.05} />
        ))}
      </ul>

      {/* Rating-only contracts: compact indicators, never given invented quotes */}
      <Reveal delay={0.08} className="mt-14 border-t border-line/16 pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="max-w-[46ch]">
            <Label>Also completed</Label>
            <p className="mt-3 text-meta text-ice/70">
              Further Upwork contracts rated by the client without written feedback. Listed
              for completeness; no quotes are attributed to them.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl lg:flex-1">
            {ratingOnlyWork.map((entry) => (
              <li
                key={entry.project}
                className="rounded-card border border-line/14 bg-raised/50 p-4"
              >
                <Rating value={entry.rating} />
                <p className="mt-3 text-[0.8125rem] leading-snug font-medium text-ice/90">
                  {entry.project}
                </p>
                {entry.date ? (
                  <p className="mt-1.5 font-accent text-[0.6875rem] tabular-nums text-ice/60">
                    {entry.date}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

function ReviewCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="group flex h-full flex-col justify-between gap-7 rounded-panel border border-line/14 bg-raised/50 p-7 transition-colors duration-500 hover:border-cyan/45 sm:p-8"
    >
      <figure className="flex h-full flex-col">
        <Rating value={testimonial.rating} />

        <blockquote className="mt-5 flex-1">
          <p className="text-[1.0625rem] leading-[1.6] text-ice/90 text-pretty-safe">
            {testimonial.quote}
          </p>
        </blockquote>

        <figcaption className="mt-7 border-t border-line/14 pt-5">
          <p className="text-[0.875rem] font-medium text-ice">{testimonial.project}</p>
          <p className="mt-1.5 font-accent text-[0.75rem] tabular-nums text-ice/60">
            {testimonial.date} <span aria-hidden>·</span> Upwork Review
          </p>

          {testimonial.endorsements?.length ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {testimonial.endorsements.map((item) => (
                <li key={item}>
                  <span className="inline-flex rounded-full border border-line/18 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.08em] text-ice/75 uppercase">
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
