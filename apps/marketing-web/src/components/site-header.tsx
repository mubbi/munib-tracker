"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { NAV_LINKS, SITE_PATHS } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link
          href={SITE_PATHS.home}
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-hero-from to-hero-to text-sm text-hero-gold shadow-sm"
          >
            ﷽
          </span>
          <span>{APP_NAME}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted-surface/60 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={SITE_PATHS.download}
            className="hidden h-9 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] sm:inline-flex"
          >
            Get the app
          </Link>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-border/60 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="text-lg leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id={menuId}
          aria-label="Mobile"
          className="border-t border-border/60 bg-background px-6 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted-surface/60"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={SITE_PATHS.download}
                className="mt-2 block rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                Get the app
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
