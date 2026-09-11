import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccess, decodeSession, getDefaultRoute, isStudentEditPath, SESSION_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!user) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isStudentEditPath(pathname) && !["SUPER_ADMIN", "DIRECTOR", "FRONT_OFFICE"].includes(user.role)) {
    return NextResponse.redirect(new URL("/dashboard/students", request.url));
  }

  if (!canAccess(user.role, pathname)) {
    return NextResponse.redirect(new URL(getDefaultRoute(user.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
