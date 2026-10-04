import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, rendered at build time on deep navy with the approved monogram.
 * Matimo ships as WOFF2 for the browser, which Satori cannot read, so the TTF
 * from the same licensed package is used here (assets/og).
 */
export default async function OpengraphImage() {
  const [bold, medium, monogram] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/Matimo-Bold.ttf")),
    readFile(join(process.cwd(), "assets/og/Matimo-Medium.ttf")),
    readFile(join(process.cwd(), "public/brand/monogram-on-dark.png")),
  ]);

  const monogramSrc = `data:image/png;base64,${monogram.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#293681",
          padding: "68px 80px",
          fontFamily: "Matimo",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -160,
            width: 680,
            height: 680,
            borderRadius: 9999,
            background: "#4274d9",
            opacity: 0.55,
            filter: "blur(150px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "#95ccdd",
            opacity: 0.3,
            filter: "blur(150px)",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={monogramSrc} width={58} height={58} alt="" />
            <div
              style={{
                fontSize: 27,
                fontWeight: 700,
                color: "#d0e7e6",
                letterSpacing: "0.13em",
              }}
            >
              SABIH UL EBAD
            </div>
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: "#95ccdd",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            8+ Years · Top Rated on Upwork
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          <span>I design &amp; build</span>
          <span>digital experiences</span>
          <span style={{ color: "#95ccdd" }}>that deliver results.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(208,231,230,0.22)",
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 25, fontWeight: 500, color: "rgba(208,231,230,0.9)" }}>
            {site.name}
          </div>
          <div style={{ fontSize: 21, fontWeight: 500, color: "rgba(208,231,230,0.65)" }}>
            {site.role}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Matimo", data: bold, weight: 700, style: "normal" },
        { name: "Matimo", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
