import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME } from "@munib-tracker/shared/constants";
import { Globe, Mail, MoonStar } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { MosqueSkyline } from "@/components/day-arc/mosque-skyline";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { TrackedLink } from "@/components/tracked-link";
import { Link } from "@/i18n/navigation";
import { isGoogleAnalyticsConfigured } from "@/lib/gtag";
import { FOOTER_GROUPS, productAppUrl, SITE_PATHS } from "@/lib/site";

const COPYRIGHT_YEAR = 2026;

/** Day Arc footer — the night at the end of the journey: starlit sky, girih
 *  lattice, and the mosque resting over still water beneath the links.
 *  Server-rendered; click tracking lives in the `TrackedLink` islands. */
export function Footer() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("metadata");
  const locale = useLocale();
  const showCookiePreferences = isGoogleAnalyticsConfigured();
  return (
    <footer className="relative mt-auto overflow-x-hidden border-t border-white/10 bg-[linear-gradient(180deg,#0a1830_0%,#0b2226_55%,#04101a_100%)] text-white">
      {/* Night texture: pattern + twinkling stars */}
      <div
        aria-hidden
        className="islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(80%_70%_at_15%_0%,#000_0%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="hero-stars pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="hero-stars-2 pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_85%)]"
      />

      {/* Mosque + water — absolute at the bottom so domes rise behind the links */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[280px] sm:h-[320px]"
      >
        <MosqueSkyline fit="meet" className="absolute inset-x-0 bottom-0 h-full w-full" />
        <svg
          viewBox="0 0 100 100"
          className="absolute bottom-[58%] right-[12%] size-7 rotate-[24deg] drop-shadow-[0_0_16px_rgba(246,214,130,0.85)] sm:size-8"
        >
          <title>{t("crescentMoon")}</title>
          <path d="M68 54a30 30 0 11-26-32 24 24 0 1026 32z" fill="#f2cd7e" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_3fr]">
          <div>
            <Link
              href={SITE_PATHS.home}
              className="inline-flex items-center gap-4 font-semibold tracking-tight"
            >
              <Image
                src="/icon-512.png"
                alt=""
                width={220}
                height={220}
                className="size-20 shrink-0 rounded-[22%] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)]"
              />
              <span className="font-display text-xl font-semibold">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {t("description", { tagline: tMeta("tagline") })}
            </p>
            <div className="mt-6">
              <TrackedLink
                href={productAppUrl(locale)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#f6dfa4,#e0b563)] px-5 text-sm font-semibold text-[#3a2c10] shadow-[0_10px_26px_-10px_rgba(224,181,99,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-200 hover:brightness-[1.04] active:scale-[0.98]"
                track="web_demo"
                placement="footer"
              >
                <MoonStar className="size-4" />
                {t("openWebApp")}
              </TrackedLink>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <TrackedLink
                href={APP_AUTHOR_URL}
                aria-label={t("authorWebsite", { author: APP_AUTHOR })}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
                track="outbound"
                linkText={APP_AUTHOR}
                placement="footer"
              >
                <Globe className="size-[18px]" />
              </TrackedLink>
              <Link
                href={SITE_PATHS.contact}
                aria-label={t("contactUs")}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
              >
                <Mail className="size-[18px]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-5">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ecca7d]">
                  {t(`groups.${group.id}`)}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <TrackedLink
                          href={link.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                          track="outbound"
                          linkText={link.brand}
                          placement="footer"
                        >
                          {link.brand}
                        </TrackedLink>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {t(`links.${link.id}`, { appName: APP_NAME })}
                        </Link>
                      )}
                    </li>
                  ))}
                  {group.id === "company" && showCookiePreferences ? (
                    <li>
                      <CookiePreferencesButton className="block w-full cursor-pointer border-0 bg-transparent p-0 text-start text-sm whitespace-nowrap text-white/65 transition-colors hover:text-white" />
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-14 flex flex-col items-center gap-3 pt-8 pb-40 text-sm text-white/60 [text-shadow:0_1px_12px_rgba(4,16,26,0.85)] sm:flex-row sm:justify-between sm:pb-44">
          <p>{t("copyright", { year: String(COPYRIGHT_YEAR), appName: APP_NAME })}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <p>{t("license")}</p>
            <LocaleSwitcher direction="up" />
          </div>
        </div>
      </div>
    </footer>
  );
}
