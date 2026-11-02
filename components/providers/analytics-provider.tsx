"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Analytics never runs on private family or studio routes. Matching is by whole
// path segment, so "/s" (private presentations) does not also match "/sign-in".
const privateRoutePrefixes = ["/archive", "/handoff", "/invite", "/projects", "/review", "/s"];

function isPrivateRoute(pathname: string) {
  return privateRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (
      !apiKey ||
      !apiHost ||
      isPrivateRoute(pathname)
    ) {
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false,
      persistence: "localStorage+cookie",
      autocapture: false,
      disable_session_recording: true,
    });

    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  return children;
}
