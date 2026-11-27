import { TRANSLATIONS as arCategories } from "@/content/i18n/ar/categories";
import { TRANSLATIONS as urCategories } from "@/content/i18n/ur/categories";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import type { ResourceCategory, ResourceCategorySlug } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  {
    slug: "salah",
    title: "Salah",
    seoTitle: "Salah Guides — Consistency, Qaza and Missed Prayers",
    seoDescription:
      "Practical, cited guides on building a consistent Salah habit, understanding Qaza Salah, and tracking and making up missed prayers.",
    description:
      "Build a consistent Salah habit, understand Qaza, and make a realistic plan for missed prayers.",
    feature: "salah-tracker",
  },
  {
    slug: "zikr",
    title: "Zikr & adhkar",
    seoTitle: "Zikr Guides — Daily Routine and Morning & Evening Adhkar",
    seoDescription:
      "How to build a daily Zikr routine and keep the morning and evening adhkar, with authentic sources for every remembrance.",
    description:
      "Make remembrance of Allah a daily routine, with authentic adhkar and their sources.",
    feature: "zikr-tracker",
  },
  {
    slug: "quran-learning",
    title: "Qur'an learning",
    seoTitle: "Qur'an Learning Guides — Reading, Recitation & Memorization",
    seoDescription:
      "Guides for learning to read the Qur'an, improving recitation, daily reading, memorization, and helping children learn the Qur'an.",
    description:
      "Learn to read, improve your recitation, read every day, memorize, and help children learn.",
    feature: "learn-quran",
  },
  {
    slug: "islamic-habits",
    title: "Islamic habits",
    seoTitle: "Islamic Habits — Staying Consistent in Daily Worship",
    seoDescription:
      "How to build Islamic habits that last and stay consistent with daily worship, through small deeds, good anchors and gentle tracking.",
    description:
      "Build habits that last and stay consistent with daily worship, without burning out.",
    feature: "daily-islamic-habits",
  },
  {
    slug: "ramadan-fasting",
    title: "Ramadan & fasting",
    seoTitle: "Ramadan and Fasting Guides — Sunnah Fasts and Laylat al-Qadr",
    seoDescription:
      "Cited guides to preparing for Ramadan, the recommended Sunnah fasts through the year, and seeking Laylat al-Qadr in the last ten nights.",
    description:
      "Prepare for Ramadan, keep the Sunnah fasts through the year, and seek Laylat al-Qadr.",
    feature: "ramadan-tracker",
  },
  {
    slug: "zakat-hajj",
    title: "Zakat, Hajj & Umrah",
    seoTitle: "Zakat, Hajj and Umrah Guides — Step by Step, With Sources",
    seoDescription:
      "Practical, cited guides on calculating zakat on savings and gold, and performing Hajj and Umrah step by step, with the main differences between the schools.",
    description: "Work out your zakat, and perform Hajj and Umrah step by step.",
    feature: "zakat-calculator",
  },
];

/** Translated categories per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<ResourceCategory> = {
  ar: arCategories,
  ur: urCategories,
};

/** Resource categories in `locale`, English where one isn't translated yet. */
export function getCategories(locale: Locale = DEFAULT_LOCALE): readonly ResourceCategory[] {
  return localizeEntries(RESOURCE_CATEGORIES, TRANSLATIONS, locale, (c) => c.slug);
}

export function getCategory(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): ResourceCategory | undefined {
  return getCategories(locale).find((c) => c.slug === slug);
}

export function categoryHref(slug: ResourceCategorySlug): string {
  return `/resources/${slug}`;
}
