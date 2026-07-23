import type { Href } from "expo-router";
import type { TFunction } from "i18next";

import type { QuickActionItem } from "@/components/ui/quick-action";
import { isTV } from "@/lib/platform/is-tv";

import { type AppIcon, NAMES_OF_ALLAH_ICON } from "./names-of-allah-ui";

/** Branded sentinel — use wherever the tasbeeh counter needs an icon. */
export const TASBEEH_ICON: AppIcon = {
  ios: "hand.tap.fill",
  android: "touch_app",
  web: "touch_app",
};

/** Semantic tone → theme token, resolved by consumers against `tokens.status` / accent. */
export type QuickActionTone = "success" | "info" | "danger" | "warning" | "accent";

/**
 * Metadata for every home quick action (NF-1.23). Kept separate from the home
 * screen's behavioral array (which owns `onPress`) so the customization screen
 * can list, toggle, and reorder actions by id. Library menu entries reuse the
 * same ids, icons, and routes — keep `LIBRARY_MENU_META` aligned via
 * `assertLibraryMenuParity`.
 */
export interface QuickActionDef {
  id: string;
  labelKey: string;
  icon: AppIcon;
  tone: QuickActionTone;
}

export const QUICK_ACTION_ROUTES: Record<string, Href> = {
  checklist: "/tracker",
  schedule: "/schedule" as Href,
  zikr: "/zikr",
  tasbeeh: "/tasbeeh/free",
  ramadan: "/ramadan",
  salahGuide: "/salah-guide",
  jannah: "/jannah" as Href,
  jahannam: "/jahannam" as Href,
  lastDay: "/last-day" as Href,
  battles: "/battles" as Href,
  learnQuran: "/learn-quran" as Href,
  taharah: "/taharah" as Href,
  prophets: "/prophets" as Href,
  aqeedah: "/aqeedah" as Href,
  learnDua: "/learn-dua" as Href,
  travel: "/travel" as Href,
  hajj: "/hajj" as Href,
  seerah: "/seerah" as Href,
  events: "/events" as Href,
  zakat: "/zakat" as Href,
  qaza: "/qaza",
  quran: "/quran",
  hadith: "/hadith",
  bookmarks: "/bookmarks",
  duas: "/dua",
  duroods: "/duroods",
  names: "/names-of-allah",
  qibla: "/qibla",
  calendar: "/calendar",
  dateConverter: "/calendar/converter",
  achievements: "/achievements",
  stats: "/statistics",
  journal: "/journal",
  tahajjud: "/tahajjud",
  lastThirdNight: "/last-third-night" as Href,
  hayd: "/hayd",
  sick: "/sick",
  adhkarBuilder: "/adhkar-builder",
  sahaba: "/sahaba" as Href,
  history: "/history" as Href,
  laylatAlQadr: "/laylat-al-qadr" as Href,
  eid: "/eid" as Href,
  friday: "/friday" as Href,
  ruqyah: "/ruqyah" as Href,
  newMuslim: "/new-muslim" as Href,
  finance: "/finance" as Href,
  flashCards: "/flash-cards" as Href,
  verseDetector: "/verse-detector" as Href,
  fidyah: "/fidyah" as Href,
  janazah: "/janazah" as Href,
  sadaqah: "/sadaqah" as Href,
};

export const QUICK_ACTION_META: QuickActionDef[] = [
  {
    id: "checklist",
    labelKey: "actions.checklist",
    icon: { ios: "checklist", android: "checklist", web: "checklist" },
    tone: "success",
  },
  {
    id: "schedule",
    labelKey: "home.scheduleTitle",
    icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
    tone: "info",
  },
  {
    id: "zikr",
    labelKey: "actions.zikr",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    tone: "danger",
  },
  {
    id: "adhkarBuilder",
    labelKey: "actions.adhkarBuilder",
    icon: { ios: "square.and.pencil", android: "edit_note", web: "edit_note" },
    tone: "accent",
  },
  {
    id: "tasbeeh",
    labelKey: "actions.tasbeeh",
    icon: TASBEEH_ICON,
    tone: "accent",
  },
  {
    id: "ramadan",
    labelKey: "actions.ramadan",
    icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
    tone: "info",
  },
  {
    id: "tahajjud",
    labelKey: "actions.tahajjud",
    icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
    tone: "info",
  },
  {
    id: "lastThirdNight",
    labelKey: "actions.lastThirdNight",
    icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
    tone: "info",
  },
  {
    id: "journal",
    labelKey: "actions.journal",
    icon: { ios: "square.and.pencil", android: "edit", web: "edit" },
    tone: "accent",
  },
  {
    id: "salahGuide",
    labelKey: "actions.salahGuide",
    icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
    tone: "info",
  },
  {
    id: "events",
    labelKey: "actions.events",
    icon: { ios: "star.circle.fill", android: "event", web: "event" },
    tone: "warning",
  },
  {
    id: "zakat",
    labelKey: "actions.zakat",
    icon: { ios: "banknote.fill", android: "payments", web: "payments" },
    tone: "success",
  },
  {
    id: "qaza",
    labelKey: "actions.qaza",
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    tone: "warning",
  },
  {
    id: "quran",
    labelKey: "actions.quran",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    tone: "accent",
  },
  {
    id: "hadith",
    labelKey: "actions.hadith",
    icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
    tone: "info",
  },
  {
    id: "bookmarks",
    labelKey: "actions.bookmarks",
    icon: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
    tone: "warning",
  },
  {
    id: "duas",
    labelKey: "actions.duas",
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    tone: "danger",
  },
  {
    id: "duroods",
    labelKey: "actions.duroods",
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    tone: "danger",
  },
  {
    id: "names",
    labelKey: "actions.names",
    icon: NAMES_OF_ALLAH_ICON,
    tone: "accent",
  },
  {
    id: "qibla",
    labelKey: "actions.qibla",
    icon: { ios: "location.north.line.fill", android: "explore", web: "explore" },
    tone: "info",
  },
  {
    id: "calendar",
    labelKey: "actions.calendar",
    icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
    tone: "warning",
  },
  {
    id: "dateConverter",
    labelKey: "dateConverter.title",
    icon: { ios: "arrow.left.arrow.right", android: "sync_alt", web: "sync_alt" },
    tone: "warning",
  },
  {
    id: "jannah",
    labelKey: "actions.jannah",
    icon: { ios: "leaf.fill", android: "park", web: "park" },
    tone: "success",
  },
  {
    id: "battles",
    labelKey: "actions.battles",
    icon: { ios: "scroll.fill", android: "history_edu", web: "history_edu" },
    tone: "info",
  },
  {
    id: "lastDay",
    labelKey: "actions.lastDay",
    icon: { ios: "scalemass.fill", android: "balance", web: "balance" },
    tone: "info",
  },
  {
    id: "jahannam",
    labelKey: "actions.jahannam",
    icon: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
    tone: "danger",
  },
  {
    id: "learnQuran",
    labelKey: "actions.learnQuran",
    icon: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
    tone: "accent",
  },
  {
    id: "taharah",
    labelKey: "actions.taharah",
    icon: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
    tone: "info",
  },
  {
    id: "hayd",
    labelKey: "actions.hayd",
    icon: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
    tone: "info",
  },
  {
    id: "sick",
    labelKey: "actions.sick",
    icon: { ios: "cross.case.fill", android: "medical_services", web: "medical_services" },
    tone: "warning",
  },
  {
    id: "prophets",
    labelKey: "actions.prophets",
    icon: { ios: "person.3.fill", android: "groups", web: "groups" },
    tone: "accent",
  },
  {
    id: "aqeedah",
    labelKey: "actions.aqeedah",
    icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
    tone: "success",
  },
  {
    id: "learnDua",
    labelKey: "actions.learnDua",
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    tone: "danger",
  },
  {
    id: "travel",
    labelKey: "travel.title",
    icon: { ios: "airplane", android: "flight", web: "flight" },
    tone: "info",
  },
  {
    id: "hajj",
    labelKey: "hajj.title",
    icon: { ios: "building.2.fill", android: "mosque", web: "mosque" },
    tone: "accent",
  },
  {
    id: "seerah",
    labelKey: "seerah.title",
    icon: { ios: "book.pages.fill", android: "history_edu", web: "history_edu" },
    tone: "info",
  },
  {
    id: "achievements",
    labelKey: "settings.achievements",
    icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
    tone: "warning",
  },
  {
    id: "stats",
    labelKey: "actions.stats",
    icon: { ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" },
    tone: "success",
  },
  {
    id: "sahaba",
    labelKey: "actions.sahaba",
    icon: { ios: "person.3.fill", android: "groups", web: "groups" },
    tone: "accent",
  },
  {
    id: "history",
    labelKey: "actions.history",
    icon: { ios: "scroll.fill", android: "history_edu", web: "history_edu" },
    tone: "info",
  },
  {
    id: "laylatAlQadr",
    labelKey: "actions.laylatAlQadr",
    icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
    tone: "info",
  },
  {
    id: "eid",
    labelKey: "actions.eid",
    icon: { ios: "gift.fill", android: "celebration", web: "celebration" },
    tone: "warning",
  },
  {
    id: "friday",
    labelKey: "actions.friday",
    icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    tone: "warning",
  },
  {
    id: "ruqyah",
    labelKey: "actions.ruqyah",
    icon: { ios: "shield.fill", android: "shield", web: "shield" },
    tone: "success",
  },
  {
    id: "newMuslim",
    labelKey: "actions.newMuslim",
    icon: { ios: "person.fill.badge.plus", android: "person_add", web: "person_add" },
    tone: "accent",
  },
  {
    id: "flashCards",
    labelKey: "actions.flashCards",
    icon: { ios: "rectangle.stack.fill", android: "style", web: "style" },
    tone: "accent",
  },
  {
    id: "finance",
    labelKey: "actions.finance",
    icon: { ios: "chart.pie.fill", android: "pie_chart", web: "pie_chart" },
    tone: "success",
  },
  {
    id: "verseDetector",
    labelKey: "actions.verseDetector",
    icon: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
    tone: "success",
  },
  {
    id: "fidyah",
    labelKey: "actions.fidyah",
    icon: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
    tone: "warning",
  },
  {
    id: "janazah",
    labelKey: "actions.janazah",
    // Keep iOS/Android glyphs aligned — avoid sharing Learn Dua / Sadaqah icons.
    icon: {
      ios: "heart.text.square.fill",
      android: "favorite",
      web: "favorite",
    },
    tone: "info",
  },
  {
    id: "sadaqah",
    labelKey: "actions.sadaqah",
    // Distinct from Learn Dua (`hands.and.sparkles` / `volunteer_activism`).
    icon: {
      ios: "heart.circle.fill",
      android: "savings",
      web: "savings",
    },
    tone: "success",
  },
];

/**
 * Curated set shown on the home Explore grid by default (daily-driver worship +
 * core reading tools). Every other action stays discoverable and can be added
 * back from Settings → Customize home. Order here is the on-screen order.
 */
export const DEFAULT_QUICK_ACTION_ORDER: string[] = [
  "quran",
  "checklist",
  "qibla",
  "tasbeeh",
  "zikr",
  "duas",
  "qaza",
  "hadith",
  "bookmarks",
  "calendar",
  "events",
  "stats",
];

type QuickActionTheme = {
  colors: { accent: string };
  tokens: {
    status: Record<Exclude<QuickActionTone, "accent">, { color: string }>;
  };
};

export function resolveQuickActionTint(
  tone: QuickActionTone,
  { colors, tokens }: QuickActionTheme,
): string {
  if (tone === "accent") return colors.accent;
  return tokens.status[tone].color;
}

/** Quick-action / library ids that need mic, camera, or phone-only chrome. */
export const TV_HIDDEN_QUICK_ACTION_IDS = new Set(["verseDetector"]);

/** Builds the home Explore grid from shared quick-action metadata. */
export function buildQuickActionItems(
  t: TFunction,
  push: (href: Href) => void,
  theme: QuickActionTheme,
): QuickActionItem[] {
  const tv = isTV();
  return QUICK_ACTION_META.filter((meta) => !(tv && TV_HIDDEN_QUICK_ACTION_IDS.has(meta.id))).map(
    (meta) => {
      const route = QUICK_ACTION_ROUTES[meta.id];
      if (!route) throw new Error(`Missing quick action route for ${meta.id}`);
      return {
        id: meta.id,
        label: t(meta.labelKey),
        icon: meta.icon,
        tint: resolveQuickActionTint(meta.tone, theme),
        onPress: () => push(route),
      };
    },
  );
}

/** Orders a behavioral action list by a saved id order, dropping unknown/removed ids. */
export function orderQuickActions<T extends { id: string }>(all: T[], order: string[]): T[] {
  const byId = new Map(all.map((item) => [item.id, item]));
  const result: T[] = [];
  for (const id of order) {
    const item = byId.get(id);
    if (item) result.push(item);
  }
  return result;
}

/** Throws when library menu ids diverge from quick-action metadata. */
export function assertLibraryMenuParity(libraryIds: string[]): void {
  const metaIds = QUICK_ACTION_META.map((entry) => entry.id);
  const missingFromLibrary = metaIds.filter((id) => !libraryIds.includes(id));
  const extraInLibrary = libraryIds.filter((id) => !metaIds.includes(id));
  if (missingFromLibrary.length || extraInLibrary.length) {
    throw new Error(
      `Library/quick-action parity broken. Missing from library: ${missingFromLibrary.join(", ") || "none"}. Extra in library: ${extraInLibrary.join(", ") || "none"}.`,
    );
  }
}
