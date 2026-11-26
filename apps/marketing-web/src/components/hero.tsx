import { ArrowRight, Ban, Download, Lock, Sparkle, Sparkles, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeviceScreen } from "@/components/content/device-screen";
import { MosqueSkyline } from "@/components/day-arc/mosque-skyline";
import { PrayerArc } from "@/components/day-arc/prayer-arc";
import { HeroDevice, HeroItem, HeroStagger } from "@/components/hero-motion";
import { StoreBadges } from "@/components/store-badges";
import { TrackedLink } from "@/components/tracked-link";
import { useCapture, useScreenshot } from "@/lib/screenshots";
import { SITE_PATHS } from "@/lib/site";

const TRUST = [
  { id: "noAds", icon: Ban, color: "#8fd9ae" },
  { id: "noAccount", icon: Lock, color: "#e9c675" },
  { id: "offline", icon: WifiOff, color: "#9ad4a9" },
] as const;

/** Day Arc hero — fully coded: gradient sky, stars, crescent, mosque skyline,
 *  the color-coded prayer arc, and the app's real home screen on every device.
 *  Server-rendered; only the entrance animation (`hero-motion.tsx`) is client code. */
export function Hero() {
  const t = useTranslations("home.hero");
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate -mt-24 flex min-h-screen items-center overflow-hidden pb-40 pt-32 sm:pb-48"
    >
      {/* Girih strapwork lattice, strongest at the copy's edge like the concept
          (left in LTR; mirrored with the rest of the composition in RTL) */}
      <div
        aria-hidden
        className="islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(90%_80%_at_0%_35%,#000_0%,rgba(0,0,0,0.4)_45%,transparent_75%)] rtl:-scale-x-100"
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
      {/* Warm golden sparkles clustered around the arc + horizon. The arc, the
          sparkles and the bloom sit on the phone's side, so RTL mirrors them. */}
      <div
        aria-hidden
        className="hero-sparkles pointer-events-none absolute inset-0 rtl:-scale-x-100"
      />
      {/* Warm sun bloom behind the phone */}
      <div
        aria-hidden
        className="hero-bloom pointer-events-none absolute inset-0 rtl:-scale-x-100"
      />

      {/* Day arc + color-coded prayer bullets down the inline-end edge */}
      <PrayerArc />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pe-24 xl:pe-40">
        <HeroStagger className="text-center lg:text-start">
          <HeroItem className="flex justify-center lg:justify-start">
            <TrackedLink
              href="/features/quran-practice"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[rgba(20,26,36,0.55)] py-1.5 ps-1.5 pe-4 text-sm font-medium text-[#8fe0b8] shadow-[0_8px_24px_-8px_rgba(8,12,24,0.6)] transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.4)] hover:border-white/35"
              track="select_content"
              contentType="announcement"
              itemId="quran_practice_ai"
              placement="hero"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#f8e7b2] to-[#dcae5e] px-2.5 py-1 text-xs font-bold text-[#1a1408] [text-shadow:none]">
                <Sparkles className="size-3.5" aria-hidden />
                {t("announcementBadge")}
              </span>
              {t("announcement")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden
              />
            </TrackedLink>
          </HeroItem>

          {/* Not animated: the H1 is the LCP element and must paint immediately. */}
          <h1
            id="hero-heading"
            className="hero-text-shadow mt-7 font-sans text-[3rem] font-semibold max-[359px]:text-[2.5rem] leading-[1.04] tracking-[-0.015em] text-[#f4f1ea] sm:text-6xl lg:text-[3.75rem] xl:text-[4.35rem]"
          >
            {/* The spaces between the tags in the catalog keep the accessible name
                ("Track Your Journey Back to Allah.") intact; they collapse
                visually between the block spans. The English lines are sized to
                never wrap; the longer Arabic/Urdu lines may wrap (balanced). */}
            {t.rich("headline", {
              line: (chunks) => (
                <span className="block whitespace-nowrap rtl:text-balance rtl:whitespace-normal">
                  {chunks}
                </span>
              ),
              accent: (chunks) => (
                <span className="block whitespace-nowrap rtl:text-balance rtl:whitespace-normal bg-gradient-to-r from-[#f8e7b2] via-[#eecd81] to-[#dcae5e] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_2px_14px_rgba(30,20,4,0.45)]">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <HeroItem
            as="p"
            className="hero-text-shadow-soft mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/85 lg:mx-0"
          >
            {t("lead")}
          </HeroItem>

          <HeroItem className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start">
            <TrackedLink
              href={SITE_PATHS.download}
              className="group hidden h-[3.75rem] items-center justify-center gap-3 rounded-full bg-[linear-gradient(160deg,#43d69d_0%,#1db884_45%,#0f9268_100%)] whitespace-nowrap px-8 text-[17px] font-semibold lg:px-7 xl:px-10 text-white shadow-[0_22px_44px_-14px_rgba(4,34,24,0.7),0_6px_16px_-6px_rgba(4,34,24,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-200 [text-shadow:0_1px_4px_rgba(0,60,40,0.45)] hover:brightness-[1.06] active:scale-[0.98] sm:inline-flex"
              track="cta"
              cta="get_app"
              placement="hero"
            >
              <Download
                className="size-[22px] drop-shadow-[0_1px_3px_rgba(0,60,40,0.5)]"
                strokeWidth={2.2}
              />
              {t("getApp")}
            </TrackedLink>
            <TrackedLink
              href={SITE_PATHS.features}
              className="group inline-flex h-[3.75rem] items-center justify-center gap-3 rounded-full border border-white/35 bg-[rgba(58,46,44,0.55)] whitespace-nowrap px-8 text-[17px] font-semibold lg:px-7 xl:px-10 text-white shadow-[0_18px_38px_-14px_rgba(12,10,20,0.6),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.45)] hover:bg-[rgba(70,58,56,0.65)] active:scale-[0.98]"
              track="cta"
              cta="explore_features"
              placement="hero"
            >
              <Sparkle className="size-5 fill-white text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
              {t("exploreFeatures")}
            </TrackedLink>
          </HeroItem>

          <HeroItem className="mt-6 flex justify-center lg:justify-start">
            <StoreBadges placement="hero" className="justify-center lg:justify-start" />
          </HeroItem>

          <HeroItem
            as="ul"
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-start"
          >
            {TRUST.map(({ id, icon: Icon, color }, i) => (
              <li key={id} className="inline-flex items-center gap-2.5">
                {i > 0 ? (
                  <span aria-hidden className="me-3 hidden h-8 w-px bg-white/20 sm:block" />
                ) : null}
                <Icon
                  className="size-7 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
                  style={{ color }}
                  strokeWidth={1.6}
                />
                <span className="hero-text-shadow-soft text-start text-[13px] leading-snug text-white/80">
                  <span className="block">{t(`trust.${id}.top`)}</span>
                  <span className="block font-semibold text-white/95">
                    {t(`trust.${id}.bottom`)}
                  </span>
                </span>
              </li>
            ))}
          </HeroItem>
        </HeroStagger>

        {/* Real captures of the home screen, in the visitor's language */}
        <HeroDevice className="relative flex justify-center lg:justify-end">
          <HeroDevices />
        </HeroDevice>
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
        <title>{t("moonTitle")}</title>
        <path d="M68 54a30 30 0 11-26-32 24 24 0 1026 32z" fill="#f2cd7e" />
      </svg>
    </section>
  );
}

/**
 * The home screen on four devices, in depth: a TV at the back, the iPhone in
 * front (the hero image, preloaded), an Android phone tucked behind it on the
 * inline-end side and an Apple Watch in front on the inline-start side. Every
 * size is a percentage of a fixed-aspect stage, so the cluster scales as one;
 * logical `start`/`end` offsets mirror it in RTL.
 *
 * - phones: iPhone + Android peeking + watch (the TV is hidden);
 * - `sm`+: the full cluster, with the TV rising above the iPhone.
 */
function HeroDevices() {
  const iphone = useScreenshot("home");
  const android = useCapture("android", "home");
  const tv = useCapture("tv", "home");
  const watch = useCapture("watch", "schedule");
  return (
    <div className="relative aspect-[5/7] w-full max-w-[340px] sm:aspect-[20/27] sm:max-w-[440px] lg:max-w-[480px]">
      {/* Warm bloom + soft ground shadow tying the devices together */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] -z-10 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,185,104,0.34)_0%,rgba(240,185,104,0.1)_42%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[8%] bottom-[-1%] -z-10 h-[7%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(6,10,20,0.6),transparent)] blur-md"
      />

      {/* Back: TV, set back with a touch less light */}
      <div className="absolute start-0 top-0 hidden w-[88%] brightness-[0.88] sm:block">
        <DeviceScreen shot={tv} className="w-full" sizes="(min-width: 1024px) 420px, 390px" />
      </div>

      {/* Middle: Android phone behind the iPhone on the inline-end side */}
      <div className="absolute bottom-[3%] end-0 z-10 w-[44%] sm:bottom-[4%] sm:w-[40%]">
        <div className="animate-float-slow [animation-delay:-3s]">
          <DeviceScreen shot={android} className="w-full" sizes="(min-width: 640px) 190px, 44vw" />
        </div>
      </div>

      {/* Front: the iPhone — the hero image */}
      <div className="absolute inset-x-0 top-0 z-20 mx-auto w-[62%] sm:top-[9%] sm:w-[58%]">
        <div className="animate-float-slow">
          <DeviceScreen
            shot={iphone}
            className="w-full"
            sizes="(min-width: 640px) 280px, 62vw"
            preload
          />
        </div>
      </div>

      {/* Closest: Apple Watch overlapping the iPhone's inline-start edge */}
      <div className="absolute bottom-0 start-[3%] z-30 w-[24%] sm:bottom-[1%] sm:start-[8%] sm:w-[20%]">
        <div className="animate-float-slow [animation-delay:-6s]">
          <DeviceScreen shot={watch} className="w-full" sizes="(min-width: 640px) 96px, 24vw" />
        </div>
      </div>
    </div>
  );
}
