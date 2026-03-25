import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { hasConfiguredBackend, requireEnv } from "@/lib/runtime";

export async function createSupabaseServerClient() {
  if (!hasConfiguredBackend()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(values) {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
