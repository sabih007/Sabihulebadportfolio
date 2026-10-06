import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { SITE_URL } from "@/data/site";
import { publishedPosts } from "@/data/writing";
import { listPublishedFeedback } from "@/lib/feedback/store";

/**
 * Regenerated daily. `lastModified` matters only when it is truthful: a date
 * that moves to "today" on every crawl is a signal search engines learn to
 * ignore, so the static pages carry a real content date and only /reviews
 * tracks something that genuinely changes.
 */
export const revalidate = 86400;

/**
 * Bump this when page copy is meaningfully revised. It is the honest
 * "last substantive change" date for the pages whose content lives in the
 * repository rather than in the feedback store.
 */
const CONTENT_UPDATED = new Date("2026-10-05T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await listPublishedFeedback();

  // The reviews page really does change when a review is approved, so its
  // lastModified is the newest published review (falling back to the copy date).
  const reviewsUpdated =
    published.length > 0 ? new Date(published[0].submittedAt) : CONTENT_UPDATED;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: reviewsUpdated, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/work`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: reviewsUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/feedback`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  // Writing stays out of the sitemap entirely until there is an article to
  // read, so search engines are never pointed at an empty index. Each article
  // carries its own publication date, which is the one date here that is
  // genuinely per-URL.
  const posts = publishedPosts();
  const writing: MetadataRoute.Sitemap =
    posts.length === 0
      ? []
      : [
          {
            url: `${SITE_URL}/writing`,
            lastModified: new Date(`${posts[0].publishedAt}T00:00:00.000Z`),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          ...posts.map((post) => ({
            url: `${SITE_URL}/writing/${post.slug}`,
            lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00.000Z`),
            changeFrequency: "yearly" as const,
            priority: 0.7,
          })),
        ];

  return [...staticRoutes, ...caseStudies, ...writing];
}
