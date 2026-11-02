import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** Origins the browser may call: Supabase auth and, when configured, PostHog. */
function connectSources() {
  const sources = new Set(["'self'"]);
  for (const value of [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_POSTHOG_HOST]) {
    if (!value) continue;
    try {
      sources.add(new URL(value).origin);
    } catch {
      // Ignore malformed values rather than emitting an invalid policy.
    }
  }
  return [...sources].join(" ");
}

// Next.js bootstraps pages with inline scripts, so 'unsafe-inline' is needed
// for scripts unless every page moves to per-request nonces. Everything else
// is locked to this origin: no third-party scripts, frames, or plugins.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  `connect-src ${connectSources()}${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
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
