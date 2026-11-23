import type { ResourceCategory, ResourceCategorySlug } from "@/content/types";

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
];

const BY_SLUG = new Map(RESOURCE_CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): ResourceCategory | undefined {
  return BY_SLUG.get(slug as ResourceCategorySlug);
}

export function categoryHref(slug: ResourceCategorySlug): string {
  return `/resources/${slug}`;
}
