import type { Article } from "@/content/types";
import { article as eidPrayer } from "./articles/eid-prayer-and-sunnahs";
import { article as consistentSalahHabit } from "./articles/how-to-build-a-consistent-salah-habit";
import { article as dailyZikrRoutine } from "./articles/how-to-build-a-daily-zikr-routine";
import { article as buildBetterIslamicHabits } from "./articles/how-to-build-better-islamic-habits";
import { article as calculateZakat } from "./articles/how-to-calculate-zakat";
import { article as helpChildrenLearnQuran } from "./articles/how-to-help-children-learn-the-quran";
import { article as improveQuranRecitation } from "./articles/how-to-improve-quran-recitation";
import { article as makeDua } from "./articles/how-to-make-dua";
import { article as makeWudu } from "./articles/how-to-make-wudu";
import { article as memorizeQuran } from "./articles/how-to-memorize-the-quran";
import { article as performHajj } from "./articles/how-to-perform-hajj-step-by-step";
import { article as performUmrah } from "./articles/how-to-perform-umrah-step-by-step";
import { article as practiceQuranReading } from "./articles/how-to-practice-quran-reading-every-day";
import { article as prayJanazah } from "./articles/how-to-pray-janazah";
import { article as praySalahStepByStep } from "./articles/how-to-pray-salah-step-by-step";
import { article as prayTahajjud } from "./articles/how-to-pray-tahajjud";
import { article as prayWhileTravelling } from "./articles/how-to-pray-while-travelling";
import { article as prayWitr } from "./articles/how-to-pray-witr";
import { article as prepareForRamadan } from "./articles/how-to-prepare-for-ramadan";
import { article as startLearningQuran } from "./articles/how-to-start-learning-the-quran";
import { article as stayConsistent } from "./articles/how-to-stay-consistent-with-daily-worship";
import { article as trackMissedPrayers } from "./articles/how-to-track-missed-prayers";
import { article as laylatAlQadrGuide } from "./articles/laylat-al-qadr-guide";
import { article as morningEveningAdhkar } from "./articles/morning-and-evening-adhkar";
import { article as salatAlIstikhara } from "./articles/salat-al-istikhara";
import { article as sunnahFasts } from "./articles/sunnah-fasts-through-the-year";
import { article as sunnahsOfFriday } from "./articles/sunnahs-of-friday-jumuah";
import { article as whatIsQaza } from "./articles/what-is-qaza-salah";

/**
 * Arabic translations (articles). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly Article[] = [
  consistentSalahHabit,
  whatIsQaza,
  trackMissedPrayers,
  dailyZikrRoutine,
  morningEveningAdhkar,
  startLearningQuran,
  improveQuranRecitation,
  practiceQuranReading,
  memorizeQuran,
  helpChildrenLearnQuran,
  stayConsistent,
  buildBetterIslamicHabits,
  praySalahStepByStep,
  makeWudu,
  prayTahajjud,
  sunnahsOfFriday,
  makeDua,
  prepareForRamadan,
  sunnahFasts,
  laylatAlQadrGuide,
  calculateZakat,
  performUmrah,
  prayWitr,
  salatAlIstikhara,
  prayJanazah,
  prayWhileTravelling,
  eidPrayer,
  performHajj,
];
