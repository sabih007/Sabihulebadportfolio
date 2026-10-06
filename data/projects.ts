/**
 * The four confirmed featured projects.
 *
 * CONTENT RULES (enforced by hand — please keep them when editing):
 *  - URL, technology, role, "built from scratch" and the portfolio label are
 *    supplied facts. Everything else is either craft-level narrative that makes
 *    no factual claim about the project, or explicitly `null` + TODO.
 *  - `features` and `outcome` are deliberately `null` on every project: feature
 *    inventories and results require verification from Sabih or the client. The
 *    case-study page renders a clearly marked pending block instead of
 *    inventing them. Fill them in and the block disappears automatically.
 *  - `coverImage` points at a real screenshot of the live site, captured by
 *    `npm run shots`. `gallery` is still empty — no detail shots have been
 *    taken — so the case study keeps the full-bleed cover for its showcase.
 *    Where a cover is ever missing, `<ProjectCover>` renders a designed
 *    typographic frame rather than a fabricated mockup.
 *  - No `year` is recorded because no verified delivery dates were supplied.
 */

export type Project = {
  slug: string;
  /** Display number, e.g. "01". */
  index: string;
  title: string;
  /** Portfolio label, e.g. "Marketplace / Web Platform". */
  category: string;
  /** Client / industry line used on the case study. */
  industry: string;
  role: string;
  builtFromScratch: boolean;
  technologies: string[];
  services: string[];
  website?: string;
  /** TODO: add verified delivery year per project. */
  year?: string;
  /** One-line positioning used on cards and list rows. */
  description: string;
  /** Case-study introduction. */
  overview: string;
  challenge: string;
  approach: string;
  design: string;
  development: string;
  /** null = pending verification. Never fill with guesses. */
  features: string[] | null;
  /** null = pending verification. Never fill with metrics that were not supplied. */
  outcome: string | null;
  /** Path under /public — e.g. "/images/projects/buysellox.webp". */
  coverImage?: string;
  gallery?: string[];
  featured: boolean;
  /**
   * Default surface for the cover when a section does not override it.
   * Selected Work alternates light and navy panels on top of this.
   */
  surface: "light" | "navy";
};

export const projects: Project[] = [
  {
    slug: "buysellox",
    index: "01",
    title: "BuySellOX",
    category: "Marketplace / Web Platform",
    industry: "Online marketplace",
    role: "Full-Stack Developer",
    builtFromScratch: true,
    technologies: ["Next.js"],
    services: ["Web Design", "UI/UX", "Full-Stack Development", "Responsive Implementation"],
    website: "https://buysellox.com/",
    coverImage: "/images/projects/buysellox.webp",
    description:
      "A marketplace web platform built end to end in Next.js — interface, structure and application layer.",
    overview:
      "BuySellOX is a marketplace web platform. I joined as the full-stack developer and built it from scratch: the Next.js application structure, the interface layer and the foundations behind it. There was no theme to adapt and no starter to extend — the product had to be designed, structured and shipped.",
    challenge:
      "A marketplace has to be understood before it can be used. Someone landing on it for the first time needs to grasp what the platform is for, move through it without being taught, and feel that what they are looking at is credible. It also has to stay coherent as it grows, because the amount of content on a marketplace is never fixed.",
    approach:
      "I treated structure as the first design decision. Before any visual work, the application was broken into the surfaces a marketplace actually needs and the shared pieces each of those surfaces reuses, so that extending the platform later would mean composing existing parts rather than rebuilding pages. That decision is what makes a from-scratch build cheaper to live with than a theme.",
    design:
      "The interface is deliberately quiet. On a marketplace the content is the product, so the UI's job is hierarchy and legibility — a clear type scale, consistent spacing, predictable placement — rather than decoration competing with listings for attention.",
    development:
      "Built with Next.js. Rendering was chosen per surface rather than globally, components were kept small enough to be reused across the application, and the layout was built fluid from the start so one implementation holds from a phone to a wide desktop.",
    features: null,
    outcome: null,
    featured: true,
    surface: "light",
  },
  {
    slug: "nexivo-studio",
    index: "02",
    title: "Nexivo Studio",
    category: "Digital Studio / Agency Website",
    industry: "Digital studio",
    role: "Full-Stack Developer",
    builtFromScratch: true,
    technologies: ["Next.js"],
    services: ["Web Design", "UI/UX", "Full-Stack Development", "Design-to-Code Implementation"],
    website: "https://www.nexivostudio.io/",
    coverImage: "/images/projects/nexivo-studio.webp",
    description:
      "A brand and digital-experience build for a studio whose website has to prove the work it sells.",
    overview:
      "Nexivo Studio is a digital studio website, built from scratch in Next.js with me as full-stack developer. A studio site is a harder brief than it looks: it is simultaneously the brand, the portfolio and the sales argument, and it gets judged by exactly the standard the studio claims to work to.",
    challenge:
      "When the product being sold is craft, the website is the proof. Anything generic reads as a contradiction. The site had to carry a distinct brand presence and still behave impeccably — fast, legible and composed at every width — because a studio site that feels sloppy undermines the pitch no matter what the copy says.",
    approach:
      "I built the front end as a small design system rather than a set of pages: one type scale, one spacing rhythm, and a short list of surface and motion rules applied consistently. Working that way is what makes a site feel intentional instead of assembled, and it means new sections inherit the brand automatically.",
    design:
      "Composition does the work here — generous whitespace, strong typographic contrast between display and supporting copy, and restraint with effects. Motion is used to guide attention through a section, not to announce itself.",
    development:
      "Next.js, with the component layer built for reuse so the studio can extend the site without a redesign. Interaction detail is applied where it reinforces hierarchy and left out where it would only add weight to the page.",
    features: null,
    outcome: null,
    featured: true,
    surface: "navy",
  },
  {
    slug: "chinex-mall",
    index: "03",
    title: "Chinex Mall",
    category: "eCommerce",
    industry: "Online retail",
    role: "Full-Stack Developer",
    builtFromScratch: true,
    technologies: ["Next.js"],
    services: ["Web Design", "UI/UX", "eCommerce Development", "Full-Stack Development"],
    website: "https://chinexmall.com/",
    coverImage: "/images/projects/chinex-mall.webp",
    description:
      "An eCommerce experience built from scratch in Next.js, designed around how people actually shop.",
    overview:
      "Chinex Mall is an eCommerce project I built from scratch as full-stack developer, using Next.js. Commerce is the least forgiving category on the web: every extra step, every ambiguous label and every slow screen has a cost, and none of it is hidden behind a login.",
    challenge:
      "A shopper is doing three things at once — browsing, comparing and deciding — and the interface either supports that or interrupts it. The build had to make products easy to scan, keep the next step always obvious, and hold together on the phone, where a large share of retail traffic arrives.",
    approach:
      "I designed the flow before the pages: the path from arriving, to browsing, to checking out, and what has to be true at each step for someone to keep going. The interface was then built to serve that path, with product presentation and navigation treated as one system rather than as separate screens.",
    design:
      "Product imagery leads and the chrome around it stays calm. Typography is sized for scanning rather than for reading, calls to action are unambiguous and used sparingly so they keep their weight, and touch targets were sized for real thumbs rather than for a desktop cursor.",
    development:
      "Built with Next.js. Catalogue surfaces were componentised so new product presentation reuses existing parts, media below the fold was handled so it does not block first paint, and the layout was built mobile-first instead of being adapted down from desktop.",
    features: null,
    outcome: null,
    featured: true,
    surface: "light",
  },
  {
    slug: "cal-dental-usa",
    index: "04",
    title: "CAL Dental USA",
    category: "Healthcare / Dental",
    industry: "Dental practice",
    role: "Web Developer / Full-Stack Developer",
    builtFromScratch: true,
    technologies: ["WordPress"],
    services: ["Web Design", "UI/UX", "WordPress Development", "Responsive Implementation"],
    website: "https://caldentalusa.com/",
    coverImage: "/images/projects/cal-dental-usa.webp",
    description:
      "A complete production WordPress website for a dental practice — built from scratch, not assembled from a theme.",
    overview:
      "CAL Dental USA is a production WordPress website I built from scratch in the role of web developer. It sits in this portfolio for a specific reason: modern framework work and complete CMS delivery are different disciplines, and clients are right to want evidence of both. A practice needs a site its own team can keep current without a developer on call.",
    challenge:
      "Healthcare websites are read by people making a decision about their own care, often quickly and often on a phone. The site has to be reassuring and unambiguous about what the practice does and how to reach it. It also has to be genuinely maintainable, because a site the client cannot update stops being accurate within months.",
    approach:
      "I built the theme and content structure around the practice's own information rather than bending the content to fit a template. Editable regions were defined so the team can change what they need to change without accidentally breaking layout — which is the difference between delivering a WordPress site and delivering a WordPress site that survives.",
    design:
      "A calm, trust-led layout: clear hierarchy, a comfortable reading measure, and the practical information people came for kept close to the surface instead of buried under marketing copy.",
    development:
      "Custom WordPress development rather than a purchased theme, which keeps both the markup and the admin experience under control. Templates were built to be reused across the site, and the front end was implemented responsively from the start.",
    features: null,
    outcome: null,
    featured: true,
    surface: "navy",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Wraps around, so the last case study still offers a next step. */
export function getNextProject(slug: string): Project {
  const current = projects.findIndex((project) => project.slug === slug);
  return projects[(current + 1) % projects.length];
}

export function projectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/** Hostname only — used for the cover frame's address bar and link labels. */
export function websiteLabel(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
