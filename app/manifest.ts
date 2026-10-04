import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/**
 * Web app manifest. Not an SEO ranking factor, but it is what Chrome uses for
 * the install prompt and the name shown when the site is added to a home
 * screen, and it stops Lighthouse flagging the omission.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.shortBio,
    start_url: "/",
    display: "standalone",
    background_color: "#f7fafb",
    theme_color: "#f7fafb",
    /**
     * Served from `public/`, not the `app/icon.png` file convention: Next
     * fingerprints those with a query string, and a manifest needs a stable
     * path. Both are the same 512px monogram the favicon is generated from.
     */
    icons: [
      { src: "/brand/monogram.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/monogram.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
