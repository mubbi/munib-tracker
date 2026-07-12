/**
 * Learn-guide Fuse indexes — kept in a separate module so light search helpers
 * (duas/zikr/names/…) can load without pulling ~700 KB of English guide corpora
 * into the initial module graph. Loaded via `import()` from
 * {@link searchLightWithGuides}.
 */

import { AQEDAH_TOPICS } from "@munib-tracker/shared/content/aqeedah";
import { BATTLES_TOPICS } from "@munib-tracker/shared/content/battles";
import { JAHANNAM_TOPICS } from "@munib-tracker/shared/content/jahannam";
import { JANNAH_TOPICS } from "@munib-tracker/shared/content/jannah";
import { LAST_DAY_TOPICS } from "@munib-tracker/shared/content/last-day";
import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content/learn-dua";
import { PROPHETS_TOPICS } from "@munib-tracker/shared/content/prophets";
import { QURAN_GUIDE_TOPICS } from "@munib-tracker/shared/content/quran-guide";
import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/salah-guide";
import { TAHARAH_TOPICS } from "@munib-tracker/shared/content/taharah";
import type Fuse from "fuse.js";

import {
  type FuseDoc,
  type FuzzyField,
  fusePattern,
  fuseSearch,
  makeFuse,
} from "@/lib/search-fuse";
import type { SearchResult } from "@/lib/search-types";

type GuideTopic = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  actions?: string[];
  hub?: string;
  section?: string;
  journey?: string;
  steps?: { title: string; body: string }[];
  battleDetails?: {
    location?: string;
    outcome?: string;
    keyEvents?: string[];
  };
  profile?: {
    nation?: string;
    mission?: string;
    lessons?: string[];
  };
  misconceptions?: string[];
  phrases?: { title: string; translation: string; arabic: string }[];
  sources?: string[];
};

let jannahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let jahannamFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let lastDayFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let salahGuideFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let battlesFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let taharahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let prophetsFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let aqeedahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let learnDuaFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let quranGuideFuse: Fuse<FuseDoc<GuideTopic>> | null = null;

const BASE_FIELDS: FuzzyField<GuideTopic>[] = [
  { key: "title", weight: 5, get: (t) => t.title },
  { key: "summary", weight: 4, get: (t) => t.summary },
  { key: "body", weight: 2, get: (t) => t.body.join(" ") },
  { key: "actions", weight: 2, get: (t) => (t.actions ?? []).join(" ") },
];

function getJannahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!jannahFuse) {
    jannahFuse = makeFuse(JANNAH_TOPICS as GuideTopic[], BASE_FIELDS);
  }
  return jannahFuse;
}

function getJahannamFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!jahannamFuse) {
    jahannamFuse = makeFuse(JAHANNAM_TOPICS as GuideTopic[], BASE_FIELDS);
  }
  return jahannamFuse;
}

function getLastDayFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!lastDayFuse) {
    lastDayFuse = makeFuse(LAST_DAY_TOPICS as GuideTopic[], BASE_FIELDS);
  }
  return lastDayFuse;
}

function getSalahGuideFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!salahGuideFuse) {
    salahGuideFuse = makeFuse(SALAH_GUIDE_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      {
        key: "steps",
        weight: 2,
        get: (t) => (t.steps ?? []).map((s) => `${s.title} ${s.body}`).join(" "),
      },
    ]);
  }
  return salahGuideFuse;
}

function getBattlesFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!battlesFuse) {
    battlesFuse = makeFuse(BATTLES_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      {
        key: "battleDetails",
        weight: 2,
        get: (t) =>
          t.battleDetails
            ? [
                t.battleDetails.location,
                t.battleDetails.outcome,
                ...(t.battleDetails.keyEvents ?? []),
              ]
                .filter(Boolean)
                .join(" ")
            : "",
      },
    ]);
  }
  return battlesFuse;
}

function getTaharahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!taharahFuse) {
    taharahFuse = makeFuse(TAHARAH_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      {
        key: "steps",
        weight: 2,
        get: (t) => (t.steps ?? []).map((s) => `${s.title} ${s.body}`).join(" "),
      },
    ]);
  }
  return taharahFuse;
}

function getProphetsFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!prophetsFuse) {
    prophetsFuse = makeFuse(PROPHETS_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      {
        key: "profile",
        weight: 2,
        get: (t) =>
          t.profile
            ? [t.profile.nation, t.profile.mission, ...(t.profile.lessons ?? [])]
                .filter(Boolean)
                .join(" ")
            : "",
      },
    ]);
  }
  return prophetsFuse;
}

function getAqeedahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!aqeedahFuse) {
    aqeedahFuse = makeFuse(AQEDAH_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      { key: "misconceptions", weight: 2, get: (t) => (t.misconceptions ?? []).join(" ") },
    ]);
  }
  return aqeedahFuse;
}

function getLearnDuaFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!learnDuaFuse) {
    learnDuaFuse = makeFuse(LEARN_DUA_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      {
        key: "phrases",
        weight: 2,
        get: (t) =>
          (t.phrases ?? []).map((p) => `${p.title} ${p.translation} ${p.arabic}`).join(" "),
      },
    ]);
  }
  return learnDuaFuse;
}

function getQuranGuideFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!quranGuideFuse) {
    quranGuideFuse = makeFuse(QURAN_GUIDE_TOPICS as GuideTopic[], [
      ...BASE_FIELDS,
      { key: "sources", weight: 1, get: (t) => (t.sources ?? []).join(" ") },
    ]);
  }
  return quranGuideFuse;
}

/** Fuzzy-ranked Journey to Jannah topics for screen-local filters. */
export function searchJannahList(query: string, limit?: number): GuideTopic[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  return getJannahFuse()
    .search(pattern, limit ? { limit } : undefined)
    .map((match) => match.item.item);
}

/** Fuzzy-ranked Understanding Jahannam topics for screen-local filters. */
export function searchJahannamList(query: string, limit?: number): GuideTopic[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  return getJahannamFuse()
    .search(pattern, limit ? { limit } : undefined)
    .map((match) => match.item.item);
}

function mapGuide(
  fuse: Fuse<FuseDoc<GuideTopic>>,
  query: string,
  limit: number,
  category: SearchResult["category"],
  href: SearchResult["href"],
  badgeOf: (item: GuideTopic) => string | undefined,
): { results: SearchResult[]; total: number } {
  return fuseSearch(fuse, query, limit, (item) => ({
    key: `${category}:${item.id}`,
    category,
    title: item.title,
    subtitle: item.summary,
    badge: badgeOf(item),
    href,
    params: { topic: item.id },
  }));
}

/** Guide-category hits for universal light search. */
export function searchGuideGroups(
  query: string,
  perGroupLimit: number,
): Record<
  | "jannah"
  | "jahannam"
  | "lastDay"
  | "salahGuide"
  | "battles"
  | "taharah"
  | "prophets"
  | "aqeedah"
  | "learnDua"
  | "learnQuran",
  { results: SearchResult[]; total: number }
> {
  return {
    jannah: mapGuide(
      getJannahFuse(),
      query,
      perGroupLimit,
      "jannah",
      "/jannah/[topic]",
      (t) => t.hub,
    ),
    jahannam: mapGuide(
      getJahannamFuse(),
      query,
      perGroupLimit,
      "jahannam",
      "/jahannam/[topic]",
      (t) => t.section,
    ),
    lastDay: mapGuide(
      getLastDayFuse(),
      query,
      perGroupLimit,
      "lastDay",
      "/last-day/[topic]",
      (t) => t.section,
    ),
    salahGuide: mapGuide(
      getSalahGuideFuse(),
      query,
      perGroupLimit,
      "salahGuide",
      "/salah-guide/[topic]",
      (t) => t.journey,
    ),
    battles: mapGuide(
      getBattlesFuse(),
      query,
      perGroupLimit,
      "battles",
      "/battles/[topic]",
      (t) => t.section,
    ),
    taharah: mapGuide(
      getTaharahFuse(),
      query,
      perGroupLimit,
      "taharah",
      "/taharah/[topic]",
      (t) => t.section,
    ),
    prophets: mapGuide(
      getProphetsFuse(),
      query,
      perGroupLimit,
      "prophets",
      "/prophets/[topic]",
      (t) => t.section,
    ),
    aqeedah: mapGuide(
      getAqeedahFuse(),
      query,
      perGroupLimit,
      "aqeedah",
      "/aqeedah/[topic]",
      (t) => t.section,
    ),
    learnDua: mapGuide(
      getLearnDuaFuse(),
      query,
      perGroupLimit,
      "learnDua",
      "/learn-dua/[topic]",
      (t) => t.section,
    ),
    learnQuran: mapGuide(
      getQuranGuideFuse(),
      query,
      perGroupLimit,
      "learnQuran",
      "/learn-quran/[topic]",
      (t) => t.journey,
    ),
  };
}
