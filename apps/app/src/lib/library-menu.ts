import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import { isTV } from "@/lib/platform/is-tv";
import { createFuzzyIndex, type FuzzyIndex } from "@/lib/search";
import { useStore } from "@/stores/create-store";
import { devicePreferencesStore } from "@/stores/device-preferences-store";

import type { AppIcon } from "./names-of-allah-ui";
import {
  assertLibraryMenuParity,
  QUICK_ACTION_META,
  QUICK_ACTION_ROUTES,
  TV_HIDDEN_QUICK_ACTION_IDS,
} from "./quick-actions";

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
  fromQuickAction("quranPractice", "read"),
  fromQuickAction("quranNotes", "read"),
  fromQuickAction("quranRoots", "read"),
  fromQuickAction("verseDetector", "read"),
  fromQuickAction("hadith", "read"),
  fromQuickAction("bookmarks", "read"),
  // NF-3.18 group khatm (circles).
  fromQuickAction("khatmGroups", "read"),
  fromQuickAction("duas", "supplicate"),
  fromQuickAction("zikr", "supplicate"),
  fromQuickAction("adhkarBuilder", "supplicate"),
  fromQuickAction("duroods", "supplicate"),
  fromQuickAction("names", "supplicate"),
  // Track: devotionals first; checklist/schedule last (also on the Tracker tab).
  fromQuickAction("qaza", "track"),
  fromQuickAction("tasbeeh", "track"),
  fromQuickAction("ramadan", "track"),
  fromQuickAction("voluntaryFasting", "track"),
  fromQuickAction("rawatib", "track"),
  fromQuickAction("sunnahHabits", "track"),
  fromQuickAction("dhulHijjah", "track"),
  fromQuickAction("umrahMode", "track"),
  fromQuickAction("tahajjud", "track"),
  fromQuickAction("journal", "track"),
  fromQuickAction("muhasabah", "track"),
  fromQuickAction("familyTies", "track"),
  // NF-3.17 accountability partner (circles).
  fromQuickAction("partner", "track"),
  // NF-3.16 family & kids mode (circles).
  fromQuickAction("family", "track"),
  fromQuickAction("coach", "track"),
  fromQuickAction("checklist", "track"),
  fromQuickAction("schedule", "track"),
  fromQuickAction("salahGuide", "learn"),
  fromQuickAction("jannah", "learn"),
  fromQuickAction("goodCharacter", "learn"),
  fromQuickAction("lastDay", "learn"),
  fromQuickAction("heavyOnTheScale", "learn"),
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
  fromQuickAction("whiteDays", "learn"),
  fromQuickAction("ruqyah", "learn"),
  fromQuickAction("newMuslim", "learn"),
  fromQuickAction("janazah", "learn"),
  fromQuickAction("flashCards", "learn"),
  // Tools & more — Qibla first (high-frequency worship tool).
  fromQuickAction("qibla", "more"),
  // NF-3.13 Salah focus lock.
  fromQuickAction("focusLock", "more"),
  fromQuickAction("masjids", "more"),
  fromQuickAction("calendar", "more"),
  fromQuickAction("dateConverter", "more"),
  fromQuickAction("lastThirdNight", "more"),
  fromQuickAction("zakat", "more"),
  fromQuickAction("sadaqah", "more"),
  fromQuickAction("fidyah", "more"),
  fromQuickAction("debts", "more"),
  fromQuickAction("wasiyyah", "more"),
  // NF-3.10 Mirath: a calculator, so Tools (beside the will it links to); its
  // basis, evidence and school differences are explained inside the results.
  fromQuickAction("mirath", "more"),
  fromQuickAction("finance", "more"),
  fromQuickAction("achievements", "more"),
  fromQuickAction("stats", "more"),
];

assertLibraryMenuParity(LIBRARY_MENU_META.map((entry) => entry.id));

/**
 * D-UX5: finance tools — private figures and D-pad numeric entry — are hidden
 * on TV by default. The TV-only setting "Show finance tools"
 * (`devices.tv.financeTools`, device-scoped) brings them back. Debts and the
 * wasiyyah stay hidden regardless (`TV_HIDDEN_QUICK_ACTION_IDS`).
 */
export const TV_FINANCE_TOOL_IDS: ReadonlySet<string> = new Set([
  "zakat",
  "sadaqah",
  "fidyah",
  "finance",
  "mirath",
]);

/** What the current device may show (TV lean-back scope, D-UX5). */
export interface DestinationScope {
  tv: boolean;
  /** TV: the "Show finance tools" setting. Ignored off TV. */
  showFinanceTools: boolean;
}

/** True when a Library / Explore destination id is hidden on this device. */
export function isDestinationHidden(id: string, scope: DestinationScope): boolean {
  if (!scope.tv) return false;
  if (TV_HIDDEN_QUICK_ACTION_IDS.has(id)) return true;
  return !scope.showFinanceTools && TV_FINANCE_TOOL_IDS.has(id);
}

/** Drops the destinations this device hides (Library menu, Explore grid, order editors). */
export function filterDestinationsForDevice<T extends { id: string }>(
  items: readonly T[],
  scope: DestinationScope,
): T[] {
  return scope.tv ? items.filter((item) => !isDestinationHidden(item.id, scope)) : [...items];
}

/** Library entries visible on this device (the Library menu and its search). */
export function libraryMenuForDevice(scope: DestinationScope): LibraryMenuDef[] {
  return filterDestinationsForDevice(LIBRARY_MENU_META, scope);
}

/** Root route of each TV-gated finance tool (`/zakat` …). */
const TV_FINANCE_TOOL_PATHS: ReadonlyMap<string, LibraryMenuDef> = new Map(
  LIBRARY_MENU_META.filter((entry) => TV_FINANCE_TOOL_IDS.has(entry.id)).map((entry) => [
    String(entry.route),
    entry,
  ]),
);

/**
 * The hidden finance tool a route opens on this device (a deep link or a stale
 * shortcut to `/zakat` while the setting is off), else `null`. Accepts a
 * pathname (`/zakat`) or a stack route name (`zakat/index`). Only the tool
 * screens are gated: guide topics (`/zakat/[topic]`) are learning content and
 * stay reachable from search.
 */
export function hiddenFinanceToolForRoute(
  route: string,
  scope: DestinationScope,
): LibraryMenuDef | null {
  if (!scope.tv || scope.showFinanceTools) return null;
  const trimmed = route
    .replace(/^\/+/, "")
    .replace(/(^|\/)index$/, "")
    .replace(/\/+$/, "");
  return TV_FINANCE_TOOL_PATHS.get(`/${trimmed}`) ?? null;
}

/** Reactive TV "Show finance tools" value (device preference; default off). */
export function useShowTvFinanceTools(): boolean {
  return useStore(devicePreferencesStore, (s) => s.prefs.tvShowFinanceTools === true);
}

/** Reactive {@link DestinationScope} for the running device. */
export function useDestinationScope(): DestinationScope {
  const showFinanceTools = useShowTvFinanceTools();
  return { tv: isTV(), showFinanceTools };
}

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

/** The six primary destinations shown as tiles above the section lists (P5-32). */
export const LIBRARY_PRIMARY_IDS = [
  "quran",
  "hadith",
  "duas",
  "zikr",
  "names",
  "bookmarks",
] as const;

/** Learn is shown in five themed sub-groups instead of one flat list of 28. */
export interface LearnSubgroup {
  id: string;
  titleKey: string;
  descriptionKey: string;
  ids: readonly string[];
}

export const LEARN_SUBGROUPS: readonly LearnSubgroup[] = [
  {
    id: "worship",
    titleKey: "library.learnGroup.worship",
    descriptionKey: "library.learnGroup.worshipDesc",
    ids: ["salahGuide", "taharah", "hayd", "sick", "travel", "janazah"],
  },
  {
    id: "quranDua",
    titleKey: "library.learnGroup.quranDua",
    descriptionKey: "library.learnGroup.quranDuaDesc",
    ids: ["learnQuran", "learnDua", "ruqyah", "flashCards"],
  },
  {
    id: "faith",
    titleKey: "library.learnGroup.faith",
    descriptionKey: "library.learnGroup.faithDesc",
    ids: [
      "aqeedah",
      "goodCharacter",
      "newMuslim",
      "lastDay",
      "heavyOnTheScale",
      "jannah",
      "jahannam",
    ],
  },
  {
    id: "history",
    titleKey: "library.learnGroup.history",
    descriptionKey: "library.learnGroup.historyDesc",
    ids: ["seerah", "prophets", "sahaba", "battles", "history", "events"],
  },
  {
    id: "times",
    titleKey: "library.learnGroup.times",
    descriptionKey: "library.learnGroup.timesDesc",
    ids: ["hajj", "laylatAlQadr", "eid", "friday", "whiteDays"],
  },
];

/**
 * Splits the Learn entries into their sub-groups (menu order kept inside a
 * group). Entries no sub-group claims land in a trailing group so a destination
 * added later is never unreachable.
 */
export function groupLearnEntries<T extends { id: string }>(
  entries: readonly T[],
): { group: LearnSubgroup; entries: T[] }[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const claimed = new Set<string>();
  const out: { group: LearnSubgroup; entries: T[] }[] = [];
  for (const group of LEARN_SUBGROUPS) {
    const rows = group.ids.flatMap((id) => {
      const entry = byId.get(id);
      if (!entry) return [];
      claimed.add(id);
      return [entry];
    });
    if (rows.length > 0) out.push({ group, entries: rows });
  }
  const rest = entries.filter((entry) => !claimed.has(entry.id));
  if (rest.length > 0) {
    out.push({
      group: {
        id: "other",
        titleKey: "library.learnGroup.other",
        descriptionKey: "library.learnGroup.otherDesc",
        ids: rest.map((entry) => entry.id),
      },
      entries: rest,
    });
  }
  return out;
}

/**
 * Rows a single-column Library section (or the selected Learn group) shows
 * before its "See all (N)" header action. Every section uses the same pattern —
 * none is collapsible.
 */
export const LIBRARY_SECTION_PREVIEW = 5;

/** Rows shown before "See all" — three grid rows once a section lays out in columns. */
export function libraryPreviewLimit(columns: number): number {
  return columns <= 1 ? LIBRARY_SECTION_PREVIEW : columns * 3;
}

/** Content width at which a section's rows (and Learn chips) go multi-column. */
const LIBRARY_TWO_COLUMN_WIDTH = 768;
const LIBRARY_THREE_COLUMN_WIDTH = 1200;
/** Content width at which the six primary tiles fit on one row. */
const LIBRARY_TILE_ROW_WIDTH = 600;

/**
 * Columns of slim rows inside each Library section card, by the content width
 * (window width minus any native tablet rail; the web thresholds allow for its
 * rail): one on phones, two on tablets, three on wide desktop. TV: three.
 */
export function librarySectionColumns(contentWidth: number, tv = false): number {
  if (tv) return 3;
  if (contentWidth >= LIBRARY_THREE_COLUMN_WIDTH) return 3;
  if (contentWidth >= LIBRARY_TWO_COLUMN_WIDTH) return 2;
  return 1;
}

/** Primary destination tiles per row: a 3×2 grid on phones, one row of six when it fits (and TV). */
export function libraryTileColumns(contentWidth: number, tv = false): number {
  if (tv || contentWidth >= LIBRARY_TILE_ROW_WIDTH) return LIBRARY_PRIMARY_IDS.length;
  return 3;
}

/**
 * Library tab section order (D13, `UserPreferences.libraryMenuOrder`): the
 * user's order first, unknown ids dropped (and duplicates ignored), then any
 * section the saved order doesn't mention — e.g. one added in a later release —
 * appended in its default relative position.
 */
export function orderLibrarySections<T extends { id: string }>(
  sections: readonly T[],
  order: readonly string[] | undefined,
): T[] {
  if (!order || order.length === 0) return [...sections];
  const byId = new Map(sections.map((section) => [section.id, section]));
  const out: T[] = [];
  for (const id of order) {
    const section = byId.get(id);
    if (section && !out.includes(section)) out.push(section);
  }
  for (const section of sections) {
    if (!out.includes(section)) out.push(section);
  }
  return out;
}

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
  quranPractice: [
    "practice",
    "recite",
    "recitation",
    "revision",
    "hifz",
    "memorize",
    "tajweed practice",
  ],
  quranNotes: ["notes", "my notes", "reflection", "tadabbur", "highlight", "annotation", "tags"],
  quranRoots: ["root", "roots", "word root", "arabic root", "jidhr", "morphology", "lemma"],
  hadith: ["hadeeth", "ahadith", "hadiths"],
  verseDetector: ["verse", "ayah", "ayat", "detector", "recognize verse"],
  bookmarks: ["saved", "favorites", "favourite"],
  qaza: ["qada", "qadha", "qadah", "missed salah", "makeup salah", "make up"],
  tasbeeh: ["tasbih", "tasbi", "counter", "beads"],
  ramadan: ["ramazan", "ramadhan"],
  voluntaryFasting: [
    "nafl fasting",
    "sunnah fasting",
    "voluntary fast",
    "monday thursday",
    "arafah",
    "ashura",
    "shawwal six",
    "sawm",
    "roza",
  ],
  tahajjud: ["night prayer", "qiyam"],
  lastThirdNight: ["last third", "last third of the night"],
  journal: ["prayer journal", "notes", "diary"],
  muhasabah: [
    "muhasaba",
    "self accountability",
    "self review",
    "nightly reflection",
    "istighfar",
    "repentance",
    "tawbah",
  ],
  partner: [
    "accountability partner",
    "partner",
    "accountability",
    "dua for each other",
    "friend",
    "circle",
  ],
  family: ["family", "kids", "children", "child", "kids mode", "parent", "teach salah", "circle"],
  khatmGroups: [
    "group khatm",
    "khatam",
    "khatm",
    "complete quran together",
    "juz",
    "hizb",
    "quran khani",
  ],
  familyTies: [
    "silat al rahim",
    "silat ar-rahim",
    "sila rahmi",
    "kinship",
    "relatives",
    "family",
    "parents",
    "call mother",
  ],
  focusLock: [
    "focus lock",
    "app blocker",
    "block apps",
    "screen time",
    "do not disturb",
    "distraction",
    "focus mode",
  ],
  coach: ["weekly coach", "weekly reflection", "weekly report", "insights", "tips", "progress"],
  checklist: ["tracker", "daily checklist", "today"],
  schedule: ["prayer times", "salah times", "timetable"],
  salahGuide: ["salat", "namaz", "salah", "prayer guide", "how to pray", "learn prayer"],
  jannah: ["paradise", "heaven", "jannat", "janna", "garden"],
  goodCharacter: [
    "good character",
    "husn al-khuluq",
    "akhlaq",
    "manners",
    "virtue",
    "virtues",
    "character",
  ],
  jahannam: [
    "hell",
    "hellfire",
    "nar",
    "fire",
    "kabair",
    "major sins",
    "destructive sins",
    "mubiqat",
  ],
  lastDay: ["judgment day", "judgement day", "qiyamah", "qiyama", "akhirah", "day of judgment"],
  heavyOnTheScale: [
    "mizan",
    "scale of deeds",
    "heavy on the scale",
    "balance",
    "deeds on the scale",
    "scale",
  ],
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
  whiteDays: [
    "white days",
    "ayyam al bid",
    "ayyam al-bid",
    "ayyam bid",
    "al-bid",
    "bid",
    "sunnah fasting",
    "voluntary fast",
    "13 14 15",
    "monthly fast",
  ],
  ruqyah: ["ruqya", "healing", "protection dua"],
  newMuslim: ["convert", "revert", "new to islam"],
  janazah: ["janaza", "funeral", "burial"],
  flashCards: ["flashcards", "quiz", "cards", "practice"],
  qibla: ["kibla", "direction", "direction of prayer"],
  masjids: ["mosque", "masjid", "nearby", "jumuah", "jummah", "iqamah", "congregation", "jamaat"],
  calendar: ["hijri", "islamic calendar", "moon calendar"],
  dateConverter: ["hijri converter", "gregorian", "date convert"],
  zakat: ["zakaat", "zakah"],
  sadaqah: ["sadaqa", "charity", "donation", "sadaqah"],
  sunnahHabits: [
    "habits",
    "daily sunnah",
    "miswak",
    "siwak",
    "ayat al kursi",
    "surah mulk",
    "istighfar",
    "salam",
  ],
  dhulHijjah: [
    "dhul hijjah",
    "zul hijjah",
    "ten days",
    "arafah",
    "takbir tashriq",
    "udhiyah",
    "qurbani",
    "eid al adha",
  ],
  umrahMode: [
    "umrah",
    "umrah mode",
    "tawaf",
    "tawaf counter",
    "sai",
    "miqat",
    "ihram",
    "talbiyah",
    "halq",
  ],
  fidyah: ["fidya", "fidyaah"],
  debts: ["debt", "dayn", "loan", "loans", "amanah", "trust", "owe", "qarz", "vow", "nadhr"],
  wasiyyah: ["will", "wasiyat", "wasiyya", "testament", "bequest", "last will", "islamic will"],
  mirath: ["inheritance", "faraid", "fara'id", "miras", "virasat", "estate", "heirs", "warisan"],
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
