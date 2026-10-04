/**
 * Experience timeline.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *  TODO — VERIFIED EXPERIENCE ENTRIES REQUIRED
 *
 *  No employment history, company names, locations or exact dates were supplied,
 *  and none may be invented. `experience` is therefore intentionally empty.
 *
 *  The <Timeline> component is complete and data-driven: add entries in the
 *  shape below (newest first) and the timeline renders automatically, with
 *  expand/collapse, in place of the pending-verification panel.
 *
 *  Example of the expected shape — uncomment and replace with real values:
 *
 *  {
 *    id: "2022-present-independent",
 *    range: "2022 — Present",
 *    role: "Full-Stack Developer",
 *    organisation: "Independent / Client Work",
 *    locationType: "Remote",
 *    summary: "One sentence on the kind of work in this period.",
 *    detail: [
 *      "A short paragraph of verified detail.",
 *      "A second paragraph if useful.",
 *    ],
 *    technologies: ["Next.js", "TypeScript", "WordPress"],
 *  }
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type ExperienceEntry = {
  id: string;
  /** Year or range, e.g. "2022 — Present". */
  range: string;
  role: string;
  /** Company or client type. */
  organisation: string;
  /** Location or working arrangement, e.g. "Remote". */
  locationType?: string;
  summary: string;
  /** Paragraphs revealed on expand. */
  detail?: string[];
  technologies?: string[];
};

export const experience: ExperienceEntry[] = [];

export const hasExperienceEntries = experience.length > 0;

/**
 * What the 8+ years covers. These are the supplied, verifiable facts only —
 * no employers, titles or dates are implied.
 */
export const experienceFacts = [
  {
    value: "8+",
    label: "Years building for the web",
    note: "Across design, development and digital strategy.",
  },
  {
    value: "20+",
    label: "Upwork jobs completed",
    note: "Client projects delivered end to end.",
  },
  {
    value: "100%",
    label: "Job success score",
    note: "Maintained across completed contracts.",
  },
  {
    value: "4",
    label: "Featured builds from scratch",
    note: "Next.js platforms and production WordPress.",
  },
] as const;
