import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Task 1: Keamanan (Middleware)
// Melindungi rute sensitif aplikasi agar tidak bisa diakses tanpa otentikasi.
// "Login" disimulasikan dengan mengecek keberadaan cookie sesi (au_session).
export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/categories/:path*",
    "/analysis/:path*",
    "/profile/:path*",
  ],
};
