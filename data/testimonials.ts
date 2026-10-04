/**
 * Real client feedback from Sabih's public Upwork profile.
 *
 * CONTENT RULES:
 *  - Quotes are reproduced verbatim, including original capitalisation,
 *    punctuation and spelling. Only line wrapping is a presentation concern.
 *  - Reviews that show a rating but no written feedback have no `quote`. Never
 *    write one for them.
 *  - Client names are omitted: none were supplied as publicly verified, so the
 *    project title is used as context instead.
 *  - Contract values are never stored or displayed.
 */

export type Testimonial = {
  quote?: string;
  project: string;
  rating: number;
  date?: string;
  source: "Upwork";
  endorsements?: string[];
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    featured: true,
    project: "Logo And Website",
    rating: 5.0,
    date: "Oct 23, 2024 - Oct 24, 2024",
    source: "Upwork",
    quote:
      "I recently had the pleasure of working with sabih on building my website, and I couldn't be happier with the results! From start to finish, the process was smooth and professional. They took the time to understand my vision and offered valuable insights that truly elevated the final product.\n\nThe attention to detail was impressive, and they delivered everything on time, exceeding my expectations. The website is not only visually appealing but also user-friendly and functional. I've received numerous compliments on it already!\n\nI highly recommend Sabih to anyone looking to create or enhance their website. They are knowledgeable, reliable, and a pleasure to work with. Thank you for your hard work!",
    endorsements: [
      "Professional",
      "Clear Communicator",
      "Detail Oriented",
      "Reliable",
      "Committed to Quality",
      "Collaborative",
    ],
  },
  {
    project: "Elementor for Wordpress Specialist",
    rating: 5.0,
    date: "Nov 5, 2024 - Nov 11, 2024",
    source: "Upwork",
    quote:
      "Very efficient freelancer, did exactly what was requested and even helped with an extra issue I had. Recommended!",
    endorsements: ["Reliable", "Accountable for Outcomes", "Solution Oriented"],
  },
  {
    project: "User-Friendly Website Development for Article Posting",
    rating: 5.0,
    date: "Oct 1, 2024 - Oct 7, 2024",
    source: "Upwork",
    quote:
      "Very knowledgeable and understanding. He completed my entire website from scratch to finish in just a few hours.",
    endorsements: ["Committed to Quality", "Reliable"],
  },
  {
    project: "Wordpress developer",
    rating: 5.0,
    date: "Oct 30, 2024 - Nov 1, 2024",
    source: "Upwork",
    quote: "he really gets the job done i really like the solution he gave to my problem",
    endorsements: ["Reliable", "Solution Oriented"],
  },
  {
    project: "Website designer",
    rating: 5.0,
    date: "Jun 11, 2025 - Jul 14, 2025",
    source: "Upwork",
    quote: "Did a great job exact as I wanted 😇😊",
    endorsements: ["Committed to Quality"],
  },
  {
    project: "Designer with a flair for aesthetics, for WordPress/WooCommerce shop",
    rating: 4.8,
    date: "Nov 3, 2024 - Nov 5, 2024",
    source: "Upwork",
    quote:
      "I worked with Sabih on a website project, and overall, it was a positive experience. I appreciate his dedication and commitment to ensuring the project's success. I recommend him for web development tasks.",
    endorsements: ["Committed to Quality", "Accountable for Outcomes"],
  },
  {
    project: "Golf Brand Logo",
    rating: 4.8,
    date: "Nov 10, 2024 - Nov 13, 2024",
    source: "Upwork",
    quote: "Completed the job as asked",
    endorsements: ["Accountable for Outcomes"],
  },
];

/**
 * Completed Upwork contracts that show a rating but no written review.
 * Used only as compact trust indicators — no quotes are ever attributed here.
 */
export const ratingOnlyWork: Testimonial[] = [
  {
    project: "Website",
    rating: 5.0,
    date: "May 13, 2026 - Jul 27, 2026",
    source: "Upwork",
    endorsements: ["Committed to Quality", "Clear Communicator", "Accountable for Outcomes"],
  },
  {
    project: "Put images on my website TONIGHT",
    rating: 5.0,
    date: "Nov 12, 2024 - Nov 13, 2024",
    source: "Upwork",
  },
  {
    project: "Audio Visual Production Website Development",
    rating: 5.0,
    date: "Oct 23, 2024 - Oct 24, 2024",
    source: "Upwork",
  },
];

export const featuredTestimonial =
  testimonials.find((testimonial) => testimonial.featured) ?? testimonials[0];

export const supportingTestimonials = testimonials.filter(
  (testimonial) => !testimonial.featured && Boolean(testimonial.quote),
);

/**
 * The verified Upwork engagement record — project titles and date ranges exactly
 * as they appear on the public profile. Used by the Experience section as real,
 * attributable client history while the detailed employment timeline in
 * `data/experience.ts` awaits verified entries.
 */
export const engagementRecord = [...testimonials, ...ratingOnlyWork]
  .filter((entry): entry is Testimonial & { date: string } => Boolean(entry.date))
  .map((entry) => ({
    project: entry.project,
    date: entry.date,
    rating: entry.rating,
    hasWrittenReview: Boolean(entry.quote),
  }));

/** Distinct endorsement badges across all reviews, most frequent first. */
export function endorsementSummary(): { label: string; count: number }[] {
  const tally = new Map<string, number>();

  for (const entry of [...testimonials, ...ratingOnlyWork]) {
    for (const endorsement of entry.endorsements ?? []) {
      tally.set(endorsement, (tally.get(endorsement) ?? 0) + 1);
    }
  }

  return [...tally.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
