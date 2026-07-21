import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import { buildAppUrl } from "@/lib/app-links";

/** Native surface that can trigger an intent: Siri App Intents (iOS) or App Actions (Android). */
export type IntentPlatform = "ios" | "android";

export type IntentDefinition = {
  id: string;
  type: "navigation" | "background";
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
  {
    id: "open-tracker",
    type: "navigation",
    titleKey: "externalCommands.intents.openTracker",
    titleFallback: "Open checklist",
    siriPhraseEn: "Open checklist in Munib Tracker",
    href: "/tracker",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-qibla",
    type: "navigation",
    titleKey: "externalCommands.intents.openQibla",
    titleFallback: "Open Qibla",
    siriPhraseEn: "Open Qibla in Munib Tracker",
    href: "/qibla",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-tasbeeh",
    type: "navigation",
    titleKey: "externalCommands.intents.openTasbeeh",
    titleFallback: "Open Tasbeeh",
    siriPhraseEn: "Open Tasbeeh in Munib Tracker",
    href: "/tasbeeh/free",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-ramadan",
    type: "navigation",
    titleKey: "externalCommands.intents.openRamadan",
    titleFallback: "Open Ramadan",
    siriPhraseEn: "Open Ramadan in Munib Tracker",
    href: "/ramadan",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-khatm",
    type: "navigation",
    titleKey: "externalCommands.intents.openKhatm",
    titleFallback: "Open Khatm plan",
    siriPhraseEn: "Open Khatm plan in Munib Tracker",
    href: "/quran/khatm",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-qaza",
    type: "navigation",
    titleKey: "externalCommands.intents.openQaza",
    titleFallback: "Open Qaza",
    siriPhraseEn: "Open Qaza in Munib Tracker",
    href: "/qaza",
    platforms: BOTH_PLATFORMS,
  },
  {
    id: "open-quran",
    type: "navigation",
    titleKey: "externalCommands.intents.openQuran",
    titleFallback: "Open Qur'an",
    siriPhraseEn: "Open Qur'an in Munib Tracker",
    href: "/quran",
    platforms: BOTH_PLATFORMS,
  },
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
