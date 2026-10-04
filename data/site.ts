/**
 * Single source of truth for identity, verified credentials and external links.
 *
 * Nothing in this file may be invented. Every value below is either supplied in
 * the project specification or derived from it. Unverified values are `null`
 * and flagged with a TODO — the UI omits any link whose URL is `null` rather
 * than guessing one.
 */

export type SocialLink = {
  label: string;
  href: string;
  /** Rendered in the footer / final CTA when true. */
  external: boolean;
};

/**
 * Canonical production origin. Override with NEXT_PUBLIC_SITE_URL at build
 * time. TODO: confirm the final domain before launch.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sabihulebad.com"
).replace(/\/$/, "");

export const site = {
  name: "Sabih Ul Ebad",
  wordmark: "SABIH.",
  role: "Full-Stack Developer",
  positioning: "Full-Stack Developer & Digital Experience Builder",
  signature: "Designing interfaces. Developing systems. Building for results.",
  footerLine: "Full-Stack Developer — Building thoughtful digital experiences.",
  shortBio:
    "Full-Stack Developer with 8+ years of experience creating thoughtful, high-performance websites, eCommerce platforms and custom web applications.",
  longBio:
    "I'm Sabih Ul Ebad, a Full-Stack Developer with 8+ years of experience working across design, development and digital strategy. I focus on turning ideas and business requirements into polished, scalable digital products that are intuitive for users and practical for businesses.",
  availability: "Available for selected projects",
  yearsExperience: "8+",
} as const;

export const links = {
  upwork: "https://www.upwork.com/freelancers/~01d0a1f51846d16c91",
  linkedin: "https://www.linkedin.com/in/sabihulebadkhan007",
  /** TODO: no verified GitHub URL has been supplied. Add it here to surface the link site-wide. */
  github: null as string | null,
  /** TODO: no verified public email address has been supplied. Add it here (plain address, no mailto:) to surface the link site-wide. */
  email: null as string | null,
} as const;

/** Verified Upwork profile status. Do not extend beyond what the profile shows. */
export const credentials = [
  { value: "8+", label: "Years Experience" },
  { value: "Top Rated", label: "On Upwork", href: links.upwork },
  { value: "100%", label: "Job Success" },
  { value: "20+", label: "Upwork Jobs Completed" },
] as const;

/** The restrained three-item credibility row used in the hero. */
export const heroTrust = [
  { label: "8+ Years Experience" },
  { label: "Top Rated on Upwork", href: links.upwork },
  { label: "100% Job Success" },
] as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Experience", href: "/#experience" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

/** Only links with a verified URL are returned, so nothing is ever fabricated. */
export function socialLinks(): SocialLink[] {
  const entries: SocialLink[] = [
    { label: "LinkedIn", href: links.linkedin, external: true },
    { label: "Upwork", href: links.upwork, external: true },
  ];

  if (links.github) {
    entries.push({ label: "GitHub", href: links.github, external: true });
  }

  if (links.email) {
    entries.push({ label: "Email", href: `mailto:${links.email}`, external: false });
  }

  return entries;
}
