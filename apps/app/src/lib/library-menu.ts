import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import { createFuzzyIndex, type FuzzyIndex } from "@/lib/search";

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
  fromQuickAction("janazah", "learn"),
  fromQuickAction("flashCards", "learn"),
  // Tools & more — Qibla first (high-frequency worship tool).
  fromQuickAction("qibla", "more"),
  fromQuickAction("calendar", "more"),
  fromQuickAction("dateConverter", "more"),
  fromQuickAction("lastThirdNight", "more"),
  fromQuickAction("zakat", "more"),
  fromQuickAction("sadaqah", "more"),
  fromQuickAction("fidyah", "more"),
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

/**
 * Alternate spellings / common synonyms for Library search. Canonical UI labels
 * stay on the terminology guide (Zikr, Qaza, …); these only widen Fuse matching
 * for how people actually type (dhikr, azkar, qadha, koran, …).
 */
export const LIBRARY_SEARCH_ALIASES: Readonly<Record<string, readonly string[]>> = {
  zikr: ["dhikr", "adhkar", "azkar", "athkar", "zikar", "zikir", "dikir", "zikr"],
  adhkarBuilder: ["adhkar", "azkar", "athkar", "zikr", "dhikr", "my adhkar", "custom adhkar"],
  duas: ["dua", "duaa", "doa", "du'a", "supplication", "supplications"],
  duroods: ["durood", "darood", "salawat", "salawaat", "durud"],
  names: ["99 names", "asma", "asmaul husna", "asma ul husna", "names of allah"],
  quran: ["quran", "koran", "quraan", "alquran", "al quran"],
  hadith: ["hadeeth", "ahadith", "hadiths"],
  verseDetector: ["verse", "ayah", "ayat", "detector", "recognize verse"],
  bookmarks: ["saved", "favorites", "favourite"],
  qaza: ["qada", "qadha", "qadah", "missed salah", "makeup salah", "make up"],
  tasbeeh: ["tasbih", "tasbi", "counter", "beads"],
  ramadan: ["ramazan", "ramadhan"],
  tahajjud: ["night prayer", "qiyam"],
  lastThirdNight: ["last third", "last third of the night"],
  journal: ["prayer journal", "notes", "diary"],
  checklist: ["tracker", "daily checklist", "today"],
  schedule: ["prayer times", "salah times", "timetable"],
  salahGuide: ["salat", "namaz", "salah", "prayer guide", "how to pray", "learn prayer"],
  jannah: ["paradise", "heaven", "jannat"],
  jahannam: ["hell", "hellfire", "nar"],
  lastDay: ["judgment day", "judgement day", "qiyamah", "qiyama", "akhirah", "day of judgment"],
  battles: ["ghazwa", "wars", "battle"],
  learnQuran: ["tajweed", "learn quran", "quran guide"],
  taharah: ["tahara", "wudu", "wudhu", "ablution", "ghusl", "purification"],
  hayd: ["menstruation", "menses", "period", "haidh"],
  sick: ["illness", "sick salah", "praying while ill"],
  prophets: ["anbiya", "nabi", "rasul", "prophet"],
  aqeedah: ["aqidah", "creed", "belief", "iman"],
  learnDua: ["learn dua", "dua guide", "how to make dua"],
  travel: ["musafir", "journey", "travelling salah"],
  hajj: ["umrah", "pilgrimage", "haj"],
  seerah: ["sirah", "seera", "prophet biography", "life of prophet"],
  events: ["islamic events", "occasions"],
  sahaba: ["companions", "sahabat", "ashab"],
  history: ["islamic history"],
  laylatAlQadr: ["laylatul qadr", "night of power", "night of decree", "qadr"],
  eid: ["eidain", "eid ul fitr", "eid ul adha"],
  friday: ["jumuah", "jumu'ah", "jumma", "jummah"],
  ruqyah: ["ruqya", "healing", "protection dua"],
  newMuslim: ["convert", "revert", "new to islam"],
  janazah: ["janaza", "funeral", "burial"],
  flashCards: ["flashcards", "quiz", "cards", "practice"],
  qibla: ["kibla", "direction", "direction of prayer"],
  calendar: ["hijri", "islamic calendar", "moon calendar"],
  dateConverter: ["hijri converter", "gregorian", "date convert"],
  zakat: ["zakaat", "zakah"],
  sadaqah: ["sadaqa", "charity", "donation", "sadaqah"],
  fidyah: ["fidya", "fidyaah"],
  finance: ["money", "budget", "spending"],
  achievements: ["badges", "awards", "trophies"],
  stats: ["statistics", "progress", "analytics"],
};

export type LibrarySearchEntry = LibraryMenuDef & { label: string };

/** Fuzzy index over Library menu labels + spelling aliases. */
export function createLibraryMenuSearch(
  items: LibrarySearchEntry[],
): FuzzyIndex<LibrarySearchEntry> {
  return createFuzzyIndex(items, [
    { key: "label", weight: 5, get: (entry) => entry.label },
    {
      key: "aliases",
      weight: 4,
      get: (entry) => (LIBRARY_SEARCH_ALIASES[entry.id] ?? []).join(" "),
    },
  ]);
}
