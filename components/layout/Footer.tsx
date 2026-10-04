import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { contact, footerNavigation, site, socialLinks } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  const social = socialLinks();

  return (
    <footer data-tone="dark" className="grain-dark relative bg-navy text-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent"
      />

      <div className="shell relative py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Sabih Ul Ebad — home"
              className="inline-flex transition-opacity duration-300 hover:opacity-80"
            >
              <Logo tone="dark" size={40} responsive={false} />
            </Link>
            <p className="mt-5 text-body text-ice/70">{site.footerLine}</p>

            <ul className="mt-6 flex flex-col gap-2">
              <li>
                <a
                  href={contact.email.href}
                  className="text-[0.9375rem] font-medium text-ice transition-colors duration-300 hover:text-cyan"
                >
                  {contact.email.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.phone.href}
                  className="text-[0.9375rem] font-medium text-ice transition-colors duration-300 hover:text-cyan"
                >
                  {contact.phone.display}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
            <nav aria-labelledby="footer-nav-heading">
              <h2
                id="footer-nav-heading"
                className="font-accent text-label uppercase tracking-[0.18em] text-cyan/70"
              >
                Navigate
              </h2>
              <ul className="mt-5 space-y-3">
                {footerNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-ice/75 transition-colors duration-300 hover:text-ice"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-accent text-label uppercase tracking-[0.18em] text-cyan/70">
                Elsewhere
              </h2>
              <ul className="mt-5 space-y-3">
                {social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer", "data-cursor": "arrow" }
                        : {})}
                      className="text-[0.9375rem] text-ice/75 transition-colors duration-300 hover:text-ice"
                    >
                      {item.label}
                      {item.external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line/14 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-meta text-ice/55">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-accent text-meta text-ice/55">{site.signature}</p>
        </div>
      </div>
    </footer>
  );
}
