import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertise } from "@/data/skills";

/**
 * Expertise, grouped into four layers of the stack. Rendered as editorial
 * columns of plain text rather than a wall of logo pills.
 */
export function Expertise() {
  return (
    <Section tone="ice" aria-labelledby="expertise-heading">
      <SectionHeading
        id="expertise-heading"
        eyebrow="Expertise"
        lines={["From interface", "to infrastructure."]}
        lead="I work across the web stack — from crafting polished interfaces to developing the systems and integrations behind them."
      />

      <div className="mt-16 grid gap-px sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {expertise.map((group, index) => (
          <Reveal
            key={group.id}
            delay={index * 0.07}
            className="border-t border-line/15 pt-7 sm:pr-6"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-subtitle font-semibold text-navy">{group.title}</h3>
              <span className="font-accent text-label tabular-nums text-accent/70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <p className="mt-3 max-w-[30ch] font-accent text-meta text-fg/65">{group.note}</p>

            <ul className="mt-6 space-y-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="group flex items-center gap-3 text-[0.9375rem] text-fg/80"
                >
                  <span
                    aria-hidden
                    className="size-1 shrink-0 rounded-full bg-blue/40 transition-colors duration-300 group-hover:bg-blue"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
