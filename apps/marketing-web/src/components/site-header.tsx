"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { trackCtaClick, trackNavClick } from "@/lib/analytics";
import { NAV_LINKS, SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Light-on-dark header for the sitewide Day Arc canvas. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const onHome = pathname === "/";
  /** Inner pages always show chrome so nav never blends into body copy. */
  const showChrome = scrolled || !onHome || open;

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
          "relative transition-[background-color,backdrop-filter,box-shadow] duration-300",
          showChrome
            ? "bg-[#07141f]/80 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        {/* Soft dissolve into the page — avoids a hard slab edge */}
        {showChrome ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full h-10 bg-gradient-to-b from-[#07141f]/50 to-transparent"
          />
        ) : null}

        <div
          className={cn(
            "relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[height] duration-300 md:px-8",
            showChrome ? "h-[4.5rem]" : "h-[5.25rem]",
          )}
        >
          <Link
            href={SITE_PATHS.home}
            className="flex items-center gap-2.5 font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            <Image
              src="/munib-logo.png"
              alt=""
              width={112}
              height={112}
              className="size-14 rounded-xl md:size-[3.75rem]"
              priority
            />
            <span className="font-display text-lg font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
              {APP_NAME}
            </span>
          </Link>

          <nav
            aria-label="Main"
            className={cn(
              "hidden lg:block",
              onHome && "lg:absolute lg:left-1/2 lg:-translate-x-1/2",
            )}
          >
            <ul className={cn("flex items-center", onHome ? "gap-8" : "gap-5")}>
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-1 py-2 text-sm font-medium transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]",
                        active ? "text-white" : "text-white/70 hover:text-white",
                      )}
                      onClick={() => trackNavClick(link.label.toLowerCase(), pathname)}
                    >
                      {link.label}
                      {active ? (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gold"
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
            {!onHome ? (
              <div className="hidden sm:block">
                <Link
                  href={SITE_PATHS.download}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,#43d69d_0%,#1db884_45%,#0f9268_100%)] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(4,34,24,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-200 [text-shadow:0_1px_3px_rgba(0,60,40,0.45)] hover:brightness-[1.06] active:scale-[0.98]"
                  onClick={() => trackCtaClick("get_app", "header")}
                >
                  Get the app
                </Link>
              </div>
            ) : null}
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm lg:hidden"
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
            className="border-b border-white/[0.06] bg-[#07141f]/95 px-5 pb-5 pt-2 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-3 text-[15px] font-medium text-white hover:bg-white/10"
                    onClick={() => trackNavClick(link.label.toLowerCase(), pathname)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href={SITE_PATHS.download}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(160deg,#43d69d_0%,#1db884_45%,#0f9268_100%)] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(4,34,24,0.8)]"
                  onClick={() => trackCtaClick("get_app", "header")}
                >
                  Get the app
                </Link>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
