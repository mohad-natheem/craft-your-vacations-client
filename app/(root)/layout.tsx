"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar/NavBar";

const PROTECTED_PATHS = ["/destinations", "/packages"];

function RootGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  useEffect(() => {
    if (status === "loading") return;

    if (isProtected && !session) {
      redirect("/login");
    }

    if (session && session.user.phoneVerified === false) {
      redirect("/onboarding");
    }
  }, [session, status, pathname, router, isProtected]);

  if (status === "loading") return null;
  if (isProtected && !session) return null;
  if (session && session.user.phoneVerified === false) return null;

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootGuard>
      <Navbar />
      <main>{children}</main>
    </RootGuard>
  );
}
