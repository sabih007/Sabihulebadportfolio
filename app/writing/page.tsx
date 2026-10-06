import type { Metadata } from "next";

import { FinalCta } from "@/components/contact/FinalCta";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/components/layout/StructuredData";
import { Label } from "@/components/ui/Label";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { PostCard } from "@/components/writing/PostCard";
import { SITE_URL, site } from "@/data/site";
import { publishedPosts } from "@/data/writing";
import { readingMinutes } from "@/lib/writing/reading-time";
import { pageMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description:
    "Notes on building for the web by Sabih Ul Ebad — on Next.js, WordPress, performance and the decisions behind a build.",
  path: "/writing",
});

/** Blog schema, so the index and its articles are understood as a collection. */
function writingSchema(slugs: { slug: string; title: string; publishedAt: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/writing#blog`,
    name: `Writing — ${site.name}`,
    url: `${SITE_URL}/writing`,
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: slugs.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.publishedAt,
      url: `${SITE_URL}/writing/${post.slug}`,
    })),
  };
}

export default async function WritingPage() {
  const posts = publishedPosts();

  // Reading time is read from each article's source, so it is measured once
  // here at build time rather than per card.
  const minutes = await Promise.all(posts.map((post) => readingMinutes(post.slug)));

  return (
    <>
      {posts.length > 0 ? <JsonLd data={writingSchema(posts)} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
        ])}
      />

      <PageHeader
        eyebrow="Writing"
        lines={["Notes from", "the build."]}
        lead="Occasional writing on the decisions behind a project — why a build is structured the way it is, what it costs to live with, and where the trade-offs actually fall."
        aside={
          posts.length > 0 ? (
            <div className="flex flex-col gap-3">
              <Label>Subscribe</Label>
              <a
                href="/writing/rss.xml"
                className="max-w-[28ch] text-meta text-fg/80 underline decoration-line/30 underline-offset-4 transition-colors hover:text-accent"
              >
                Follow by RSS
              </a>
            </div>
          ) : undefined
        }
      />

      <Section tone="light" aria-label="Articles" className="pt-4 sm:pt-6 lg:pt-8">
        {posts.length > 0 ? (
          <div className="mx-auto max-w-[72ch]">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                minutes={minutes[index]}
                lead={index === 0}
                delay={index * 0.04}
              />
            ))}
          </div>
        ) : (
          <Reveal className="mx-auto max-w-[72ch]">
            {/* Matches the rest of the site: say what is missing rather than
                publish filler to make the section look populated. */}
            <PendingBlock
              title="No articles have been published yet."
              body="This section is built and ready. The first piece will appear here, and in the RSS feed, as soon as it is written — nothing is published to fill the space in the meantime."
            />
          </Reveal>
        )}
      </Section>

      <FinalCta />
    </>
  );
}
