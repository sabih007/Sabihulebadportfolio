import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertise } from "@/data/skills";
import { cn } from "@/lib/utils/cn";

/**
 * Expertise, as a bento grid over four layers of the stack.
 *
 * Four equal columns gave every layer the same weight and read as a list; the
 * grid below gives Development the room its item count actually needs, pairs
 * the two middle layers, and lets Performance & SEO run wide so its items sit
 * on one line instead of wrapping into a narrow stack.
 *
 * The spans live here rather than in `data/skills.ts`: which card is wide is a
 * question about this layout, not about the data, and the data is also read by
 * the services page.
 */
const layout: Record<string, { span: string; feature?: boolean }> = {
  development: { span: "lg:col-span-3 lg:row-span-2", feature: true },
  "cms-ecommerce": { span: "lg:col-span-3" },
  design: { span: "lg:col-span-3" },
  "performance-seo": { span: "lg:col-span-6" },
};

export function Expertise() {
  return (
    <Section tone="ice" aria-labelledby="expertise-heading">
      <SectionHeading
        index="03"
        id="expertise-heading"
        eyebrow="Expertise"
        lines={["From interface", "to infrastructure."]}
        lead="I work across the web stack — from crafting polished interfaces to developing the systems and integrations behind them."
      />

      <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-6">
        {expertise.map((group, index) => {
          const { span, feature } = layout[group.id] ?? { span: "lg:col-span-3" };
          const wide = group.id === "performance-seo";

          return (
            <Reveal
              key={group.id}
              delay={index * 0.07}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-panel border border-line/12 bg-raised p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-blue/35 hover:shadow-[0_24px_50px_-34px_rgba(41,54,129,0.5)] sm:p-8",
                span,
              )}
            >
              {/* Decoration, revealed on hover so the grid is quiet at rest. */}
              <div
                aria-hidden
                className="wash wash-cyan-soft -right-20 -bottom-24 size-56 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              {feature ? (
                <div
                  aria-hidden
                  className="gradient-rule pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
                />
              ) : null}

              <div className="relative flex items-start justify-between gap-4">
                <IconBox name={group.icon} size={feature ? "lg" : "md"} />
                <span className="font-accent text-label tabular-nums text-accent/85">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative mt-7">
                <h3
                  className={cn(
                    "font-semibold text-navy",
                    feature ? "text-title" : "text-subtitle",
                  )}
                >
                  {group.title}
                </h3>
                <p className="mt-3 max-w-[34ch] font-accent text-meta text-fg/80">{group.note}</p>
              </div>

              <ul
                className={cn(
                  "relative mt-7",
                  wide
                    ? "flex flex-wrap gap-x-7 gap-y-2.5"
                    : feature
                      ? "grid gap-2.5 sm:grid-cols-2"
                      : "flex flex-col gap-2.5",
                  // Pushes the list to the card's foot so the three cards in a
                  // row keep their baselines aligned.
                  !feature && !wide && "mt-auto pt-7",
                )}
              >
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[0.9375rem] text-fg/90"
                  >
                    <span
                      aria-hidden
                      className="size-1 shrink-0 rounded-full bg-blue/40 transition-colors duration-500 group-hover:bg-blue"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
