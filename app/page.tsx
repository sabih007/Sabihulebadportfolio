import { AboutIntro } from "@/components/about/AboutIntro";
import { Philosophy } from "@/components/about/Philosophy";
import { QuickProfile } from "@/components/about/QuickProfile";
import { FinalCta } from "@/components/contact/FinalCta";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Expertise } from "@/components/expertise/Expertise";
import { Marquee } from "@/components/expertise/Marquee";
import { Faq } from "@/components/faq/Faq";
import { Hero } from "@/components/hero/Hero";
import { Services } from "@/components/services/Services";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { UpworkTrust } from "@/components/testimonials/UpworkTrust";
import { SelectedWork } from "@/components/work/SelectedWork";

/**
 * Homepage order follows the specification's priority list: identity, then the
 * quality of the work, then credibility, expertise, business understanding,
 * client trust, and finally an easy way to make contact.
 */
export default function HomePage() {
  return (
    <>
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
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
