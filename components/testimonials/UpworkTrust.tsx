import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Icon, IconBox } from "@/components/ui/IconBox";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { links } from "@/data/site";

const stats = [
  { value: "Top Rated", label: "Upwork", icon: "verified" },
  { value: "100%", label: "Job Success", icon: "jobSuccess" },
  { value: "20+", label: "Completed Upwork Jobs", icon: "projects" },
] as const;

/**
 * Opens the page's second navy passage, which runs on into the testimonials.
 * States only what the public profile shows and says so explicitly, so nothing
 * here reads as an endorsement by Upwork itself.
 */
export function UpworkTrust() {
  return (
    <Section tone="dark" flush="bottom" aria-labelledby="upwork-heading">
      <div
        aria-hidden
        className="wash wash-blue-strong -top-32 right-[-6%] size-[36rem]"
      />
      <div aria-hidden className="rule-grid pointer-events-none absolute inset-0 opacity-60" />

      <Reveal className="relative">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <Label rule>Verified profile</Label>
            <h2
              id="upwork-heading"
              className="mt-6 max-w-[24ch] text-title font-semibold text-ice text-balance-safe"
            >
              Eight years of client work, documented publicly.
            </h2>
            <p className="mt-5 max-w-[48ch] text-body text-ice/85">
              Every rating and review on this site comes from Sabih&rsquo;s public Upwork
              profile. The profile is linked below so you can read it in full, in context,
              rather than taking a portfolio&rsquo;s word for it.
            </p>

            <div className="mt-9">
              <Magnetic>
                <ButtonLink href={links.upwork} external variant="contrast" arrow="ne">
                  View My Upwork Profile
                </ButtonLink>
              </Magnetic>
            </div>
          </div>

          <Reveal
            delay={0.1}
            className="shrink-0 rounded-panel border border-line/16 bg-raised/50 p-7 backdrop-blur-sm sm:p-8 lg:max-w-md"
          >
            <p className="flex items-center gap-2.5 font-accent text-label uppercase tracking-[0.18em] text-cyan/95">
              <Icon name="verified" size={16} />
              Verified on Upwork
            </p>

            <dl className="mt-7 grid grid-cols-1 items-start gap-x-6 gap-y-7 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={0.14 + index * 0.08}
                  className="group flex flex-col-reverse border-t border-line/18 pt-5 sm:pr-4"
                >
                  {/* Reversed visually so the figure leads; DOM order stays dt → dd. */}
                  <dt className="mt-2.5 font-accent text-meta text-cyan/95">{stat.label}</dt>
                  {/* Two lines of room whatever the value is: "Top Rated" wraps
                      where the figures do not, and without a floor the three
                      labels beneath them stop sharing a baseline. */}
                  <dd className="flex min-h-[2em] flex-col justify-start text-[1.75rem] leading-none font-bold tracking-[-0.03em] text-ice sm:text-[2rem]">
                    <Counter value={stat.value} />
                  </dd>
                  <IconBox
                    name={stat.icon}
                    size="sm"
                    className="mb-4 border-cyan/25 bg-cyan/10 text-cyan group-hover:border-cyan/55 group-hover:bg-cyan/18 group-hover:text-ice"
                  />
                </Reveal>
              ))}
            </dl>
          </Reveal>
        </div>
      </Reveal>
    </Section>
  );
}
