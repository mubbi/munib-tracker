"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { trackCtaClick, trackNavClick } from "@/lib/analytics";
import { NAV_LINKS, SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs to close the menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-border/60 bg-background/80 shadow-[0_1px_0_0_color-mix(in_srgb,var(--color-border)_60%,transparent)] backdrop-blur-xl"
            : "border-transparent bg-background/40 backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-300 md:px-8",
            scrolled ? "h-[92px]" : "h-24",
          )}
        >
          <Link
            href={SITE_PATHS.home}
            className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            <Image
              src="/munib-logo.png"
              alt=""
              width={176}
              height={176}
              className="size-[86px] rounded-2xl"
              priority
            />
            <span className="font-display text-lg font-semibold">{APP_NAME}</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                        active ? "text-foreground" : "text-muted hover:text-foreground",
                      )}
                      onClick={() => trackNavClick(link.label.toLowerCase(), pathname)}
                    >
                      {link.label}
                      {active ? (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <Button
                href={SITE_PATHS.download}
                size="sm"
                onClick={() => trackCtaClick("get_app", "header")}
              >
                Get the app
              </Button>
            </div>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/60 text-foreground backdrop-blur-sm lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id={menuId}
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/60 bg-background/95 px-5 pb-5 pt-2 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-3 text-[15px] font-medium text-foreground hover:bg-muted-surface/60"
                    onClick={() => trackNavClick(link.label.toLowerCase(), pathname)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Button
                  href={SITE_PATHS.download}
                  className="w-full"
                  onClick={() => trackCtaClick("get_app", "header")}
                >
                  Get the app
                </Button>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
