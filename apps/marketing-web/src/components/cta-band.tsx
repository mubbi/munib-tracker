"use client";

import { ArrowRight } from "lucide-react";
import { StoreBadges } from "@/components/store-badges";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/interactive";
import { Reveal } from "@/components/ui/motion";
import { trackCtaClick } from "@/lib/analytics";
import { SITE_PATHS } from "@/lib/site";

/** Closing call-to-action — the last chapter of the Day Arc journey. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Warm dawn glow returning on the horizon — the journey begins again */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_120%_at_50%_130%,rgba(224,150,70,0.22),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-[#34d399]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-[#ecca7d]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ecca7d] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
            Begin today
          </p>
          <h2 className="hero-text-shadow mt-4 text-balance font-sans text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Start your journey{" "}
            <span className="bg-gradient-to-r from-[#f8e7b2] via-[#eecd81] to-[#dcae5e] bg-clip-text text-transparent [text-shadow:none]">
              back to Allah
            </span>
          </h2>
          <p className="hero-text-shadow-soft mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
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
