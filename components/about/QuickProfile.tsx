import Link from "next/link";

import { Arrow } from "@/components/ui/Arrow";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProjectCover } from "@/components/work/ProjectCover";
import { featuredProjects } from "@/data/projects";

const focusAreas = ["Next.js", "React", "WordPress", "eCommerce", "UI/UX"];

/**
 * Bento profile strip. Three cards with deliberately different proportions:
 * a tall navy project feature beside two light panels, so the grid reads as an
 * editorial composition rather than three equal boxes — and so the first navy
 * surface of the page arrives as a single confident block.
 */
export function QuickProfile() {
  const recent = featuredProjects[0];

  return (
    <Section tone="light" flush="top" className="pb-20 sm:pb-24 lg:pb-28" aria-label="Profile at a glance">
      <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        {/* Currently */}
        <Reveal
          as="article"
          className="flex flex-col justify-between gap-10 rounded-panel border border-line/12 bg-raised p-7 shadow-[0_1px_2px_rgba(41,54,129,0.04)] sm:p-9 lg:col-span-5"
        >
          <Label rule>Currently</Label>
          <div>
            <h3 className="text-subtitle font-semibold text-navy text-balance-safe sm:text-[1.75rem] sm:leading-tight">
              Building digital products &amp; websites
            </h3>
            <p className="mt-4 max-w-[38ch] text-body text-fg/70">
              Working with clients on polished digital experiences — from the first
              interface decision through to a site that holds up in production.
            </p>
          </div>
        </Reveal>

        {/* Recent work — the tall navy card, spanning both rows on desktop */}
        <Reveal
          as="article"
          delay={0.1}
          className="group/project relative flex flex-col overflow-hidden rounded-panel lg:col-span-7 lg:row-span-2"
        >
          <div data-tone="dark" className="grain-dark flex h-full flex-col bg-navy text-fg">
            <div
              aria-hidden
              className="wash wash-blue-strong -top-24 -right-16 size-80"
            />
            <Link
              href={`/work/${recent.slug}`}
              data-cursor="view"
              className="relative flex h-full flex-col focus-visible:outline-offset-[-4px]"
            >
              <div className="flex items-start justify-between gap-4 p-7 pb-5 sm:p-9 sm:pb-6">
                <div>
                  <Label rule>Recent Work</Label>
                  <h3 className="mt-6 text-title font-semibold text-ice">{recent.title}</h3>
                  <p className="mt-2 font-accent text-meta text-cyan/85">{recent.category}</p>
                </div>
                <Badge tone="outline" className="hidden shrink-0 border-ice/25 text-ice/80 sm:inline-flex">
                  {recent.index}
                </Badge>
              </div>

              <div className="relative mt-auto px-7 sm:px-9">
                <div className="relative aspect-[16/9] w-full">
                  <ProjectCover
                    project={recent}
                    tone="light"
                    sizes="(min-width: 1024px) 55vw, 92vw"
                    className="h-full w-full rounded-t-card rounded-b-none border-b-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-7 py-6 text-[0.9375rem] font-medium text-ice sm:px-9">
                <span className="relative">
                  View Case Study
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-x-100"
                  />
                </span>
                <Arrow className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5" />
              </div>
            </Link>
          </div>
        </Reveal>

        {/* Specialised in */}
        <Reveal
          as="article"
          delay={0.05}
          className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-panel border border-line/12 bg-ice/45 p-7 sm:p-9 lg:col-span-5"
        >
          <div
            aria-hidden
            className="wash wash-cyan -bottom-20 -left-10 size-64"
          />
          <Label rule>Specialized In</Label>
          <div className="relative">
            <h3 className="text-subtitle font-semibold text-navy sm:text-[1.75rem] sm:leading-tight">
              Full-Stack Development
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <li key={area}>
                  <span className="inline-flex rounded-full border border-navy/15 bg-white/70 px-3 py-1.5 text-[0.8125rem] font-medium text-navy/85">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
