import { TRANSLATIONS as arArticles } from "@/content/i18n/ar/articles";
import { TRANSLATIONS as urArticles } from "@/content/i18n/ur/articles";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import type { Article, ResourceCategorySlug } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";
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

export const ARTICLES: readonly Article[] = [
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

export function articleHref(a: Pick<Article, "category" | "slug">): string {
  return `/resources/${a.category}/${a.slug}`;
}

/** Translated articles per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<Article> = {
  ar: arArticles,
  ur: urArticles,
};

/** Articles in `locale`, English where an article isn't translated yet. */
export function getArticles(locale: Locale = DEFAULT_LOCALE): readonly Article[] {
  return localizeEntries(ARTICLES, TRANSLATIONS, locale, articleHref);
}

export function getArticle(
  category: string,
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Article | undefined {
  return getArticles(locale).find((a) => a.category === category && a.slug === slug);
}

export function articlesIn(
  category: ResourceCategorySlug,
  locale: Locale = DEFAULT_LOCALE,
): Article[] {
  return getArticles(locale).filter((a) => a.category === category);
}

/** Look up an article by its full href (for related-content cards). */
export function articleByHref(href: string, locale: Locale = DEFAULT_LOCALE): Article | undefined {
  return getArticles(locale).find((a) => articleHref(a) === href);
}
