import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { services } from "@/data/services";
import { cn } from "@/lib/utils/cn";

/**
 * Four surface treatments across four cards, so the grid has a centre of
 * gravity instead of reading as four identical tiles: two plain white cards,
 * one soft-cyan card, one navy card.
 */
const treatments = {
  surface: {
    card: "border-line/12 bg-raised hover:border-blue/35",
    index: "text-accent/85",
    title: "text-navy",
    body: "text-fg/80",
    item: "text-fg/85",
    dot: "bg-blue/45",
    rule: "bg-blue/40",
    iconBox: "",
  },
  cyan: {
    card: "border-cyan/60 bg-cyan/35 hover:border-cyan",
    index: "text-navy/75",
    title: "text-navy",
    body: "text-navy/85",
    item: "text-navy/90",
    dot: "bg-navy/40",
    rule: "bg-navy/35",
    iconBox: "border-navy/20 bg-white/55 text-navy group-hover:border-navy/40 group-hover:bg-white/80 group-hover:text-navy",
  },
  navy: {
    card: "border-navy bg-navy hover:border-cyan/60",
    index: "text-cyan/90",
    title: "text-ice",
    body: "text-ice/85",
    item: "text-ice/90",
    dot: "bg-cyan/70",
    rule: "bg-cyan/60",
    iconBox: "border-cyan/25 bg-cyan/10 text-cyan group-hover:border-cyan/55 group-hover:bg-cyan/18 group-hover:text-ice",
  },
} as const;

type ServicesProps = {
  /** The homepage version links on to /services. */
  withLink?: boolean;
  id?: string;
};

export function Services({ withLink = true, id = "services" }: ServicesProps) {
  return (
    <Section tone="light" id={id} aria-labelledby={`${id}-heading`}>
      <SectionHeading
        index="02"
        id={`${id}-heading`}
        eyebrow="Services"
        lines={["What I can help", "you build."]}
        lead="Clear scope, honest timelines, and work that is handed over ready to run."
        aside={
          withLink ? (
            <TextLink href="/services" arrow="e">
              See how projects run
            </TextLink>
          ) : undefined
        }
      />

      <ul className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2">
        {services.map((service, index) => {
          const tone = treatments[service.treatment];
          const isNavy = service.treatment === "navy";

          return (
            <Reveal
              as="li"
              key={service.index}
              delay={index * 0.07}
              className={cn(
                "group relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-panel border p-7 transition-colors duration-500 sm:min-h-[21rem] sm:p-9",
                isNavy && "grain-dark",
                tone.card,
              )}
              {...(isNavy ? { "data-tone": "dark" } : {})}
            >
              {isNavy ? (
                <div
                  aria-hidden
                  className="wash wash-blue-strong -top-20 -right-16 size-72"
                />
              ) : null}

              <div className="relative flex items-start justify-between gap-4">
                <IconBox name={service.icon} size="lg" className={tone.iconBox} />

                <div className="flex items-center gap-3 pt-2">
                  <span
                    className={cn(
                      "font-accent text-label uppercase tracking-[0.2em]",
                      tone.index,
                    )}
                  >
                    {service.index}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-10 origin-right scale-x-0 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                      tone.rule,
                    )}
                  />
                </div>
              </div>

              <div className="relative">
                <h3
                  className={cn(
                    "text-subtitle font-semibold text-balance-safe sm:text-[1.75rem] sm:leading-tight",
                    tone.title,
                  )}
                >
                  {service.title}
                </h3>
                <p className={cn("mt-4 max-w-[40ch] text-body", tone.body)}>{service.body}</p>

                <ul className="mt-7 flex flex-col gap-2">
                  {service.includes.map((item) => (
                    <li key={item} className={cn("flex items-center gap-3 text-meta", tone.item)}>
                      <span aria-hidden className={cn("size-1 shrink-0 rounded-full", tone.dot)} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
