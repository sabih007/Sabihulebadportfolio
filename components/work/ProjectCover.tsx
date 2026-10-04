import Image from "next/image";

import { websiteLabel } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

export type CoverTone = "light" | "ice" | "navy";

type ProjectCoverProps = {
  project: Project;
  /**
   * "light" = white panel, "ice" = tinted panel for when the surrounding
   * ground is already near-white, "navy" = dark panel for the alternating
   * rhythm of Selected Work.
   */
  tone?: CoverTone;
  /** "cover" for the large cards, "mini" for the hero composition. */
  variant?: "cover" | "mini";
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Project visual.
 *
 * When a verified screenshot has been added to `public/images/projects/` and
 * referenced from `data/projects.ts`, it is rendered through next/image with
 * AVIF/WebP negotiation. Until then this renders a designed typographic frame
 * instead — deliberately *not* a fabricated browser mockup of a site nobody has
 * screenshotted, so nothing on the page misrepresents the work.
 *
 * Sized with container queries and `cqw` units rather than viewport
 * breakpoints, because the same component appears at ~230px inside the bento
 * card and at ~1400px full-bleed on a case study. Its typography has to follow
 * its own box, not the window.
 *
 * TODO: capture 1600×1000 screenshots of each live site, save them as
 * `public/images/projects/<slug>.webp`, and set `coverImage` in data/projects.ts.
 */
export function ProjectCover({
  project,
  tone = "light",
  variant = "cover",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: ProjectCoverProps) {
  const mini = variant === "mini";
  const host = websiteLabel(project.website);
  const dark = tone === "navy";

  return (
    <div
      data-tone={dark ? "dark" : "light"}
      className={cn(
        "@container relative isolate overflow-hidden",
        mini ? "rounded-[0.875rem]" : "rounded-panel",
        "border",
        dark && "border-navy bg-navy",
        tone === "light" && "border-navy/12 bg-white",
        tone === "ice" && "border-navy/20 bg-ice/55",
        className,
      )}
    >
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={`${project.title} — ${project.category} website designed and built by Sabih Ul Ebad`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-[1.035]"
        />
      ) : (
        <Fallback mini={mini} project={project} host={host} dark={dark} />
      )}
    </div>
  );
}

function Fallback({
  project,
  host,
  mini,
  dark,
}: {
  project: Project;
  host: string | null;
  mini: boolean;
  dark: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-[1.02]">
      {/* One restrained brand wash, not a full-surface gradient. */}
      <div
        aria-hidden
        className={cn(
          "wash -right-1/4 -bottom-1/3 size-[78%]",
          dark ? "wash-blue-strong" : "wash-cyan",
        )}
      />
      <div aria-hidden className="rule-grid pointer-events-none absolute inset-0 opacity-80" />

      {/* Browser chrome fragment */}
      <div
        className={cn(
          "relative flex shrink-0 items-center gap-2 border-b",
          dark ? "border-ice/12" : "border-navy/10",
          mini ? "h-[14%] min-h-5 px-2.5" : "h-[9%] min-h-7 px-3 @md:px-5",
        )}
      >
        <span aria-hidden className="flex items-center gap-[0.35em]">
          <Dot mini={mini} dark={dark} />
          <Dot mini={mini} dark={dark} />
          <Dot mini={mini} dark={dark} />
        </span>
        {host ? (
          <span
            className={cn(
              "mx-auto max-w-[62%] truncate rounded-full border px-[0.8em] py-[0.25em] font-accent leading-none",
              dark
                ? "border-ice/12 bg-ice/8 text-ice/85"
                : "border-navy/10 bg-navy/4 text-navy/75",
              mini
                ? "text-[min(3.4cqw,0.5625rem)]"
                : "text-[min(2.3cqw,0.6875rem)] tracking-[0.06em]",
            )}
          >
            {host}
          </span>
        ) : null}
      </div>

      {/* Typographic body */}
      <div
        className={cn(
          "relative flex flex-1 flex-col justify-between",
          mini ? "p-[4.5%]" : "p-[5%] @md:p-[4.5%]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-[4%] -bottom-[6%] font-bold leading-[0.78] tracking-[-0.06em] select-none",
            dark ? "text-ice/12" : "text-navy/8",
            mini ? "text-[22cqw]" : "text-[min(21cqw,11rem)]",
          )}
        >
          {project.index}
        </span>

        <p
          className={cn(
            "relative font-accent uppercase",
            dark ? "text-cyan/95" : "text-navy/70",
            mini
              ? "text-[min(3.2cqw,0.5rem)] tracking-[0.14em]"
              : "text-[min(2.2cqw,0.6875rem)] tracking-[0.18em]",
          )}
        >
          {project.technologies.join(" · ")}
        </p>

        <div className="relative max-w-[72%]">
          <p
            className={cn(
              "font-semibold tracking-[-0.025em]",
              dark ? "text-ice" : "text-navy",
              mini
                ? "text-[min(7cqw,1rem)] leading-tight"
                : "text-[min(5.4cqw,2.5rem)] leading-[1.05]",
            )}
          >
            {project.title}
          </p>
          <p
            className={cn(
              "mt-[0.45em] font-accent leading-snug",
              dark ? "text-ice/85" : "text-navy/75",
              mini ? "text-[min(4cqw,0.625rem)]" : "text-[min(2.9cqw,0.9375rem)]",
            )}
          >
            {project.category}
          </p>
        </div>
      </div>
    </div>
  );
}

function Dot({ mini, dark }: { mini: boolean; dark: boolean }) {
  return (
    <span
      className={cn(
        "block rounded-full",
        dark ? "bg-ice/25" : "bg-navy/18",
        mini ? "size-[1.6cqw] min-w-[2px]" : "size-[1.1cqw] min-w-[3px]",
      )}
      style={{ aspectRatio: "1 / 1" }}
    />
  );
}
