import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/contact/FinalCta";
import { JsonLd, breadcrumbSchema } from "@/components/layout/StructuredData";
import { Arrow } from "@/components/ui/Arrow";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SITE_URL, site } from "@/data/site";
import { formatPostDate, getPost, postSlugs, type Post } from "@/data/writing";
import { readingMinutes } from "@/lib/writing/reading-time";
import { pageMetadata } from "@/lib/utils/metadata";

type ArticleProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }));
}

/**
 * Every article is known at build time, so an unknown slug is a 404 rather than
 * an attempt to render a file that does not exist.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return pageMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: `/writing/${slug}`,
    });
  }

  return {
    ...pageMetadata({
      title: post.title,
      description: post.description,
      path: `/writing/${post.slug}`,
    }),
    // An article is not a "website" — the type drives how it is previewed.
    openGraph: {
      type: "article",
      siteName: `${site.name} — ${site.role}`,
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/writing/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [`${SITE_URL}/about`],
      tags: post.topics,
    },
    // A draft is reachable by URL for review, but must never be indexed.
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

function articleSchema(post: Post, minutes: number) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/writing/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `${SITE_URL}/writing/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    keywords: post.topics.join(", "),
    timeRequired: `PT${minutes}M`,
    isPartOf: { "@id": `${SITE_URL}/writing#blog` },
  };
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // The article body. Resolved per slug rather than routed to directly, so the
  // page owns the header, the schema and the layout around it.
  const { default: Article } = await import(`@/content/writing/${slug}.mdx`);
  const minutes = await readingMinutes(slug);

  return (
    <>
      <JsonLd data={articleSchema(post, minutes)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: post.title, path: `/writing/${post.slug}` },
        ])}
      />

      <article>
        <header
          data-tone="light"
          className="relative overflow-hidden bg-surface pt-[7.5rem] pb-12 text-fg sm:pt-32 sm:pb-16 lg:pt-40"
        >
          <div
            aria-hidden
            className="rule-grid pointer-events-none absolute inset-x-0 top-0 h-[80%] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div aria-hidden className="wash wash-cyan -top-56 right-[-10%] size-[42rem]" />

          <div className="shell relative">
            <div className="mx-auto max-w-[72ch]">
              <Reveal distance={12}>
                <Label rule>Writing</Label>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-8 text-headline font-bold text-navy text-balance-safe">
                  {post.title}
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-6 max-w-[58ch] text-lead text-fg/85 text-pretty-safe">
                  {post.description}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/14 pt-5">
                  <time
                    dateTime={post.publishedAt}
                    className="font-accent text-meta text-fg/75"
                  >
                    {formatPostDate(post.publishedAt)}
                  </time>
                  <span aria-hidden className="h-px w-6 bg-line/25" />
                  <span className="font-accent text-meta text-fg/75">{minutes} min read</span>
                  {post.updatedAt ? (
                    <>
                      <span aria-hidden className="h-px w-6 bg-line/25" />
                      <span className="font-accent text-meta text-fg/60">
                        Updated {formatPostDate(post.updatedAt)}
                      </span>
                    </>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </div>
        </header>

        <Section tone="light" aria-label="Article" className="pt-2 sm:pt-4">
          {/* Measure is set once, here, so figures and code blocks inside the
              article can break out of it if they need to. */}
          <div className="mx-auto max-w-[72ch]">
            <Article />

            {post.topics.length > 0 ? (
              <Reveal className="mt-14 border-t border-line/14 pt-6">
                <ul className="flex flex-wrap gap-2">
                  {post.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full border border-line/15 px-3 py-1 font-accent text-label uppercase tracking-[0.14em] text-fg/70"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal className="mt-10">
              <Link
                href="/writing"
                className="group/back inline-flex items-center gap-2 font-accent text-meta font-medium text-accent transition-colors hover:text-navy"
              >
                <Arrow
                  direction="e"
                  className="rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/back:-translate-x-1"
                />
                All writing
              </Link>
            </Reveal>
          </div>
        </Section>
      </article>

      <FinalCta />
    </>
  );
}
