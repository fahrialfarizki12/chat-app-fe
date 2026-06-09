import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  // kalau belum login tapi masuk ke dashboard ("/")
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // kalau sudah login tapi masuk auth page
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/auth/register"],
};
