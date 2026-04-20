"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isOnboarding = pathname === "/onboarding";
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (!session && isOnboarding) {
      redirect("/login");
    }

    if (isAuthPage && session && session?.user?.phoneVerified === true) {
      redirect("/");
    }
  }, [session, status, pathname, router]);

  if (status === "loading") return <LoadingSpinner />;

  if (pathname === "/login" && session && session?.user?.phoneVerified === true)
    return null;

  return <main className="min-h-screen bg-bg">{children}</main>;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
