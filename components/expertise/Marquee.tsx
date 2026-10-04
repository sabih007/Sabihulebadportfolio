import { marqueeItems } from "@/data/skills";

/**
 * Technology marquee.
 *
 * Pure CSS (see `.marquee-track` in globals.css) so it costs no JavaScript and
 * no scroll listener. The track holds the list twice and translates by exactly
 * -50%, which makes the loop seamless. Hover and keyboard focus pause it, and
 * the reduced-motion media query stops it outright.
 *
 * Set as text, not logos — a logo cloud would say less and weigh more. The
 * edges are softened with a mask rather than an overlaid gradient.
 */
export function Marquee() {
  const sequence = [...marqueeItems, ...marqueeItems];

  return (
    <section
      aria-label="Technologies I work with"
      className="marquee-shell relative overflow-hidden border-y border-navy/10 bg-white py-7 [mask-image:linear-gradient(to_right,transparent,black_4rem,black_calc(100%-4rem),transparent)] sm:py-9 sm:[mask-image:linear-gradient(to_right,transparent,black_8rem,black_calc(100%-8rem),transparent)]"
    >
      {/* Static, readable source of the same content for assistive technology. */}
      <p className="sr-only">{marqueeItems.join(", ")}</p>

      <div aria-hidden className="marquee-track">
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center whitespace-nowrap">
            <span className="px-5 text-[0.9375rem] font-medium tracking-[0.08em] text-navy/70 uppercase sm:px-7 sm:text-[1.0625rem]">
              {item}
            </span>
            <span className="text-blue/45">—</span>
          </span>
        ))}
      </div>
    </section>
  );
}
