import type { IconName } from "@/lib/icons";

/** Expertise, the technology marquee and the client-work principles. */

export type ExpertiseGroup = {
  id: string;
  title: string;
  /** Glyph for the card, named from the shared icon vocabulary. */
  icon: IconName;
  /** Short framing line — what this layer of the stack is actually for. */
  note: string;
  items: string[];
};

export const expertise: ExpertiseGroup[] = [
  {
    id: "development",
    title: "Development",
    icon: "development",
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
    icon: "ecommerce",
    note: "Platforms a client's own team can run.",
    items: ["WordPress", "WooCommerce", "Shopify", "Custom eCommerce Development"],
  },
  {
    id: "design",
    title: "Design",
    icon: "design",
    note: "Interfaces designed to be built, not just drawn.",
    items: ["Web Design", "UI/UX", "Responsive Interfaces", "Design-to-Code Implementation"],
  },
  {
    id: "performance-seo",
    title: "Performance & SEO",
    icon: "performance",
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
    icon: "quality" as const,
    body: "Care about details, from the interface users see to the implementation behind it.",
  },
  {
    index: "02",
    title: "Outcome Focused",
    icon: "outcome" as const,
    body: "Build around the actual goal of the project rather than simply completing a feature checklist.",
  },
  {
    index: "03",
    title: "Reliable",
    icon: "reliable" as const,
    body: "Clear expectations, consistent communication and ownership from beginning to completion.",
  },
  {
    index: "04",
    title: "Solution Oriented",
    icon: "solution" as const,
    body: "Focus on finding practical solutions when challenges appear.",
  },
] as const;
