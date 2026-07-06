/** Android adaptive icon keys for expo-quick-actions (see plugins/homeScreenSurfaces.cjs). */
export const QUICK_ACTION_ANDROID_ICONS = {
  checklist: "quick_checklist",
  qibla: "quick_qibla",
  tasbeeh: "quick_tasbeeh",
  qaza: "quick_qaza",
  quran: "quick_quran",
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
};

/**
 * Registry of home-screen icon shortcuts. Order matters on iOS (first N items only).
 * Add new entries here — sync and Android icons follow automatically.
 */
export const QUICK_ACTION_REGISTRY: QuickActionDefinition[] = [
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
];

export function getQuickActionById(id: string): QuickActionDefinition | undefined {
  return QUICK_ACTION_REGISTRY.find((item) => item.id === id);
}
