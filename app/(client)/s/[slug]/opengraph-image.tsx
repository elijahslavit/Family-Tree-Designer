import { ImageResponse } from "next/og";

import { productConfig } from "@/lib/config/product";

export const alt = "A private family archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card for a private archive — deliberately says nothing about the family.
 *
 * When a relative pastes their invitation link into a message, the chat service
 * fetches this card with no session and no invitation. Anything printed here is
 * visible to that service and to anyone who sees the unfurled preview, including
 * people the archive was never shared with. So the card carries the product's
 * identity and nothing about whose history it is: no family name, no ancestor,
 * no counts, no dates.
 */
export default function PrivateArchiveOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          background: "#191411",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 86,
            height: 86,
            borderRadius: 8,
            border: "2px solid rgba(212,175,90,0.5)",
            color: "#d4af5a",
            fontSize: 30,
          }}
        >
          H&amp;H
        </div>
        <div style={{ fontSize: 54, color: "#f4ebdd" }}>A private family archive</div>
        <div style={{ fontSize: 25, color: "#a3907a", maxWidth: 760, textAlign: "center" }}>
          Shared only with invited family. Open your invitation to view it.
        </div>
        <div style={{ fontSize: 17, color: "#7d6c58", letterSpacing: 5, marginTop: 14 }}>
          {productConfig.name.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
