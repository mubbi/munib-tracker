import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import type { AppIcon } from "./names-of-allah-ui";
import { assertLibraryMenuParity, QUICK_ACTION_META, QUICK_ACTION_ROUTES } from "./quick-actions";

export type LibrarySectionId = "track" | "read" | "supplicate" | "learn" | "more";

export interface LibraryMenuDef {
  id: string;
  section: LibrarySectionId;
  labelKey: string;
  icon: AppIcon;
  route: Href;
}

function fromQuickAction(id: string, section: LibrarySectionId): LibraryMenuDef {
  const meta = QUICK_ACTION_META.find((entry) => entry.id === id);
  if (!meta) throw new Error(`Missing quick action meta for ${id}`);
  const route = QUICK_ACTION_ROUTES[id];
  if (!route) throw new Error(`Missing quick action route for ${id}`);
  return {
    id,
    section,
    labelKey: meta.labelKey,
    icon: meta.icon,
    route,
  };
}

/** Every entry on the Library tab — same destinations as home Explore shortcuts. */
export const LIBRARY_MENU_META: LibraryMenuDef[] = [
  // Read first — Qur'an / hadith are primary destinations, not buried under Track.
  fromQuickAction("quran", "read"),
  fromQuickAction("verseDetector", "read"),
  fromQuickAction("hadith", "read"),
  fromQuickAction("bookmarks", "read"),
  fromQuickAction("duas", "supplicate"),
  fromQuickAction("zikr", "supplicate"),
  fromQuickAction("adhkarBuilder", "supplicate"),
  fromQuickAction("duroods", "supplicate"),
  fromQuickAction("names", "supplicate"),
  // Track: devotionals first; checklist/schedule last (also on the Tracker tab).
  fromQuickAction("qaza", "track"),
  fromQuickAction("tasbeeh", "track"),
  fromQuickAction("ramadan", "track"),
  fromQuickAction("tahajjud", "track"),
  fromQuickAction("journal", "track"),
  fromQuickAction("checklist", "track"),
  fromQuickAction("schedule", "track"),
  fromQuickAction("salahGuide", "learn"),
  fromQuickAction("jannah", "learn"),
  fromQuickAction("lastDay", "learn"),
  fromQuickAction("jahannam", "learn"),
  fromQuickAction("battles", "learn"),
  fromQuickAction("learnQuran", "learn"),
  fromQuickAction("taharah", "learn"),
  fromQuickAction("hayd", "learn"),
  fromQuickAction("sick", "learn"),
  fromQuickAction("prophets", "learn"),
  fromQuickAction("aqeedah", "learn"),
  fromQuickAction("learnDua", "learn"),
  fromQuickAction("travel", "learn"),
  fromQuickAction("hajj", "learn"),
  fromQuickAction("seerah", "learn"),
  fromQuickAction("events", "learn"),
  fromQuickAction("sahaba", "learn"),
  fromQuickAction("history", "learn"),
  fromQuickAction("laylatAlQadr", "learn"),
  fromQuickAction("eid", "learn"),
  fromQuickAction("friday", "learn"),
  fromQuickAction("ruqyah", "learn"),
  fromQuickAction("newMuslim", "learn"),
  fromQuickAction("flashCards", "learn"),
  // Tools & more — Qibla first (high-frequency worship tool).
  fromQuickAction("qibla", "more"),
  fromQuickAction("calendar", "more"),
  fromQuickAction("dateConverter", "more"),
  fromQuickAction("lastThirdNight", "more"),
  fromQuickAction("zakat", "more"),
  fromQuickAction("finance", "more"),
  fromQuickAction("achievements", "more"),
  fromQuickAction("stats", "more"),
];

assertLibraryMenuParity(LIBRARY_MENU_META.map((entry) => entry.id));

/**
 * Route prefixes for the "learn" section — long-form educational content where a
 * reading-progress indicator is useful. Derived from the canonical menu so it
 * stays in sync as sections change. `ScreenLayout` uses this to auto-enable the
 * reading-progress bar on these routes (and their sub-routes).
 */
export const LEARN_SECTION_ROUTES: string[] = LIBRARY_MENU_META.filter(
  (entry) => entry.section === "learn",
).map((entry) => String(entry.route));

export const LIBRARY_SECTIONS: {
  id: LibrarySectionId;
  titleKey: string;
  icon: SymbolViewProps["name"];
}[] = [
  {
    id: "read",
    titleKey: "library.read",
    icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
  },
  {
    id: "supplicate",
    titleKey: "library.supplicate",
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
  },
  {
    id: "track",
    titleKey: "library.track",
    icon: {
      ios: "list.bullet.clipboard.fill",
      android: "checklist",
      web: "checklist",
    },
  },
  {
    id: "learn",
    titleKey: "library.learn",
    icon: { ios: "graduationcap.fill", android: "school", web: "school" },
  },
  {
    id: "more",
    titleKey: "library.more",
    icon: { ios: "square.grid.2x2.fill", android: "apps", web: "apps" },
  },
];

/** Groups library entries into their section cards. */
export function groupLibraryMenuBySection(
  entries: LibraryMenuDef[],
): Record<LibrarySectionId, LibraryMenuDef[]> {
  const groups: Record<LibrarySectionId, LibraryMenuDef[]> = {
    track: [],
    read: [],
    supplicate: [],
    learn: [],
    more: [],
  };
  for (const entry of entries) {
    groups[entry.section].push(entry);
  }
  return groups;
}
