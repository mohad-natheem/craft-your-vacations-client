"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isOnboarding = pathname === "/onboarding";
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (!session && isOnboarding) {
      router.replace("/login");
    }

    if (session?.user?.role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (isAuthPage && session && session?.user?.phoneVerified === true) {
      router.replace("/");
    }
  }, [session, status, pathname, router]);

  if (status === "loading") return <LoadingSpinner />;

  if (session?.user?.role === "Admin") return null;

  if (pathname === "/login" && session && session?.user?.phoneVerified === true)
    return null;

  return <main className="min-h-screen bg-bg">{children}</main>;
}
