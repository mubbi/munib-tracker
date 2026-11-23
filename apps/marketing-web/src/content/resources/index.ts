import type { Article, ResourceCategorySlug } from "@/content/types";
import { article as consistentSalahHabit } from "./articles/how-to-build-a-consistent-salah-habit";
import { article as dailyZikrRoutine } from "./articles/how-to-build-a-daily-zikr-routine";
import { article as buildBetterIslamicHabits } from "./articles/how-to-build-better-islamic-habits";
import { article as helpChildrenLearnQuran } from "./articles/how-to-help-children-learn-the-quran";
import { article as improveQuranRecitation } from "./articles/how-to-improve-quran-recitation";
import { article as memorizeQuran } from "./articles/how-to-memorize-the-quran";
import { article as practiceQuranReading } from "./articles/how-to-practice-quran-reading-every-day";
import { article as startLearningQuran } from "./articles/how-to-start-learning-the-quran";
import { article as stayConsistent } from "./articles/how-to-stay-consistent-with-daily-worship";
import { article as trackMissedPrayers } from "./articles/how-to-track-missed-prayers";
import { article as morningEveningAdhkar } from "./articles/morning-and-evening-adhkar";
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
];

export function articleHref(a: Pick<Article, "category" | "slug">): string {
  return `/resources/${a.category}/${a.slug}`;
}

export function getArticle(category: string, slug: string): Article | undefined {
  return ARTICLES.find((a) => a.category === category && a.slug === slug);
}

export function articlesIn(category: ResourceCategorySlug): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

/** Look up an article by its full href (for related-content cards). */
export function articleByHref(href: string): Article | undefined {
  return ARTICLES.find((a) => articleHref(a) === href);
}
