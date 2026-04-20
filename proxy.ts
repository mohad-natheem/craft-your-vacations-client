import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require a valid session
const PROTECTED_PATHS = ["/destinations", "/packages"];

// Auth pages — redirect away if already logged in
const AUTH_PATHS = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isOnboarding = pathname.startsWith("/onboarding");
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);
  const isApiRoute = pathname.startsWith("/api/");

  // Redirect authenticated users away from login/register
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect onboarding — must be signed in
  if (isOnboarding && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect app routes — must be signed in
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Force onboarding if phone is not yet verified (all page routes, not API calls)
  console.log("Inside Proxy .ts");
  if (
    token &&
    token.phoneVerified === false &&
    !isOnboarding &&
    !isAuthPage &&
    !isApiRoute
  ) {
    console.log(
      "Inside Redirecting to Onboarding phoneVerified:",
      token.phoneVerified,
    );
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Runs on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
