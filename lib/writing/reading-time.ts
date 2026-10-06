import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reading time, measured from the article source rather than declared by hand.
 *
 * A number typed into the data file is wrong the moment the article is edited,
 * and nobody remembers to update it. This reads the same `.mdx` the page
 * renders, so the estimate cannot drift from the text.
 *
 * Server-only, and called during static generation — the files are read at
 * build time, never per request.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "writing");

/** 220 wpm: the usual figure for adults reading non-fiction on screen. */
const WORDS_PER_MINUTE = 220;

export function postSourcePath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.mdx`);
}

/**
 * Strips everything a reader does not read word by word — fenced code, inline
 * code, JSX/HTML tags, link targets, image syntax and markdown punctuation —
 * so a post heavy with code is not credited with the reading time of prose.
 */
function countWords(source: string): number {
  const prose = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*import .+$/gm, " ")
    .replace(/[#>*_~|-]/g, " ");

  const words = prose.match(/\p{L}[\p{L}\p{N}'’-]*/gu);
  return words ? words.length : 0;
}

/**
 * Whole minutes, never zero — "1 min read" is honest for a short post, while
 * "0 min read" reads like a bug.
 */
export async function readingMinutes(slug: string): Promise<number> {
  const source = await readFile(postSourcePath(slug), "utf8");
  return Math.max(1, Math.round(countWords(source) / WORDS_PER_MINUTE));
}
