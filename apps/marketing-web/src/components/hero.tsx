import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { CtaButton } from "@/components/cta-button";
import { DeviceMockup } from "@/components/device-mockup";
import { StoreBadges } from "@/components/store-badges";
import { PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-grain hero-stars geometric-pattern relative overflow-hidden bg-gradient-to-b from-hero-from via-hero-to to-hero-to text-hero-text"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-hero-glow/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-hero-gold">
            {APP_TAGLINE}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 font-serif text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
          >
            {APP_NAME}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-hero-muted md:text-xl">
            Your daily worship companion — salah, dhikr, qadha, Qur&apos;an, hadith, and gentle
            reminders. Free, offline-first, and private by default.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
            <StoreBadges />
            <div className="flex flex-wrap gap-3">
              <CtaButton href={SITE_PATHS.features} variant="hero-outline">
                Explore features
              </CtaButton>
              <CtaButton href={PRODUCT_APP_URL} variant="hero-ghost" className="text-sm">
                Try web app →
              </CtaButton>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DeviceMockup />
        </div>
      </div>
    </section>
  );
}
