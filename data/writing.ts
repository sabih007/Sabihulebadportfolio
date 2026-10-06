/**
 * The writing section.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *  TODO — NO ARTICLES HAVE BEEN WRITTEN YET
 *
 *  `posts` is intentionally empty. Nothing here may be ghost-written: an
 *  article carries opinions and experience that have to be Sabih's own, and a
 *  portfolio that publishes invented technical writing is worse than one that
 *  publishes none.
 *
 *  The section is complete and data-driven, and it is wired to stay invisible
 *  until it has something to show:
 *
 *    - `/writing` is not linked from the header, the footer or the sitemap
 *      while `publishedPosts()` is empty.
 *    - The RSS feed and the route itself still exist, and start working the
 *      moment the first post is published.
 *
 *  To publish an article:
 *
 *    1. Write `content/writing/<slug>.mdx` — plain markdown. No front matter
 *       and no class names: `mdx-components.tsx` styles every element, and the
 *       metadata lives in the entry below.
 *    2. Add an entry to `posts` (newest first) with the same `slug`.
 *    3. That is all. The index, the article page, the sitemap, the RSS feed,
 *       the navigation link and the structured data all follow from it.
 *
 *  Example of the expected shape — replace with a real article:
 *
 *  {
 *    slug: "choosing-between-a-theme-and-a-build",
 *    title: "Choosing between a theme and a build",
 *    description:
 *      "What actually drives the cost of a website over five years, and when a from-scratch build is the cheaper of the two.",
 *    publishedAt: "2026-10-12",
 *    topics: ["Web Development", "Working With Clients"],
 *  }
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type Post = {
  /** URL segment, and the name of the file in `content/writing/`. */
  slug: string;
  title: string;
  /** One or two sentences. Used on the index card and as the meta description. */
  description: string;
  /** ISO date, `YYYY-MM-DD`. The day the article went live. */
  publishedAt: string;
  /** Set only when an article is substantively revised, never for a typo fix. */
  updatedAt?: string;
  /** Free-form subject tags, shown on the card and the article header. */
  topics: string[];
  /**
   * Promotes one article to the top of the index. Only the newest featured
   * post is used, so leaving an old one set does no harm.
   */
  featured?: boolean;
  /**
   * Keeps a finished-but-unpublished article out of the index, the sitemap and
   * the feed. The route still renders, so the draft can be previewed and shared
   * by URL — it is simply not advertised anywhere.
   */
  draft?: boolean;
};

export const posts: Post[] = [];

/** Newest first, drafts excluded. The list every public surface should use. */
export function publishedPosts(): Post[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Every slug that should be prerendered — drafts included, so they can be previewed. */
export function postSlugs(): string[] {
  return posts.map((post) => post.slug);
}

/** The newest featured article, used for the lead slot on the index. */
export function featuredPost(): Post | undefined {
  return publishedPosts().find((post) => post.featured);
}

/**
 * True once there is something worth linking to. The header, footer and sitemap
 * check this, so the section appears across the site the moment the first
 * article is published and never shows an empty page to a visitor.
 */
export function hasPublishedWriting(): boolean {
  return publishedPosts().length > 0;
}

/** The date a visitor reads, e.g. "12 October 2026". */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
