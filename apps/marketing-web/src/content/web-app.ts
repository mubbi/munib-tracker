import type { FeatureSlug } from "@/content/types";

/**
 * Where each feature lives in the product web app (`my.munibtracker.app`),
 * so feature pages can say "Try it free in your browser" and open that
 * screen directly. `null` = the feature needs the iPhone / Android app (the
 * page shows the store badges only).
 *
 * Paths are expo-router routes in `apps/app/src/app/` (checked 2026-11-27).
 * A `Record` over every slug: a new feature page must decide here.
 */
export const FEATURE_WEB_APP_PATHS: Readonly<Record<FeatureSlug, string | null>> = {
  "salah-tracker": "/tracker",
  "qaza-salah-tracker": "/qaza",
  "salah-focus-lock": null, // blocks apps: phones only
  "fasting-tracker": "/fasting",
  "ramadan-tracker": "/ramadan",
  "zikr-tracker": "/zikr",
  "tasbeeh-counter": "/tasbeeh/free",
  "daily-islamic-habits": "/habits",
  "worship-progress": "/statistics",
  quran: "/quran",
  "quran-practice": "/quran/practice",
  "hifz-tracker": "/quran/hifz",
  "learn-quran": "/learn-quran",
  hadith: "/hadith",
  "duas-hisnul-muslim": "/dua",
  "99-names-of-allah": "/names-of-allah",
  "prayer-times-qibla": "/",
  "qibla-finder": "/qibla",
  "masjid-finder": "/masjids",
  "hijri-calendar": "/calendar",
  "my-madhhab": "/settings/fiqh",
  "umrah-mode": "/umrah",
  "widgets-and-devices": "/",
  "family-and-friends": "/family",
  "kids-mode": "/family",
  "private-reflection": "/muhasabah",
  "islamic-will-and-inheritance": "/mirath",
  "zakat-calculator": "/zakat",
};

/** The web-app route for a feature, or `null` when it needs the phone app. */
export function featureWebAppPath(slug: FeatureSlug): string | null {
  return FEATURE_WEB_APP_PATHS[slug];
}
