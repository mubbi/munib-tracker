import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";

import type { AppIcon } from "@/lib/names-of-allah-ui";

/**
 * Presentation helpers for the Duas section: category taxonomy + icons, occasion
 * grouping inside a category, time-of-day suggestions and the dua of the day.
 *
 * Pure functions only — nothing here edits dua *content*. Headings are tidied
 * for display (the Hisnul Muslim source numbers repeated chapter headings as
 * "… #3" and uses scholarly transliteration marks), the scripture fields are
 * never touched.
 */

/** Canonical display order (also the order duas are numbered in). */
export const DUA_CATEGORY_IDS: readonly DuaCategoryId[] = [
  "morning_evening",
  "sleep",
  "prayer",
  "forgiveness",
  "distress",
  "protection",
  "quranic",
  "food",
  "home",
  "travel",
  "family",
  "illness",
  "weather",
  "hajj",
  "purification",
  "social",
];

export function isDuaCategoryId(value: unknown): value is DuaCategoryId {
  return typeof value === "string" && (DUA_CATEGORY_IDS as readonly string[]).includes(value);
}

// ── Topics (cross-occasion shortcuts inside a category) ──────────────────────

/**
 * A curated slice of one category that other screens deep-link to, e.g. Family
 * ties → "Duas for the deceased" (`/dua/illness?topic=deceased`). Ids are the
 * Hisnul Muslim numbers from the generated corpus (asserted in tests).
 */
export interface DuaTopic {
  categoryId: DuaCategoryId;
  ids: readonly string[];
}

export const DUA_TOPICS = {
  // Hisnul Muslim #155–165 except #162 (condolence, said to the bereaved):
  // closing the eyes, the funeral prayer (adult + child), burial, visiting graves.
  deceased: {
    categoryId: "illness",
    ids: [
      "hisn-155",
      "hisn-156",
      "hisn-157",
      "hisn-158",
      "hisn-159",
      "hisn-160",
      "hisn-161",
      "hisn-163",
      "hisn-164",
      "hisn-165",
    ],
  },
} as const satisfies Record<string, DuaTopic>;

export type DuaTopicId = keyof typeof DUA_TOPICS;

export function isDuaTopicId(value: unknown): value is DuaTopicId {
  return typeof value === "string" && Object.hasOwn(DUA_TOPICS, value);
}

/** The topic's duas in corpus order, or `items` unchanged when the topic belongs elsewhere. */
export function filterDuasByTopic<T extends Pick<DuaItem, "id" | "categoryId">>(
  items: readonly T[],
  topicId: DuaTopicId,
): T[] {
  const topic: DuaTopic = DUA_TOPICS[topicId];
  const ids = new Set(topic.ids);
  return items.filter((item) => item.categoryId === topic.categoryId && ids.has(item.id));
}

export const DUA_CATEGORY_ICONS: Record<DuaCategoryId, AppIcon> = {
  morning_evening: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  sleep: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
  prayer: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  forgiveness: {
    ios: "hands.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  distress: {
    ios: "figure.mind.and.body",
    android: "self_improvement",
    web: "self_improvement",
  },
  protection: { ios: "shield.fill", android: "shield", web: "shield" },
  quranic: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  food: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  home: { ios: "house.fill", android: "home", web: "home" },
  travel: { ios: "airplane", android: "flight", web: "flight" },
  family: {
    ios: "figure.2.and.child.holdinghands",
    android: "family_restroom",
    web: "family_restroom",
  },
  illness: { ios: "cross.case.fill", android: "medical_services", web: "medical_services" },
  weather: { ios: "cloud.sun.fill", android: "cloud", web: "cloud" },
  hajj: { ios: "mappin.and.ellipse", android: "location_on", web: "location_on" },
  purification: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  social: { ios: "person.2.fill", android: "groups", web: "groups" },
};

import type { CategoryHueKey } from "@/constants/theme";

/** Hue keys resolved to colours by the UI (`accent` follows the user's accent). */
export type DuaGroupHue = CategoryHueKey;

export type DuaCategoryGroupId = "daily" | "worship" | "heart" | "people";

export interface DuaCategoryGroup {
  id: DuaCategoryGroupId;
  hue: DuaGroupHue;
  icon: AppIcon;
  categories: readonly DuaCategoryId[];
}

/**
 * Life-moment groups for the hub (the pattern Hisnul Muslim / Muslim Pro style
 * apps use): people look for "what do I say when…", not for a flat A–Z list.
 * Every category appears in exactly one group (asserted in tests).
 */
export const DUA_CATEGORY_GROUPS: readonly DuaCategoryGroup[] = [
  {
    id: "daily",
    hue: "dawn",
    icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    categories: ["morning_evening", "sleep", "food", "home", "purification", "weather"],
  },
  {
    id: "worship",
    hue: "accent",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    categories: ["prayer", "quranic", "forgiveness", "hajj"],
  },
  {
    id: "heart",
    hue: "sky",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    categories: ["distress", "protection", "illness"],
  },
  {
    id: "people",
    hue: "rose",
    icon: { ios: "person.2.fill", android: "groups", web: "groups" },
    categories: ["family", "social", "travel"],
  },
];

const GROUP_BY_CATEGORY = new Map<DuaCategoryId, DuaCategoryGroup>(
  DUA_CATEGORY_GROUPS.flatMap((group) => group.categories.map((id) => [id, group] as const)),
);

export function duaCategoryGroup(categoryId: DuaCategoryId): DuaCategoryGroup {
  return GROUP_BY_CATEGORY.get(categoryId) ?? DUA_CATEGORY_GROUPS[0];
}

// ── Headings ────────────────────────────────────────────────────────────────

/** Trailing "#3" the source appends to repeated chapter headings. */
const SEQUENCE_SUFFIX = /\s*#\s*(\d+)\s*$/;

/**
 * Hisnul Muslim's English headings use scholarly transliteration (Ŝalâh, Athân,
 * Du'â). Fold the marks and align the app's standard spellings so headings read
 * like the rest of the UI. Display-only; the source heading is unchanged.
 */
const HEADING_TERMS: ReadonlyArray<[RegExp, string]> = [
  [/\bAthan\b/g, "Adhan"],
  [/\bDu'a\b/g, "Dua"],
  [/\bSalat\b/g, "Salah"],
];

function foldMarks(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Display heading without its "#N" suffix and with tidy spelling. */
export function formatDuaHeading(title: string): string {
  let out = foldMarks(title.replace(SEQUENCE_SUFFIX, ""));
  for (const [pattern, replacement] of HEADING_TERMS) out = out.replace(pattern, replacement);
  return out
    .replace(/,?\s*\betc\b\.*\s*/gi, " ")
    .replace(/\s*\.{2,}\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The "occasion" a dua belongs to — the Hisnul chapter when the builder keeps
 * one, else its heading without the sequence suffix. Duas sharing an occasion
 * are shown together under one header.
 */
export function duaOccasion(item: Pick<DuaItem, "title" | "chapter">): string {
  return formatDuaHeading(item.chapter ?? item.title);
}

/**
 * Short chip label for an occasion: drops the "Supplication(s) said…" lead-in
 * and parenthetical glosses ("While bowing in Salah (Ruku')" → "While bowing in
 * Salah"). Section headers keep the full heading.
 */
export function shortOccasionLabel(occasion: string): string {
  const stripped = occasion
    .replace(
      /^(?:supplications?|remembrances?)(?:\s+(?:said|to be said|related to|for|when|at|while))?\s+/i,
      (match) => {
        // Keep the preposition: "Supplication when wearing clothes" → "When wearing clothes".
        const prep = /\s(when|at|while|for)\s+$/i.exec(match)?.[1];
        return prep ? `${prep} ` : "";
      },
    )
    .replace(/^the\s+/i, "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();
  const label = stripped.length > 0 ? stripped : occasion;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// ── Grouping inside a category ───────────────────────────────────────────────

export interface DuaSection {
  /** Stable key (the occasion, or a run key for untitled runs). */
  key: string;
  /** Occasion heading — null for a run of one-off duas (each row shows its own title). */
  title: string | null;
  items: DuaItem[];
}

/**
 * Groups a category's duas by occasion, keeping corpus order. Occasions with two
 * or more duas get a titled section; consecutive one-off duas are collected into
 * an untitled run so the list doesn't become a header per row.
 */
export function groupDuasByOccasion(items: readonly DuaItem[]): DuaSection[] {
  const byOccasion = new Map<string, DuaItem[]>();
  for (const item of items) {
    const occasion = duaOccasion(item);
    const bucket = byOccasion.get(occasion);
    if (bucket) bucket.push(item);
    else byOccasion.set(occasion, [item]);
  }

  const sections: DuaSection[] = [];
  let run: DuaItem[] = [];
  const flushRun = () => {
    if (run.length === 0) return;
    sections.push({ key: `run:${run[0].id}`, title: null, items: run });
    run = [];
  };
  for (const [occasion, bucket] of byOccasion) {
    if (bucket.length === 1) {
      run.push(bucket[0]);
      continue;
    }
    flushRun();
    sections.push({ key: occasion, title: occasion, items: bucket });
  }
  flushRun();
  return sections;
}

// ── Navigation inside a category ─────────────────────────────────────────────

export interface DuaNeighbors {
  previous?: DuaItem;
  next?: DuaItem;
  /** 1-based position within the category (browse order). */
  position: number;
  total: number;
  /** Position within its occasion when that occasion has several duas. */
  occasion?: { title: string; position: number; total: number };
}

/**
 * Previous / next dua in the same category, walking the exact order the
 * category screen lists them (occasion-grouped), so "Next" never jumps around.
 */
export function duaNeighbors(items: readonly DuaItem[], id: string): DuaNeighbors | null {
  const target = items.find((item) => item.id === id);
  if (!target) return null;
  const sections = groupDuasByOccasion(
    items.filter((item) => item.categoryId === target.categoryId),
  );
  const ordered = sections.flatMap((section) => section.items);
  const index = ordered.findIndex((item) => item.id === id);
  const section = sections.find((s) => s.items.some((item) => item.id === id));
  const occasionIndex = section?.items.findIndex((item) => item.id === id) ?? -1;
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
    position: index + 1,
    total: ordered.length,
    occasion:
      section?.title != null && occasionIndex >= 0
        ? { title: section.title, position: occasionIndex + 1, total: section.items.length }
        : undefined,
  };
}

// ── Suggestions ──────────────────────────────────────────────────────────────

export type DuaMoment = "morning" | "midday" | "evening" | "night";

export interface DuaMomentSuggestion {
  moment: DuaMoment;
  categoryId: DuaCategoryId;
  icon: AppIcon;
}

/**
 * Time-of-day suggestion for the hub's "Suggested now" card. Coarse local-hour
 * windows (not prayer-time maths) — it is a shortcut, not a ruling.
 */
export function duaMomentFor(date: Date): DuaMomentSuggestion {
  const hour = date.getHours();
  if (hour >= 3 && hour < 11) {
    return {
      moment: "morning",
      categoryId: "morning_evening",
      icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
    };
  }
  if (hour >= 11 && hour < 15) {
    return {
      moment: "midday",
      categoryId: "prayer",
      icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    };
  }
  if (hour >= 15 && hour < 21) {
    return {
      moment: "evening",
      categoryId: "morning_evening",
      icon: { ios: "sunset.fill", android: "nights_stay", web: "nights_stay" },
    };
  }
  return {
    moment: "night",
    categoryId: "sleep",
    icon: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
  };
}

/** Local calendar day number — stable for the whole local day. */
function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/**
 * Deterministic "dua of the day": rotates daily through duas that carry a
 * transliteration (readable for everyone), falling back to the whole corpus.
 */
export function duaOfTheDay(items: readonly DuaItem[], date: Date): DuaItem | undefined {
  if (items.length === 0) return undefined;
  const readable = items.filter((item) => item.transliteration);
  const pool = readable.length > 0 ? readable : items;
  // Multiply by a prime so consecutive days don't walk adjacent (same-topic) duas.
  const index = (localDayNumber(date) * 7919) % pool.length;
  return pool[index];
}
