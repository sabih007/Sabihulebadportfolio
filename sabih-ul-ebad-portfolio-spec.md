# Sabih Ul Ebad --- Personal Portfolio Website Specification

## 1. Project Overview

Build a premium, modern personal portfolio website for **Sabih Ul
Ebad**, an experienced **Full-Stack Developer**.

The website should position Sabih as a high-value developer who
understands **design, development, user experience, eCommerce,
performance, and business outcomes**.

This must **not** look like a generic developer template. Avoid cliché
developer visuals such as excessive neon gradients, floating code
brackets, matrix effects, terminal-style sections, or walls of
technology logos.

The visual personality should be:

-   Premium
-   Minimal
-   Editorial
-   Confident
-   Modern
-   Creative
-   Technical without looking overly "techy"
-   Strong typography
-   Highly polished micro-interactions
-   Premium, modern and sophisticated

The portfolio should communicate this idea:

> Sabih understands design. Sabih understands development. And Sabih
> understands what the client is actually trying to achieve.

------------------------------------------------------------------------

## 2. Personal Information

**Name:** Sabih Ul Ebad\
**Primary Role:** Full-Stack Developer\
**Experience:** 8+ Years

**Upwork:**\
https://www.upwork.com/freelancers/\~01d0a1f51846d16c91

**LinkedIn:**\
https://www.linkedin.com/in/sabihulebadkhan007

### Professional credibility

Use these trust signals where appropriate:

-   8+ Years of Experience
-   Top Rated on Upwork
-   100% Job Success
-   20+ Upwork Jobs Completed
-   Strong client feedback around quality, reliability, communication,
    accountability, professionalism, attention to detail, collaboration,
    and problem solving

Do not over-repeat these metrics.

------------------------------------------------------------------------

## 3. Core Positioning

Sabih should primarily be presented as a **Full-Stack Developer**, not
as a freelancer who offers dozens of unrelated services.

Secondary positioning:

-   Web Design
-   UI/UX
-   eCommerce
-   WordPress
-   Performance
-   Technical SEO

### Suggested positioning line

**Full-Stack Developer & Digital Experience Builder**

### Hero concept

Use a large editorial headline such as:

> I DESIGN & BUILD\
> DIGITAL EXPERIENCES\
> THAT DELIVER RESULTS.

Supporting text:

> I'm Sabih Ul Ebad, a Full-Stack Developer with 8+ years of experience
> creating high-performance websites, eCommerce experiences and custom
> web applications for businesses worldwide.

Do not make the hero copy excessively long.

------------------------------------------------------------------------

# 4. Visual Direction

The design is inspired by premium dark editorial portfolios with
oversized typography, asymmetric compositions, expressive cards, large
project previews and playful but controlled interactions.

Do **not** reproduce an inspiration website exactly.

The final design should feel original to Sabih.

### Light / dark composition

The previous concept was predominantly black. The updated identity
should instead use the blue palette to create more visual range.

Recommended rhythm:

-   Hero: deep navy or carefully composed light treatment
-   Selected Work: alternate light and dark project presentations
-   About/Expertise: light ice/near-white surface
-   Experience: deep navy
-   Services: light or mixed card composition
-   Testimonials: deep navy with ice typography
-   Final CTA/Footer: deep navy

Do not alternate backgrounds mechanically. The transitions should feel
intentional and editorial.

## Core Color Palette

Use these colors as the primary design system:

  Color          Hex           Purpose
  -------------- ------------- ----------------------------------------
  Deep Navy      \`#293681     \` Main background
  Royal Blue     `#4274D9`     Cards and secondary surfaces
  Soft Cyan \`   #95CCDD\` A   ccents, hover states, subtle gradients
  Ice \`#D0E7E   6\` Main ty   pography and high-contrast UI

### Color roles and visual balance

-   **`#293681` Deep Navy** --- primary dark brand color, hero/footer
    backgrounds, strong typography and high-contrast surfaces
-   **`#4274D9` Royal Blue** --- primary interactive accent, CTAs,
    links, active states and key highlights
-   **`#95CCDD` Soft Cyan** --- secondary accent, subtle gradients,
    graphical details and hover moments
-   **`#D0E7E6` Ice** --- light surfaces, cards, section backgrounds and
    soft contrast

The website should use a deliberate mix of **deep dark sections and airy
light sections** rather than becoming an all-blue interface.

Allow neutral support colors when necessary: - Near-white for large
light backgrounds and breathing room - Very dark navy/ink derived from
the brand palette when stronger text contrast is required - Opacity
variants of the four core colors

Do not introduce unrelated purple, orange, brown, neon green, or generic
SaaS gradient colors.

### Brand gradient

Where a gradient genuinely improves the design, use a restrained brand
transition such as:

`#293681 → #4274D9 → #95CCDD`

Use this primarily for the logo treatment, small highlights, selected
graphical elements, or controlled interactive states. Do not cover every
section in gradients.

------------------------------------------------------------------------

# 5. Typography

Typography is one of the core parts of the portfolio identity.

## Primary Font --- Matimo Humanist Sans

Use **Matimo Humanist Sans** as the primary typeface throughout the
website.

The licensed font package has been provided separately. Use the actual
local font files from the supplied package; **do not substitute Google
Fonts or another font** unless the files are genuinely unavailable.

The goal is a modern humanist look similar in spirit to Afacad:
approachable, contemporary, highly readable, and distinctive without
feeling decorative.

### Recommended usage

-   **Hero display:** Bold / Semibold
-   **Major section headings:** Semibold
-   **Project titles:** Medium / Semibold
-   **Navigation:** Medium
-   **Buttons / CTAs:** Medium / Semibold
-   **Body copy:** Regular
-   **Labels / metadata:** Medium
-   **Large stats:** Bold

Use the real weight files available in the supplied Matimo package. Do
not simulate font weights that are not included.

### Next.js implementation

Use `next/font/local` rather than loading the font from Google Fonts,
Envato, or a third-party CDN.

Organize the licensed web font assets locally, for example:

``` text
app/
  fonts/
    matimo/
      ...
```

Then configure the available weights with `next/font/local`.

Example implementation pattern only:

``` ts
import localFont from "next/font/local";

export const matimo = localFont({
  src: [
    {
      path: "./fonts/matimo/Matimo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/matimo/Matimo-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/matimo/Matimo-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/matimo/Matimo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-matimo",
  display: "swap",
});
```

**Important:** filenames above are illustrative. Inspect the supplied
font package and use its actual filenames, formats, weights, and styles.

Prefer `.woff2` for web delivery when supplied by the licensed package.

### Typography behavior

-   Oversized hero typography on desktop
-   Tight but readable display line-height
-   Slightly tighter tracking on very large headings
-   Comfortable body line-height
-   Strong contrast between display and supporting copy
-   Responsive sizes using `clamp()` or equivalent fluid typography
-   Avoid excessive uppercase
-   Avoid excessively wide body text
-   Keep paragraph line lengths comfortable

Suggested visual direction:

``` text
Hero:             700 weight / very large / tight line-height
Section Heading:  600–700 / large
Project Title:    600
Body Large:       400–500
Body:             400
Navigation:       500
Labels:           500 / small / optional uppercase + tracking
```

Do not hard-code these as universal values without visually testing them
at all breakpoints.

## Secondary Font --- Neral Soft Humanist Sans

**Neral Soft Humanist Sans** is also supplied and approved as a
secondary/accent typeface.

Do **not** use it everywhere and do not create a 50/50 two-font design.

Matimo remains the dominant font.

Neral Soft may be used sparingly for:

-   Occasional short accent phrases
-   Selected project metadata
-   Small editorial moments
-   Optional alternate styling for a quote or CTA
-   Special visual details where its softer character adds contrast

If Neral does not clearly improve a section, use Matimo instead.

Use `next/font/local` for Neral as well and only load the weights
actually used on the site.

## Font performance

-   Self-host the supplied licensed font files
-   Prefer WOFF2 where available
-   Load only necessary weights/styles
-   Use `display: swap`
-   Avoid duplicate font requests
-   Do not load every font file merely because it exists in the package
-   Preload only critical fonts where Next.js does not already handle it
    appropriately
-   Maintain stable layout during font loading

The final result should feel like a cohesive **Matimo-led visual
identity**, not a showcase of multiple fonts.

# 6. Technology

Build with:

-   Next.js
-   TypeScript
-   App Router
-   Tailwind CSS
-   GSAP where advanced timeline/scroll animation is justified
-   Framer Motion / Motion for component interactions
-   Lenis or an equivalent lightweight smooth-scroll solution if it does
    not harm accessibility
-   Next/Image
-   Modern semantic HTML

Use Three.js only if a subtle visual element genuinely improves the
experience. Do not add a heavy 3D scene just because Three.js is
available.

The website must remain fast.

------------------------------------------------------------------------

# 6.1 Brand Logo System

Use the newly established **Sabih Ul Ebad "S" monogram** as the visual
identity.

The logo direction uses the same core palette:

-   `#293681`
-   `#4274D9`
-   `#95CCDD`
-   `#D0E7E6`

Preferred logo gradient:

`#293681 → #4274D9 → #95CCDD`

Required logo variants/assets:

1.  **Primary horizontal lockup** --- S monogram + `SABIH UL EBAD` +
    `FULL-STACK DEVELOPER`
2.  **Monogram-only mark** --- for compact navigation/mobile usage
3.  **Dark-background variant**
4.  **Light-background variant**
5.  **Favicon/app icon** --- monogram only, simplified for small sizes

The navigation should favor the monogram or a compact lockup so the
header does not become oversized.

For favicon usage, prioritize legibility at **16×16 and 32×32**. Do not
place the full name or subtitle inside the favicon.

If supplied logo artwork is raster-only, use the highest-quality source
available and avoid aggressive enlargement. Prefer a clean SVG/vector
recreation for production if an approved vector asset is available.

Do not redraw or materially alter the approved monogram shape without
instruction.

------------------------------------------------------------------------

# 7. Global Navigation

Create a minimal fixed or sticky navigation.

Left:

**SABIH.**

Center/right navigation:

-   Home
-   About
-   Work
-   Experience
-   Services
-   Contact

Primary CTA:

**Let's Talk ↗**

On mobile, use an elegant full-screen menu.

The navigation should become slightly more visible after scrolling,
potentially using a subtle blurred dark background.

------------------------------------------------------------------------

# 8. Hero Section

The hero must immediately establish identity and expertise.

Suggested small intro:

`HI, I'M SABIH UL EBAD`

Main headline:

> I DESIGN & BUILD\
> DIGITAL EXPERIENCES\
> THAT DELIVER RESULTS.

Highlight one phrase subtly using the blue/cyan brand palette.

Supporting copy:

> Full-Stack Developer with 8+ years of experience creating thoughtful,
> high-performance websites, eCommerce platforms and custom web
> applications.

Primary CTA:

**View My Work ↗**

Secondary CTA:

**Let's Work Together**

Include:

`Available for selected projects`

### Hero trust indicators

Show a restrained credibility row:

**8+ YEARS EXPERIENCE**\
**TOP RATED ON UPWORK**\
**100% JOB SUCCESS**

The Upwork indicator can link to the Upwork profile.

### Hero visual treatment

Create an editorial composition rather than a standard centered
developer hero.

Possible elements:

-   Rotated mini project cards
-   Browser/UI fragments
-   Subtle grid
-   Small abstract shapes
-   Brown glow
-   Project screenshots
-   Minimal pointer/cursor interactions

Do not overwhelm the headline.

------------------------------------------------------------------------

# 9. Quick Profile / Bento Section

Immediately after the hero, introduce 3 visually distinctive cards.

### Currently

**Building digital products & websites**

Short copy about working on polished digital experiences.

### Specialized In

**Full-Stack Development**

Display selected areas:

`Next.js` `React` `WordPress` `eCommerce` `UI/UX`

### Recent Work

Feature the latest or strongest case study.

Include:

-   Project name
-   Category
-   Small visual
-   View Case Study CTA

Cards should have different proportions to create an editorial bento
layout.

------------------------------------------------------------------------

# 10. Selected Work

Move portfolio work near the beginning of the page.

Heading concept:

> SELECTED WORK\
> BUILT WITH PURPOSE.

Supporting copy:

> A selection of digital experiences designed and developed around real
> business goals.

Show approximately **4--6 strongest projects**, not every project Sabih
has ever completed.

## Confirmed Featured Projects

The following four projects are confirmed portfolio pieces. **Sabih Ul
Ebad built all four from scratch.**

### 01 --- BuySellOX

-   **URL:** https://buysellox.com/
-   **Technology:** Next.js
-   **Role:** Full-Stack Developer
-   **Build:** Built from scratch
-   **Portfolio label:** Marketplace / Web Platform
-   Present this as a major full-stack project and use a visible **Built
    from Scratch** badge.
-   Do not invent backend technologies, integrations, user numbers,
    traffic, revenue, or business results that have not been supplied.

### 02 --- Nexivo Studio

-   **URL:** https://www.nexivostudio.io/
-   **Technology:** Next.js
-   **Role:** Full-Stack Developer
-   **Build:** Built from scratch
-   **Portfolio label:** Digital Studio / Agency Website
-   Use a visible **Built from Scratch** badge.
-   Present it as a polished brand and digital-experience project
    without inventing unverified technical details or results.

### 03 --- Chinex Mall

-   **URL:** https://chinexmall.com/
-   **Technology:** Next.js
-   **Role:** Full-Stack Developer
-   **Build:** Built from scratch
-   **Portfolio label:** eCommerce
-   Use a visible **Built from Scratch** badge.
-   Emphasize the eCommerce nature of the project, but do not invent
    payment providers, backend architecture, sales metrics,
    integrations, or features unless verified.

### 04 --- CAL Dental USA

-   **URL:** https://caldentalusa.com/
-   **Technology:** WordPress
-   **Role:** Web Developer / Full-Stack Developer
-   **Build:** Built from scratch
-   **Portfolio label:** Healthcare / Dental
-   Use a visible **Built from Scratch** badge.
-   Present this as evidence that Sabih can deliver complete production
    WordPress websites in addition to modern Next.js projects.
-   Do not invent patient numbers, conversion improvements,
    integrations, or business results.

### Project ordering

Use the order above initially. The first three projects demonstrate
modern Next.js development, while CAL Dental USA demonstrates complete
WordPress delivery.

The homepage should feature all four projects. The layout should make
them feel substantial rather than filling space with additional weaker
projects.

Additional projects may be added later, but **do not create fictional
fifth or sixth projects merely to reach a target count**.

Project details must remain easy to update through structured data.

## Project Card

Each featured project should include:

-   Large screenshot/mockup
-   Project number
-   Project title
-   Industry/category
-   Services provided
-   Technology
-   Short outcome/description
-   View Case Study
-   Visit Website, when appropriate
-   `Built from Scratch` badge for all four confirmed projects

Use large cards with alternating layouts.

Do not make the homepage portfolio a tiny thumbnail gallery.

### Project interactions

On hover:

-   Subtle image zoom
-   Cursor label such as `View Project`
-   Small metadata movement
-   Border/blue/cyan transition

Keep animation smooth and controlled.

------------------------------------------------------------------------

# 11. Individual Case Study Pages

For the four confirmed projects, clearly communicate that Sabih built
the project from scratch. Use this as a credibility signal without
repeating the same sentence excessively.

Every major project should support a dedicated route:

`/work/[slug]`

Structure:

1.  Project Hero
2.  Overview
3.  Client / Industry
4.  My Role
5.  Challenge
6.  Approach
7.  Design
8.  Development
9.  Important Features
10. Full-width visual showcase
11. Results / Outcome
12. Technology
13. Visit Website
14. Next Project

Do not invent performance numbers, revenue numbers, conversion
improvements, testimonials, or client outcomes.

Use placeholders/TODOs when verified information is unavailable.

The case study should explain **why decisions were made**, not merely
show screenshots.

------------------------------------------------------------------------

# 12. About Section

Use a strong editorial layout.

Suggested heading:

> I DON'T JUST BUILD\
> WEBSITES. I BUILD\
> EXPERIENCES THAT WORK.

Suggested introduction:

> I'm Sabih Ul Ebad, a Full-Stack Developer with 8+ years of experience
> working across design, development and digital strategy. I focus on
> turning ideas and business requirements into polished, scalable
> digital products that are intuitive for users and practical for
> businesses.

Follow with concise copy explaining the combination of:

-   Development
-   Design awareness
-   Business understanding
-   Communication
-   Problem solving

Avoid generic autobiography.

------------------------------------------------------------------------

# 13. Client Work Philosophy

Use the Upwork client insights to create an original section.

Heading:

> GOOD CODE IS ONLY\
> HALF THE JOB.

Supporting line:

> Great projects also depend on ownership, communication and attention
> to detail.

Create four cards.

### 01 --- Quality First

Care about details from the interface users see to the implementation
behind it.

### 02 --- Outcome Focused

Build around the actual goal of the project rather than simply
completing a feature checklist.

### 03 --- Reliable

Clear expectations, consistent communication and ownership from
beginning to completion.

### 04 --- Solution Oriented

Focus on finding practical solutions when challenges appear.

Small note:

`Based on insights from completed client projects on Upwork.`

Link:

**View Upwork Profile ↗**

------------------------------------------------------------------------

# 14. Experience

Heading concept:

> 8+ YEARS OF\
> BUILDING FOR THE WEB.

Create an elegant interactive timeline.

Do not invent employment history.

Build the timeline component so real experience entries can be inserted
later.

Each entry should support:

-   Year/range
-   Role
-   Company/client type
-   Location/remote
-   Description
-   Technologies
-   Expand/collapse

Use subtle horizontal lines and animated expansion.

------------------------------------------------------------------------

# 15. Expertise

Heading:

> FROM INTERFACE\
> TO INFRASTRUCTURE.

Supporting text:

> I work across the web stack---from crafting polished interfaces to
> developing the systems and integrations behind them.

Divide expertise into four categories.

### Development

-   Next.js
-   React
-   TypeScript
-   JavaScript
-   PHP
-   Laravel
-   HTML5
-   CSS
-   Tailwind CSS

### CMS & eCommerce

-   WordPress
-   WooCommerce
-   Shopify
-   Custom eCommerce Development

### Design

-   Web Design
-   UI/UX
-   Responsive Interfaces
-   Design-to-Code Implementation

### Performance & SEO

-   Technical SEO
-   On-Page SEO
-   Website Performance
-   SEO Audits

Do not heavily promote backlinking or SEO plugins as primary skills.

------------------------------------------------------------------------

# 16. Technology Marquee

Create a subtle horizontal marquee.

Example:

`NEXT.JS — TYPESCRIPT — REACT — WORDPRESS — SHOPIFY — WOOCOMMERCE — PHP — LARAVEL — GSAP — FIGMA`

The marquee should move slowly.

Pause or reduce animation when required by `prefers-reduced-motion`.

Avoid a generic logo cloud.

------------------------------------------------------------------------

# 17. Services

Heading:

> WHAT I CAN HELP\
> YOU BUILD.

Create four premium cards.

### Web Development

High-performance websites and applications built with modern
technologies.

### Web Design & UI/UX

Thoughtful digital interfaces balancing aesthetics, usability and
business requirements.

### eCommerce

Custom shopping experiences using Shopify, WooCommerce or custom
solutions.

### WordPress & Custom Solutions

Custom WordPress development, integrations, functionality and
performance improvements.

Cards should react on hover.

One card may use the soft-cyan or ice treatment to create visual rhythm.

------------------------------------------------------------------------

# 18. Upwork Trust / Social Proof

Create a visually distinctive trust card or section.

Include verified profile information:

**TOP RATED**\
Upwork

**100%**\
Job Success

**20+**\
Completed Upwork Jobs

CTA:

**View My Upwork Profile ↗**

Use the official external profile link.

Do not imply Upwork endorsement beyond actual profile status.

------------------------------------------------------------------------

# 19. Testimonials --- Real Upwork Reviews

Use **real feedback from Sabih's Upwork profile**. Do not generate
placeholder testimonials and do not rewrite client wording to make it
sound more polished.

The testimonial section should feel like premium social proof rather
than a generic review carousel.

## Featured Review

Use the **Logo And Website** review as the large featured testimonial.

**Project:** Logo And Website\
**Rating:** 5.0 / 5\
**Date:** Oct 23, 2024 - Oct 24, 2024

> "I recently had the pleasure of working with sabih on building my
> website, and I couldn't be happier with the results! From start to
> finish, the process was smooth and professional. They took the time to
> understand my vision and offered valuable insights that truly elevated
> the final product.
>
> The attention to detail was impressive, and they delivered everything
> on time, exceeding my expectations. The website is not only visually
> appealing but also user-friendly and functional. I've received
> numerous compliments on it already!
>
> I highly recommend Sabih to anyone looking to create or enhance their
> website. They are knowledgeable, reliable, and a pleasure to work
> with. Thank you for your hard work!"

Client endorsement themes visible on Upwork include:

-   Professional
-   Clear Communicator
-   Detail Oriented
-   Reliable
-   Committed to Quality
-   Collaborative

## Supporting Review 1

**Project:** Elementor for Wordpress Specialist\
**Rating:** 5.0 / 5\
**Date:** Nov 5, 2024 - Nov 11, 2024

> "Very efficient freelancer, did exactly what was requested and even
> helped with an extra issue I had. Recommended!"

Endorsed for:

-   Reliable
-   Accountable for Outcomes
-   Solution Oriented

## Supporting Review 2

**Project:** Wordpress developer\
**Rating:** 5.0 / 5\
**Date:** Oct 30, 2024 - Nov 1, 2024

> "he really gets the job done i really like the solution he gave to my
> problem"

Endorsed for:

-   Reliable
-   Solution Oriented

## Supporting Review 3

**Project:** Website designer\
**Rating:** 5.0 / 5\
**Date:** Jun 11, 2025 - Jul 14, 2025

> "Did a great job exact as I wanted 😇😊"

Endorsed for:

-   Committed to Quality

## Supporting Review 4

**Project:** Designer with a flair for aesthetics, for
WordPress/WooCommerce shop\
**Rating:** 4.8 / 5\
**Date:** Nov 3, 2024 - Nov 5, 2024

> "I worked with Sabih on a website project, and overall, it was a
> positive experience. I appreciate his dedication and commitment to
> ensuring the project's success. I recommend him for web development
> tasks."

Endorsed for:

-   Committed to Quality
-   Accountable for Outcomes

## Supporting Review 5

**Project:** Golf Brand Logo\
**Rating:** 4.8 / 5\
**Date:** Nov 10, 2024 - Nov 13, 2024

> "Completed the job as asked"

Endorsed for:

-   Accountable for Outcomes

## Supporting Review 6

**Project:** User-Friendly Website Development for Article Posting\
**Rating:** 5.0 / 5\
**Date:** Oct 1, 2024 - Oct 7, 2024

> "Very knowledgeable and understanding. He completed my entire website
> from scratch to finish in just a few hours."

Endorsed for:

-   Committed to Quality
-   Reliable

## Additional Rating-Only Work

Other completed Upwork projects may be used as compact trust indicators
when useful, including:

-   **Website** --- 5.0 / 5 --- May 13, 2026 - Jul 27, 2026 --- endorsed
    for Committed to Quality, Clear Communicator, Accountable for
    Outcomes
-   **Put images on my website TONIGHT** --- 5.0 / 5 --- Nov 12, 2024 -
    Nov 13, 2024
-   **Audio Visual Production Website Development** --- 5.0 / 5 --- Oct
    23, 2024 - Oct 24, 2024

Do not invent written quotes for projects that only show a rating.

## Testimonial Design

-   One large featured review with oversized quotation typography
-   Supporting reviews can appear in a horizontal slider, stacked
    editorial cards, or asymmetric grid
-   Show rating and project title
-   Add a subtle `Upwork Review` / `Client Review on Upwork` attribution
-   Link testimonial section or CTA to Sabih's public Upwork profile
-   Client names must only be displayed when publicly available and
    verified; otherwise use the project title as context
-   Do not display project prices in the portfolio
-   Do not display old contract budgets as they can unnecessarily anchor
    future project pricing
-   Preserve the original wording of reviews; only fix
    presentation-level line wrapping, never meaning or grammar
-   Do not imply that Upwork directly endorses Sabih beyond the
    information visible on his profile

## Testimonial Data Model

Store testimonials as structured data so they can easily be reordered or
expanded later.

``` ts
export type Testimonial = {
  quote?: string;
  project: string;
  rating: number;
  date?: string;
  source: "Upwork";
  endorsements?: string[];
  featured?: boolean;
};
```

# 20. FAQ

Heading:

> QUESTIONS?\
> LET'S CLEAR THINGS UP.

Suggested questions:

### What types of projects do you work on?

Websites, custom web applications, eCommerce experiences, redesigns and
development projects.

### Do you handle both design and development?

Yes. Projects can include UI/UX, frontend development, backend
functionality or complete end-to-end implementation depending on
requirements.

### Can you redesign an existing website?

Yes. Existing websites can be modernized while preserving important
content, functionality, integrations and business workflows.

### Do you work with international clients?

Yes.

### How long does a website take?

Explain that timelines depend on scope and requirements. Do not promise
a universal turnaround time.

### Do you provide ongoing support?

Support and ongoing improvements can be discussed based on the project.

Use a smooth accordion.

------------------------------------------------------------------------

# 21. Final CTA

This should feel like the visual finale of the website.

Large headline:

> HAVE AN IDEA?\
> LET'S BUILD\
> SOMETHING GREAT.

Supporting text:

> Tell me what you're working on and let's see how I can help bring it
> to life.

Primary CTA:

**Start a Project ↗**

Secondary links:

-   LinkedIn
-   Upwork
-   Email
-   GitHub, if/when a verified URL is provided

Do not invent email addresses or social profile URLs.

------------------------------------------------------------------------

# 22. Footer

Minimal footer.

Left:

**SABIH.**

Text:

`Full-Stack Developer — Building thoughtful digital experiences.`

Navigation:

-   Home
-   About
-   Work
-   Services
-   Contact

Social:

-   LinkedIn
-   Upwork
-   GitHub when available

Bottom:

`© [current year] Sabih Ul Ebad. All rights reserved.`

Use the current year dynamically.

------------------------------------------------------------------------

# 23. Animation Direction

Animations are important but must never make the website frustrating.

Use:

-   GSAP text reveals
-   Scroll-triggered section entrances
-   Image masking/reveals
-   Subtle parallax
-   Magnetic CTA buttons
-   Project hover transitions
-   Smooth accordion animations
-   Marquee movement
-   Navigation transitions
-   Tasteful page transitions

Possible headline reveal:

Text enters line-by-line using clipping/masks.

Project imagery can reveal as the section enters the viewport.

### Avoid

-   Constantly moving backgrounds
-   Excessive cursor trails
-   Heavy particle systems
-   Long intro loaders
-   Scroll hijacking
-   Animations that delay content
-   Animating every element
-   Excessive 3D

Support `prefers-reduced-motion`.

------------------------------------------------------------------------

# 24. Cursor

Desktop may use a subtle custom cursor.

Default:

Small blue/ice dot or ring.

When hovering a project:

`VIEW`

When hovering external links:

Arrow indicator.

Disable custom cursor on touch devices.

Never compromise normal pointer usability.

------------------------------------------------------------------------

# 25. Responsive Design

The site must be designed intentionally for:

-   Large desktop
-   Desktop
-   Laptop
-   Tablet
-   Mobile

Do not merely stack desktop sections.

For mobile:

-   Reduce oversized headings intelligently
-   Preserve strong visual hierarchy
-   Remove unnecessary decorative elements
-   Disable hover-only interactions
-   Ensure project information is visible without hover
-   Use comfortable touch targets
-   Maintain excellent spacing
-   Keep animations lighter

------------------------------------------------------------------------

# 26. Accessibility

Requirements:

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   Proper labels
-   Descriptive alt text
-   WCAG-conscious contrast
-   `prefers-reduced-motion`
-   Logical heading hierarchy
-   Accessible accordions
-   Accessible mobile navigation
-   Do not communicate information through color alone

------------------------------------------------------------------------

# 27. Performance

Target a premium visual experience without sacrificing performance.

Requirements:

-   Optimize all images
-   Use AVIF/WebP where appropriate
-   Lazy load below-fold media
-   Avoid unnecessary client components
-   Code split heavy interactive elements
-   Keep JavaScript bundles controlled
-   Optimize fonts
-   Prevent layout shift
-   Avoid unnecessary third-party scripts
-   Lazy-load optional animation libraries/features when practical

Aim for excellent Core Web Vitals.

------------------------------------------------------------------------

# 28. SEO

Implement:

-   Metadata API
-   Unique page titles/descriptions
-   Open Graph
-   Twitter/social metadata
-   Canonical URLs
-   Sitemap
-   robots.txt
-   Structured data where appropriate
-   Person schema
-   Website schema
-   Project/case-study metadata
-   Semantic headings
-   Clean URLs

Do not keyword-stuff.

------------------------------------------------------------------------

# 29. Suggested Routes

``` text
/
├── /about
├── /work
│   └── /work/[slug]
├── /services
└── /contact
```

If the homepage already contains extensive About and Services content,
dedicated pages can provide deeper information rather than duplicating
the homepage word-for-word.

------------------------------------------------------------------------

# 30. Suggested Project Architecture

``` text
app/
  layout.tsx
  page.tsx
  about/
  work/
    page.tsx
    [slug]/
      page.tsx
  services/
  contact/

components/
  layout/
  navigation/
  hero/
  work/
  about/
  experience/
  expertise/
  services/
  testimonials/
  faq/
  contact/
  ui/

data/
  projects.ts
  experience.ts
  testimonials.ts
  skills.ts

lib/
  animations/
  utils/

public/
  images/
    projects/
    profile/
    misc/
```

Keep content/data separated from presentation where practical.

------------------------------------------------------------------------

# 31. Project Data Model

Projects should be data-driven.

Example TypeScript structure:

``` ts
export type Project = {
  slug: string;
  title: string;
  category: string;
  year?: string;
  description: string;
  services: string[];
  technologies: string[];
  coverImage: string;
  gallery?: string[];
  website?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  featured: boolean;
};
```

Never invent missing project details.

------------------------------------------------------------------------

# 32. Contact Form

Fields:

-   Name
-   Email
-   Company / Brand (optional)
-   Project Type
-   Budget Range (optional)
-   Project Description

CTA:

**Send Inquiry**

Include:

-   Loading state
-   Success state
-   Error state
-   Validation
-   Spam protection

Do not implement a fake form that silently discards submissions.

If no email/API service is configured yet, clearly leave integration
instructions/TODOs in the code.

------------------------------------------------------------------------

# 33. Design Details

Use:

-   Rounded corners, but not excessively
-   Thin low-opacity navy/ice borders
-   Large whitespace
-   Layered navy and light surfaces
-   Editorial grid layouts
-   Subtle grain/noise only if lightweight
-   Occasional rotated visual elements
-   Strong alignment
-   Small metadata labels
-   Large project photography/screenshots

Avoid:

-   Generic glassmorphism everywhere
-   Blue/purple SaaS gradients
-   Excessive shadows
-   Neon cyberpunk styling
-   Generic template sections
-   Emoji as primary interface icons
-   Huge collections of skill pills
-   Overcrowding

------------------------------------------------------------------------

# 34. Content Tone

Writing should sound:

-   Confident
-   Clear
-   Human
-   Experienced
-   Professional
-   Direct

Avoid phrases such as:

-   "Coding ninja"
-   "Tech wizard"
-   "Pixel-perfect guru"
-   "I turn coffee into code"
-   Excessive buzzwords
-   Unsupported claims such as "world-class" or "award-winning"

Use short, meaningful copy.

------------------------------------------------------------------------

# 35. Important Implementation Rule

Before building each section, ask:

> Does this section help a potential client understand Sabih's
> capability, trust him, see his work, or contact him?

If the answer is no, simplify or remove it.

The portfolio should prioritize:

1.  Identity
2.  Quality of work
3.  Credibility
4.  Expertise
5.  Business understanding
6.  Client trust
7.  Easy contact

------------------------------------------------------------------------

# 36. Content That Must Not Be Invented

Do not fabricate:

-   Client testimonials
-   Client names
-   Employers
-   Education
-   Awards
-   Revenue generated
-   Conversion improvements
-   Performance metrics
-   Project outcomes
-   Certifications
-   GitHub URL
-   Email address
-   Phone number
-   Exact employment timeline

Use obvious TODO placeholders where this information is required.

------------------------------------------------------------------------

# 37. Final Experience

When someone lands on the website, the desired impression is:

> "This developer has experience, understands good design, knows how to
> build serious web products, communicates professionally, and can
> handle my project."

The site should feel closer to a **premium independent digital studio /
senior developer portfolio** than a traditional freelancer profile.

The visual identity should be unmistakably built around:

**Deep Navy + Royal Blue + Soft Cyan + Ice**

and the personal brand:

# SABIH UL EBAD

**Full-Stack Developer --- Designing interfaces. Developing systems.
Building for results.**
