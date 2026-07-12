"use client";

import { ArrowRight } from "lucide-react";
import { StoreBadges } from "@/components/store-badges";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/interactive";
import { Reveal } from "@/components/ui/motion";
import { trackCtaClick } from "@/lib/analytics";
import { SITE_PATHS } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="noise relative overflow-hidden bg-gradient-to-br from-hero-from via-hero-via to-hero-to py-20 text-hero-text md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-hero-glow/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-hero-gold/10 blur-[120px]"
      />
      <div className="hero-stars islamic-tiles absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-hero-gold">
            Begin today
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Start your journey back to Allah
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-hero-muted">
            Small, steady steps matter more than perfection. Track today, learn something new, and
            continue as a guest — or sign in to sync across devices.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Button
                href={SITE_PATHS.download}
                variant="gold"
                size="lg"
                onClick={() => trackCtaClick("get_app", "cta")}
              >
                Get the app
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Magnetic>
            <Button
              href={SITE_PATHS.features}
              variant="glass"
              size="lg"
              onClick={() => trackCtaClick("explore_features", "cta")}
            >
              Explore features
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <StoreBadges className="justify-center" placement="cta" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
