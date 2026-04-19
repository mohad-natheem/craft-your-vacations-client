import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Add any path that requires login here
const PROTECTED_PATHS = ["/destinations", "/packages"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  // Redirect already-logged-in users away from /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect listed paths — redirect unauthenticated users to /login
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Runs on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
