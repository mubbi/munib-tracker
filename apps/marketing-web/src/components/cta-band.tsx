import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { CtaButton } from "@/components/cta-button";
import { PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-hero-from to-hero-to py-20 text-hero-text md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-hero-glow/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hero-gold">
          Begin today
        </p>
        <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          {APP_TAGLINE}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-hero-muted">
          Small, steady steps matter more than perfection. Log what you complete, return tomorrow,
          and continue as a guest or sign in to sync across devices.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CtaButton href={SITE_PATHS.download} variant="hero-primary">
            Get the app
          </CtaButton>
          <CtaButton href={PRODUCT_APP_URL} variant="hero-outline">
            Open in browser
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
