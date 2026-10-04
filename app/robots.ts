import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Mutation endpoints, not content.
          "/api/",
          // The moderation queue. The page also sends `noindex`, and it is
          // password-gated — this just keeps it out of the crawl budget.
          "/admin/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
