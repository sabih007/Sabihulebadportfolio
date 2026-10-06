import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu", "--no-first-run"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto("https://caldentalusa.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForNetworkIdle({ idleTime: 1500, timeout: 20000 }).catch(() => {});
await sleep(6000);

console.log("--- frames ---");
for (const f of page.frames()) console.log(" frame:", f.url().slice(0, 100));

const info = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cls = typeof el.className === "string" ? el.className : "";
    const id = el.id ?? "";
    const aria = el.getAttribute("aria-label") ?? "";
    const text = (el.textContent ?? "").trim().slice(0, 30);
    if (/close|dismiss|popup|modal/i.test(`${cls} ${id} ${aria}`)) {
      out.push({
        tag: el.tagName,
        cls: cls.slice(0, 80),
        id: id.slice(0, 40),
        aria,
        text,
        box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
      });
    }
  }
  return out.slice(0, 40);
});

console.log("--- close/popup candidates ---");
for (const c of info) console.log(JSON.stringify(c));

await browser.close();
