import type { FaqItem } from "@/data/faq";
import { services } from "@/data/services";
import { SITE_URL, contact, links, site } from "@/data/site";
import type { Testimonial } from "@/data/testimonials";
import type { PublicFeedback } from "@/lib/feedback/store";

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

/** Canonical absolute URL for a site-relative path. */
function absolute(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
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

  /**
   * The freelance practice as a distinct node from the person, so service,
   * review and offer data has something to attach to. `areaServed: Worldwide`
   * rather than a city: the work is remote and claiming a local address the
   * business does not have would be a fabrication.
   */
  const business = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#practice`,
    name: `${site.name} — ${site.role}`,
    description: site.positioning,
    url: SITE_URL,
    email: contact.email.display,
    telephone: contact.phone.href.replace("tel:", ""),
    founder: { "@id": `${SITE_URL}/#person` },
    areaServed: { "@type": "Place", name: "Worldwide" },
    availableLanguage: ["English"],
    priceRange: "$$",
    knowsLanguage: ["en"],
    sameAs,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, business],
  };
}

/**
 * BreadcrumbList for an inner page.
 *
 * Google uses this for the breadcrumb trail shown in place of the raw URL in
 * results, so every page below the root declares its own.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

/**
 * FAQPage for the homepage accordion.
 *
 * The answers here are the same strings the accordion renders — the markup must
 * never describe content a visitor cannot find on the page, which is both a
 * Google requirement and the honest thing to do.
 */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.join(" "),
      },
    })),
  };
}

/** The service catalogue, attached to the practice node. */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absolute("/services")}#page`,
        url: absolute("/services"),
        name: "Services",
        about: { "@id": `${SITE_URL}/#practice` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#practice`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web design and development services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.body,
              provider: { "@id": `${SITE_URL}/#person` },
              areaServed: { "@type": "Place", name: "Worldwide" },
              serviceType: service.title,
            },
          })),
        },
      },
    ],
  };
}

/**
 * Review + AggregateRating for the reviews page.
 *
 * A note on expectations: Google does not show review-snippet rich results for
 * reviews an entity collects about itself on its own site. This markup is here
 * because it is accurate and it helps search engines understand the entity and
 * its reputation — not because it will put stars in the results. Nothing is
 * inflated to chase that: the aggregate is computed from the real entries, and
 * reviews with a rating but no written text are counted, never quoted.
 */
export function reviewsSchema({
  upwork,
  website,
  ratingOnly,
}: {
  upwork: Testimonial[];
  website: PublicFeedback[];
  ratingOnly: Testimonial[];
}) {
  const reviews = [
    ...upwork
      .filter((entry) => entry.quote)
      .map((entry) => ({
        "@type": "Review" as const,
        reviewRating: {
          "@type": "Rating",
          ratingValue: entry.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: entry.quote,
        name: entry.project,
        // No client names were supplied as publicly verified, so the review is
        // attributed to the platform it was left on rather than to a person.
        author: { "@type": "Organization", name: "Verified Upwork client" },
        publisher: { "@type": "Organization", name: "Upwork" },
        itemReviewed: { "@id": `${SITE_URL}/#practice` },
      })),
    ...website.map((entry) => ({
      "@type": "Review" as const,
      reviewRating: {
        "@type": "Rating",
        ratingValue: entry.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: entry.quote,
      name: entry.headline,
      datePublished: entry.submittedAt.slice(0, 10),
      author: { "@type": "Person", name: entry.name },
      itemReviewed: { "@id": `${SITE_URL}/#practice` },
    })),
  ];

  const rated = [...upwork, ...ratingOnly, ...website];
  const total = rated.reduce((sum, entry) => sum + entry.rating, 0);

  const aggregate =
    rated.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: Math.round((total / rated.length) * 100) / 100,
          reviewCount: reviews.length,
          ratingCount: rated.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absolute("/reviews")}#page`,
        url: absolute("/reviews"),
        name: "Client Reviews",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#practice`,
        aggregateRating: aggregate,
        review: reviews,
      },
    ],
  };
}

/** ProfilePage for /about, which is what that page actually is. */
export function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absolute("/about")}#page`,
    url: absolute("/about"),
    name: `About ${site.name}`,
    description: site.longBio,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

/** ContactPage for /contact. */
export function contactSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absolute("/contact")}#page`,
    url: absolute("/contact"),
    name: "Contact",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

