import { APP_NAME } from "@munib-tracker/shared/constants";
import { useTranslations } from "next-intl";
import type { ScreenshotKey } from "@/content/types";

/**
 * Image facts for a capture. The alt text (a literal description of what is
 * on screen) is translated: `screenshots.alt.<key>` in the message catalog —
 * read it with `useScreenshot(key)` or `screenshotAlt(t, key)`.
 */
export type Screenshot = {
  src: string;
  width: number;
  height: number;
  /** Frame to draw around it. */
  frame: "phone" | "watch" | "round" | "tv";
};

/** A screenshot plus its translated alt text. */
export type LocalizedScreenshot = Screenshot & { alt: string };

const PHONE = { width: 960, height: 2087, frame: "phone" as const };

/**
 * Real captures of the shipping app (iOS, English) from
 * `apps/app/store-assets/captures-native/**`, converted to WebP.
 * Never add mock-ups here — only screens the app actually renders.
 */
export const SCREENSHOTS: Record<ScreenshotKey, Screenshot> = {
  home: {
    ...PHONE,
    src: "/screenshots/home.webp",
  },
  "home-light": {
    ...PHONE,
    src: "/screenshots/home-light.webp",
  },
  tracker: {
    ...PHONE,
    src: "/screenshots/tracker.webp",
  },
  "tracker-light": {
    ...PHONE,
    src: "/screenshots/tracker-light.webp",
  },
  qaza: {
    ...PHONE,
    src: "/screenshots/qaza.webp",
  },
  zikr: {
    ...PHONE,
    src: "/screenshots/zikr.webp",
  },
  "zikr-light": {
    ...PHONE,
    src: "/screenshots/zikr-light.webp",
  },
  tasbeeh: {
    ...PHONE,
    src: "/screenshots/tasbeeh.webp",
  },
  quran: {
    ...PHONE,
    src: "/screenshots/quran.webp",
  },
  "quran-light": {
    ...PHONE,
    src: "/screenshots/quran-light.webp",
  },
  qibla: {
    ...PHONE,
    src: "/screenshots/qibla.webp",
  },
  names: {
    ...PHONE,
    src: "/screenshots/names.webp",
  },
  "offline-data": {
    width: 960,
    height: 2133,
    frame: "phone",
    src: "/screenshots/offline-data.webp",
  },
  "watch-schedule": {
    width: 422,
    height: 514,
    frame: "watch",
    src: "/screenshots/watch-schedule.webp",
  },
  "wear-salah-tile": {
    width: 454,
    height: 454,
    frame: "round",
    src: "/screenshots/wear-salah-tile.webp",
  },
  "wear-tasbeeh-tile": {
    width: 454,
    height: 454,
    frame: "round",
    src: "/screenshots/wear-tasbeeh-tile.webp",
  },
  "tv-home": {
    width: 1600,
    height: 900,
    frame: "tv",
    src: "/screenshots/tv-home.webp",
  },
};

/** Image facts (src, size, frame) — locale-independent. Use `useScreenshot` for alt text. */
export function getScreenshot(key: ScreenshotKey): Screenshot {
  return SCREENSHOTS[key];
}

type ScreenshotsT = ReturnType<typeof useTranslations<"screenshots">>;

/**
 * Translated alt text for `key`, given a `screenshots` translator — for async
 * code: `screenshotAlt(await getTranslations("screenshots"), key)`.
 */
export function screenshotAlt(t: ScreenshotsT, key: ScreenshotKey): string {
  return t(`alt.${key}`, { appName: APP_NAME });
}

/** `getScreenshot(key)` plus its translated alt text (non-async server components). */
export function useScreenshot(key: ScreenshotKey): LocalizedScreenshot {
  const t = useTranslations("screenshots");
  return { ...SCREENSHOTS[key], alt: screenshotAlt(t, key) };
}
