import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes: anyone can visit without a session.
const PUBLIC_PREFIXES = ["/", "/campaigns", "/auth"];

// Routes that require an authenticated session.
const PROTECTED_PREFIXES = ["/create", "/dashboard", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("fundflow_token")?.value;

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Authenticated user trying to reach login/register → send to dashboard.
  if (token && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // No session on a protected route → redirect to login with next param.
  if (!token && isProtected) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};
