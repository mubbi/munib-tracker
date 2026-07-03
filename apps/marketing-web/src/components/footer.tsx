import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import Link from "next/link";
import { FOOTER_LINKS, PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

const COPYRIGHT_YEAR = 2026;

const LEGAL_LINKS = [
  { href: SITE_PATHS.privacy, label: "Privacy" },
  { href: SITE_PATHS.terms, label: "Terms" },
  { href: SITE_PATHS.credits, label: "Credits" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-hero-from to-hero-to text-hero-text">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href={SITE_PATHS.home}
              className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-base text-hero-gold"
              >
                ﷽
              </span>
              <span className="text-lg">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-hero-muted">{APP_TAGLINE}</p>
            <a
              href={PRODUCT_APP_URL}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-hero-gold px-5 text-sm font-semibold text-hero-to transition-[filter,transform] hover:brightness-105 active:scale-[0.98]"
            >
              Open the app
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-hero-gold">
              Explore
            </p>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-hero-muted transition-colors hover:text-hero-text"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-hero-gold">
              Legal
            </p>
            <nav aria-label="Legal" className="mt-4 flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-hero-muted transition-colors hover:text-hero-text"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-hero-muted/20 pt-8 text-sm text-hero-muted sm:flex-row sm:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {APP_NAME}. All worship data stays yours.
          </p>
          <p>Free for personal and educational use.</p>
        </div>
      </div>
    </footer>
  );
}
