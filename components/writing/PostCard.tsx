import Link from "next/link";

import { Arrow } from "@/components/ui/Arrow";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { formatPostDate, type Post } from "@/data/writing";
import { cn } from "@/lib/utils/cn";

type PostCardProps = {
  post: Post;
  /** Measured from the article source — see lib/writing/reading-time.ts. */
  minutes: number;
  /** The lead article on the index gets the larger treatment. */
  lead?: boolean;
  delay?: number;
};

/**
 * One article in the index list.
 *
 * A row rather than a tile: articles have no cover image, so a grid of boxes
 * would be a grid of text in boxes. The whole row is the link, with the title
 * carrying the accessible name and the rest left out of it, so a screen reader
 * announces the article rather than re-reading the date and topics.
 */
export function PostCard({ post, minutes, lead = false, delay = 0 }: PostCardProps) {
  return (
    <Reveal as="article" delay={delay} distance={16}>
      <Link
        href={`/writing/${post.slug}`}
        className="group/post block border-b border-line/14 py-8 transition-colors duration-500 first:border-t sm:py-10"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <time dateTime={post.publishedAt} className="font-accent text-meta text-fg/70">
            {formatPostDate(post.publishedAt)}
          </time>
          <span aria-hidden className="h-px w-6 bg-line/25" />
          <span className="font-accent text-meta text-fg/70">{minutes} min read</span>
          {lead ? <Label className="ml-auto">Latest</Label> : null}
        </div>

        <h2
          className={cn(
            "mt-4 font-semibold text-navy transition-colors duration-500 group-hover/post:text-accent text-balance-safe",
            lead ? "text-title" : "text-subtitle",
          )}
        >
          {post.title}
        </h2>

        <p
          className={cn(
            "mt-3 max-w-[64ch] text-fg/85 text-pretty-safe",
            lead ? "text-lead" : "text-body",
          )}
        >
          {post.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          {post.topics.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-line/15 px-3 py-1 font-accent text-label uppercase tracking-[0.14em] text-fg/70"
                >
                  {topic}
                </li>
              ))}
            </ul>
          ) : null}

          <span
            aria-hidden
            className="ml-auto inline-flex items-center gap-1.5 font-accent text-meta font-medium text-accent"
          >
            Read
            <Arrow
              direction="e"
              className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
