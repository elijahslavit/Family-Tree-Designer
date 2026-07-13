"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const privateRoutePrefixes = ["/archive", "/invite", "/projects", "/review", "/s", "/t"];

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (
      !apiKey ||
      !apiHost ||
      privateRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
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
