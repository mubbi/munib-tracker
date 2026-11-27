import type { FeaturePage } from "@/content/types";
import { dailyIslamicHabits } from "./features/daily-islamic-habits";
import { fastingTracker } from "./features/fasting-tracker";
import { hifzTracker } from "./features/hifz-tracker";
import { learnQuran } from "./features/learn-quran";
import { qazaSalahTracker } from "./features/qaza-salah-tracker";
import { quran } from "./features/quran";
import { quranPractice } from "./features/quran-practice";
import { ramadanTracker } from "./features/ramadan-tracker";
import { salahFocusLock } from "./features/salah-focus-lock";
import { salahTracker } from "./features/salah-tracker";
import { tasbeehCounter } from "./features/tasbeeh-counter";
import { worshipProgress } from "./features/worship-progress";
import { zikrTracker } from "./features/zikr-tracker";

/**
 * Arabic translations (features-1). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly FeaturePage[] = [
  salahTracker,
  qazaSalahTracker,
  salahFocusLock,
  fastingTracker,
  zikrTracker,
  dailyIslamicHabits,
  worshipProgress,
  quran,
  quranPractice,
  learnQuran,
  tasbeehCounter,
  ramadanTracker,
  hifzTracker,
];
