import React, { useEffect, useState } from "react";
import type { NavLink } from "@/app/types/component";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Search } from "lucide-react";
import { CircleUser } from "lucide-react";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import ToggleTheme from "@/components/ToggleTheme/ToggleTheme";
import Link from "next/link";
import path from "path";

interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Components", href: "/components" },
];

export function Navbar({
  logo,
  links = defaultLinks,
  className = "",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 glass border-b border-outline ${className}`}
    >
      <div className="mx-auto px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="Logo" className="w-25" />
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.href === pathname;
            return (
              <li key={link.href}>
                <Link href={link.href}>
                  <div
                    className={`px-4 py-2 text-body-md transition-colors relative pb-0.5 ${
                      isActive
                        ? "text-primary"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      {isActive && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-full bg-primary rounded-full" />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-primary transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-primary transition-colors"
          >
            <CircleUser className="w-5 h-5" />
          </button>
          <ToggleTheme />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-primary transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="material-symbols-outlined text-[20px]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline px-6 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-body-md transition-colors ${
                link.isActive
                  ? "text-primary bg-primary/10"
                  : "text-text-muted hover:text-text hover:bg-surface-high"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
