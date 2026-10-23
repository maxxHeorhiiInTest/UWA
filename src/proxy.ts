import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_COOKIE, verifySessionToken } from "./lib/session";

const intl = createMiddleware(routing);

function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return Boolean(token && verifySessionToken(token));
}

function clearAdminCookie(response: NextResponse) {
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (!hasValidAdminSession(request)) {
      return clearAdminCookie(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const valid = hasValidAdminSession(request);

    if (!isLogin && !valid) {
      return clearAdminCookie(
        NextResponse.redirect(new URL("/admin/login", request.url))
      );
    }

    return NextResponse.next();
  }

  return intl(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/api/admin/:path*",
  ],
};
