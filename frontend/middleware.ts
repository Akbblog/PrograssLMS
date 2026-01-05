import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rewrite the root path to serve the static landing page from /public/presentation.html
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isRscRequest = request.nextUrl.searchParams.has("_rsc");

  if (path === "/") {
    // Next.js App Router issues internal requests to "/?_rsc=...".
    // Rewriting those to a static HTML breaks navigation and can cause 404s.
    if (isRscRequest) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/presentation.html";
    return NextResponse.rewrite(url);
  }

  if (path === "/register") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"]
};
