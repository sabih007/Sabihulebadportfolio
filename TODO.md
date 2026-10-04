# Before launch

Everything below is information the specification forbids inventing. The site is
built to accept each item without any layout work — each one is a value in the
data layer, and the placeholder it replaces disappears automatically.

## 1. Verified contact details — `data/site.ts`

| Field | Status | Effect once set |
| --- | --- | --- |
| `links.email` | `null` | Adds an Email link to the footer, the final CTA and the contact page, and removes the "direct email is not published yet" note. |
| `links.github` | `null` | Adds GitHub to the same three places and to the `sameAs` list in the Person schema. |

Set `links.email` to a bare address (`you@domain.com`) — the `mailto:` prefix is
added for you.

## 2. Email delivery for the contact form — `app/api/contact/route.ts`

The form validates, rate-limits and rejects spam today, but **does not send**. It
returns HTTP 503 `not_configured` and the UI says so plainly rather than showing
a false success. To go live:

1. Copy `.env.example` to `.env.local` and set `CONTACT_PROVIDER_API_KEY`,
   `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
2. Replace the body of `deliver()` with the provider call. A ready-to-paste
   Resend implementation is in the comment block at the top of the file.

## 3. Experience timeline — `data/experience.ts`

`experience` is an empty array because no employment history, company names,
locations or dates were supplied. Add entries (newest first, shape documented in
the file) and the interactive `<Timeline>` replaces the pending panel on both the
homepage and `/about`.

The verified Upwork engagement record shown underneath is real data derived from
`data/testimonials.ts` and needs no changes.

## 4. Project screenshots — `public/images/projects/`

Every project visual currently renders a designed typographic frame rather than a
fabricated mockup. To use real imagery:

1. Capture each live site at roughly 1600×1000 (and any detail shots).
2. Save as `public/images/projects/<slug>.webp`.
3. Set `coverImage` (and optionally `gallery`) on that project in
   `data/projects.ts`.

`<ProjectCover>` then switches to `next/image` with AVIF/WebP negotiation and the
case-study gallery grid appears in place of the full-bleed fallback.

## 5. Per-project detail — `data/projects.ts`

Deliberately `null` on all four projects, because feature inventories and results
need confirming with the client:

- `features` — renders a marked "to be confirmed" block until set.
- `outcome` — same. **Never** fill this with estimated traffic, revenue or
  conversion figures.
- `year` — optional; no verified delivery dates were supplied.

## 6. Domain

`NEXT_PUBLIC_SITE_URL` defaults to `https://sabihulebad.com`. Confirm the real
domain before launch — it drives canonical URLs, Open Graph, `sitemap.xml` and
`robots.txt`.

## 7. Brand artwork (optional upgrade)

The approved logo was supplied as a single raster PNG
(`assets/brand/logo-source.png`, 2172×724). Everything the site uses is derived
from it by `scripts/generate-brand-assets.mjs` — monogram, dark-surface variant,
favicon and app icon — and the monogram shape is never redrawn.

If an approved **vector** (SVG) of the mark becomes available, drop it in and the
header/footer can switch to it for perfectly crisp rendering at any size. Not
required: the current raster assets are generated well above their display size
and were checked for legibility down to 16×16.
