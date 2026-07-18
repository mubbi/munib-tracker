"use client";

import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { Globe, Mail, MoonStar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MosqueSkyline } from "@/components/day-arc/mosque-skyline";
import { trackOutboundClick, trackWebDemoLaunch } from "@/lib/analytics";
import { openCookiePreferences } from "@/lib/cookie-preferences-events";
import { isGoogleAnalyticsConfigured } from "@/lib/gtag";
import { FOOTER_GROUPS, PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

const COPYRIGHT_YEAR = 2026;

/** Day Arc footer — the night at the end of the journey: starlit sky, girih
 *  lattice, and the mosque resting over still water beneath the links. */
export function Footer() {
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
          <title>Crescent moon</title>
          <path d="M68 54a30 30 0 11-26-32 24 24 0 1026 32z" fill="#f2cd7e" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link
              href={SITE_PATHS.home}
              className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <Image
                src="/munib-logo.png"
                alt=""
                width={220}
                height={220}
                className="size-[110px] shrink-0 rounded-2xl"
              />
              <span className="font-display text-xl font-semibold">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {APP_TAGLINE} A free, offline-first companion for salah, dhikr, qadha, and learning
              your deen.
            </p>
            <div className="mt-6">
              <a
                href={PRODUCT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#f6dfa4,#e0b563)] px-5 text-sm font-semibold text-[#3a2c10] shadow-[0_10px_26px_-10px_rgba(224,181,99,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-200 hover:brightness-[1.04] active:scale-[0.98]"
                onClick={() => trackWebDemoLaunch("footer")}
              >
                <MoonStar className="size-4" />
                Open the web app
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={APP_AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${APP_AUTHOR}'s website`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => trackOutboundClick(APP_AUTHOR_URL, APP_AUTHOR, "footer")}
              >
                <Globe className="size-[18px]" />
              </a>
              <Link
                href={SITE_PATHS.contact}
                aria-label="Contact us"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
              >
                <Mail className="size-[18px]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ecca7d]">
                  {group.heading}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={`${group.heading}-${link.label}`}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/65 transition-colors hover:text-white"
                          onClick={() => trackOutboundClick(link.href, link.label, "footer")}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  {group.heading === "Legal" && showCookiePreferences ? (
                    <li>
                      <button
                        type="button"
                        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-sm whitespace-nowrap text-white/65 transition-colors hover:text-white"
                        onClick={() => openCookiePreferences()}
                      >
                        Cookie preferences
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-14 flex flex-col items-center gap-3 pt-8 pb-40 text-sm text-white/60 [text-shadow:0_1px_12px_rgba(4,16,26,0.85)] sm:flex-row sm:justify-between sm:pb-44">
          <p>
            © {COPYRIGHT_YEAR} {APP_NAME}. Your worship data stays yours.
          </p>
          <p>Free for personal and educational use.</p>
        </div>
      </div>
    </footer>
  );
}
