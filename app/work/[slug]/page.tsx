import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/components/layout/StructuredData";
import { Arrow } from "@/components/ui/Arrow";
import { BuiltFromScratchBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CaseStudyNarrative } from "@/components/work/CaseStudyNarrative";
import { ProjectCover } from "@/components/work/ProjectCover";
import {
  getNextProject,
  getProject,
  projects,
  websiteLabel,
} from "@/data/projects";
import { SITE_URL, site } from "@/data/site";
import { pageMetadata } from "@/lib/utils/metadata";

type CaseStudyProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return pageMetadata({
      title: "Case study not found",
      description: "This case study could not be found.",
      path: `/work/${slug}`,
    });
  }

  return pageMetadata({
    title: `${project.title} — ${project.category}`,
    description: `${project.description} Built from scratch by ${site.name} as ${project.role}, using ${project.technologies.join(", ")}.`,
    path: `/work/${project.slug}`,
    image: project.coverImage,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(project.slug);
  const host = websiteLabel(project.website);

  const facts = [
    { label: "Client / Industry", value: project.industry },
    { label: "My Role", value: project.role },
    { label: "Technology", value: project.technologies.join(", ") },
    { label: "Build", value: "Built from scratch" },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${project.slug}#project`,
    name: project.title,
    headline: `${project.title} — ${project.category}`,
    abstract: project.description,
    description: project.overview,
    url: `${SITE_URL}/work/${project.slug}`,
    genre: project.category,
    about: project.industry,
    creator: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: site.name },
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: site.name },
    keywords: [...project.technologies, ...project.services].join(", "),
    ...(project.website ? { sameAs: project.website } : {}),
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/` },
        ])}
      />

      <PageHeader
        eyebrow={`${project.index} — ${project.category}`}
        lines={[project.title]}
        uppercase={false}
        lead={project.description}
        aside={
          <div className="flex flex-col items-start gap-5">
            <BuiltFromScratchBadge />
            {project.website ? (
              <Magnetic strength={7}>
                <ButtonLink href={project.website} external variant="outline" arrow="ne">
                  Visit {host ?? "website"}
                </ButtonLink>
              </Magnetic>
            ) : null}
          </div>
        }
      />

      {/* Project hero visual */}
      <div data-tone="light" className="shell bg-surface">
        <Reveal distance={26}>
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
            <ProjectCover
              project={project}
              priority
              sizes="(min-width: 1536px) 1440px, 92vw"
              className="h-full w-full"
            />
          </div>
        </Reveal>
      </div>

      {/* Facts: client / industry, role, technology, build */}
      <Section tone="light" className="py-14 sm:py-16 lg:py-20" aria-label="Project details">
        <dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {facts.map((fact, index) => (
            <Reveal
              key={fact.label}
              delay={index * 0.05}
              distance={14}
              className="flex flex-col gap-2.5 border-t border-line/12 py-5 lg:pr-6"
            >
              <dt className="font-accent text-label uppercase tracking-[0.16em] text-fg/80">
                {fact.label}
              </dt>
              <dd className="text-[1.0625rem] font-medium text-navy">{fact.value}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* Overview */}
      <Section tone="ice" className="py-16 sm:py-20 lg:py-24" aria-labelledby="overview-heading">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal distance={12}>
              <Label rule>Overview</Label>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.06}>
              <h2 id="overview-heading" className="sr-only">
                Overview
              </h2>
              <p className="max-w-[64ch] text-subtitle font-medium text-navy text-pretty-safe sm:text-[1.5rem] sm:leading-[1.45]">
                {project.overview}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Challenge → Approach → Design → Development */}
      <Section tone="light" aria-label="How the project was approached">
        <CaseStudyNarrative
          blocks={[
            {
              index: "01",
              heading: "The Challenge",
              note: "What this kind of product has to get right.",
              body: <p>{project.challenge}</p>,
            },
            {
              index: "02",
              heading: "Approach",
              note: "The decisions taken before any code.",
              body: <p>{project.approach}</p>,
            },
            {
              index: "03",
              heading: "Design",
              note: "Why the interface looks the way it does.",
              body: <p>{project.design}</p>,
            },
            {
              index: "04",
              heading: "Development",
              note: "How it was built, and why that way.",
              body: <p>{project.development}</p>,
            },
          ]}
        />
      </Section>

      {/* Important features — pending verification on every project today */}
      <Section tone="light" divider className="py-14 sm:py-16 lg:py-20" aria-labelledby="features-heading">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal distance={12}>
              <Label rule>Important features</Label>
            </Reveal>
            <h2 id="features-heading" className="sr-only">
              Important features
            </h2>
          </div>
          <div className="lg:col-span-8">
            {project.features?.length ? (
              <Reveal>
                <ul className="grid gap-px sm:grid-cols-2 sm:gap-6">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-4 border-t border-line/12 py-5 text-body text-fg/90"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 size-1 shrink-0 rounded-full bg-blue/50"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : (
              <Reveal>
                {/* TODO: add a verified feature list to this project in data/projects.ts. */}
                <PendingBlock
                  title="The feature breakdown is being confirmed with the client."
                  body="Listing functionality that has not been verified would misrepresent the build, so this section stays empty until each item is confirmed."
                />
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* Full-width visual showcase */}
      <section
        data-tone="ice"
        aria-label={`${project.title} visual showcase`}
        className="bg-surface py-16 text-fg sm:py-20 lg:py-24"
      >
        <div className="shell">
          <Reveal distance={12}>
            <Label rule className="mb-8">
              Visual showcase
            </Label>
          </Reveal>
        </div>

        {project.gallery?.length ? (
          <div className="shell grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, index) => (
              <Reveal key={src} delay={index * 0.06} className="relative aspect-[4/3] w-full">
                <Image
                  src={src}
                  alt={`${project.title} — interface detail ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 46vw, 92vw"
                  className="rounded-panel border border-line/12 object-cover object-top"
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            {/* Full-bleed designed frame until real screenshots are supplied.
                TODO: add gallery paths to data/projects.ts. */}
            <Reveal distance={20} className="px-[var(--shell-gutter)]">
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[110rem] sm:aspect-[21/9]">
                <ProjectCover
                  project={project}
                  sizes="100vw"
                  className="h-full w-full"
                />
              </div>
            </Reveal>
            <div className="shell">
              <p className="mt-6 max-w-[56ch] font-accent text-meta text-fg/80">
                Interface captures from the live site are being prepared. Until then the live
                build is linked below.
              </p>
            </div>
          </>
        )}
      </section>

      {/* Results / outcome */}
      <Section tone="ice" flush="top" className="pb-16 sm:pb-20 lg:pb-24" aria-labelledby="outcome-heading">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal distance={12}>
              <Label rule>Results</Label>
            </Reveal>
            <h2 id="outcome-heading" className="sr-only">
              Results
            </h2>
          </div>
          <div className="lg:col-span-8">
            {project.outcome ? (
              <Reveal>
                <p className="max-w-[64ch] text-lead text-fg/90 text-pretty-safe">
                  {project.outcome}
                </p>
              </Reveal>
            ) : (
              <Reveal>
                {/* TODO: add verified outcomes to this project in data/projects.ts.
                    Never substitute estimated traffic, revenue or conversion figures. */}
                <PendingBlock
                  title="No performance or business figures are published for this project."
                  body="Metrics only mean something when they can be verified, so none are claimed here. The live site is linked below so the work can be judged directly."
                />
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* Technology + visit website */}
      <Section tone="light" aria-labelledby="stack-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal distance={12}>
              <Label rule className="mb-7">
                Technology
              </Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="stack-heading"
                className="text-title font-semibold text-navy text-balance-safe"
              >
                Built with {project.technologies.join(" and ")}.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-[42ch] text-body text-fg/80">
                Only the technologies actually used on this project are listed. Nothing is
                added to lengthen the stack.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li key={tech}>
                    <span className="inline-flex rounded-full border border-blue/30 bg-blue/6 px-4 py-2 text-[0.875rem] font-medium text-navy">
                      {tech}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <Label className="mb-4">Services provided</Label>
              <ul className="grid gap-px sm:grid-cols-2">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-center gap-3 border-b border-line/12 py-3 text-[0.9375rem] text-fg/85"
                  >
                    <span aria-hidden className="size-1 shrink-0 rounded-full bg-blue/50" />
                    {service}
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.website ? (
              <Reveal delay={0.14} className="mt-10">
                <Magnetic>
                  <ButtonLink href={project.website} external variant="primary" arrow="ne">
                    Visit {host ?? "the live site"}
                  </ButtonLink>
                </Magnetic>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Next project */}
      <Section tone="dark" aria-labelledby="next-project-heading">
        <Reveal>
          <Link
            href={`/work/${next.slug}`}
            data-cursor="view"
            className="group/project grid items-center gap-8 rounded-panel lg:grid-cols-12 lg:gap-14"
          >
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full">
                <ProjectCover
                  project={next}
                  tone="light"
                  sizes="(min-width: 1024px) 58vw, 92vw"
                  className="h-full w-full transition-colors duration-500 group-hover/project:border-line/12"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <Label rule>Next project</Label>
              <h2
                id="next-project-heading"
                className="mt-6 text-title font-semibold text-ice"
              >
                {next.title}
              </h2>
              <p className="mt-2 font-accent text-meta text-cyan/95">{next.category}</p>
              <p className="mt-5 max-w-[42ch] text-body text-ice/90">{next.description}</p>
              <span className="mt-7 inline-flex items-baseline gap-2 text-[0.9375rem] font-semibold text-ice">
                <span className="relative">
                  View Case Study
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-x-100"
                  />
                </span>
                <Arrow
                  direction="e"
                  className="translate-y-[0.1em] transition-transform duration-500 group-hover/project:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
