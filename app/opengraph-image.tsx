import { ImageResponse } from "next/og";

import { productConfig } from "@/lib/config/product";

export const alt = `${productConfig.name} — ${productConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card for the public marketing pages. Rendered at request time from
 * the brand palette rather than a static export, so a rename or palette change
 * cannot leave a stale image behind.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f2e9d8",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68,
              height: 68,
              borderRadius: 6,
              border: "2px solid rgba(166,124,82,0.55)",
              color: "#6b3e36",
              fontSize: 26,
            }}
          >
            H&amp;H
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, color: "#3a3026", letterSpacing: 2 }}>
              {productConfig.name}
            </div>
            <div style={{ fontSize: 17, color: "#8a7a62", letterSpacing: 5 }}>
              {productConfig.tagline.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 74, color: "#3a3026", lineHeight: 1.05, maxWidth: 900 }}>
            Your research deserves a reveal
          </div>
          <div style={{ fontSize: 27, color: "#5c5142", maxWidth: 820, lineHeight: 1.4 }}>
            Private family archives, delivered under a genealogist&apos;s own name.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 6,
            background: "#6b3e36",
            width: 180,
          }}
        />
      </div>
    ),
    size,
  );
}
