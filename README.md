# Sabih Ul Ebad — Portfolio

Premium editorial portfolio for **Sabih Ul Ebad**, Full-Stack Developer.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP and Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npx tsc --noEmit
```

See **[TODO.md](./TODO.md)** for the short list of real-world values that still
need supplying before launch (SMTP credentials, GitHub, experience entries,
project screenshots). Nothing in that list blocks the site from running.

---

## Brand

| Token | Value | Role |
| --- | --- | --- |
| `navy` | `#293681` | Deep Navy — dark sections, strong typography, high-contrast surfaces |
| `blue` | `#4274D9` | Royal Blue — primary interactive accent: CTAs, links, active states |
| `cyan` | `#95CCDD` | Soft Cyan — secondary accent, graphical detail, hover moments |
| `ice` | `#D0E7E6` | Ice — light surfaces, cards, section backgrounds |

Two neutrals are derived from the palette, which the spec permits: `ink`
(`#141B3D`) for body text on light, and `paper` (`#F7FAFB`) for large light
grounds. `blue-solid` (`#3762C6`) is Royal Blue nudged toward navy so white
label text on a filled button clears 4.5:1 — plain `#4274D9` measures 4.44:1 and
would fail. No colour outside this set is used; everything else is an opacity
variation.

**The brand gradient** (`#293681 → #4274D9 → #95CCDD`) is deliberately rationed.
It appears on the logo, on exactly one word per oversized headline, and on the
small eyebrow rules. It is never a section background.

### Light / dark composition

The site is not a dark site. Three substantial navy passages punctuate a
light-led page, and the dark surfaces also appear *inside* light sections — one
bento card, alternating project panels, one service card:

```
Hero            light      Expertise       ice
Quick profile   light      Marquee         white band
Selected work   light †    Services        light ‡
About           ice        Upwork trust    NAVY ┐
Philosophy      NAVY ┐     Testimonials    NAVY ┘
Experience      NAVY ┘     FAQ             light
                           Final CTA       NAVY ┐
                           Footer          NAVY ┘

† project panels alternate light / navy    ‡ one cyan card, one navy card
```

### The tone system

Sections declare `data-tone="light" | "ice" | "dark"`, which rebinds
`--color-surface`, `--color-raised`, `--color-fg`, `--color-line` and
`--color-accent`. Components then use `bg-surface`, `text-fg/70`,
`border-line/12`, `text-accent` and adapt automatically — no component
hard-codes a light or dark colour, and the composition of the page is decided in
one place.

One caveat worth knowing if you extend this: those variables must hold **real
values** in each tone block, never `var(--something-else)`. A custom property is
substituted where it is *declared*, so aliasing them on `:root` freezes them to
whatever `:root` sees and they never follow the tone.

---

## Logo system

The approved artwork (`assets/brand/logo-source.png`) is a single raster
horizontal lockup. `scripts/generate-brand-assets.mjs` derives the rest from it:

```bash
node scripts/generate-brand-assets.mjs
```

| Asset | Use |
| --- | --- |
| `public/brand/logo-lockup.png` | Primary horizontal lockup, light surfaces with room for the subtitle |
| `public/brand/monogram.png` | Monogram as supplied — light surfaces |
| `public/brand/monogram-on-dark.png` | Dark-surface variant (see below) |
| `app/icon.png`, `app/apple-icon.png` | Favicon / app icon — monogram only, no wordmark |

The monogram shape is never redrawn. Two adaptations are applied, both required
by the spec's logo section:

- **Dark-surface variant.** The supplied gradient starts at Deep Navy, which
  disappears on a navy ground, so luminance is remapped up the brand ramp
  (Royal Blue → Soft Cyan → Ice). Shape and alpha are untouched.
- **App icon.** The mark sits on a navy rounded tile using a brighter
  cyan → ice ramp, because the ribbon's counters collapse at 16×16. Verified
  legible at 16/32/48px on both light and dark browser chrome.

**In the header**, the monogram is paired with the name set in Matimo rather
than using the raster lockup: at header height the lockup's own subtitle renders
~6px tall and is illegible. This keeps the mark exact and crisp at every pixel
density. Below `sm` the wordmark drops and the monogram stands alone. The header
also keeps a light tone at all times — including over the navy bands — so the
mark never needs to swap artwork mid-scroll.

---

## Typography

- **Matimo Humanist Sans** — primary, and dominant everywhere. Self-hosted from
  the licensed package via `next/font/local`; only the four weights actually
  used are loaded (400/500/600/700, WOFF2 from the package's `Web-TT` folder).
- **Neral Soft Humanist Sans** — accent only: eyebrow labels, project metadata,
  dates and the oversized quotation glyph. Supplied as TTF, converted to WOFF2
  for delivery. Not preloaded, since it never appears in the critical first paint.

Font configuration is in `app/fonts.ts`; the files are in `app/fonts/`.

The display scale is capped so the longest headline line never wraps inside its
reveal mask — see the comments above `--text-display` and `--text-headline` in
`app/globals.css` before changing those values.

---

## Architecture

```
app/
  layout.tsx            fonts, metadata, JSON-LD, chrome
  page.tsx              homepage
  about/  work/  work/[slug]/  services/  contact/
  api/contact/route.ts  inquiry endpoint
  opengraph-image.tsx   social card, navy + monogram, rendered at build time
  icon.png apple-icon.png
  sitemap.ts  robots.ts  not-found.tsx

components/
  brand/  layout/  navigation/  hero/  work/  about/
  experience/  expertise/  services/  testimonials/  faq/  contact/  ui/

data/        site · projects · testimonials · experience · skills · services · faq
lib/         animations · contact (zod schema + nodemailer) · utils
scripts/     generate-brand-assets.mjs
assets/      brand/ (approved source artwork) · og/ (TTF for the OG route)
```

Content lives entirely in `data/` and is typed. Reordering projects, adding a
testimonial or publishing an experience entry requires no component changes.

---

## Animation

Two libraries, each for the job it is actually best at:

- **GSAP** drives the one thing that needs a real timeline — the hero's
  line-by-line masked headline reveal, whose completion then releases the
  supporting copy, so the hero resolves in two clear beats.
- **Motion** handles component interaction: scroll reveals, the accordion and
  timeline height animations, the mobile menu, magnetic buttons and the cursor.
- **Lenis** smooths wheel scrolling. Dynamically imported, and skipped entirely
  on touch devices and under `prefers-reduced-motion`.
- The technology marquee is **pure CSS** — no JavaScript, no scroll listener.

`prefers-reduced-motion` is honoured throughout: the global stylesheet collapses
durations, the marquee stops, the custom cursor and smooth scrolling do not
mount, and the headline masks are forced open by CSS (with a `<noscript>`
fallback) so text can never be left hidden.

The custom cursor reads the nearest `data-tone` ancestor under the pointer and
switches between a navy and an ice ring, so it stays visible on both grounds.

---

## Accessibility

- Semantic landmarks, one `<h1>` per page, logical heading order.
- Skip-to-content link; tone-aware `:focus-visible` rings on every interactive
  element.
- Mobile menu is a labelled modal dialog with focus trapping, focus restore,
  Escape-to-close and background scroll lock.
- FAQ and timeline are real buttons with `aria-expanded` / `aria-controls`, and
  panels are regions labelled by their trigger.
- Ratings expose their numeric value as text, never shape alone; "Built from
  Scratch" is a word, not a colour.
- Every external link is marked `(opens in a new tab)` for screen readers.
- The marquee has a static, readable copy of its content for assistive tech.

**Contrast was audited programmatically**, not by eye: every text node on every
page was measured against its computed background. The whole site passes WCAG AA
(4.5:1 body, 3:1 large). The gradient-filled headline words are measured by their
endpoints instead, since `background-clip: text` makes the colour transparent —
light runs 10.3:1 → 4.2:1 and dark runs 5.4:1 → 8.4:1, both clearing the 3:1
large-text bar at every stop. The documented opacity floors (`fg/70` on light,
`fg/75` on dark) exist to keep it that way.

## Performance

- All routes are statically prerendered; only the contact endpoint is dynamic.
- Four font files total, `display: swap`, with Neral excluded from preload.
- Ambient brand washes are **radial gradients, not `filter: blur()`**. The first
  pass used a dozen large blurred circles; each forces its own compositing layer
  and together they were enough to stall the renderer. The gradients paint for
  free and give finer control over the falloff.
- Covers use container queries and `cqw` units, so the same component is correct
  at 230px in the bento and 1400px full-bleed without extra markup or images.
- Texture is one inline SVG turbulence tile, applied to dark sections only (on a
  light ground it reads as dirt), with no blend mode.
- `next/image` with AVIF/WebP negotiation is wired up and takes over the moment
  real screenshots are added.

## SEO

Metadata API with per-page titles, descriptions and canonicals; Open Graph and
Twitter cards; a generated OG image; `sitemap.xml`; `robots.txt`; and JSON-LD for
`Person`, `WebSite`, the work `CollectionPage` and a `CreativeWork` per case
study. Only verified profile URLs appear in `sameAs`.

---

## Contact form

Enquiries are delivered over SMTP with **Nodemailer** to
`info@sabihulebad.com`. Credentials come from the environment only — see
`.env.example` for the five variables and worked examples for cPanel and Google
Workspace.

- `lib/contact/mailer.ts` owns the transport and the message. Connection is
  pooled and reused, with connection/greeting/socket timeouts so a hung mail
  server cannot hold a request open.
- `app/api/contact/route.ts` owns validation and policy: a shared zod schema
  (client and server), a hidden honeypot, a minimum time-on-form, and a small
  per-IP rate limit.
- The message is sent as **multipart/alternative**. The `From` is your own
  address — sending as the visitor would fail SPF/DKIM — and `Reply-To` is the
  visitor, so replying reaches them directly.

Two details worth keeping if you edit it:

- **CR/LF is stripped** from any value used in a mail header. Without that, a
  newline in the name field could inject extra headers.
- **User text is HTML-escaped** in the HTML part. Verified against a real SMTP
  exchange: the `text/html` part contains only `&lt;script&gt;`, never an
  executable tag or an `onerror` attribute.

If SMTP is not configured the route does not pretend. It validates, rejects
spam, logs the enquiry so nothing is lost, and answers HTTP 503
`not_configured`; the form then says so and offers the email and phone.

---

## Content rules

The data files carry these as comments, and they are not stylistic preferences:

- Upwork reviews are reproduced **verbatim**, including original spelling and
  punctuation. Contracts with a rating but no written review never get a quote.
- Client names are not shown (none were verified as public); reviews are
  attributed by project title, rating and date.
- Contract values and budgets from past work are never displayed.
- No metrics, results, feature lists, employment history, awards, certifications,
  email addresses or profile URLs are invented. Where the specification requires
  such content and it has not been verified, the page renders a clearly marked
  "to be confirmed" block instead — see `components/ui/PendingBlock.tsx`.
