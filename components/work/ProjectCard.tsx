import Link from "next/link";

import { Arrow } from "@/components/ui/Arrow";
import { BuiltFromScratchBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserMockup } from "@/components/work/BrowserMockup";
import { ProjectCover } from "@/components/work/ProjectCover";
import type { CoverTone } from "@/components/work/ProjectCover";
import { websiteLabel } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

type ProjectCardProps = {
  project: Project;
  /** Alternates the composition so consecutive cards do not mirror each other. */
  flipped?: boolean;
  /** Alternates the cover surface, which is what gives the section its rhythm. */
  tone?: CoverTone;
  /** First card above the fold gets priority image loading. */
  priority?: boolean;
};

/**
 * Large featured project card.
 *
 * Every piece of information is visible without hovering — hover only adds the
 * image scale, the cursor label, the metadata nudge and the cyan border lift,
 * so touch users lose nothing.
 */
export function ProjectCard({
  project,
  flipped = false,
  tone = "light",
  priority = false,
}: ProjectCardProps) {
  const host = websiteLabel(project.website);

  const meta = [
    { label: "Role", value: project.role },
    { label: "Technology", value: project.technologies.join(", ") },
    { label: "Services", value: project.services.join(", ") },
  ];

  return (
    <Reveal
      as="article"
      className="group/project grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
      distance={28}
    >
      <div className={cn("lg:col-span-7", flipped && "lg:order-2")}>
        <Link
          href={`/work/${project.slug}`}
          data-cursor="view"
          aria-label={`${project.title} case study — ${project.category}`}
          className="block rounded-panel focus-visible:outline-offset-4"
        >
          <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
            {/* A real capture is framed as the live site; anything without one
                falls back to the designed panel, which is what <ProjectCover>
                draws. */}
            {project.coverFull ? (
              <BrowserMockup
                project={project}
                priority={priority}
                sizes="(min-width: 1024px) 58vw, 92vw"
                className="h-full w-full group-hover/project:border-blue/35 group-hover/project:shadow-[0_30px_70px_-45px_rgba(41,54,129,0.55)]"
              />
            ) : (
              <ProjectCover
                project={project}
                tone={tone}
                priority={priority}
                sizes="(min-width: 1024px) 58vw, 92vw"
                className={cn(
                  "h-full w-full transition-[border-color,box-shadow] duration-500",
                  tone === "navy"
                    ? "group-hover/project:shadow-[0_30px_70px_-40px_rgba(41,54,129,0.8)]"
                    : "group-hover/project:border-blue/35 group-hover/project:shadow-[0_30px_70px_-45px_rgba(41,54,129,0.55)]",
                )}
              />
            )}
          </div>
        </Link>
      </div>

      <div className={cn("lg:col-span-5", flipped && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-accent text-label uppercase tracking-[0.2em] text-fg/70">
            {project.index}
          </span>
          <span aria-hidden className="h-px flex-1 bg-line/15" />
          <span className="font-accent text-label uppercase tracking-[0.16em] text-accent">
            {project.category}
          </span>
        </div>

        <h3 className="mt-6 text-title font-semibold tracking-[-0.025em] text-navy">
          <Link
            href={`/work/${project.slug}`}
            className="transition-colors duration-300 hover:text-blue"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-4 max-w-[46ch] text-body text-fg/80 text-pretty-safe">
          {project.description}
        </p>

        {project.builtFromScratch ? (
          <div className="mt-6">
            <BuiltFromScratchBadge />
          </div>
        ) : null}

        <dl className="mt-8 grid gap-px border-t border-line/12 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover/project:translate-x-1">
          {meta.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 border-b border-line/12 py-3.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="font-accent text-label uppercase tracking-[0.16em] text-fg/70 sm:w-[6.5rem] sm:shrink-0">
                {item.label}
              </dt>
              <dd className="text-meta text-fg/90">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link
            href={`/work/${project.slug}`}
            className="group/link inline-flex items-baseline gap-1.5 text-[0.9375rem] font-semibold text-navy"
          >
            <span className="relative">
              View Case Study
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
              />
            </span>
            <Arrow
              direction="e"
              className="translate-y-[0.1em] transition-transform duration-500 group-hover/link:translate-x-1"
            />
          </Link>

          {project.website ? (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="arrow"
              className="group/link inline-flex items-baseline gap-1.5 text-[0.9375rem] font-medium text-fg/80 transition-colors duration-300 hover:text-blue"
            >
              <span className="relative">
                Visit {host ?? "Website"}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
                />
              </span>
              <Arrow className="translate-y-[0.1em] transition-transform duration-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-[0.05em]" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
