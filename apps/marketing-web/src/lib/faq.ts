import { APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import type { getTranslations } from "next-intl/server";
import type { FaqItem } from "@/content/types";

export type { FaqItem } from "@/content/types";

/**
 * Site FAQ, in display order. The copy lives in the `faq` catalog
 * (`messages/<locale>/faq.json` → `items.<id>.question` / `.answer`); answers
 * keep the content inline markup (`[label](/path)`, `**bold**`) rendered by
 * `RichText`, so `content.test.ts` checks their links.
 */
export const FAQ_IDS = [
  "what",
  "free",
  "account",
  "offline",
  "voice",
  "platforms",
  "teach",
  "family",
  "madhhab",
  "coach",
  "prayerTimes",
  "trust",
  "data",
  "languages",
  "reminders",
  "backup",
  "reportError",
  "openSource",
  "fork",
  "donations",
  "contribute",
] as const;

export type FaqId = (typeof FAQ_IDS)[number];

/** `useTranslations("faq")` (server component) or `await getTranslations("faq")`. */
export type FaqTranslator = Awaited<ReturnType<typeof getTranslations<"faq">>>;

/** The translated FAQ (`FAQ_IDS` order), optionally limited to the first `limit` items. */
export function getFaqItems(t: FaqTranslator, limit?: number): FaqItem[] {
  const values = { appName: APP_NAME, duaCount: DUA_COUNT };
  return FAQ_IDS.slice(0, limit).map((id) => ({
    question: t(`items.${id}.question`, values),
    answer: t(`items.${id}.answer`, values),
  }));
}
