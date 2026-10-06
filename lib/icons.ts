import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleCheckBig,
  Clock3,
  Code2,
  Gauge,
  Globe2,
  Layers,
  Layers3,
  Lightbulb,
  Mail,
  MessagesSquare,
  PenTool,
  Phone,
  Puzzle,
  Quote,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The site's single icon vocabulary.
 *
 * One library — Lucide — and one place that decides which glyph stands for
 * which idea. Components and data files refer to icons by name, so the same
 * concept cannot end up as `Code2` in one section and `Terminal` in another,
 * and swapping a glyph is a one-line change here rather than a hunt through
 * the tree.
 *
 * Only icons actually in use are listed. Adding one means adding it here
 * first, which keeps the set deliberately small — an icon language works by
 * being learnable, and a hundred glyphs is not a language.
 */
export const icons = {
  // Services
  development: Code2,
  design: PenTool,
  ecommerce: ShoppingBag,
  cms: Layers,
  performance: Gauge,
  seo: Search,
  integrations: Workflow,

  // How I work — the four principles
  quality: Sparkles,
  outcome: Target,
  reliable: ShieldCheck,
  solution: Lightbulb,

  // About / strengths
  business: ChartNoAxesCombined,
  communication: MessagesSquare,
  problemSolving: Puzzle,

  // Statistics
  experience: Clock3,
  projects: BriefcaseBusiness,
  jobSuccess: CircleCheckBig,
  builds: Layers3,

  // Trust
  verified: BadgeCheck,
  rating: Star,
  quote: Quote,

  // Contact and links.
  //
  // There is no brand glyph for LinkedIn or Upwork here on purpose: Lucide
  // dropped its brand icons at v1, and importing a second library for two
  // marks would break the one-vocabulary rule for the sake of two links.
  // Social profiles are external links, so they carry the external arrow and say
  // whose profile they are in their own label.
  email: Mail,
  phone: Phone,
  remote: Globe2,
  external: ArrowUpRight,
} as const;

export type IconName = keyof typeof icons;

export type { LucideIcon };

/**
 * One stroke weight for the whole site.
 *
 * Lucide ships at 2, which reads heavy beside this site's type at the sizes
 * icons are used here. 1.6 sits with the hairline rules and the 1px borders
 * the layout already uses.
 */
export const ICON_STROKE = 1.6;
