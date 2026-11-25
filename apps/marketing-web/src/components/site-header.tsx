"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { Link, usePathname } from "@/i18n/navigation";
import { trackCtaClick, trackNavClick } from "@/lib/analytics";
import { isActivePath, menuIsActive } from "@/lib/nav";
import { NAV_LINKS, NAV_MENUS, type NavMenu, SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Header CTA look. No display utility here: `cn` doesn't de-duplicate, and an
 * `inline-flex` would beat the caller's `hidden` (Tailwind sorts display rules). */
const CTA_CLASS =
  "items-center justify-center rounded-full bg-[linear-gradient(160deg,#43d69d_0%,#1db884_45%,#0f9268_100%)] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(4,34,24,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-200 [text-shadow:0_1px_3px_rgba(0,60,40,0.45)] hover:brightness-[1.06] active:scale-[0.98]";

/** Desktop mega-menu panel. */
function MegaPanel({
  menu,
  id,
  pathname,
  onNavigate,
}: {
  menu: NavMenu;
  id: string;
  pathname: string;
  /** Called with a stable, locale-independent id for analytics. */
  onNavigate: (navId: string) => void;
}) {
  const t = useTranslations("nav");
  return (
    <div
      id={id}
      className="absolute inset-x-0 top-full border-y border-white/[0.08] bg-[#081a27] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-8 py-8 lg:grid-cols-[1fr_18rem]">
        <div className={cn("grid gap-8", menu.columns.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
          {menu.columns.map((col) => (
            <div key={col.id}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {t(`columns.${col.id}`)}
              </p>
              <ul className="mt-3 flex flex-col gap-0.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                      onClick={() => onNavigate(item.href)}
                    >
                      <span className="block text-[15px] font-medium text-white group-hover:text-brand">
                        {t(`items.${item.id}.label`, { appName: APP_NAME })}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-white/55">
                        {t(`items.${item.id}.hint`)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {menu.feature ? (
            <Link
              href={menu.feature.href}
              className="group flex flex-1 flex-col rounded-2xl border border-brand/25 bg-[#0d2a2a] p-5 transition-colors hover:border-brand/50"
              onClick={() => onNavigate(`feature_${menu.id}`)}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                <Sparkles aria-hidden className="size-3.5" />
                {t(`featured.${menu.feature.id}.eyebrow`)}
              </span>
              <span className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                {t(`featured.${menu.feature.id}.label`)}
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-white/65">
                {t(`featured.${menu.feature.id}.hint`)}
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand">
                {t("learnMore")}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </span>
            </Link>
          ) : null}
          <Link
            href={menu.href}
            className="inline-flex items-center gap-1.5 px-1 text-sm font-semibold text-white/80 hover:text-brand"
            onClick={() => onNavigate(`all_${menu.id}`)}
          >
            {t(`menus.${menu.id}.viewAll`)}
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Sitewide header: mega-menus on desktop, an accordion drawer on mobile. */
export function SiteHeader() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const baseId = useId();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHome = pathname === "/";
  const showChrome = scrolled || !onHome || mobileOpen || openMenu !== null;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes; clicking outside closes.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openMenu) {
        document.getElementById(`${baseId}-trigger-${openMenu}`)?.focus();
        setOpenMenu(null);
      }
      if (mobileOpen) {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, mobileOpen, baseId]);

  // Lock page scroll and make the page behind the mobile drawer inert.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const behind = [
      document.getElementById("main-content"),
      document.querySelector("body > footer"),
    ];
    for (const el of behind) el?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = prev;
      for (const el of behind) el?.removeAttribute("inert");
    };
  }, [mobileOpen]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);

  // Close a hover-opened menu shortly after the pointer leaves the header.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    el.addEventListener("mouseleave", scheduleClose);
    return () => el.removeEventListener("mouseleave", scheduleClose);
  }, [scheduleClose]);

  const onNavigate = (navId: string) => {
    trackNavClick(navId, pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 isolate">
      <div
        className={cn(
          "relative transition-colors duration-200",
          showChrome
            ? "bg-[#07141f]/95 shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <Link
            href={SITE_PATHS.home}
            className="flex shrink-0 items-center gap-3 font-semibold tracking-tight text-white transition-opacity hover:opacity-85"
          >
            <Image
              src="/icon-512.png"
              alt=""
              width={112}
              height={112}
              className="size-10 rounded-[22%] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)] md:size-11"
              loading="eager"
            />
            <span className="font-display text-[17px] font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.35)] md:text-lg">
              {APP_NAME}
            </span>
          </Link>

          <nav aria-label={t("mainLabel")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_MENUS.map((menu) => {
                const open = openMenu === menu.id;
                const panelId = `${baseId}-panel-${menu.id}`;
                const active = menuIsActive(pathname, menu);
                return (
                  <li
                    key={menu.id}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse") return;
                      cancelClose();
                      setOpenMenu(menu.id);
                    }}
                    onBlur={(e) => {
                      const next = e.relatedTarget as Node | null;
                      if (next && !e.currentTarget.contains(next)) {
                        setOpenMenu((current) => (current === menu.id ? null : current));
                      }
                    }}
                  >
                    <button
                      id={`${baseId}-trigger-${menu.id}`}
                      type="button"
                      aria-expanded={open}
                      aria-controls={open ? panelId : undefined}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]",
                        open || active ? "text-white" : "text-white/75 hover:text-white",
                        open && "bg-white/[0.07]",
                      )}
                      onClick={(e) => {
                        // Mouse users already opened it on hover; a click shouldn't close it.
                        const native = e.nativeEvent as PointerEvent;
                        if (native.pointerType === "mouse") setOpenMenu(menu.id);
                        else setOpenMenu(open ? null : menu.id);
                      }}
                    >
                      {t(`menus.${menu.id}.label`)}
                      <ChevronDown
                        aria-hidden
                        className={cn("size-4 transition-transform", open && "rotate-180")}
                      />
                    </button>
                    {open ? (
                      <MegaPanel
                        menu={menu}
                        id={panelId}
                        pathname={pathname}
                        onNavigate={onNavigate}
                      />
                    ) : null}
                  </li>
                );
              })}
              {NAV_LINKS.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href} onPointerEnter={() => setOpenMenu(null)}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={cn(
                        "inline-flex rounded-full px-3.5 py-2 text-sm font-medium transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]",
                        active ? "text-white" : "text-white/75 hover:text-white",
                      )}
                      onClick={() => onNavigate(link.href)}
                    >
                      {t(`links.${link.id}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden lg:block" />
            <Link
              href={SITE_PATHS.download}
              className={cn(CTA_CLASS, "hidden h-10 whitespace-nowrap px-5 text-sm sm:inline-flex")}
              onClick={() => trackCtaClick("get_app", "header")}
            >
              {t("getTheApp")}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls={`${baseId}-mobile`}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="sr-only">{mobileOpen ? t("closeMenu") : t("openMenu")}</span>
              {mobileOpen ? (
                <X aria-hidden className="size-5" />
              ) : (
                <Menu aria-hidden className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <MobileNav
          id={`${baseId}-mobile`}
          pathname={pathname}
          expanded={mobileSection}
          onExpand={setMobileSection}
          onNavigate={onNavigate}
        />
      ) : null}
    </header>
  );
}
