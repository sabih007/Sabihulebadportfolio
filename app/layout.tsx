import type { Metadata, Viewport } from "next";

import { matimo, neral } from "@/app/fonts";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd, siteSchema } from "@/components/layout/StructuredData";
import { Header } from "@/components/navigation/Header";
import { Cursor } from "@/components/ui/Cursor";
import { SITE_URL, site } from "@/data/site";

import "./globals.css";

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
  alternates: { canonical: "/" },
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
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
      </body>
    </html>
  );
}
