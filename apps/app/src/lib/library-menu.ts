import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import type { AppIcon } from "./names-of-allah-ui";
import { QUICK_ACTION_META } from "./quick-actions";

export type LibrarySectionId = "track" | "read" | "supplicate" | "learn" | "more";

export interface LibraryMenuDef {
  id: string;
  section: LibrarySectionId;
  labelKey: string;
  icon: AppIcon;
  route: Href;
}

const QUICK_ACTION_ROUTES: Record<string, Href> = {
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
  achievements: "/achievements",
  stats: "/statistics",
};

function fromQuickAction(id: string, section: LibrarySectionId): LibraryMenuDef {
  const meta = QUICK_ACTION_META.find((entry) => entry.id === id);
  if (!meta) throw new Error(`Missing quick action meta for ${id}`);
  return {
    id,
    section,
    labelKey: meta.labelKey,
    icon: meta.icon,
    route: QUICK_ACTION_ROUTES[id],
  };
}

/** Every entry on the Library tab — mirrors home explore shortcuts plus Hajj. */
export const LIBRARY_MENU_META: LibraryMenuDef[] = [
  fromQuickAction("checklist", "track"),
  fromQuickAction("schedule", "track"),
  fromQuickAction("qaza", "track"),
  fromQuickAction("tasbeeh", "track"),
  fromQuickAction("ramadan", "track"),
  fromQuickAction("quran", "read"),
  fromQuickAction("hadith", "read"),
  fromQuickAction("bookmarks", "read"),
  fromQuickAction("duas", "supplicate"),
  fromQuickAction("zikr", "supplicate"),
  fromQuickAction("duroods", "supplicate"),
  fromQuickAction("names", "supplicate"),
  fromQuickAction("salahGuide", "learn"),
  fromQuickAction("jannah", "learn"),
  fromQuickAction("lastDay", "learn"),
  fromQuickAction("jahannam", "learn"),
  fromQuickAction("battles", "learn"),
  fromQuickAction("learnQuran", "learn"),
  fromQuickAction("taharah", "learn"),
  fromQuickAction("prophets", "learn"),
  fromQuickAction("aqeedah", "learn"),
  fromQuickAction("learnDua", "learn"),
  {
    id: "travel",
    section: "learn",
    labelKey: "travel.title",
    icon: { ios: "airplane", android: "flight", web: "flight" },
    route: "/travel" as Href,
  },
  {
    id: "hajj",
    section: "learn",
    labelKey: "hajj.title",
    icon: { ios: "building.2.fill", android: "mosque", web: "mosque" },
    route: "/hajj" as Href,
  },
  {
    id: "seerah",
    section: "learn",
    labelKey: "seerah.title",
    icon: { ios: "book.pages.fill", android: "history_edu", web: "history_edu" },
    route: "/seerah" as Href,
  },
  fromQuickAction("events", "learn"),
  fromQuickAction("calendar", "more"),
  fromQuickAction("qibla", "more"),
  fromQuickAction("zakat", "more"),
  fromQuickAction("achievements", "more"),
  fromQuickAction("stats", "more"),
];

export const LIBRARY_SECTIONS: {
  id: LibrarySectionId;
  titleKey: string;
  icon: SymbolViewProps["name"];
}[] = [
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
