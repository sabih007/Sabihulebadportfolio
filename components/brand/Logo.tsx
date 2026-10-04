import Image from "next/image";

import { site } from "@/data/site";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  /**
   * "dark" swaps to the monogram variant whose gradient starts at Royal Blue
   * instead of Deep Navy, so the mark stays visible on a navy surface.
   */
  tone?: "light" | "dark";
  /** Hides the wordmark below `sm`, where the header only has room for the mark. */
  responsive?: boolean;
  /** Monogram edge length in px. The wordmark scales from it. */
  size?: number;
  /** Only the header mark is above the fold. */
  priority?: boolean;
  className?: string;
};

/**
 * Brand lockup: the approved "S" monogram plus the name set in Matimo.
 *
 * The supplied artwork is a single raster lockup whose own wordmark would be
 * ~6px tall at header size — illegible. Pairing the monogram with live type
 * keeps the mark exact, stays crisp at every pixel density, and matches the
 * site's typography. The full supplied lockup is used where it has room to
 * breathe (see `<LogoLockup>`).
 *
 * The monogram shape is never redrawn; `monogram-on-dark.png` only remaps the
 * gradient up the brand ramp. See scripts/generate-brand-assets.mjs.
 *
 * Every caller wraps this in a link that carries its own `aria-label`, so the
 * mark is `aria-hidden` and the wordmark is decorative text.
 */
export function Logo({
  tone = "light",
  responsive = true,
  size = 32,
  priority = false,
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={tone === "dark" ? "/brand/monogram-on-dark.png" : "/brand/monogram.png"}
        alt=""
        aria-hidden
        width={size}
        height={size}
        priority={priority}
        sizes={`${size}px`}
        className="shrink-0"
        style={{ width: size, height: size }}
      />
      <span
        aria-hidden
        className={cn("font-semibold whitespace-nowrap", responsive && "hidden sm:inline")}
        style={{ fontSize: size * 0.4, letterSpacing: "0.13em" }}
      >
        SABIH UL EBAD
      </span>
    </span>
  );
}

/**
 * The approved horizontal lockup exactly as supplied, for light surfaces with
 * enough room for the subtitle to stay legible (roughly 220px wide and up).
 */
export function LogoLockup({ className, width = 320 }: { className?: string; width?: number }) {
  return (
    <Image
      src="/brand/logo-lockup.png"
      alt={`${site.name} — ${site.role}`}
      width={width}
      height={Math.round((width * 298) / 1200)}
      className={cn("h-auto", className)}
      sizes={`${width}px`}
    />
  );
}
