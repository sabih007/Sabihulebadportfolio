import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/utils/cn";

/**
 * Global element mapping for every MDX article in `content/writing/`.
 *
 * Required by `@next/mdx` with the App Router — the integration does not work
 * without this file at the project root.
 *
 * Articles are written as plain markdown, so these mappings are what make them
 * look like the rest of the site: the same type scale, the same `line` rules
 * and `accent` links as the case studies, rather than browser defaults. Writing
 * a post should never involve reaching for a class name.
 *
 * Measure is set once on the article wrapper in the page, not per element, so
 * full-bleed figures and code blocks can break out of it.
 */
const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-14 scroll-mt-28 border-t border-line/14 pt-8 text-title font-semibold text-navy first:mt-0 first:border-0 first:pt-0",
        className,
      )}
      {...props}
    />
  ),

  h3: ({ className, ...props }) => (
    <h3
      className={cn("mt-10 scroll-mt-28 text-subtitle font-semibold text-navy", className)}
      {...props}
    />
  ),

  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-mt-28 font-accent text-label uppercase tracking-[0.18em] text-accent",
        className,
      )}
      {...props}
    />
  ),

  p: ({ className, ...props }) => (
    <p className={cn("mt-5 text-lead text-fg/90 text-pretty-safe", className)} {...props} />
  ),

  ul: ({ className, ...props }) => (
    <ul className={cn("mt-5 space-y-2.5 pl-5 text-lead text-fg/90", className)} {...props} />
  ),

  ol: ({ className, ...props }) => (
    <ol
      className={cn("mt-5 list-decimal space-y-2.5 pl-5 text-lead text-fg/90", className)}
      {...props}
    />
  ),

  // The marker is drawn rather than inherited, so it keeps the accent colour
  // and stays aligned with the first line of a wrapped item.
  li: ({ className, children, ...props }) => (
    <li
      className={cn(
        "relative marker:text-accent/70 [ul>&]:list-none [ul>&]:before:absolute [ul>&]:before:-left-5 [ul>&]:before:top-[0.7em] [ul>&]:before:size-1.5 [ul>&]:before:rounded-full [ul>&]:before:bg-accent/60",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  ),

  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-8 border-l-2 border-accent/40 pl-6 text-subtitle font-medium text-navy italic",
        className,
      )}
      {...props}
    />
  ),

  a: ({ href = "", children, className, ...props }) => {
    const external = /^https?:\/\//.test(href);
    const classes = cn(
      "font-medium text-accent underline decoration-accent/35 underline-offset-[0.25em] transition-colors duration-300 hover:text-navy hover:decoration-navy/60",
      className,
    );

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  },

  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-navy", className)} {...props} />
  ),

  hr: ({ className, ...props }) => (
    <hr className={cn("my-12 border-0 border-t border-line/14", className)} {...props} />
  ),

  code: ({ className, ...props }) => (
    <code
      className={cn(
        // Inside a <pre> the block styling owns the surface, so the inline chip
        // is suppressed there.
        "rounded-[0.3rem] bg-navy/6 px-[0.4em] py-[0.15em] font-mono text-[0.875em] text-navy [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit",
        className,
      )}
      {...props}
    />
  ),

  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mt-6 overflow-x-auto rounded-card border border-navy/15 bg-navy p-5 font-mono text-[0.875rem] leading-relaxed text-ice",
        className,
      )}
      {...props}
    />
  ),

  // Wide tables scroll inside their own box rather than widening the article.
  table: ({ className, ...props }) => (
    <div className="mt-8 overflow-x-auto rounded-card border border-line/14">
      <table className={cn("w-full border-collapse text-left text-meta", className)} {...props} />
    </div>
  ),

  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border-b border-line/14 bg-ice/35 px-4 py-3 font-accent text-label uppercase tracking-[0.14em] text-navy",
        className,
      )}
      {...props}
    />
  ),

  td: ({ className, ...props }) => (
    <td className={cn("border-b border-line/10 px-4 py-3 text-fg/85", className)} {...props} />
  ),

  /**
   * Markdown images go through next/image so articles get the same AVIF/WebP
   * negotiation as the rest of the site. Intrinsic dimensions are required, so
   * posts should reference files in `public/images/writing/` and pass them.
   */
  img: (props) => (
    <Image
      {...(props as ImageProps)}
      width={typeof props.width === "number" ? props.width : 1600}
      height={typeof props.height === "number" ? props.height : 900}
      sizes="(min-width: 1024px) 70ch, 100vw"
      className="mt-8 h-auto w-full rounded-card border border-line/12"
      alt={props.alt ?? ""}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
