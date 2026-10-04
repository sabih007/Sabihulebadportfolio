import { Label } from "@/components/ui/Label";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import type { PublicFeedback } from "@/lib/feedback/store";
import { ratingSummary } from "@/lib/feedback/store";
import { cn } from "@/lib/utils/cn";

/**
 * Reviews left directly on this site, after approval.
 *
 * Only entries the store has marked approved *and* consented reach this
 * component — see lib/feedback/store.ts. Email addresses never leave the
 * server, so there is nothing to omit here.
 *
 * Renders nothing at all when there are no approved reviews, rather than an
 * empty state: an unproven "no reviews yet" panel is worse than silence.
 */
export function ClientReviews({
  entries,
  tone = "ice",
  heading = true,
}: {
  entries: PublicFeedback[];
  tone?: "light" | "ice";
  /** Off when the surrounding page already carries the heading. */
  heading?: boolean;
}) {
  if (entries.length === 0) return null;

  const summary = ratingSummary(entries);
  const [featured, ...rest] = entries;

  return (
    <Section id="client-reviews" tone={tone} aria-labelledby="client-reviews-heading">
      {heading ? (
        <SectionHeading
          id="client-reviews-heading"
          eyebrow="Left on this site"
          lines={["Straight from", "the client."]}
          lead="Reviews submitted through the form on this site. Each one is checked before it appears, and published only with the client's permission."
          aside={
            summary ? (
              <div className="flex flex-col gap-3">
                <Label>Average</Label>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] leading-none font-bold tracking-[-0.03em] text-navy">
                    {summary.average.toFixed(1)}
                  </span>
                  <span className="text-meta text-fg/80">
                    from {summary.count} {summary.count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            ) : null
          }
        />
      ) : (
        <h2 id="client-reviews-heading" className="sr-only">
          Reviews left on this site
        </h2>
      )}

      <div className={cn("grid gap-4", heading && "mt-16 sm:mt-20")}>
        <ReviewCard entry={featured} featured />

        {rest.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((entry, index) => (
              <ReviewCard key={entry.id} entry={entry} delay={index * 0.05} asListItem />
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}

/** "Founder, Northwind" — whichever parts the client actually supplied. */
function attribution(entry: PublicFeedback): string | null {
  const parts = [entry.role, entry.company].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * The featured review renders as a standalone `<figure>`; the rest are `<li>`
 * inside the grid's list, each wrapping its own `<figure>` so the quote keeps
 * its caption association either way.
 */
function ReviewCard({
  entry,
  featured = false,
  asListItem = false,
  delay = 0,
}: {
  entry: PublicFeedback;
  featured?: boolean;
  asListItem?: boolean;
  delay?: number;
}) {
  const shell = cn(
    "flex h-full flex-col rounded-panel border border-line/14 bg-raised transition-colors duration-500 hover:border-blue/35",
    featured ? "p-7 sm:p-10 lg:p-12" : "p-7 sm:p-8",
  );

  if (asListItem) {
    return (
      <Reveal as="li" delay={delay} className={shell}>
        <figure className="flex h-full flex-col">
          <ReviewBody entry={entry} featured={featured} />
        </figure>
      </Reveal>
    );
  }

  return (
    <Reveal as="figure" delay={delay} className={shell}>
      <ReviewBody entry={entry} featured={featured} />
    </Reveal>
  );
}

function ReviewBody({ entry, featured }: { entry: PublicFeedback; featured: boolean }) {
  const role = attribution(entry);
  const submitted = new Date(entry.submittedAt);

  return (
    <>
      <Rating value={entry.rating} />

      <blockquote className={cn("flex-1", featured ? "mt-6" : "mt-5")}>
        {entry.headline ? (
          <p
            className={cn(
              "font-semibold text-navy text-pretty-safe",
              featured ? "text-subtitle" : "text-[1.0625rem] leading-snug",
            )}
          >
            {entry.headline}
          </p>
        ) : null}
        <p
          className={cn(
            "text-fg/85 text-pretty-safe",
            entry.headline && "mt-3",
            featured ? "max-w-[68ch] text-lead" : "text-[0.9375rem] leading-[1.65]",
          )}
        >
          {entry.quote}
        </p>
      </blockquote>

      <figcaption className={cn("border-t border-line/14", featured ? "mt-9 pt-6" : "mt-7 pt-5")}>
        <p
          className={cn(
            "font-medium text-navy",
            featured ? "text-[1.0625rem]" : "text-[0.9375rem]",
          )}
        >
          {entry.website ? (
            <TextLink href={entry.website} external ugc arrow={false}>
              {entry.name}
            </TextLink>
          ) : (
            entry.name
          )}
        </p>

        {role ? <p className="mt-1 text-meta text-fg/80">{role}</p> : null}

        <p className="mt-2 font-accent text-[0.75rem] text-fg/75">
          {entry.projectType ? (
            <>
              {entry.projectType} <span aria-hidden>·</span>{" "}
            </>
          ) : null}
          <time dateTime={entry.submittedAt.slice(0, 10)} className="tabular-nums">
            {submitted.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </time>
        </p>
      </figcaption>
    </>
  );
}
