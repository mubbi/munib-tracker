import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import { buildAppUrl } from "@/lib/app-links";

/** Native surface that can trigger an intent: Siri App Intents (iOS) or App Actions (Android). */
export type IntentPlatform = "ios" | "android";

export type IntentDefinition = {
  id: string;
  /**
   * navigation: opens a screen; background: enqueues a mark without UI;
   * query: answers from the widget snapshot without opening the app (Siri).
   */
  type: "navigation" | "background" | "query";
  titleKey: string;
  titleFallback: string;
  siriPhraseEn: string;
  href?: string;
  commandType?: "mark-current-obligatory" | "mark-prayer";
  /** Only set when `commandType` is `mark-prayer` (named-prayer intents, Siri only). */
  prayerId?: ObligatoryPrayer;
  /** Which native surfaces mirror this intent — see `MunibAppIntents.swift` / `withExternalCommands.cjs`. */
  platforms: readonly IntentPlatform[];
};

const BOTH_PLATFORMS: readonly IntentPlatform[] = ["ios", "android"];
const IOS_ONLY: readonly IntentPlatform[] = ["ios"];

/** Named-prayer mark intents (Siri only — Android App Actions exposes only `mark-current`). */
const NAMED_PRAYER_INTENTS: ReadonlyArray<{ prayerId: ObligatoryPrayer; label: string }> = [
  { prayerId: "fajr", label: "Fajr" },
  { prayerId: "dhuhr", label: "Dhuhr" },
  { prayerId: "asr", label: "Asr" },
  { prayerId: "maghrib", label: "Maghrib" },
  { prayerId: "isha", label: "Isha" },
];

/** Screens reachable by voice on both platforms (Siri `MunibFeature` + App Actions inventory). */
const NAVIGATION_INTENTS: ReadonlyArray<{
  id: string;
  label: string;
  phrase: string;
  href: string;
}> = [
  { id: "open-tracker", label: "openTracker", phrase: "Open checklist", href: "/tracker" },
  { id: "open-qibla", label: "openQibla", phrase: "Open Qibla", href: "/qibla" },
  { id: "open-tasbeeh", label: "openTasbeeh", phrase: "Open Tasbeeh", href: "/tasbeeh/free" },
  { id: "open-ramadan", label: "openRamadan", phrase: "Open Ramadan", href: "/ramadan" },
  { id: "open-khatm", label: "openKhatm", phrase: "Open Khatm plan", href: "/quran/khatm" },
  { id: "open-qaza", label: "openQaza", phrase: "Open Qaza", href: "/qaza" },
  { id: "open-quran", label: "openQuran", phrase: "Open Qur'an", href: "/quran" },
  { id: "open-adhkar", label: "openAdhkar", phrase: "Open Adhkar", href: "/zikr" },
  { id: "open-duas", label: "openDuas", phrase: "Open Duas", href: "/dua" },
  {
    id: "open-calendar",
    label: "openCalendar",
    phrase: "Open Islamic calendar",
    href: "/calendar",
  },
  { id: "open-events", label: "openEvents", phrase: "Open Islamic events", href: "/events" },
  {
    id: "open-daily-hadith",
    label: "openDailyHadith",
    phrase: "Open daily hadith",
    href: "/hadith/daily",
  },
  {
    id: "open-statistics",
    label: "openStatistics",
    phrase: "Open statistics",
    href: "/statistics",
  },
  { id: "open-friday", label: "openFriday", phrase: "Open Jumu'ah", href: "/friday" },
];

const FALLBACK_TITLES: Record<string, string> = {
  openTracker: "Open checklist",
  openQibla: "Open Qibla",
  openTasbeeh: "Open Tasbeeh",
  openRamadan: "Open Ramadan",
  openKhatm: "Open Khatm plan",
  openQaza: "Open Qaza",
  openQuran: "Open Qur'an",
  openAdhkar: "Open Adhkar",
  openDuas: "Open Duas",
  openCalendar: "Open Islamic calendar",
  openEvents: "Open Islamic events",
  openDailyHadith: "Open daily hadith",
  openStatistics: "Open statistics",
  openFriday: "Open Jumu'ah",
};

/**
 * Voice / Shortcuts intents (NF-2.15). Navigation intents open the app;
 * background intents enqueue mark commands without UI. Mirrored in
 * `targets/munib-tracker-intents/_shared/MunibAppIntents.swift` (Siri App
 * Intents + `AppShortcutsProvider` phrases — the five named-prayer entries map
 * to the single parameterized `MarkSalahIntent`) and, for
 * `platforms: ["ios", "android"]` navigation intents, in
 * `plugins/withExternalCommands.cjs` (Android App Actions `OPEN_APP_FEATURE`
 * entity inventory).
 */
export const INTENT_REGISTRY: IntentDefinition[] = [
  ...NAVIGATION_INTENTS.map(
    ({ id, label, phrase, href }): IntentDefinition => ({
      id,
      type: "navigation",
      titleKey: `externalCommands.intents.${label}`,
      titleFallback: FALLBACK_TITLES[label] ?? phrase,
      siriPhraseEn: `${phrase} in Munib Tracker`,
      href,
      platforms: BOTH_PLATFORMS,
    }),
  ),
  {
    id: "mark-current",
    type: "background",
    titleKey: "externalCommands.intents.markCurrent",
    titleFallback: "Mark my Salah",
    siriPhraseEn: "Mark my Salah in Munib Tracker",
    commandType: "mark-current-obligatory",
    platforms: BOTH_PLATFORMS,
  },
  ...NAMED_PRAYER_INTENTS.map(
    ({ prayerId, label }): IntentDefinition => ({
      id: `mark-${prayerId}`,
      type: "background",
      titleKey: `externalCommands.intents.mark${label}`,
      titleFallback: `Mark ${label}`,
      siriPhraseEn: `Mark ${label} in Munib Tracker`,
      commandType: "mark-prayer",
      prayerId,
      platforms: IOS_ONLY,
    }),
  ),
  // Siri answers from the App Group snapshot without opening the app (iOS only:
  // Android voice now runs through Gemini, which has no App Actions answers).
  {
    id: "next-salah",
    type: "query",
    titleKey: "externalCommands.intents.nextSalah",
    titleFallback: "When is the next Salah?",
    siriPhraseEn: "When is the next Salah in Munib Tracker",
    platforms: IOS_ONLY,
  },
  {
    id: "salah-time",
    type: "query",
    titleKey: "externalCommands.intents.salahTime",
    titleFallback: "When is a Salah?",
    siriPhraseEn: "When is Asr in Munib Tracker",
    platforms: IOS_ONLY,
  },
  {
    id: "today-progress",
    type: "query",
    titleKey: "externalCommands.intents.todayProgress",
    titleFallback: "Today's Salah progress",
    siriPhraseEn: "How is my Salah today in Munib Tracker",
    platforms: IOS_ONLY,
  },
  {
    id: "search",
    type: "navigation",
    titleKey: "externalCommands.intents.search",
    titleFallback: "Search Munib Tracker",
    siriPhraseEn: "Search for Ayat al-Kursi in Munib Tracker",
    href: "/search",
    platforms: ["android"],
  },
];

export function getIntentDeepLink(intent: IntentDefinition): string | undefined {
  if (!intent.href) return undefined;
  return buildAppUrl(intent.href);
}

export function getIntentById(id: string): IntentDefinition | undefined {
  return INTENT_REGISTRY.find((item) => item.id === id);
}

/** Intents mirrored on a given native surface (Siri vs Android App Actions). */
export function getIntentsForPlatform(platform: IntentPlatform): IntentDefinition[] {
  return INTENT_REGISTRY.filter((item) => item.platforms.includes(platform));
}
