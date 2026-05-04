"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const PROTECTED_PATHS = ["/destinations", "/packages", "/profile", "/bookings"];

export function RootGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  useEffect(() => {
    if (status === "loading") return;

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
      return;
    }

    if (session?.user?.role === "Admin") {
      console.log("Redirecting from Root Guard");
      router.replace("/admin");
      return;
    }

    if (isProtected && !session) {
      redirect("/login");
    }

    if (session && session.user.phoneVerified === false) {
      redirect("/onboarding");
    }
  }, [session, status, pathname, router, isProtected]);

  if (status === "loading") return <LoadingSpinner />;
  if (session?.error === "RefreshAccessTokenError") return null;
  if (session?.user?.role === "Admin") return null;
  if (isProtected && !session) return null;
  if (session && session.user.phoneVerified === false) return null;

  return <>{children}</>;
}
