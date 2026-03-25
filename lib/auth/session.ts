import { redirect } from "next/navigation";

import { getDemoStore } from "@/lib/data/demo-store";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ViewerContext } from "@/lib/types";

export async function getSessionAccountId() {
  if (!hasConfiguredBackend() || isDemoMode()) {
    return getDemoStore().account.id;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  return user?.id ?? null;
}

export async function requireAccountSession() {
  const accountId = await getSessionAccountId();

  if (!accountId) {
    redirect("/sign-in");
  }

  return accountId;
}

export async function getCreatorViewerContext(): Promise<ViewerContext> {
  return {
    mode: "creator",
    accountId: await requireAccountSession(),
  };
}

export function getPublicViewerContext(shareToken: string | null): ViewerContext {
  return {
    mode: "viewer",
    shareToken,
  };
}
