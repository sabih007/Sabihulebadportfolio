"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { navigation } from "@/data/site";
import { cn } from "@/lib/utils/cn";

/**
 * The header keeps a light tone at all times, including over the navy bands.
 * That is deliberate: the approved logo is drawn for light grounds, so a single
 * light bar means the mark and the navigation stay legible on every section
 * without swapping artwork mid-scroll.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ice"
      >
        Skip to content
      </a>

      <header
        data-tone="light"
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-fg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-b border-line/10 bg-paper shadow-[0_1px_30px_-18px_rgba(41,54,129,0.55)] supports-[backdrop-filter]:bg-paper/92 supports-[backdrop-filter]:backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            aria-label="Sabih Ul Ebad — home"
            className="transition-opacity duration-300 hover:opacity-75"
          >
            <Logo size={34} priority />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "group relative inline-flex items-center rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-300",
                      isActive(item.href) ? "text-navy" : "text-fg/65 hover:text-navy",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "gradient-rule absolute bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Wrapped rather than hidden via Magnetic's own class, so the
                display utility cannot collide with its inline-flex base. */}
            <div className="hidden sm:block">
              <Magnetic strength={6}>
                <Link
                  href="/contact"
                  className="group/btn inline-flex items-center gap-2 rounded-full bg-blue-solid px-5 py-2.5 text-[0.875rem] font-semibold text-white transition-colors duration-500 hover:bg-navy"
                >
                  Let&rsquo;s Talk
                  <Arrow className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Magnetic>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line/20 text-navy transition-colors duration-300 hover:border-line/40 hover:bg-line/6 lg:hidden"
            >
              <span aria-hidden className="flex flex-col items-center gap-[5px]">
                <span className="block h-[1.5px] w-[18px] rounded-full bg-current" />
                <span className="block h-[1.5px] w-[18px] rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
