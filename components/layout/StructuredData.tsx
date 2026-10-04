import { SITE_URL, contact, links, site } from "@/data/site";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Renders a JSON-LD block. Content is serialised, never user-supplied. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Person + WebSite schema for the site root. Only verified links are included. */
export function siteSchema() {
  const sameAs = [links.linkedin, links.upwork, links.github].filter(
    (value): value is string => Boolean(value),
  );

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: site.name,
    jobTitle: site.role,
    description: site.shortBio,
    url: SITE_URL,
    email: contact.email.display,
    telephone: contact.phone.href.replace("tel:", ""),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Business enquiries",
      email: contact.email.display,
      telephone: contact.phone.href.replace("tel:", ""),
      availableLanguage: ["English"],
    },
    sameAs,
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "WordPress",
      "WooCommerce",
      "Shopify",
      "Laravel",
      "Web Design",
      "UI/UX",
      "Technical SEO",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${site.name} — ${site.role}`,
    description: site.shortBio,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website],
  };
}
