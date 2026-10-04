/**
 * Derives the brand asset set from the single approved logo PNG.
 *
 * The monogram shape and its alpha are never altered — only cropped, scaled, or
 * (for the dark-surface variant) remapped along the brand ramp so the navy end
 * of the gradient stays visible on a navy background.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/brand/logo-source.png";

// Measured from the alpha profile of the source artwork.
const MONO = { left: 104, top: 134, width: 493, height: 492 };
const LOCKUP = { left: 104, top: 134, width: 2081 - 104 + 1, height: 625 - 134 + 1 };
const LUM = { min: 0.0802, max: 0.8791 };

const lerp = (a, b, t) => a + (b - a) * t;

/** For navy surfaces: royal blue → soft cyan → ice, so the navy end stays visible. */
const RAMP_ON_DARK = [
  [0.0, [66, 116, 217]], // #4274D9 royal blue
  [0.62, [149, 204, 221]], // #95CCDD soft cyan
  [1.0, [208, 231, 230]], // #D0E7E6 ice
];

/**
 * For the app icon the mark sits on a navy tile at 16px, where the ribbon’s
 * counters collapse. Skipping royal blue and running soft cyan → ice keeps the
 * silhouette readable at that size.
 */
const RAMP_ICON = [
  [0.0, [133, 190, 214]], // slightly deepened soft cyan
  [0.5, [163, 214, 226]],
  [1.0, [233, 245, 245]], // near-white ice
];

function rampColor(t, RAMP) {
  for (let i = 0; i < RAMP.length - 1; i += 1) {
    const [t0, c0] = RAMP[i];
    const [t1, c1] = RAMP[i + 1];
    if (t <= t1 || i === RAMP.length - 2) {
      const k = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
      return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)];
    }
  }
  return RAMP.at(-1)[1];
}

/** Remaps colour by luminance while preserving the alpha mask exactly. */
async function remapForDark(buffer, ramp = RAMP_ON_DARK) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += info.channels) {
    if (out[i + 3] === 0) continue;
    const l = (0.2126 * out[i] + 0.7152 * out[i + 1] + 0.0722 * out[i + 2]) / 255;
    const t = Math.max(0, Math.min(1, (l - LUM.min) / (LUM.max - LUM.min)));
    const [r, g, b] = rampColor(t, ramp);
    out[i] = Math.round(r);
    out[i + 1] = Math.round(g);
    out[i + 2] = Math.round(b);
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

/** Square canvas with the monogram centred and `pad` fraction of breathing room. */
async function squareMonogram(size, pad, recolour, ramp) {
  let mono = await sharp(SRC).extract(MONO).png().toBuffer();
  if (recolour) mono = await remapForDark(mono, ramp);

  const inner = Math.round(size * (1 - pad * 2));
  const resized = await sharp(mono)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

/** App icon: the monogram on a deep-navy rounded tile, for 16/32px legibility. */
async function appIcon(size) {
  const radius = Math.round(size * 0.22);
  const tile = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#293681"/>
     </svg>`,
  );

  // Tight padding plus the high-contrast ramp so the mark survives 16x16.
  const mark = await squareMonogram(size, 0.07, true, RAMP_ICON);

  return sharp(tile).composite([{ input: mark }]).png().toBuffer();
}

await mkdir("public/brand", { recursive: true });

// 1. Full horizontal lockup, trimmed to content, for light surfaces.
await sharp(SRC)
  .extract(LOCKUP)
  .resize({ width: 1200 })
  .png({ compressionLevel: 9 })
  .toFile("public/brand/logo-lockup.png");

// 2. Monogram as supplied — for light surfaces.
await sharp(await squareMonogram(512, 0.04, false))
  .png({ compressionLevel: 9 })
  .toFile("public/brand/monogram.png");

// 3. Monogram remapped up the brand ramp — for navy surfaces.
await sharp(await squareMonogram(512, 0.04, true))
  .png({ compressionLevel: 9 })
  .toFile("public/brand/monogram-on-dark.png");

// 4. Favicon / app icons (monogram only, no wordmark).
await sharp(await appIcon(512)).png({ compressionLevel: 9 }).toFile("app/icon.png");
await sharp(await appIcon(180)).png({ compressionLevel: 9 }).toFile("app/apple-icon.png");

for (const f of [
  "public/brand/logo-lockup.png",
  "public/brand/monogram.png",
  "public/brand/monogram-on-dark.png",
  "app/icon.png",
  "app/apple-icon.png",
]) {
  const m = await sharp(f).metadata();
  console.log(`${f}  ${m.width}x${m.height}`);
}
