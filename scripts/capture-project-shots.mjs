/**
 * Captures a cover screenshot of every project that has a `website` in
 * `data/projects.ts`, and writes it to `public/images/projects/<slug>.webp`.
 *
 * Run it with `npm run shots`, or `npm run shots -- buysellox` for one project.
 * Re-run it whenever a client site is redesigned; the case studies pick the new
 * file up with no code change.
 *
 * The project list is read from `data/projects.ts` rather than repeated here,
 * so a project can never end up with a screenshot of the wrong site.
 *
 * Why a real browser and not `chrome --headless --screenshot`: Chrome's
 * `--virtual-time-budget` fast-forwards timers, which ends the shot mid-intro
 * on sites with a preloader and never settles on slower ones. Each page is
 * loaded, given time to finish its intro, scrolled end to end so lazy images
 * decode, and returned to the top before the shot is taken.
 *
 * Captured at 2x and resized down, so the text in the screenshot stays crisp on
 * retina displays without shipping a 3200px asset.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

import puppeteer from "puppeteer-core";
import sharp from "sharp";

import { projects } from "../data/projects.ts";

const WIDTH = 1600;
const HEIGHT = 1000;
const OUT_DIR = "public/images/projects";

/**
 * puppeteer-core ships no browser of its own — it drives the Chrome already
 * installed on the machine. Set CHROME_PATH to override.
 */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

/**
 * How long one site gets, end to end, before it is abandoned and reported.
 *
 * Must stay above the sum of the step budgets in the capture block below
 * (60 + 22 + 32 + 10 + 25 + 32 + 10 = 191s), or the outer timeout fires first
 * and a merely slow site is reported as a failure.
 */
const PER_SITE_TIMEOUT_MS = 210000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Caps one site's total work, so a hung page cannot stall the whole run. */
function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timed out after ${ms / 1000}s (${label})`)), ms);
    }),
  ]);
}

/**
 * Every preparation step is an improvement to the shot, not a precondition for
 * it: a site that never goes network-idle, never finishes its intro, or runs a
 * permanent animation that blocks `evaluate` should still be photographed.
 * Each step therefore gets its own small budget and is allowed to fail.
 */
function best(promise, ms) {
  return withTimeout(Promise.resolve(promise), ms, "step").catch(() => undefined);
}

function findChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      `Could not find Chrome. Set CHROME_PATH to its executable.\nLooked in:\n  ${CHROME_CANDIDATES.join("\n  ")}`,
    );
  }
  return found;
}

/**
 * Clears anything covering the hero: cookie bars, and the promotional modals
 * marketing sites open a few seconds after load.
 *
 * Run more than once by the caller, because those modals are usually on a
 * timer and may not exist yet the first time.
 *
 * Two phases, because clicking the close button is not always enough.
 * caldentalusa.com opens a newsletter modal (#cdu-nl-popup) whose scroll-lock
 * collapses the page container to 1px wide — clicking its close button leaves
 * the layout broken, and the shot comes out blank. So anything still covering
 * the viewport after the clicks is removed outright, and the scroll lock those
 * modals leave on <html>/<body> is undone.
 */
async function dismissOverlays(page) {
  // Phase 1 — ask nicely. Preferred, because a site's own close handler also
  // undoes whatever else the modal changed.
  await page.evaluate(() => {
    const dismiss =
      /^(accept|accept all|allow all|i agree|agree|got it|ok|okay|understood|maybe later|no thanks|not now|dismiss|close|skip|×|✕|✖)$/i;

    for (const el of document.querySelectorAll("button, a, [role=button]")) {
      const label = (el.textContent ?? "").trim();
      const aria = el.getAttribute("aria-label") ?? "";
      if (dismiss.test(label) || /close|dismiss/i.test(aria)) {
        // Only click something actually on screen — "close" appears in plenty
        // of hidden markup.
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) el.click();
      }
    }
  });
  // Many modals also close on Escape, which costs nothing to try.
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(500);

  // Phase 2 — remove what is still in the way.
  await page.evaluate(() => {
    // Only elements named like an interruption are touched. A full-viewport
    // overlay that is part of the hero design does not match this.
    const NAMED =
      /(modal|popup|pop-up|overlay|backdrop|lightbox|newsletter|subscribe|cookie|consent|gdpr|interstitial|promo)/i;

    for (const el of document.querySelectorAll("div, section, aside, dialog")) {
      const style = getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "absolute") continue;

      const visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01;
      if (!visible) continue;

      const rect = el.getBoundingClientRect();
      if (rect.width < innerWidth * 0.9 || rect.height < innerHeight * 0.9) continue;

      if (!NAMED.test(`${el.id} ${(el.className ?? "").toString()}`)) continue;
      el.remove();
    }

    /**
     * Undo whatever has been written onto <html>/<body> to hide the page.
     *
     * Two different things end up here. A modal's scroll lock is one.
     * The other is a cloak: caldentalusa.com answers an automated browser with
     *
     *   body { clip-path: inset(100%); overflow: hidden;
     *          position: absolute; height: 1px; width: 1px }
     *
     * — the screen-reader-only pattern applied to the whole document, which is
     * why that site photographed as a single flat colour even though every
     * element underneath reported itself visible and correctly laid out.
     * clip-path is the one that actually blanks the frame, so it has to be
     * cleared too; removing the size and position alone is not enough.
     */
    for (const el of [document.documentElement, document.body]) {
      for (const prop of [
        "clip-path",
        "clip",
        "overflow",
        "overflow-y",
        "position",
        "width",
        "height",
        "top",
        "visibility",
        "opacity",
      ]) {
        el.style.removeProperty(prop);
      }
      el.style.setProperty("clip-path", "none", "important");
      el.style.setProperty("overflow", "visible", "important");
      el.style.setProperty("position", "static", "important");
      el.style.setProperty("width", "auto", "important");
      el.style.setProperty("height", "auto", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
    }

    // Reveal libraries recalculate on these, so nudge anything that was
    // suppressed while the modal held the page.
    dispatchEvent(new Event("resize"));
    dispatchEvent(new Event("scroll"));
  });
  await sleep(600);
}

/**
 * Waits for the page to stop showing a loading state.
 *
 * Three shapes have to be caught, and the original only caught the first:
 *
 *  1. A full-screen intro overlay covering the whole viewport.
 *  2. An interstitial bot check — buysellox.com serves "Checking your browser
 *     before accessing…" for about five seconds, with a 64x64 spinner.
 *  3. An in-shell loading state: a spinner in the content area while the app
 *     fetches its data, with the real header already painted above it.
 *
 * Size turned out to be the wrong signal entirely — the spinner in (2) covers
 * 0.26% of the viewport, so any area threshold large enough to avoid false
 * positives also missed it, and the shutter fired on the loading screen.
 *
 * What actually separates the two states is substance: a loading screen has a
 * spinner and almost no text, a loaded page has paragraphs. So the page counts
 * as still loading while either a loader-named element is visible on screen, at
 * any size, or the body has too little text to be a real page. The caller caps
 * this, so a site that keeps a spinner in the DOM forever is still photographed.
 */
async function waitForLoaders(page, budgetMs = 30000) {
  const deadline = Date.now() + budgetMs;

  while (Date.now() < deadline) {
    const loading = await page.evaluate(() => {
      // A real page has paragraphs; a loading screen has a line or two.
      const MIN_TEXT = 250;
      if ((document.body?.innerText ?? "").trim().length < MIN_TEXT) return true;

      const nodes = document.querySelectorAll(
        '[class*="preload" i],[id*="preload" i],[class*="loader" i],[id*="loader" i],' +
          '[class*="loading" i],[id*="loading" i],[class*="spinner" i],[id*="spinner" i],' +
          '[role="progressbar"],[aria-busy="true"]',
      );

      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);

        const visible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0.01 &&
          rect.width > 0 &&
          rect.height > 0;

        if (!visible) continue;

        // Only something in the shot matters. A lazy-load sentinel further down
        // the page is not a loading state as far as the camera is concerned.
        if (rect.bottom <= 0 || rect.top >= innerHeight) continue;
        if (rect.right <= 0 || rect.left >= innerWidth) continue;

        return true;
      }

      return false;
    });

    if (!loading) return;
    await sleep(500);
  }
}

/**
 * Scroll the page so lazy images decode, then return to the top.
 *
 * Capped at a fixed number of screens rather than running to `scrollHeight`:
 * on a site that appends content as you scroll, or animates with a pinned
 * section, `scrollHeight` grows faster than the loop consumes it and the walk
 * never terminates. Only the first screen is ever photographed anyway — this
 * exists so the images in it have loaded.
 */
async function primeLazyImages(page, maxScreens = 12) {
  await page.evaluate(async (screens) => {
    const step = Math.round(innerHeight * 0.8);
    for (let i = 0; i < screens; i += 1) {
      const y = step * i;
      if (y > document.body.scrollHeight) break;
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    scrollTo(0, 0);
  }, maxScreens);
  await page
    .evaluate(() =>
      Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {}))),
    )
    .catch(() => {});
  // Let anything that began decoding on the way back up settle.
  await sleep(1200);
}

/**
 * How much the pixels vary, averaged over the channels.
 *
 * A blank page is a single flat colour, so its deviation is ~0. This is the
 * guard against silently shipping an empty cover: caldentalusa.com rendered
 * blank for a while because a newsletter modal collapsed its layout, and
 * nothing in the run said so — the file was written and the run reported "ok".
 */
/**
 * Navigates, and insists on having actually arrived.
 *
 * `page.goto` resolving is not enough on its own: a site that fails mid-load
 * leaves Chrome's own "This page couldn't load" interstitial in the tab, which
 * is a perfectly well-formed page as far as a screenshot is concerned. It has
 * text and contrast, so the blank-frame check passes it, and the result is a
 * cover image of a browser error — nexivostudio.io did exactly that on one run.
 *
 * One reload, because the usual cause is a transient network blip.
 *
 * Only the error page is treated as failure, deliberately — not the HTTP
 * status. Bot protection on buysellox.com and chinexmall.com answers an
 * automated browser 403 for the document and then renders the real site
 * anyway, so refusing anything >= 400 rejected two sites that photograph
 * perfectly well. What the shot actually depends on is whether a page was
 * rendered at all, which is what this checks.
 */
async function navigate(page, url) {
  for (let attempt = 1; ; attempt += 1) {
    if (attempt === 1) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    } else {
      await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    }

    const errorPage = await page.evaluate(
      () =>
        document.documentElement.className.includes("neterror") ||
        Boolean(document.querySelector("#main-frame-error")),
    );

    if (!errorPage) return;

    if (attempt >= 2) {
      throw new Error("Chrome could not load the site (network error page).");
    }

    await sleep(2000);
  }
}

async function pageIsBlank(buffer) {
  const { channels } = await sharp(buffer).stats();
  const variation = channels.reduce((sum, channel) => sum + channel.stdev, 0) / channels.length;
  // A rendered page is never this flat; a single background colour is.
  return variation < 2;
}

const only = process.argv.slice(2);
const targets = projects.filter(
  (project) => project.website && (only.length === 0 || only.includes(project.slug)),
);

if (targets.length === 0) {
  console.error(
    only.length > 0
      ? `No project with a website matched: ${only.join(", ")}`
      : "No project in data/projects.ts has a website.",
  );
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu", "--no-first-run"],
});

let failed = 0;

for (const project of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  try {
    const raw = await withTimeout(
      (async () => {
        await navigate(page, project.website);
        await best(page.waitForNetworkIdle({ idleTime: 1500, timeout: 20000 }), 22000);
        await best(waitForLoaders(page), 32000);
        await best(dismissOverlays(page), 10000);
        await best(primeLazyImages(page), 25000);
        // Scrolling can kick off another round of fetching, so re-check that
        // nothing is loading before the shutter rather than only before it.
        await best(waitForLoaders(page), 32000);

        /**
         * Shoot, check, and if the frame came out blank clear the overlays and
         * shoot again.
         *
         * A single sweep before the shutter is not enough on a site whose promo
         * modal runs on a timer: it can reopen in the gap between the sweep and
         * the shutter, and its scroll lock collapses the layout to nothing.
         * Checking the frame itself is the only test that cannot be fooled by
         * timing, so the sweep is driven by the result rather than by a guess
         * about when the modal appears.
         */
        for (let attempt = 1; ; attempt += 1) {
          // Timed pop-ups often arrive only after the scroll pass, so sweep
          // again immediately before the shutter.
          await best(dismissOverlays(page), 10000);
          const shot = await page.screenshot({ type: "png" });

          if (await pageIsBlank(shot)) {
            if (attempt >= 3) {
              throw new Error(
                "captured a blank page three times. The site renders an overlay or fails " +
                  "to paint headless; capture this one by hand.",
              );
            }
            continue;
          }

          return shot;
        }
      })(),
      PER_SITE_TIMEOUT_MS,
      project.slug,
    );

    const file = `${OUT_DIR}/${project.slug}.webp`;
    const { size } = await sharp(raw)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
      .webp({ quality: 82, effort: 6 })
      .toFile(file);

    console.log(`  ok    ${project.slug.padEnd(16)} ${(size / 1024).toFixed(0)} kB  ${file}`);
  } catch (error) {
    failed += 1;
    console.error(`  FAIL  ${project.slug.padEnd(16)} ${error.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();

if (failed > 0) {
  console.error(`\n${failed} of ${targets.length} failed. Re-run for just those slugs.`);
  process.exit(1);
}

console.log(`\nCaptured ${targets.length} screenshot(s) into ${OUT_DIR}/.`);
console.log("Set `coverImage` on each project in data/projects.ts to use them.");
