import { SITE_URL, contact, site } from "@/data/site";
import { publishedPosts } from "@/data/writing";

/**
 * RSS 2.0 feed for the writing section.
 *
 * Generated at build time rather than per request — the posts come from the
 * repository, so the feed only ever changes when the site is rebuilt.
 *
 * Drafts are excluded, because `publishedPosts()` excludes them. A feed is the
 * one surface where a mistake is permanent: readers keep what it hands them.
 */
export const dynamic = "force-static";

/** Escapes the five XML entities. Titles contain em dashes and ampersands. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS requires RFC 822 dates, not the ISO dates the data layer stores. */
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T09:00:00Z`).toUTCString();
}

export async function GET() {
  const posts = publishedPosts();
  const self = `${SITE_URL}/writing/rss.xml`;

  // An empty feed is valid, and is the honest answer before the first article.
  const lastBuild = posts.length > 0 ? rfc822(posts[0].publishedAt) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/writing/${post.slug}`;
      const categories = post.topics
        .map((topic) => `      <category>${escapeXml(topic)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${rfc822(post.publishedAt)}</pubDate>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Writing — ${site.name}`)}</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml("Notes on building for the web — on Next.js, WordPress, performance and the decisions behind a build.")}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <managingEditor>${contact.email.display} (${escapeXml(site.name)})</managingEditor>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
