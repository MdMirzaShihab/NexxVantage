"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="nv-nav-embossed-link"
      data-active={isActive || undefined}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close drawer on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus the close button when drawer opens
  useEffect(() => {
    if (mobileOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-3 md:pt-4 md:px-6">
      <nav
        className="nv-nav-board mx-auto flex max-w-7xl items-center justify-between"
      >
        {/* Logo — raised from the board */}
        <div className="nv-nav-embossed-logo">
          <Logo />
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isActive(link.href)}
            />
          ))}

          <div className="mx-2 h-6 w-px" style={{ background: "var(--nv-border-default)" }} />

          <ThemeToggle />

          <div className="ml-2">
            <Button href={SITE_CONFIG.bookingUrl} className="text-xs px-4 py-2">
              Book a consultation
            </Button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="nv-nav-embossed-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onKeyDown={(e) => e.key === "Escape" && closeMobile()}
        >
          {/* Backdrop */}
          <div
            className="nv-drawer-backdrop"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            id="mobile-drawer"
            className="nv-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-6">
              <div className="nv-nav-embossed-logo">
                <Logo />
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="nv-nav-embossed-hamburger"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav links */}
            <div className="flex flex-col gap-3 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={isActive(link.href)}
                  onClick={closeMobile}
                />
              ))}
            </div>

            {/* Drawer divider */}
            <div className="mx-6 my-4 h-px" style={{ background: "var(--nv-border-default)" }} />

            {/* Drawer CTA */}
            <div className="px-6">
              <Button href={SITE_CONFIG.bookingUrl} className="w-full text-center">
                Book a consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
