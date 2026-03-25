import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { hasConfiguredBackend, requireEnv, isDemoMode } from "@/lib/runtime";

const protectedPrefixes = ["/dashboard", "/directory", "/person", "/canvas", "/import", "/theme", "/settings"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!hasConfiguredBackend()) {
    return response;
  }

  const supabase = createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !isDemoMode() &&
    protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
