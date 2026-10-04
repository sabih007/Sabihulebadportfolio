# Before launch

Everything below is information the specification forbids inventing. The site is
built to accept each item without any layout work — each one is a value in the
data layer, and the placeholder it replaces disappears automatically.

## 1. Verified contact details — `data/site.ts`

| Field | Status | Notes |
| --- | --- | --- |
| `contact.email` | **info@sabihulebad.com** | Shown on the contact page and in the footer; also the default enquiry destination. |
| `contact.phone` | **+92 325 3596641** | Shown on the contact page and in the footer, with a `tel:` link. |
| `links.github` | `null` | Add it and GitHub appears in the footer, the final CTA and the `sameAs` list in the Person schema. |

> The email was given as "info@sabihulebad" / "info@sabihulebad.con" — read as
> **info@sabihulebad.com** to match the site domain. If that is wrong, change it
> in `data/site.ts` (two places in the `contact` object plus `links.email`) and
> set `CONTACT_TO_EMAIL`.

## 2. SMTP credentials for the contact form

Delivery is implemented with **Nodemailer** (`lib/contact/mailer.ts`) and sends
to `info@sabihulebad.com`. The only thing missing is the mailbox credentials,
which must come from the environment — never the repository.

1. Copy `.env.example` to `.env.local`.
2. Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Worked examples
   for cPanel and Google Workspace are in that file.
3. Set the same variables in your host's environment settings for production.

`CONTACT_FROM_EMAIL` must be an address the SMTP account is allowed to send as,
or messages will fail SPF/DKIM and be filed as spam. The visitor's own address is
set as **Reply-To**, so replying in your mail client still reaches them.

Until those are set the route validates, rejects spam, **logs the enquiry so it
is never lost**, and returns HTTP 503 `not_configured` — the form then tells the
visitor the truth and offers the email and phone instead.

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
