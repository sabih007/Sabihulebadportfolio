import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { site, socialLinks } from "@/data/site";

/**
 * The visual finale, and the start of the closing navy block that runs into the
 * footer. The brand gradient appears once more on "great." — here it runs deep
 * cyan → ice, because Royal Blue measures only 2.4:1 on navy.
 *
 * Oversized headline, one primary action, and the verified secondary links:
 * Email and GitHub appear automatically once real values are added to
 * data/site.ts, and are simply absent until then.
 */
export function FinalCta() {
  const social = socialLinks();

  return (
    <section
      data-tone="dark"
      aria-labelledby="cta-heading"
      className="grain-dark relative overflow-hidden bg-surface py-24 text-fg sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="wash wash-blue-strong -bottom-56 left-1/2 h-[38rem] w-[72rem] -translate-x-1/2"
      />
      <div
        aria-hidden
        className="wash wash-cyan-soft -top-40 right-[-8%] size-[34rem]"
      />
      <div
        aria-hidden
        className="rule-grid pointer-events-none absolute inset-x-0 bottom-0 h-2/3 [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      <div className="shell relative">
        <Reveal distance={12}>
          <Label rule>Next step</Label>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="cta-heading"
            className="mt-8 text-display font-bold text-ice uppercase text-balance-safe"
          >
            <span className="block">Have an idea?</span>
            <span className="block">Let&rsquo;s build</span>
            <span className="block">
              something <span className="gradient-text">great.</span>
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal delay={0.12} className="max-w-xl">
            <p className="text-lead text-ice/90 text-pretty-safe">
              Tell me what you&rsquo;re working on and let&rsquo;s see how I can help bring it
              to life.
            </p>
            <div className="mt-8">
              <Magnetic>
                <ButtonLink href="/contact" variant="contrast" arrow="ne">
                  Start a Project
                </ButtonLink>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <ul className="flex flex-col gap-px border-t border-line/16 pt-5 sm:flex-row sm:gap-10 sm:border-t-0 sm:pt-0">
              {social.map((item) => (
                <li
                  key={item.label}
                  className="border-b border-line/14 py-3 sm:border-b-0 sm:py-0"
                >
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer", "data-cursor": "arrow" }
                      : {})}
                    className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ice/85 transition-colors duration-300 hover:text-cyan"
                  >
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-cyan/60 transition-colors duration-300 group-hover:bg-cyan"
                    />
                    {item.label}
                    {item.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[34ch] font-accent text-meta text-ice/80">
              {site.availability}. Based remote, working with clients worldwide.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
