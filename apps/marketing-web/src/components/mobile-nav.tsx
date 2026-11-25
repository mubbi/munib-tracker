"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { StoreBadges } from "@/components/store-badges";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS, NAV_MENUS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Mobile drawer for `SiteHeader`: one accordion section per mega-menu, then the plain links. */
export function MobileNav({
  id,
  pathname,
  expanded,
  onExpand,
  onNavigate,
}: {
  id: string;
  pathname: string;
  /** Id of the open accordion section (kept by the header so it survives closing the drawer). */
  expanded: string | null;
  onExpand: (menuId: string | null) => void;
  /** Called with a stable, locale-independent id for analytics. */
  onNavigate: (navId: string) => void;
}) {
  const t = useTranslations("nav");
  return (
    <nav
      id={id}
      aria-label={t("mobileLabel")}
      className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto overscroll-contain border-t border-white/[0.08] bg-[#07141f] px-4 pb-10 pt-3 md:top-20 lg:hidden"
    >
      <ul className="flex flex-col">
        {NAV_MENUS.map((menu) => {
          const isOpen = expanded === menu.id;
          const sectionId = `${id}-${menu.id}`;
          return (
            <li key={menu.id} className="border-b border-white/[0.07]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={sectionId}
                className="flex w-full items-center justify-between px-2 py-4 text-start text-[17px] font-semibold text-white"
                onClick={() => onExpand(isOpen ? null : menu.id)}
              >
                {t(`menus.${menu.id}.label`)}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 text-white/60 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen ? (
                <div id={sectionId} className="pb-4">
                  {menu.columns.map((col) => (
                    <div key={col.id} className="mt-2">
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                        {t(`columns.${col.id}`)}
                      </p>
                      <ul className="mt-1">
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-current={pathname === item.href ? "page" : undefined}
                              className="block rounded-xl px-2 py-2.5 text-[15px] text-white/85 active:bg-white/10"
                              onClick={() => onNavigate(item.href)}
                            >
                              {t(`items.${item.id}.label`, { appName: APP_NAME })}
                              <span className="block text-[13px] text-white/50">
                                {t(`items.${item.id}.hint`)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link
                    href={menu.href}
                    className="mt-2 inline-flex items-center gap-1 px-2 py-2 text-sm font-semibold text-brand"
                    onClick={() => onNavigate(`all_${menu.id}`)}
                  >
                    {t(`menus.${menu.id}.viewAll`)}
                    <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
                  </Link>
                </div>
              ) : null}
            </li>
          );
        })}
        {NAV_LINKS.map((link) => (
          <li key={link.href} className="border-b border-white/[0.07]">
            <Link
              href={link.href}
              className="block px-2 py-4 text-[17px] font-semibold text-white"
              onClick={() => onNavigate(link.href)}
            >
              {t(`links.${link.id}`)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-display text-lg font-semibold text-white">
          {t("mobileCta.title", { appName: APP_NAME })}
        </p>
        <p className="mt-1 text-sm text-white/60">{t("mobileCta.body")}</p>
        <StoreBadges className="mt-4" layout="column" placement="header" />
      </div>
      <LocaleSwitcher variant="list" className="mt-8" onNavigate={() => onNavigate("locale")} />
    </nav>
  );
}
