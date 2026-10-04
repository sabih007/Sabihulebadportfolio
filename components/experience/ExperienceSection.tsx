import { Timeline } from "@/components/experience/Timeline";
import { Label } from "@/components/ui/Label";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience, experienceFacts } from "@/data/experience";
import { engagementRecord } from "@/data/testimonials";

/** Latest first, by the end date of each engagement. */
function orderedEngagements() {
  const endTimestamp = (range: string) => {
    const end = range.split(" - ").at(-1) ?? range;
    const parsed = Date.parse(end);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return [...engagementRecord].sort((a, b) => endTimestamp(b.date) - endTimestamp(a.date));
}

export function ExperienceSection() {
  const engagements = orderedEngagements();

  return (
    <Section id="experience" tone="dark" flush="top" aria-labelledby="experience-heading">
      <SectionHeading
        id="experience-heading"
        eyebrow="Experience"
        lines={["8+ years of", "building for the web."]}
        lead="Design, development and digital strategy — across client projects delivered end to end."
      />

      <div className="mt-16 grid gap-14 sm:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-2">
            {experienceFacts.map((fact, index) => (
              <Reveal
                key={fact.label}
                delay={index * 0.06}
                className="border-t border-line/16 pt-5"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block text-[2rem] leading-none font-bold tracking-[-0.03em] text-ice sm:text-[2.5rem]">
                    {fact.value}
                  </span>
                  <span className="mt-3 block text-[0.8125rem] font-medium text-ice/90">
                    {fact.label}
                  </span>
                  <span className="mt-1.5 block max-w-[24ch] text-meta text-ice/80">
                    {fact.note}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-8">
          {experience.length > 0 ? (
            <Reveal>
              <Timeline entries={experience} />
            </Reveal>
          ) : (
            <>
              <Reveal>
                {/* TODO: supply verified entries in data/experience.ts — the
                    Timeline component then replaces this block automatically. */}
                <PendingBlock
                  title="The detailed role-by-role timeline is being verified."
                  body="Rather than publish approximate dates, titles or company names, this section lists the client engagement record below and will be expanded once each role is confirmed."
                />
              </Reveal>

              <Reveal delay={0.08} className="mt-12">
                <Label rule className="mb-6">
                  Client engagement record
                </Label>
                <p className="mb-7 max-w-[56ch] text-meta text-ice/85">
                  Completed contracts from the public Upwork profile, most recent first.
                  Titles and dates exactly as the client recorded them. Contract values are
                  deliberately not shown.
                </p>

                <ul className="border-t border-line/16">
                  {engagements.map((entry) => (
                    <li
                      key={`${entry.project}-${entry.date}`}
                      className="flex flex-col gap-2 border-b border-line/14 py-4 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <span className="font-accent text-meta tabular-nums whitespace-nowrap text-cyan/90 sm:w-52 sm:shrink-0">
                        {entry.date}
                      </span>
                      <span className="flex-1 text-[0.9375rem] text-ice/95">
                        {entry.project}
                      </span>
                      <span className="shrink-0">
                        <Rating value={entry.rating} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
