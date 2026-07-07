import { buildAppUrl } from "@/lib/app-links";

export type IntentDefinition = {
  id: string;
  type: "navigation" | "background";
  titleKey: string;
  titleFallback: string;
  siriPhraseEn: string;
  href?: string;
  commandType?: "mark-current-obligatory";
};

/**
 * Voice / Shortcuts intents (NF-2.15). Navigation intents open the app;
 * background intents enqueue mark commands without UI.
 */
export const INTENT_REGISTRY: IntentDefinition[] = [
  {
    id: "open-tracker",
    type: "navigation",
    titleKey: "externalCommands.intents.openTracker",
    titleFallback: "Open checklist",
    siriPhraseEn: "Open checklist in Munib Tracker",
    href: "/tracker",
  },
  {
    id: "open-qibla",
    type: "navigation",
    titleKey: "externalCommands.intents.openQibla",
    titleFallback: "Open Qibla",
    siriPhraseEn: "Open Qibla in Munib Tracker",
    href: "/qibla",
  },
  {
    id: "open-tasbeeh",
    type: "navigation",
    titleKey: "externalCommands.intents.openTasbeeh",
    titleFallback: "Open Tasbeeh",
    siriPhraseEn: "Open Tasbeeh in Munib Tracker",
    href: "/tasbeeh/free",
  },
  {
    id: "mark-current",
    type: "background",
    titleKey: "externalCommands.intents.markCurrent",
    titleFallback: "Mark my Salah",
    siriPhraseEn: "Mark my Salah in Munib Tracker",
    commandType: "mark-current-obligatory",
  },
];

export function getIntentDeepLink(intent: IntentDefinition): string | undefined {
  if (!intent.href) return undefined;
  return buildAppUrl(intent.href);
}

export function getIntentById(id: string): IntentDefinition | undefined {
  return INTENT_REGISTRY.find((item) => item.id === id);
}
