import { AboutIntro } from "@/components/about/AboutIntro";
import { Philosophy } from "@/components/about/Philosophy";
import { QuickProfile } from "@/components/about/QuickProfile";
import { FinalCta } from "@/components/contact/FinalCta";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Expertise } from "@/components/expertise/Expertise";
import { Marquee } from "@/components/expertise/Marquee";
import { Faq } from "@/components/faq/Faq";
import { ClientReviews } from "@/components/feedback/ClientReviews";
import { Hero } from "@/components/hero/Hero";
import { JsonLd, faqSchema } from "@/components/layout/StructuredData";
import { Services } from "@/components/services/Services";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { UpworkTrust } from "@/components/testimonials/UpworkTrust";
import { SelectedWork } from "@/components/work/SelectedWork";
import { faq } from "@/data/faq";
import { listPublishedFeedback } from "@/lib/feedback/store";

/**
 * Homepage order follows the specification's priority list: identity, then the
 * quality of the work, then credibility, expertise, business understanding,
 * client trust, and finally an easy way to make contact.
 *
 * Revalidated hourly as a backstop so an approved review is never more than an
 * hour stale. Approving one calls `revalidatePath("/")`, so in practice it
 * appears immediately.
 */
export const revalidate = 3600;

export default async function HomePage() {
  const published = await listPublishedFeedback();

  return (
    <>
      {/* FAQPage markup for the accordion below. The answers in the markup are
          the same strings the accordion renders — never content a visitor
          cannot find on the page. */}
      <JsonLd data={faqSchema(faq)} />

      <Hero />
      <QuickProfile />
      <SelectedWork />
      <AboutIntro />
      <Philosophy />
      <ExperienceSection />
      <Expertise />
      <Marquee />
      <Services />
      <UpworkTrust />
      {/* A selection only: the full record lives on /reviews. */}
      <Testimonials limit={3} />
      {/* Renders nothing until a review left on this site is approved. */}
      <ClientReviews entries={published.slice(0, 4)} tone="ice" />
      <Faq />
      <FinalCta />
    </>
  );
}
