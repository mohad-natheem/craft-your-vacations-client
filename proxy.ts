import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const PROTECTED_PATHS: string[] = [];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Auth0 handle all /auth/* routes (login, callback, logout, profile)
  const authResponse = await auth0.middleware(request);
  if (authResponse.status !== 200 || pathname.startsWith("/auth/")) {
    return authResponse;
  }

  // Protect specific paths
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );


  if (isProtected) {
    const sessionCookie = request.cookies.get("__session");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return authResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
