import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { ProjectCard } from "@/components/work/ProjectCard";
import { featuredProjects } from "@/data/projects";

/**
 * The light/dark play of this section happens inside it rather than around it:
 * the band stays light and the project panels alternate light and navy, which
 * is what the spec asks for and keeps the four projects from reading as a list.
 */
export function SelectedWork() {
  return (
    <Section id="work" tone="light" divider aria-labelledby="work-heading">
      <SectionHeading
        id="work-heading"
        eyebrow="Selected Work"
        lines={["Selected work", "built with purpose."]}
        lead="A selection of digital experiences designed and developed around real business goals."
        aside={
          <div className="flex flex-col gap-4">
            <Label>All four built from scratch</Label>
            <TextLink href="/work" arrow="e">
              Browse all work
            </TextLink>
          </div>
        }
      />

      <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-24 lg:gap-32">
        {featuredProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            flipped={index % 2 === 1}
            tone={index % 2 === 1 ? "navy" : "light"}
            priority={index === 0}
          />
        ))}
      </div>

      <Reveal className="mt-20 border-t border-line/12 pt-8">
        <p className="max-w-[60ch] text-body text-fg/80">
          Four projects, four briefs, one constant: each was built from an empty
          repository rather than adapted from a template — which is why they could be
          shaped around the business behind them.
        </p>
      </Reveal>
    </Section>
  );
}
