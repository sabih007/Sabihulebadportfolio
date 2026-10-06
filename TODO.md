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

## 4. Project screenshots — done

All four projects now carry a real 1600×1000 screenshot of the live site in
`public/images/projects/`, wired to `coverImage` in `data/projects.ts`, so
`<ProjectCover>` renders them through `next/image` with AVIF/WebP negotiation.

Re-capture with `npm run shots` (or `npm run shots -- <slug>`) whenever a client
site is redesigned — the case studies pick the new file up with no code change.
The script refuses to write a blank frame or a browser error page, so a failed
capture is reported rather than silently shipped.

Still optional: **detail shots**. Set `gallery` on a project and the case-study
grid replaces the full-bleed cover in the visual showcase.

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

---

# SEO & feedback — what to do after deploying

## 8. Turn on the feedback queue — `ADMIN_PASSWORD`

Clients can leave a review at **`/feedback`**. Nothing they write appears on the
site until you approve it at **`/admin/feedback`**.

1. Set `ADMIN_PASSWORD` in the server environment — **at least 12 characters**.
   While it is unset, `/admin/feedback` says so plainly and refuses every
   sign-in. Submitted reviews are still stored safely in the meantime.
2. Set `FEEDBACK_DATA_DIR` to a directory **outside the deploy folder** if your
   release process replaces the whole tree, e.g.
   `FEEDBACK_DATA_DIR=/home/USER/portfolio-data`. Otherwise reviews live in
   `.data/feedback.json` in the project root and are lost on the next deploy.
   This is the single most important setting to get right.
3. Back that directory up like any other data. It is one small JSON file.

How the queue works:

- **Publish** puts the review on the homepage and `/reviews` immediately.
- **Feature** promotes one review to the large pull-quote slot. Only one at a
  time; featuring a new one clears the old.
- **Hide** takes it off the site but keeps the text, so it is reversible.
- **Delete** is permanent — for spam.
- A review where the client **did not tick publish consent** can never be
  approved. The server refuses it, not just the UI.

Email delivery is optional here: a new review triggers a notification through
the same SMTP setup as the contact form, but the review is **stored first**, so
a mail outage cannot lose it.

## 9. Google Search Console — do this on launch day

1. Add the property at [search.google.com/search-console](https://search.google.com/search-console)
   as a **Domain** property if you can edit DNS (covers www and non-www), or a
   **URL prefix** property otherwise.
2. For URL-prefix verification choose **HTML tag**, copy the `content` value
   only, and set it as `GOOGLE_SITE_VERIFICATION` in the environment. Redeploy,
   then press Verify. (`BING_SITE_VERIFICATION` does the same for Bing
   Webmaster Tools.)
3. Submit `https://sabihulebad.com/sitemap.xml` under **Sitemaps**.
4. Use **URL Inspection → Request indexing** once for `/`, `/work`, `/services`,
   `/reviews` and each case study. After that, leave it alone — repeatedly
   requesting indexing does nothing.
5. Check **Page indexing** after a week or two for anything excluded.

Expect weeks, not days. A new domain has no history, and nothing legitimate
changes that.

## 10. Analytics (optional)

Set **one** of these and it loads automatically, after interactive so it stays
off the critical path:

- `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` — Google Analytics 4.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=sabihulebad.com` — Plausible (no cookie banner
  needed; it sets no cookies).

Leave both unset and the site ships no third-party script at all.

## 11. What is already handled in code

No action needed on any of these — listed so they are not redone by hand:

- Canonical URLs, Open Graph and Twitter cards on every route (`lib/utils/metadata.ts`).
- `sitemap.xml` with honest `lastModified` dates, and `robots.txt` disallowing
  `/api/` and `/admin/`.
- Structured data: `Person`, `WebSite` and `ProfessionalService` site-wide;
  `BreadcrumbList` on every inner page; `FAQPage` on the homepage;
  `OfferCatalog` on `/services`; `CreativeWork` per case study; `Review` and
  `AggregateRating` on `/reviews`.
- `noindex` on the admin queue.
- Client-supplied URLs in reviews carry `rel="ugc nofollow"`, so the form cannot
  be used for link spam.
- Web app manifest at `/manifest.webmanifest`.

### The one thing code cannot fix

**Content depth.** Four case studies with `features` and `outcome` still pending
(item 5) is thin for the queries worth ranking for. Filling those in will move
the needle further than any further technical work.
