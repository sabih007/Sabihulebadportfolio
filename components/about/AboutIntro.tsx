import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/data/site";

/** The five things that have to combine for a project to actually land. */
const combination = [
  {
    index: "01",
    title: "Development",
    body: "Modern frameworks and CMS work, chosen for the project rather than for novelty.",
  },
  {
    index: "02",
    title: "Design awareness",
    body: "Interfaces designed to be built — so what gets shipped is what was intended.",
  },
  {
    index: "03",
    title: "Business understanding",
    body: "A clear read on what the site is for before deciding how it should work.",
  },
  {
    index: "04",
    title: "Communication",
    body: "Plain updates, honest timelines, and no surprises at handover.",
  },
  {
    index: "05",
    title: "Problem solving",
    body: "Practical answers when requirements shift or something unexpected appears.",
  },
];

type AboutIntroProps = {
  /** The homepage version links on to /about; the About page does not. */
  withLink?: boolean;
  as?: "h2" | "h1";
  id?: string;
};

export function AboutIntro({ withLink = true, as: Tag = "h2", id = "about" }: AboutIntroProps) {
  return (
    <Section id={id} tone="ice" aria-labelledby={`${id}-heading`}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal distance={12}>
            <Label rule className="mb-7">
              About
            </Label>
          </Reveal>
          <Reveal delay={0.05}>
            <Tag
              id={`${id}-heading`}
              className="text-headline font-semibold text-navy uppercase text-balance-safe"
            >
              <span className="block">I don&rsquo;t just build</span>
              <span className="block">websites. I build</span>
              <span className="block">experiences</span>
              <span className="gradient-text block">that work.</span>
            </Tag>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <Reveal delay={0.1}>
            <p className="max-w-[52ch] text-lead text-fg/90 text-pretty-safe">{site.longBio}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[52ch] text-body text-fg/80 text-pretty-safe">
              In practice most projects do not fail on code. They drift because nobody
              asked what the site was really for, because the design could not survive
              being built, or because communication thinned out halfway through. I work
              across all of it, which is usually why clients come back.
            </p>
          </Reveal>
          {withLink ? (
            <Reveal delay={0.22} className="mt-8">
              <TextLink href="/about" arrow="e">
                More about how I work
              </TextLink>
            </Reveal>
          ) : null}
        </div>
      </div>

      <ul className="mt-16 grid gap-px border-t border-line/12 sm:mt-20 lg:grid-cols-5 lg:gap-6 lg:border-t-0">
        {combination.map((item, index) => (
          <Reveal
            as="li"
            key={item.index}
            delay={index * 0.06}
            className="border-b border-line/12 py-6 lg:border-0 lg:border-t lg:pt-6"
          >
            <span className="font-accent text-label uppercase tracking-[0.2em] text-accent">
              {item.index}
            </span>
            <h3 className="mt-4 text-[1.0625rem] font-semibold text-navy">{item.title}</h3>
            <p className="mt-2 max-w-[34ch] text-meta text-fg/80">{item.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
