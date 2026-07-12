"use client";

import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Flame, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import { DeviceMockup } from "@/components/device-mockup";
import { StoreBadges } from "@/components/store-badges";
import { Aurora, GridBackdrop } from "@/components/ui/backgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic, Tilt } from "@/components/ui/interactive";
import { ProgressRing } from "@/components/ui/progress-ring";
import { trackCtaClick } from "@/lib/analytics";
import { SITE_PATHS } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const TRUST = [
  { icon: WifiOff, label: "Offline-first" },
  { icon: ShieldCheck, label: "Private by default" },
  { icon: Check, label: "Free, no ads" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <Aurora />
      <GridBackdrop className="opacity-50" />
      <div
        aria-hidden
        className="islamic-tiles pointer-events-none absolute right-0 top-0 hidden h-80 w-80 opacity-40 [mask-image:radial-gradient(circle_at_top_right,#000,transparent_70%)] lg:block"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <Badge icon={<Sparkles className="size-3.5 text-brand" />}>
              {APP_NAME} — now with a full learning library
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            id="hero-heading"
            className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Track Your Journey <span className="text-gradient">Back to Allah.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted lg:mx-0"
          >
            Build unshakeable salah consistency, clear your qaza, and learn your deen — Qur&apos;an,
            hadith, and structured lessons in one calm, judgement-free companion.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <Magnetic>
              <Button
                href={SITE_PATHS.download}
                size="lg"
                onClick={() => trackCtaClick("get_app", "hero")}
              >
                Get the app
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Magnetic>
            <Button
              href={SITE_PATHS.features}
              variant="outline"
              size="lg"
              onClick={() => trackCtaClick("explore_features", "hero")}
            >
              Explore features
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-8">
            <StoreBadges className="justify-center lg:justify-start" placement="hero" />
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted lg:justify-start"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-brand" />
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative flex justify-center lg:justify-end"
        >
          <Tilt className="relative">
            <div className="animate-float-slow">
              <DeviceMockup />
            </div>

            {/* Floating glass stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
              className="animate-float absolute -left-4 top-16 hidden rounded-2xl border border-border/60 bg-card/85 p-3 shadow-[var(--shadow-card)] backdrop-blur-md sm:block"
              style={{ animationDelay: "-1.5s" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Flame className="size-4.5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold leading-none text-foreground">
                    7 days
                  </p>
                  <p className="mt-1 text-[11px] text-muted">Prayer streak</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
              className="animate-float absolute -right-5 top-40 hidden items-center gap-2.5 rounded-2xl border border-border/60 bg-card/85 p-3 shadow-[var(--shadow-card)] backdrop-blur-md sm:flex"
            >
              <ProgressRing progress={0.82} size={44} stroke={5} gradientId="hero-ring">
                <span className="text-[10px] font-bold text-foreground">82%</span>
              </ProgressRing>
              <div>
                <p className="font-display text-sm font-bold leading-none text-foreground">Today</p>
                <p className="mt-1 text-[11px] text-muted">6 of 8 acts</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: EASE }}
              className="animate-float absolute -bottom-3 left-2 hidden items-center gap-2.5 rounded-2xl border border-border/60 bg-card/85 p-3 shadow-[var(--shadow-card)] backdrop-blur-md sm:flex"
              style={{ animationDelay: "-3s" }}
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Check className="size-4.5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold leading-none text-foreground">
                  Qaza cleared
                </p>
                <p className="mt-1 text-[11px] text-muted">12 of 40 made up</p>
              </div>
            </motion.div>
          </Tilt>
        </motion.div>
      </div>

      <p className="sr-only">{APP_TAGLINE}</p>
    </section>
  );
}
