"use client";

import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { motion, type Variants } from "framer-motion";
import { Award, Download, Lock, Sparkle, Sparkles, WifiOff } from "lucide-react";
import { DeviceFrame } from "@/components/day-arc/device-frame";
import { MosqueSkyline } from "@/components/day-arc/mosque-skyline";
import { PrayerArc } from "@/components/day-arc/prayer-arc";
import { TrackedLink } from "@/components/tracked-link";
import { SITE_PATHS } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  // Opacity + translate only — filter blur forces expensive paint on load
  // and can leave the GPU layer thrashing under the sticky header.
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const TRUST = [
  { icon: WifiOff, top: "Works offline", bottom: "Salah to Qur'an", color: "#8fd9ae" },
  { icon: Lock, top: "Privacy First", bottom: "Always", color: "#e9c675" },
  { icon: Award, top: "Made for", bottom: "Every Believer", color: "#9ad4a9" },
];

/** Day Arc hero — fully coded: gradient sky, stars, crescent, mosque skyline,
 *  the color-coded prayer arc, and a steel phone frame with the real screenshot. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate -mt-24 flex min-h-screen items-center overflow-hidden pb-40 pt-32 sm:pb-48"
    >
      {/* Girih strapwork lattice, strongest at the left edge like the concept */}
      <div
        aria-hidden
        className="islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(90%_80%_at_0%_35%,#000_0%,rgba(0,0,0,0.4)_45%,transparent_75%)]"
      />
      {/* Twinkling starlight — two offset layers like a starlit headliner */}
      <div
        aria-hidden
        className="hero-stars pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.4)_55%,transparent_92%)]"
      />
      <div
        aria-hidden
        className="hero-stars-2 pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.25)_95%)]"
      />
      {/* Warm golden sparkles clustered around the arc + horizon */}
      <div aria-hidden className="hero-sparkles pointer-events-none absolute inset-0" />
      {/* Warm sun bloom behind the phone */}
      <div aria-hidden className="hero-bloom pointer-events-none absolute inset-0" />

      {/* Day arc + color-coded prayer bullets down the right edge */}
      <PrayerArc />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pr-24 xl:pr-40">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[rgba(20,26,36,0.55)] px-5 py-2.5 text-sm font-medium text-[#8fe0b8] shadow-[0_8px_24px_-8px_rgba(8,12,24,0.6)] [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
              <Sparkles className="size-4 text-gold drop-shadow-[0_0_6px_rgba(240,200,120,0.8)]" />
              Your prayers. Your path. His pleasure.
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            id="hero-heading"
            className="hero-text-shadow mt-7 font-sans text-[3rem] font-semibold leading-[1.04] tracking-[-0.015em] text-[#f4f1ea] sm:text-6xl lg:text-[4.35rem]"
          >
            <span className="block whitespace-nowrap">Track Your</span>
            <span className="block whitespace-nowrap">Journey</span>
            <span className="block whitespace-nowrap bg-gradient-to-r from-[#f8e7b2] via-[#eecd81] to-[#dcae5e] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_2px_14px_rgba(30,20,4,0.45)]">
              Back to Allah.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="hero-text-shadow-soft mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/85 lg:mx-0"
          >
            <span className="lg:block lg:whitespace-nowrap">
              Build consistency, strengthen your faith,
            </span>{" "}
            <span className="lg:block lg:whitespace-nowrap">
              and become the best version of yourself&mdash;one prayer at a time.
            </span>
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
          >
            <TrackedLink
              href={SITE_PATHS.download}
              className="group inline-flex h-[3.75rem] items-center justify-center gap-3 rounded-full bg-[linear-gradient(160deg,#43d69d_0%,#1db884_45%,#0f9268_100%)] px-10 text-[17px] font-semibold text-white shadow-[0_22px_44px_-14px_rgba(4,34,24,0.7),0_6px_16px_-6px_rgba(4,34,24,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-200 [text-shadow:0_1px_4px_rgba(0,60,40,0.45)] hover:brightness-[1.06] active:scale-[0.98]"
              track="cta"
              cta="get_app"
              placement="hero"
            >
              <Download
                className="size-[22px] drop-shadow-[0_1px_3px_rgba(0,60,40,0.5)]"
                strokeWidth={2.2}
              />
              Get the app
            </TrackedLink>
            <TrackedLink
              href={SITE_PATHS.features}
              className="group inline-flex h-[3.75rem] items-center justify-center gap-3 rounded-full border border-white/35 bg-[rgba(58,46,44,0.55)] px-10 text-[17px] font-semibold text-white shadow-[0_18px_38px_-14px_rgba(12,10,20,0.6),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.45)] hover:bg-[rgba(70,58,56,0.65)] active:scale-[0.98]"
              track="cta"
              cta="explore_features"
              placement="hero"
            >
              <Sparkle className="size-5 fill-white text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
              Explore features
            </TrackedLink>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-start"
          >
            {TRUST.map(({ icon: Icon, top, bottom, color }, i) => (
              <li key={bottom} className="inline-flex items-center gap-2.5">
                {i > 0 ? (
                  <span aria-hidden className="mr-3 hidden h-8 w-px bg-white/20 sm:block" />
                ) : null}
                <Icon
                  className="size-7 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
                  style={{ color }}
                  strokeWidth={1.6}
                />
                <span className="hero-text-shadow-soft text-left text-[13px] leading-snug text-white/80">
                  <span className="block">{top}</span>
                  <span className="block font-semibold text-white/95">{bottom}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Real screenshot in a straight steel frame */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative flex justify-center lg:justify-end lg:pr-4"
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,185,104,0.35)_0%,transparent_68%)]"
          />
          <div className="animate-float-slow">
            <DeviceFrame
              src="/app-home-dark.png"
              alt="Munib Tracker home screen: today's prayer times, the Hijri date, and a daily activity checklist."
              className="w-[250px] sm:w-[272px] lg:w-[292px]"
            />
          </div>
        </motion.div>
      </div>

      {/* ── Horizon: mountain ridges, mosque, lit windows, still water ─────── */}
      <div
        aria-hidden
        className="hero-horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[200px] sm:h-[240px]"
      >
        <MosqueSkyline />
      </div>

      {/* Golden crescent moon glowing over the water */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute bottom-[5%] left-[69%] z-[1] size-11 rotate-[24deg] drop-shadow-[0_0_22px_rgba(246,214,130,0.9)] sm:size-12"
      >
        <title>Crescent moon</title>
        <path d="M68 54a30 30 0 11-26-32 24 24 0 1026 32z" fill="#f2cd7e" />
      </svg>

      <p className="sr-only">{APP_TAGLINE}</p>
    </section>
  );
}
