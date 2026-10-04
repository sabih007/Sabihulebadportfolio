import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { links } from "@/data/site";
import { principles } from "@/data/skills";

/**
 * Client-work philosophy — the opening of the page's first full navy passage,
 * which runs on into Experience. The four cards are drawn from the endorsement
 * themes clients selected on Upwork, stated plainly in the footnote rather than
 * implied as an endorsement by Upwork itself.
 */
export function Philosophy() {
  return (
    <Section tone="dark" flush="bottom" aria-labelledby="philosophy-heading">
      <div
        aria-hidden
        className="wash wash-blue-strong -top-40 left-[-8%] size-[38rem]"
      />

      <div className="relative">
        <SectionHeading
          id="philosophy-heading"
          eyebrow="How I work"
          lines={["Good code is only", "half the job."]}
          lead="Great projects also depend on ownership, communication and attention to detail."
        />

        <ul className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => (
            <Reveal
              as="li"
              key={principle.index}
              delay={index * 0.07}
              className="group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-panel border border-line/14 bg-raised/60 p-7 transition-colors duration-500 hover:border-cyan/45 sm:min-h-[17rem]"
            >
              <div
                aria-hidden
                className="wash wash-cyan -right-16 -bottom-16 size-44 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              <span className="relative font-accent text-label uppercase tracking-[0.2em] text-cyan/90">
                {principle.index}
              </span>
              <div className="relative">
                <h3 className="text-subtitle font-semibold text-ice">{principle.title}</h3>
                <p className="mt-3 text-meta text-ice/85">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-col gap-4 border-t border-line/14 pt-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-accent text-meta text-ice/80">
            Based on insights from completed client projects on Upwork.
          </p>
          <TextLink href={links.upwork} external>
            View Upwork Profile
          </TextLink>
        </Reveal>
      </div>
    </Section>
  );
}
