import type { Metadata } from "next";

import { SITE_URL, site } from "@/data/site";

type PageMetaInput = {
  title: string;
  description: string;
  /** Path beginning with "/" — used for the canonical URL. */
  path: string;
  /** Defaults to the site-wide OG image route. */
  image?: string;
};

/**
 * Builds consistent canonical + Open Graph + Twitter metadata for every route.
 * `metadataBase` lives in the root layout, so relative paths resolve correctly.
 */
export function pageMetadata({ title, description, path, image }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: `${site.name} — ${site.role}`,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
