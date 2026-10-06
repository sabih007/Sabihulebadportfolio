import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats first; next/image negotiates per request.
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints the layout actually uses.
    deviceSizes: [420, 640, 768, 1024, 1280, 1536, 1920],
  },

  // The OG image route reads the licensed TTF from assets/ at render time, so
  // that directory has to be traced into the deployment bundle.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/og/**", "./public/brand/**"],
  },

  // Keeps the client bundle lean by tree-shaking the animation libraries.
  experimental: {
    optimizePackageImports: ["motion", "gsap", "lucide-react"],
  },

  poweredByHeader: false,
};

/**
 * MDX powers the writing section. Articles live in `content/writing/*.mdx` and
 * are pulled in by `app/writing/[slug]/page.tsx`, so no `pageExtensions` entry
 * is needed — `.mdx` files are imported, never routed to directly.
 *
 * Plugins are named as strings rather than imported: `next dev` runs Turbopack,
 * which cannot pass JavaScript functions across to Rust, while `next build`
 * runs webpack. Strings are the one form both accept.
 */
const withMDX = createMDX({
  options: {
    // Tables, strikethrough, task lists and autolinks.
    remarkPlugins: ["remark-gfm"],
    // Gives every heading an id, so headings are linkable.
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
