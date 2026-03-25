"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!apiKey || !apiHost) {
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: true,
      persistence: "localStorage+cookie",
    });
  }, []);

  return children;
}
