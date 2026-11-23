import type { ScreenshotKey } from "@/content/types";

export type Screenshot = {
  src: string;
  width: number;
  height: number;
  /** Literal description of what is on screen (alt text). */
  alt: string;
  /** Frame to draw around it. */
  frame: "phone" | "watch" | "round" | "tv";
};

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
    alt: "Munib Tracker home screen with today's Salah times, the Hijri date, a countdown to Fajr, and Today's Goal checklist.",
  },
  "home-light": {
    ...PHONE,
    src: "/screenshots/home-light.webp",
    alt: "Munib Tracker home screen in the light theme with Salah times and Today's Goal.",
  },
  tracker: {
    ...PHONE,
    src: "/screenshots/tracker.webp",
    alt: "Tracker screen showing 2 of 5 obligatory Salah logged, a 2-day streak, and progress rings for optional Salah, Witr, Adhkar, Qaza and Khatm.",
  },
  "tracker-light": {
    ...PHONE,
    src: "/screenshots/tracker-light.webp",
    alt: "Tracker screen in the light theme with today's Salah progress ring and streak.",
  },
  qaza: {
    ...PHONE,
    src: "/screenshots/qaza.webp",
    alt: "Qaza screen showing 25 remaining and 62 made up, a progress bar, an estimated finish date, and shortcuts to the calculator, planner, fasting and history.",
  },
  zikr: {
    ...PHONE,
    src: "/screenshots/zikr.webp",
    alt: "Zikr screen with favorites, adhkar search, My adhkar, and categories such as Morning Adhkar and Evening Adhkar with progress counts.",
  },
  "zikr-light": {
    ...PHONE,
    src: "/screenshots/zikr-light.webp",
    alt: "Zikr screen in the light theme with adhkar categories and favorites.",
  },
  tasbeeh: {
    ...PHONE,
    src: "/screenshots/tasbeeh.webp",
    alt: "Tasbeeh counter with 33, 99, 100, unlimited and custom targets, a large tap circle, and undo and reset buttons.",
  },
  quran: {
    ...PHONE,
    src: "/screenshots/quran.webp",
    alt: "Qur'an screen with a continue-reading card for Al-Baqarah, shortcuts to search, pages, juz, learn and khatm, and the surah list.",
  },
  "quran-light": {
    ...PHONE,
    src: "/screenshots/quran-light.webp",
    alt: "Qur'an surah list in the light theme with a continue-reading card.",
  },
  qibla: {
    ...PHONE,
    src: "/screenshots/qibla.webp",
    alt: "Qibla screen with a compass dial, the Kaaba marker, the Qibla bearing in degrees and the distance to Makkah.",
  },
  names: {
    ...PHONE,
    src: "/screenshots/names.webp",
    alt: "The 99 Names of Allah screen with Arabic names, transliterations and meanings.",
  },
  "offline-data": {
    width: 960,
    height: 2133,
    frame: "phone",
    src: "/screenshots/offline-data.webp",
    alt: "Offline data settings listing cached Qur'an translations, mushaf fonts, hadith collections, audio recitations and location lookups, each with a delete button.",
  },
  "watch-schedule": {
    width: 422,
    height: 514,
    frame: "watch",
    src: "/screenshots/watch-schedule.webp",
    alt: "Apple Watch app showing a Tasbeeh shortcut and the next Salah, Asr, with its time.",
  },
  "wear-salah-tile": {
    width: 454,
    height: 454,
    frame: "round",
    src: "/screenshots/wear-salah-tile.webp",
    alt: "Wear OS tile showing the next Salah.",
  },
  "wear-tasbeeh-tile": {
    width: 454,
    height: 454,
    frame: "round",
    src: "/screenshots/wear-tasbeeh-tile.webp",
    alt: "Wear OS Tasbeeh tile.",
  },
  "tv-home": {
    width: 1600,
    height: 900,
    frame: "tv",
    src: "/screenshots/tv-home.webp",
    alt: "Munib Tracker on Apple TV: side navigation, excused-day options for hayd, illness and travel, achievements, and a continue-reading card.",
  },
};

export function getScreenshot(key: ScreenshotKey): Screenshot {
  return SCREENSHOTS[key];
}
