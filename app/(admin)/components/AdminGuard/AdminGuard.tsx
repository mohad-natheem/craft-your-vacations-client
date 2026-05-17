"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import InactivityDialog from "@/components/InactivityDialog/InactivityDialog";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { showWarning, countdown, keepSignedIn } = useInactivityLogout(
    !!session && status === "authenticated" && session.user.role === "Admin",
  );

  useEffect(() => {
    if (status === "loading") return;

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
      return;
    }

    if (!session) {
      redirect("/login");
      return;
    }

    if (session.user.role !== "Admin") {
      redirect("/");
    }
  }, [session, status]);

  if (status === "loading") return <LoadingSpinner />;
  if (session?.error === "RefreshAccessTokenError") return null;
  if (!session) return null;
  if (session.user.role !== "Admin") return null;

  return (
    <>
      <InactivityDialog
        isOpen={showWarning}
        countdown={countdown}
        onKeepSignedIn={keepSignedIn}
      />
      {children}
    </>
  );
}
