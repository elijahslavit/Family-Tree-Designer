import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  images: {
    // Card-kit PNGs are multi‑MB; optimizing many in parallel crashes sharp/jest
    // workers in dev ("Jest worker … exceeding retry limit"). Display frames are
    // already WebP; keep formats limited and refuse to over-process.
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/(s|invite|review|handoff|archive)/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
