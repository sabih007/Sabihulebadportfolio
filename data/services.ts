export type Service = {
  index: string;
  title: string;
  body: string;
  /** Capability lines — deliberately short, never a pill wall. */
  includes: string[];
  /** Surface treatment. One cyan and one navy card create the visual rhythm. */
  treatment: "surface" | "cyan" | "navy";
};

export const services: Service[] = [
  {
    index: "01",
    title: "Web Development",
    body: "High-performance websites and applications built with modern technologies.",
    includes: ["Next.js & React builds", "Custom web applications", "Performance work"],
    treatment: "surface",
  },
  {
    index: "02",
    title: "Web Design & UI/UX",
    body: "Thoughtful digital interfaces balancing aesthetics, usability and business requirements.",
    includes: ["Interface design", "Responsive systems", "Design-to-code implementation"],
    treatment: "cyan",
  },
  {
    index: "03",
    title: "eCommerce",
    body: "Custom shopping experiences using Shopify, WooCommerce or custom solutions.",
    includes: ["Shopify & WooCommerce", "Custom storefronts", "Checkout and catalogue UX"],
    treatment: "surface",
  },
  {
    index: "04",
    title: "WordPress & Custom Solutions",
    body: "Custom WordPress development, integrations, functionality and performance improvements.",
    includes: ["Custom themes", "Functionality & integrations", "Maintainable editing"],
    treatment: "navy",
  },
];

/** Project types offered in the contact form's select. */
export const projectTypes = [
  "Website design & development",
  "Custom web application",
  "eCommerce build or migration",
  "WordPress development",
  "Redesign of an existing site",
  "Performance or technical SEO",
  "Something else",
] as const;

/**
 * Budget ranges are optional on the form and intentionally broad. No past
 * contract values are referenced anywhere in this project.
 */
export const budgetRanges = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $7,500",
  "$7,500 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;
