/**
 * Learn-guide Fuse indexes — kept in a separate module so light search helpers
 * (duas/zikr/names/…) can load without pulling ~700 KB of English guide corpora
 * into the initial module graph. Loaded on first guide search via require().
 */
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { JANNAH_TOPICS } = require("@munib-tracker/shared/content/jannah") as {
      JANNAH_TOPICS: GuideTopic[];
    };
    jannahFuse = makeFuse(JANNAH_TOPICS, BASE_FIELDS);
  }
  return jannahFuse;
}

function getJahannamFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!jahannamFuse) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { JAHANNAM_TOPICS } = require("@munib-tracker/shared/content/jahannam") as {
      JAHANNAM_TOPICS: GuideTopic[];
    };
    jahannamFuse = makeFuse(JAHANNAM_TOPICS, BASE_FIELDS);
  }
  return jahannamFuse;
}

function getLastDayFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!lastDayFuse) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LAST_DAY_TOPICS } = require("@munib-tracker/shared/content/last-day") as {
      LAST_DAY_TOPICS: GuideTopic[];
    };
    lastDayFuse = makeFuse(LAST_DAY_TOPICS, BASE_FIELDS);
  }
  return lastDayFuse;
}

function getSalahGuideFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!salahGuideFuse) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SALAH_GUIDE_TOPICS } = require("@munib-tracker/shared/content/salah-guide") as {
      SALAH_GUIDE_TOPICS: GuideTopic[];
    };
    salahGuideFuse = makeFuse(SALAH_GUIDE_TOPICS, [
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BATTLES_TOPICS } = require("@munib-tracker/shared/content/battles") as {
      BATTLES_TOPICS: GuideTopic[];
    };
    battlesFuse = makeFuse(BATTLES_TOPICS, [
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TAHARAH_TOPICS } = require("@munib-tracker/shared/content/taharah") as {
      TAHARAH_TOPICS: GuideTopic[];
    };
    taharahFuse = makeFuse(TAHARAH_TOPICS, [
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PROPHETS_TOPICS } = require("@munib-tracker/shared/content/prophets") as {
      PROPHETS_TOPICS: GuideTopic[];
    };
    prophetsFuse = makeFuse(PROPHETS_TOPICS, [
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AQEDAH_TOPICS } = require("@munib-tracker/shared/content/aqeedah") as {
      AQEDAH_TOPICS: GuideTopic[];
    };
    aqeedahFuse = makeFuse(AQEDAH_TOPICS, [
      ...BASE_FIELDS,
      { key: "misconceptions", weight: 2, get: (t) => (t.misconceptions ?? []).join(" ") },
    ]);
  }
  return aqeedahFuse;
}

function getLearnDuaFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!learnDuaFuse) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LEARN_DUA_TOPICS } = require("@munib-tracker/shared/content/learn-dua") as {
      LEARN_DUA_TOPICS: GuideTopic[];
    };
    learnDuaFuse = makeFuse(LEARN_DUA_TOPICS, [
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { QURAN_GUIDE_TOPICS } = require("@munib-tracker/shared/content/quran-guide") as {
      QURAN_GUIDE_TOPICS: GuideTopic[];
    };
    quranGuideFuse = makeFuse(QURAN_GUIDE_TOPICS, [
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
