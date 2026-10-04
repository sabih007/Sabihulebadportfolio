/** Expertise, the technology marquee and the client-work principles. */

export type ExpertiseGroup = {
  id: string;
  title: string;
  /** Short framing line — what this layer of the stack is actually for. */
  note: string;
  items: string[];
};

export const expertise: ExpertiseGroup[] = [
  {
    id: "development",
    title: "Development",
    note: "The layer everything else depends on.",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "PHP",
      "Laravel",
      "HTML5",
      "CSS",
      "Tailwind CSS",
    ],
  },
  {
    id: "cms-ecommerce",
    title: "CMS & eCommerce",
    note: "Platforms a client's own team can run.",
    items: ["WordPress", "WooCommerce", "Shopify", "Custom eCommerce Development"],
  },
  {
    id: "design",
    title: "Design",
    note: "Interfaces designed to be built, not just drawn.",
    items: ["Web Design", "UI/UX", "Responsive Interfaces", "Design-to-Code Implementation"],
  },
  {
    id: "performance-seo",
    title: "Performance & SEO",
    note: "Work that only counts once people can find it.",
    items: ["Technical SEO", "On-Page SEO", "Website Performance", "SEO Audits"],
  },
];

export const marqueeItems = [
  "Next.js",
  "TypeScript",
  "React",
  "WordPress",
  "Shopify",
  "WooCommerce",
  "PHP",
  "Laravel",
  "GSAP",
  "Figma",
];

/** Client-work philosophy, drawn from Upwork feedback themes. */
export const principles = [
  {
    index: "01",
    title: "Quality First",
    body: "Care about details, from the interface users see to the implementation behind it.",
  },
  {
    index: "02",
    title: "Outcome Focused",
    body: "Build around the actual goal of the project rather than simply completing a feature checklist.",
  },
  {
    index: "03",
    title: "Reliable",
    body: "Clear expectations, consistent communication and ownership from beginning to completion.",
  },
  {
    index: "04",
    title: "Solution Oriented",
    body: "Focus on finding practical solutions when challenges appear.",
  },
] as const;
