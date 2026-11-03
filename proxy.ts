import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

// The earlier hobbyist tree editor and public share links were superseded by
// the professional studio and invitation-only client presentations. Old
// bookmarks redirect without their query strings, so retired share tokens are
// never carried into a new URL.
const retiredStudioRoutes = /^\/(dashboard|directory|canvas|lineages|theme|import|settings|person)(\/|$)/;
const retiredPublicRoutes = /^\/(t|card-preview)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (retiredStudioRoutes.test(pathname)) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }
  if (retiredPublicRoutes.test(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
