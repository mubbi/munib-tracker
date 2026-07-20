/** Android adaptive icon keys for expo-quick-actions (see plugins/homeScreenSurfaces.cjs). */
export const QUICK_ACTION_ANDROID_ICONS = {
  markCurrent: "quick_mark",
  checklist: "quick_checklist",
  qibla: "quick_qibla",
  tasbeeh: "quick_tasbeeh",
  qaza: "quick_qaza",
  quran: "quick_quran",
  ramadan: "quick_ramadan",
} as const;

export type QuickActionDefinition = {
  id: string;
  titleKey: string;
  titleFallback: string;
  subtitleKey: string;
  subtitleFallback: string;
  iosSymbol: string;
  androidIcon: string;
  href: string;
  /** Only surfaced by `getActiveQuickActionDefinitions` while the matching season is active. */
  seasonal?: "ramadan";
};

/**
 * Registry of home-screen icon shortcuts. Order matters on iOS (first N items only —
 * see `IOS_QUICK_ACTION_LIMIT`). Add new entries here — sync and Android icons follow
 * automatically. Use `getActiveQuickActionDefinitions` (not this array directly) to
 * resolve the list actually shown, so seasonal entries swap in/out correctly.
 */
export const QUICK_ACTION_REGISTRY: QuickActionDefinition[] = [
  {
    id: "mark-current",
    titleKey: "externalCommands.intents.markCurrent",
    titleFallback: "Mark my Salah",
    subtitleKey: "quickActions.markCurrentSubtitle",
    subtitleFallback: "Mark current Salah",
    iosSymbol: "symbol:checkmark.circle",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.markCurrent,
    href: "/mark-current",
  },
  {
    id: "tracker",
    titleKey: "actions.checklist",
    titleFallback: "Checklist",
    subtitleKey: "quickActions.checklistSubtitle",
    subtitleFallback: "Log today's prayers",
    iosSymbol: "symbol:checklist",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.checklist,
    href: "/tracker",
  },
  {
    id: "qibla",
    titleKey: "actions.qibla",
    titleFallback: "Qibla",
    subtitleKey: "quickActions.qiblaSubtitle",
    subtitleFallback: "Find qibla direction",
    iosSymbol: "symbol:location.north.line",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.qibla,
    href: "/qibla",
  },
  {
    id: "tasbeeh",
    titleKey: "actions.tasbeeh",
    titleFallback: "Tasbeeh",
    subtitleKey: "quickActions.tasbeehSubtitle",
    subtitleFallback: "Open tasbeeh counter",
    iosSymbol: "symbol:hand.tap",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.tasbeeh,
    href: "/tasbeeh/free",
  },
  {
    id: "qaza",
    titleKey: "actions.qaza",
    titleFallback: "Qaza",
    subtitleKey: "quickActions.qazaSubtitle",
    subtitleFallback: "Manage missed prayers",
    iosSymbol: "symbol:clock.arrow.circlepath",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.qaza,
    href: "/qaza",
  },
  {
    id: "quran",
    titleKey: "actions.quran",
    titleFallback: "Qur'an",
    subtitleKey: "quickActions.quranSubtitle",
    subtitleFallback: "Read Qur'an",
    iosSymbol: "symbol:book",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.quran,
    href: "/quran",
  },
  {
    id: "ramadan",
    titleKey: "actions.ramadan",
    titleFallback: "Ramadan",
    subtitleKey: "quickActions.ramadanSubtitle",
    subtitleFallback: "Suhoor, iftar & fasting log",
    iosSymbol: "symbol:moon.stars.fill",
    androidIcon: QUICK_ACTION_ANDROID_ICONS.ramadan,
    href: "/ramadan",
    seasonal: "ramadan",
  },
];

/** Evergreen slot the seasonal Ramadan action swaps into while Ramadan is active. */
const RAMADAN_SWAP_TARGET_ID = "tasbeeh";

export function getQuickActionById(id: string): QuickActionDefinition | undefined {
  return QUICK_ACTION_REGISTRY.find((item) => item.id === id);
}

/**
 * Resolves the definitions actually shown on the home screen / launcher, in order.
 * `mark-current` always leads; the Ramadan entry only appears (swapped in for
 * `RAMADAN_SWAP_TARGET_ID`) while `isRamadanActive` — otherwise it's dropped so
 * `IOS_QUICK_ACTION_LIMIT` slicing stays on the evergreen icons.
 */
export function getActiveQuickActionDefinitions(isRamadanActive: boolean): QuickActionDefinition[] {
  const evergreen = QUICK_ACTION_REGISTRY.filter((def) => def.seasonal == null);
  if (!isRamadanActive) return evergreen;

  const ramadan = QUICK_ACTION_REGISTRY.find((def) => def.seasonal === "ramadan");
  if (!ramadan) return evergreen;

  const swapIndex = evergreen.findIndex((def) => def.id === RAMADAN_SWAP_TARGET_ID);
  if (swapIndex === -1) return [...evergreen, ramadan];

  const next = [...evergreen];
  next[swapIndex] = ramadan;
  return next;
}
