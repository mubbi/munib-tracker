import type { FeaturePage } from "@/content/types";
import { dailyIslamicHabitsUr } from "./features/daily-islamic-habits";
import { fastingTrackerUr } from "./features/fasting-tracker";
import { hifzTrackerUr } from "./features/hifz-tracker";
import { learnQuranUr } from "./features/learn-quran";
import { qazaSalahTrackerUr } from "./features/qaza-salah-tracker";
import { quranUr } from "./features/quran";
import { quranPracticeUr } from "./features/quran-practice";
import { ramadanTrackerUr } from "./features/ramadan-tracker";
import { salahFocusLockUr } from "./features/salah-focus-lock";
import { salahTrackerUr } from "./features/salah-tracker";
import { tasbeehCounterUr } from "./features/tasbeeh-counter";
import { worshipProgressUr } from "./features/worship-progress";
import { zikrTrackerUr } from "./features/zikr-tracker";

/**
 * Urdu translations (features-1). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly FeaturePage[] = [
  salahTrackerUr,
  qazaSalahTrackerUr,
  salahFocusLockUr,
  fastingTrackerUr,
  zikrTrackerUr,
  dailyIslamicHabitsUr,
  worshipProgressUr,
  quranUr,
  quranPracticeUr,
  learnQuranUr,
  tasbeehCounterUr,
  ramadanTrackerUr,
  hifzTrackerUr,
];
