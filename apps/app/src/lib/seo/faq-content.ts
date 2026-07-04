import { APP_NAME } from "@munib-tracker/shared/constants";

import type { FaqEntry } from "@/lib/seo/structured-data";

/**
 * Human-readable FAQ content surfaced as `FAQPage` JSON-LD on key pages.
 *
 * These plain-language question/answer pairs are the single most useful signal
 * for AI answer engines (ChatGPT, Gemini, Claude, Perplexity, Google AI
 * Overviews): they state, unambiguously, what the app is and how it works.
 * Keep answers factual and self-contained.
 */
export const HOME_FAQ: readonly FaqEntry[] = [
  {
    question: `What is ${APP_NAME}?`,
    answer: `${APP_NAME} is a free, offline-first Islamic companion app. It helps Muslims track their five daily prayers (salah), make up missed prayers (qaza), and keep up daily dhikr — alongside the Qur'an, hadith, duas, the 99 Names of Allah, prayer times, and a qibla compass.`,
  },
  {
    question: `Is ${APP_NAME} free to use?`,
    answer: `Yes. ${APP_NAME} is completely free, with no ads, subscriptions, or in-app purchases. You can use the whole app as a guest without creating an account.`,
  },
  {
    question: `Does ${APP_NAME} work offline?`,
    answer: `Yes. ${APP_NAME} is offline-first. The Qur'an, hadith, duas, adhkar, the 99 Names, and your tracking data all work without an internet connection. Prayer times and the qibla are calculated on your device.`,
  },
  {
    question: `Do I need to sign in to use it?`,
    answer: `No. Every feature is available in guest mode and your data stays on your device. Signing in is optional and only used to back up and sync your worship data across devices.`,
  },
  {
    question: `What can I track with ${APP_NAME}?`,
    answer: `You can track the five daily fard prayers plus Witr and sunnah prayers, missed (qaza) prayers and fasts, and daily dhikr. Streaks, a calendar, statistics, and gentle reminders help you stay consistent.`,
  },
  {
    question: `How are prayer times calculated?`,
    answer: `Prayer times are calculated locally from your location using standard astronomical methods, and shown with a live countdown, the Hijri date, and the qibla direction toward the Kaaba in Makkah.`,
  },
];
