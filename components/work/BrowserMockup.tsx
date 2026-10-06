import Image from "next/image";

import { websiteLabel } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

/**
 * A project screenshot presented inside a minimal browser window.
 *
 * Two things make this read as the live site rather than as a picture of one:
 * the chrome carries the project's real domain, and on hover the tall capture
 * pans upward so you see the page scroll — the detail the brief asks for, and
 * the reason `coverFull` exists alongside `coverImage`.
 *
 * The pan is pure CSS on `transform`, so it stays on the compositor and costs
 * no JavaScript. It is driven by `group-hover/project`, the group the whole
 * card already establishes, so hovering anywhere on the card — not only the
 * image — starts it, and keyboard focus on the card's link does too.
 *
 * Accessibility and touch:
 *  - The chrome is `aria-hidden`; only the screenshot carries a description.
 *  - A touch device never fires hover, so it simply sees the top of the page,
 *    which is the same thing the static cover would have shown.
 *  - `motion-reduce:` disables the pan outright.
 */

type BrowserMockupProps = {
  project: Project;
  /** First card above the fold gets priority loading. */
  priority?: boolean;
  sizes?: string;
  /** How far the page scrolls on hover, as a share of the image's own height. */
  pan?: number;
  className?: string;
};

export function BrowserMockup({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 58vw, 92vw",
  pan = 0.58,
  className,
}: BrowserMockupProps) {
  const host = websiteLabel(project.website);
  const source = project.coverFull ?? project.coverImage;

  // Without a capture there is nothing to frame — the caller falls back to
  // <ProjectCover>, which draws its own designed panel.
  if (!source) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-panel border border-line/14 bg-raised shadow-[0_18px_44px_-32px_rgba(41,54,129,0.45)] transition-[border-color,box-shadow] duration-500",
        className,
      )}
    >
      {/* Window chrome */}
      <div
        aria-hidden
        className="flex h-9 shrink-0 items-center gap-2 border-b border-line/12 bg-line/4 px-4 sm:h-10"
      >
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-line/20" />
          <span className="size-2 rounded-full bg-line/20" />
          <span className="size-2 rounded-full bg-line/20" />
        </span>

        {host ? (
          <span className="mx-auto max-w-[60%] truncate rounded-full border border-line/12 bg-raised px-3 py-1 font-accent text-[0.6875rem] leading-none tracking-[0.04em] text-fg/70">
            {host}
          </span>
        ) : null}
      </div>

      {/* Viewport. The image is taller than this box; hover slides it up. */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 transition-transform duration-[2600ms] ease-[cubic-bezier(0.33,0,0.2,1)] will-change-transform group-hover/project:-translate-y-[var(--pan)] motion-reduce:transition-none motion-reduce:group-hover/project:translate-y-0"
          // A percentage translate resolves against the element's own height —
          // the image's, not the window's — so `pan` is simply the share of
          // the capture that scrolls past. The cap is derived in the default
          // above and deliberately left short of the image's end, so the pan
          // never runs into empty space below the screenshot.
          style={{ "--pan": `${pan * 100}%` } as React.CSSProperties}
        >
          <Image
            src={source}
            alt={`${project.title} — ${project.category} website designed and built by Sabih Ul Ebad`}
            width={1600}
            height={2600}
            priority={priority}
            sizes={sizes}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
