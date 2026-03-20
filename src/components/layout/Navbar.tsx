"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("nv-theme");
    if (stored === "light") setTheme("light");
  }, []);

  function toggle(newTheme: "dark" | "light") {
    setTheme(newTheme);
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("nv-theme", newTheme);
  }

  return (
    <div className="nv-theme-toggle">
      <button
        type="button"
        className={theme === "dark" ? "active" : ""}
        onClick={() => toggle("dark")}
        aria-label="Dark theme"
      >
        ☾
      </button>
      <button
        type="button"
        className={theme === "light" ? "active" : ""}
        onClick={() => toggle("light")}
        aria-label="Light theme"
      >
        ☀
      </button>
    </div>
  );
}

/* Embossed nav link — raised from the surface like a physical control */
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className="nv-nav-embossed-link"
      data-active={isActive || undefined}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
      <nav
        className="nv-nav-board mx-auto flex max-w-7xl items-center justify-between"
      >
        {/* Logo — raised from the board */}
        <div className="nv-nav-embossed-logo">
          <Logo />
        </div>

        {/* Nav links — embossed controls */}
        <div className="flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}

          <div className="mx-2 h-6 w-px" style={{ background: "var(--nv-border-default)" }} />

          <ThemeToggle />

          <div className="ml-2">
            <Button href={SITE_CONFIG.bookingUrl} className="text-xs px-4 py-2">
              Book a Consultation
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
