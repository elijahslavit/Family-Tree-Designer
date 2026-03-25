"use client";

import { createBrowserClient } from "@supabase/ssr";

import { hasConfiguredPublicSupabase } from "@/lib/runtime";

let browserClient:
  | ReturnType<typeof createBrowserClient>
  | null
  | undefined;

export function createSupabaseBrowserClient() {
  if (!hasConfiguredPublicSupabase()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return browserClient;
}
