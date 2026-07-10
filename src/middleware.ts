import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, decodeSession } from "@/lib/auth-session";

const publicPaths = [
  "/",
  "/login",
  "/login/allianz",
  "/login/prudential",
  "/register",
];
const authPaths = [
  "/login",
  "/login/allianz",
  "/login/prudential",
  "/register",
];

function isAuthPage(pathname: string) {
  return authPaths.some((p) => pathname === p);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? decodeSession(token) : null;
  const isAuthenticated = Boolean(session);
  const isProtected = pathname.startsWith("/dashboard");

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Clients can view cases & comment only — block create case
  if (
    pathname.startsWith("/dashboard/cases/new") &&
    session?.role === "CLIENT"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!publicPaths.includes(pathname) && !isProtected && !isAuthPage(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
