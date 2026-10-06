# Articles

One `.mdx` file per article, named after its slug. The file holds the body only
— no front matter. Everything else (title, description, date, topics) lives in
the matching entry in [`data/writing.ts`](../../data/writing.ts).

## Publishing an article

1. Write `content/writing/<slug>.mdx`.
2. Add an entry with the same `slug` to `posts` in `data/writing.ts`, newest
   first.

That is the whole process. The index page, the article route, the sitemap, the
RSS feed, the `BlogPosting` structured data and the "Writing" link in the header
and footer all derive from that entry. Until the first article is published the
section stays unlinked, so no visitor is ever sent to an empty page.

## Writing the file

Plain markdown. Do not reach for class names — every element is styled centrally
in [`mdx-components.tsx`](../../mdx-components.tsx), so a heading, list, table or
code block already matches the rest of the site.

```mdx
Start with a paragraph, not a heading — the title is rendered by the page from
`data/writing.ts`, so repeating it here would show it twice.

## Use h2 for sections

`remark-gfm` is enabled, so tables, task lists and strikethrough work.
`rehype-slug` gives every heading an `id`, so headings can be linked to.
```

Begin at `##`. The page renders the `<h1>`.

### Images

Put them in `public/images/writing/` and give both dimensions, so the layout
does not shift while they load:

```mdx
<img src="/images/writing/example.webp" alt="Describe what it shows" width={1600} height={900} />
```

### Drafts

Set `draft: true` on the entry. The article still renders at its URL so it can
be previewed and shared, but it is kept out of the index, the sitemap and the
feed, and is marked `noindex`.

## Reading time

Calculated from this file at build time — see
[`lib/writing/reading-time.ts`](../../lib/writing/reading-time.ts). Code blocks
are excluded from the word count. There is nothing to set by hand.
