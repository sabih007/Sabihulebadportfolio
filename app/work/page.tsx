import type { Metadata } from "next";

import { FinalCta } from "@/components/contact/FinalCta";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/components/layout/StructuredData";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/work/ProjectCard";
import { SITE_URL, site } from "@/data/site";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected projects by Sabih Ul Ebad — BuySellOX, Nexivo Studio, Chinex Mall and CAL Dental USA. Next.js platforms and production WordPress, all built from scratch.",
  path: "/work",
});

/** ItemList schema so each case study is discoverable from the index. */
function workSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#collection`,
    name: `Selected Work — ${site.name}`,
    url: `${SITE_URL}/work`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${SITE_URL}/work/${project.slug}`,
      })),
    },
  };
}

export default function WorkPage() {
  return (
    <>
      <JsonLd data={workSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />

      <PageHeader
        eyebrow="Selected Work"
        lines={["Four projects.", "Four briefs.", "All built from scratch."]}
        lead="A selection of digital experiences designed and developed around real business goals — rather than every project ever completed."
        aside={
          <div className="flex flex-col gap-3">
            <Label>Scope</Label>
            <p className="max-w-[28ch] text-meta text-fg/80">
              Three modern Next.js builds and one complete production WordPress website.
            </p>
          </div>
        }
      />

      <Section tone="light" aria-label="All projects" className="pt-4 sm:pt-6 lg:pt-8">
        <div className="flex flex-col gap-20 sm:gap-24 lg:gap-32">
          {projects.map((project, index) => (
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
          <p className="max-w-[62ch] text-body text-fg/80">
            {/* Honest note: no fictional projects are added to pad this list. */}
            This page lists confirmed work only. Additional projects are added as they are
            cleared for publication rather than to reach a particular count.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
