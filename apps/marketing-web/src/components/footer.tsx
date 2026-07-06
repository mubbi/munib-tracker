import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FOOTER_GROUPS, PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="noise relative mt-auto overflow-hidden bg-gradient-to-b from-hero-from via-hero-via to-hero-to text-hero-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-hero-glow/20 blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-hero-muted">
              {APP_TAGLINE} A free, offline-first companion for salah, dhikr, qadha, and learning
              your deen.
            </p>
            <div className="mt-6">
              <Button href={PRODUCT_APP_URL} variant="gold" size="sm">
                Open the web app
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={APP_AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${APP_AUTHOR}'s website`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-text"
              >
                <Globe className="size-[18px]" />
              </a>
              <Link
                href={SITE_PATHS.contact}
                aria-label="Contact us"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-text"
              >
                <Mail className="size-[18px]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hero-gold">
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
                          className="text-sm text-hero-muted transition-colors hover:text-hero-text"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-hero-muted transition-colors hover:text-hero-text"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-sm text-hero-muted sm:flex-row sm:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {APP_NAME}. Your worship data stays yours.
          </p>
          <p>Free for personal and educational use.</p>
        </div>
      </div>
    </footer>
  );
}
