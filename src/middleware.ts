import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("appSession");

  // Si no hay cookie de sesión → redirigir al login
  if (!sessionCookie) {
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname); // permite volver tras login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Aplica solo a rutas protegidas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/children/:path*",
    "/calendar/:path*",
    "/expenses/:path*",
  ],
};
