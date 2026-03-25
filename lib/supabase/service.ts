import { createClient } from "@supabase/supabase-js";

import { hasConfiguredBackend, requireEnv } from "@/lib/runtime";

declare global {
  var __familyTreeSupabaseServiceClient:
    | ReturnType<typeof createClient>
    | undefined;
}

export function createSupabaseServiceClient() {
  if (!hasConfiguredBackend()) {
    return null;
  }

  if (!globalThis.__familyTreeSupabaseServiceClient) {
    globalThis.__familyTreeSupabaseServiceClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  return globalThis.__familyTreeSupabaseServiceClient;
}
