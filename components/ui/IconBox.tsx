import { ICON_STROKE, icons } from "@/lib/icons";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Icon primitives.
 *
 * Two of them, and they are the only way an icon reaches the page:
 *
 *   <Icon />     an inline glyph, for buttons, links and list rows.
 *   <IconBox />  a framed glyph, for the anchor at the top of a card.
 *
 * Both take a name from `lib/icons.ts` rather than a component, so no file
 * outside that module decides which glyph means what, and both pin the same
 * stroke weight — mismatched stroke is the fastest way to make an icon set
 * look assembled rather than designed.
 *
 * Colours come from the tone tokens (`--color-line`, `--color-accent`), so a
 * box renders correctly on paper, on ice and on navy without being told which
 * it is sitting on.
 */

const BOX_SIZES = {
  sm: { box: "size-10 rounded-[0.75rem]", glyph: 17 },
  md: { box: "size-12 rounded-[0.875rem]", glyph: 20 },
  lg: { box: "size-[3.25rem] rounded-[0.95rem]", glyph: 22 },
} as const;

type IconProps = {
  name: IconName;
  /** Pixel size of the glyph itself. */
  size?: number;
  className?: string;
};

export function Icon({ name, size = 18, className }: IconProps) {
  const Glyph = icons[name];

  return (
    <Glyph
      aria-hidden
      size={size}
      strokeWidth={ICON_STROKE}
      className={cn("shrink-0", className)}
    />
  );
}

type IconBoxProps = {
  name: IconName;
  size?: keyof typeof BOX_SIZES;
  /**
   * `accent` tints the glyph with the tone's accent colour. Used sparingly —
   * one accented box per group at most, so it still reads as emphasis.
   */
  tone?: "line" | "accent";
  /**
   * Set when an ancestor carries `group`, so the box can answer that card's
   * hover rather than only its own. Off by default: a box inside a card
   * should not light up independently of the card.
   */
  interactive?: boolean;
  className?: string;
};

export function IconBox({
  name,
  size = "md",
  tone = "line",
  interactive = true,
  className,
}: IconBoxProps) {
  const { box, glyph } = BOX_SIZES[size];

  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex items-center justify-center border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        box,
        tone === "accent"
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-line/14 bg-line/5 text-fg/85",
        interactive &&
          "group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent",
        className,
      )}
    >
      <Icon name={name} size={glyph} />
    </span>
  );
}
