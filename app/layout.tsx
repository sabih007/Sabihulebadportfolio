import type { Metadata, Viewport } from "next";

import { matimo, neral } from "@/app/fonts";
import { Analytics } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd, siteSchema } from "@/components/layout/StructuredData";
import { Header } from "@/components/navigation/Header";
import { Cursor } from "@/components/ui/Cursor";
import { SITE_URL, site } from "@/data/site";

import "./globals.css";
import Script from 'next/script';

 * Search-engine ownership verification. Set whichever you need and the meta tag
 * appears; leave them unset and nothing is emitted. These are the token values
 * from the "HTML tag" verification method, not the whole tag.
 *
 *   GOOGLE_SITE_VERIFICATION  — Google Search Console
 *   BING_SITE_VERIFICATION    — Bing Webmaster Tools
 */
const verification = {
  google: process.env.GOOGLE_SITE_VERIFICATION,
  other: process.env.BING_SITE_VERIFICATION
    ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
    : undefined,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.shortBio,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  /**
   * Terms a prospective client would actually type. Google ignores this tag;
   * it is here because other engines and some AI crawlers still read it, and it
   * costs nothing. It is not a substitute for the copy on the page.
   */
  keywords: [
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "WordPress developer",
    "WooCommerce developer",
    "Shopify developer",
    "eCommerce development",
    "web design and development",
    "custom web application development",
    "freelance web developer",
    "Sabih Ul Ebad",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${site.name} — ${site.role}`,
    title: `${site.name} — ${site.role}`,
    description: site.shortBio,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.shortBio,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      // Lets Google show a full-length snippet and video preview rather than
      // truncating to its default.
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification,
  category: "technology",
};

export const viewport: Viewport = {
  // Matches the near-white page ground the site now opens on.
  themeColor: "#f7fafb",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${matimo.variable} ${neral.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <JsonLd data={siteSchema()} />
        <SmoothScroll />
        <Cursor />

        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />

        <Analytics />
        
// inside <body>, after {children}
<Script
  id="monetag-vignette"
  src="https://n6wxm.com/vignette.min.js"
  data-zone="11958145"
  strategy="afterInteractive"
/>

/**
      </body>
    </html>
  );
}
