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
    optimizePackageImports: ["motion", "gsap"],
  },

  poweredByHeader: false,
};

export default nextConfig;
