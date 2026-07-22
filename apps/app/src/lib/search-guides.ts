/**
 * Learn-guide Fuse indexes — kept in a separate module so light search helpers
 * (duas/zikr/names/…) can load without pulling Learn corpora into the initial
 * module graph. Loaded via `import()` from {@link searchLightWithGuides}.
 *
 * All guide hits share category `"learn"` (one universal-search tab).
 */

import { AQEDAH_TOPICS } from "@munib-tracker/shared/content/aqeedah";
import { BATTLES_TOPICS } from "@munib-tracker/shared/content/battles";
import { EID_GUIDE_TOPICS } from "@munib-tracker/shared/content/eid-guide";
import { EXCUSED_GUIDES } from "@munib-tracker/shared/content/excused-guide";
import { FIDYAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/fidyah-guide";
import { FRIDAY_GUIDE_TOPICS } from "@munib-tracker/shared/content/friday-guide";
import { HAJJ_GUIDE_TOPICS } from "@munib-tracker/shared/content/hajj-guide";
import { ISLAMIC_FINANCE_TOPICS } from "@munib-tracker/shared/content/islamic-finance";
import { ISLAMIC_HISTORY_EVENTS } from "@munib-tracker/shared/content/islamic-history";
import { JAHANNAM_TOPICS } from "@munib-tracker/shared/content/jahannam";
import { JANAZAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/janazah-guide";
import { JANNAH_TOPICS } from "@munib-tracker/shared/content/jannah";
import { LAST_DAY_TOPICS } from "@munib-tracker/shared/content/last-day";
import { LAYLAT_AL_QADR_TOPICS } from "@munib-tracker/shared/content/laylat-al-qadr";
import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content/learn-dua";
import { NEW_MUSLIM_TOPICS } from "@munib-tracker/shared/content/new-muslim";
import { PROPHETS_TOPICS } from "@munib-tracker/shared/content/prophets";
import { PROPHETS_GENEALOGY_NODES } from "@munib-tracker/shared/content/prophets-genealogy";
import { QURAN_GUIDE_TOPICS } from "@munib-tracker/shared/content/quran-guide";
import { RUQYAH_TOPICS } from "@munib-tracker/shared/content/ruqyah";
import { SAHABA_PROFILES } from "@munib-tracker/shared/content/sahaba";
import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/salah-guide";
import { SEERAH_EVENTS } from "@munib-tracker/shared/content/seerah";
import { TAHARAH_TOPICS } from "@munib-tracker/shared/content/taharah";
import { TRAVEL_SECTIONS, type TravelSectionKey } from "@munib-tracker/shared/content/travel-guide";
import {
  ZAKAT_GUIDE_SECTIONS,
  type ZakatGuideSectionKey,
} from "@munib-tracker/shared/content/zakat-guide";
import type Fuse from "fuse.js";

import i18n from "@/i18n";
import { type FuseDoc, type FuzzyField, fusePattern, makeFuse } from "@/lib/search-fuse";
import type { SearchHref, SearchResult } from "@/lib/search-types";

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
  name?: string;
  relationNote?: string;
};

type ScoredHit = { score: number; result: SearchResult };

const BASE_FIELDS: FuzzyField<GuideTopic>[] = [
  { key: "title", weight: 5, get: (t) => t.title },
  { key: "summary", weight: 4, get: (t) => t.summary },
  { key: "body", weight: 2, get: (t) => t.body.join(" ") },
  { key: "actions", weight: 2, get: (t) => (t.actions ?? []).join(" ") },
];

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
let ruqyahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let eidFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let fridayFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let newMuslimFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let laylatFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let financeFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let fidyahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let janazahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let prophetsTreeFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let seerahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let historyFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let sahabaFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let hajjFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let travelFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let zakatFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let sadaqahFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let haydFuse: Fuse<FuseDoc<GuideTopic>> | null = null;
let sickFuse: Fuse<FuseDoc<GuideTopic>> | null = null;

/** English UI strings for travel/zakat/excused corpora (matching other Learn English bodies). */
function tEn(key: string): string {
  return i18n.getFixedT("en")(key);
}

function getJannahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!jannahFuse) jannahFuse = makeFuse(JANNAH_TOPICS as GuideTopic[], BASE_FIELDS);
  return jannahFuse;
}

function getJahannamFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!jahannamFuse) jahannamFuse = makeFuse(JAHANNAM_TOPICS as GuideTopic[], BASE_FIELDS);
  return jahannamFuse;
}

function getLastDayFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!lastDayFuse) lastDayFuse = makeFuse(LAST_DAY_TOPICS as GuideTopic[], BASE_FIELDS);
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

function getRuqyahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!ruqyahFuse) ruqyahFuse = makeFuse(RUQYAH_TOPICS as GuideTopic[], BASE_FIELDS);
  return ruqyahFuse;
}

function getEidFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!eidFuse) eidFuse = makeFuse(EID_GUIDE_TOPICS as GuideTopic[], BASE_FIELDS);
  return eidFuse;
}

function getFridayFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!fridayFuse) fridayFuse = makeFuse(FRIDAY_GUIDE_TOPICS as GuideTopic[], BASE_FIELDS);
  return fridayFuse;
}

function getNewMuslimFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!newMuslimFuse) newMuslimFuse = makeFuse(NEW_MUSLIM_TOPICS as GuideTopic[], BASE_FIELDS);
  return newMuslimFuse;
}

function getLaylatFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!laylatFuse) laylatFuse = makeFuse(LAYLAT_AL_QADR_TOPICS as GuideTopic[], BASE_FIELDS);
  return laylatFuse;
}

function getFinanceFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!financeFuse) financeFuse = makeFuse(ISLAMIC_FINANCE_TOPICS as GuideTopic[], BASE_FIELDS);
  return financeFuse;
}

function getFidyahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!fidyahFuse) fidyahFuse = makeFuse(FIDYAH_GUIDE_TOPICS as GuideTopic[], BASE_FIELDS);
  return fidyahFuse;
}

function getJanazahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!janazahFuse) janazahFuse = makeFuse(JANAZAH_GUIDE_TOPICS as GuideTopic[], BASE_FIELDS);
  return janazahFuse;
}

function getProphetsTreeFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!prophetsTreeFuse) {
    const topics: GuideTopic[] = PROPHETS_GENEALOGY_NODES.map((n) => ({
      id: n.id,
      title: n.name,
      summary: n.relationNote,
      body: n.sources,
      sources: n.sources,
      name: n.name,
      relationNote: n.relationNote,
    }));
    prophetsTreeFuse = makeFuse(topics, [
      ...BASE_FIELDS,
      { key: "name", weight: 5, get: (t) => t.name },
      { key: "relationNote", weight: 2, get: (t) => t.relationNote },
      { key: "sources", weight: 1, get: (t) => (t.sources ?? []).join(" ") },
    ]);
  }
  return prophetsTreeFuse;
}

function getSeerahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!seerahFuse) {
    seerahFuse = makeFuse(
      SEERAH_EVENTS.map(
        (e): GuideTopic => ({
          id: e.id,
          title: e.title,
          summary: e.location ?? "",
          body: [e.body],
        }),
      ),
      BASE_FIELDS,
    );
  }
  return seerahFuse;
}

function getHistoryFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!historyFuse) {
    historyFuse = makeFuse(
      ISLAMIC_HISTORY_EVENTS.map(
        (e): GuideTopic => ({
          id: e.id,
          title: e.title,
          summary: [e.location, e.era].filter(Boolean).join(" · "),
          body: [e.body],
        }),
      ),
      BASE_FIELDS,
    );
  }
  return historyFuse;
}

function getSahabaFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!sahabaFuse) {
    type SahabaDoc = GuideTopic & { arabic?: string };
    sahabaFuse = makeFuse(
      SAHABA_PROFILES.map(
        (p): SahabaDoc => ({
          id: p.id,
          title: p.name,
          summary: p.summary,
          body: [p.body, p.epithet ?? "", p.lifespan ?? ""].filter(Boolean),
          arabic: p.arabicName,
        }),
      ),
      [...BASE_FIELDS, { key: "arabic", weight: 3, get: (t) => (t as SahabaDoc).arabic }],
    );
  }
  return sahabaFuse;
}

function getHajjFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!hajjFuse) {
    hajjFuse = makeFuse(HAJJ_GUIDE_TOPICS as GuideTopic[], BASE_FIELDS);
  }
  return hajjFuse;
}

function getTravelFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!travelFuse) {
    const topics: GuideTopic[] = [
      {
        id: "hub",
        title: tEn("travel.title"),
        summary: tEn("travel.subtitle"),
        body: [
          tEn("travel.takeaway"),
          ...Array.from({ length: 6 }, (_, i) => tEn(`travel.obligations.${i}`)),
        ],
      },
      ...TRAVEL_SECTIONS.map(
        (key: TravelSectionKey): GuideTopic => ({
          id: key,
          title: tEn(`travel.${key}.title`),
          summary: "",
          body: [tEn(`travel.${key}.body`)],
        }),
      ),
    ];
    travelFuse = makeFuse(topics, BASE_FIELDS);
  }
  return travelFuse;
}

function getZakatFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!zakatFuse) {
    const topics: GuideTopic[] = ZAKAT_GUIDE_SECTIONS.map(
      (key: ZakatGuideSectionKey): GuideTopic => ({
        id: key,
        title: tEn(`zakat.guide.${key}.title`),
        summary: tEn(`zakat.guide.${key}.summary`),
        body: [tEn(`zakat.guide.${key}.body`)],
      }),
    );
    zakatFuse = makeFuse(topics, BASE_FIELDS);
  }
  return zakatFuse;
}

function getSadaqahFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!sadaqahFuse) {
    sadaqahFuse = makeFuse(
      [
        {
          id: "hub",
          title: tEn("sadaqah.title"),
          summary: tEn("sadaqah.subtitle"),
          body: [tEn("sadaqah.intro"), tEn("sadaqah.intentionHint")],
        },
      ],
      BASE_FIELDS,
    );
  }
  return sadaqahFuse;
}

function excusedSectionTopics(
  namespace: "hayd" | "sick",
  sections: readonly string[],
): GuideTopic[] {
  return [
    {
      id: "hub",
      title: tEn(`${namespace}.title`),
      summary: tEn(`${namespace}.subtitle`),
      body: Array.from(
        { length: EXCUSED_GUIDES[namespace === "hayd" ? "hayd" : "sick"].obligationCount },
        (_, i) => tEn(`${namespace}.obligations.${i}`),
      ),
    },
    ...sections.map(
      (key): GuideTopic => ({
        id: key,
        title: tEn(`${namespace}.${key}.title`),
        summary: "",
        body: [tEn(`${namespace}.${key}.body`)],
      }),
    ),
  ];
}

function getHaydFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!haydFuse) {
    haydFuse = makeFuse(
      excusedSectionTopics("hayd", EXCUSED_GUIDES.hayd.extraSections ?? []),
      BASE_FIELDS,
    );
  }
  return haydFuse;
}

function getSickFuse(): Fuse<FuseDoc<GuideTopic>> {
  if (!sickFuse) {
    sickFuse = makeFuse(
      excusedSectionTopics("sick", EXCUSED_GUIDES.sick.extraSections ?? []),
      BASE_FIELDS,
    );
  }
  return sickFuse;
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

function mapScored(
  fuse: Fuse<FuseDoc<GuideTopic>>,
  query: string,
  href: SearchHref,
  sourceBadge: string,
  paramKey: "topic" | "id" | null,
  arabicOf?: (item: GuideTopic) => string | undefined,
): ScoredHit[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  return fuse.search(pattern).map((match) => {
    const item = match.item.item;
    const result: SearchResult = {
      key: `learn:${href}:${item.id}`,
      category: "learn",
      title: item.title,
      subtitle: item.summary || undefined,
      arabic: arabicOf?.(item),
      badge: sourceBadge,
      href,
      params: paramKey ? { [paramKey]: item.id } : undefined,
    };
    return { score: match.score ?? 1, result };
  });
}

/** All Learn-guide hits merged into a single `learn` group (score-ranked). */
export function searchGuideGroups(
  query: string,
  perGroupLimit: number,
): { learn: { results: SearchResult[]; total: number } } {
  const pattern = fusePattern(query);
  if (!pattern) return { learn: { results: [], total: 0 } };

  const hits: ScoredHit[] = [
    ...mapScored(getJannahFuse(), query, "/jannah/[topic]", "Jannah", "topic"),
    ...mapScored(getJahannamFuse(), query, "/jahannam/[topic]", "Jahannam", "topic"),
    ...mapScored(getLastDayFuse(), query, "/last-day/[topic]", "Last Day", "topic"),
    ...mapScored(getSalahGuideFuse(), query, "/salah-guide/[topic]", "Salah", "topic"),
    ...mapScored(getBattlesFuse(), query, "/battles/[topic]", "Battles", "topic"),
    ...mapScored(getTaharahFuse(), query, "/taharah/[topic]", "Purification", "topic"),
    ...mapScored(getProphetsFuse(), query, "/prophets/[topic]", "Prophets", "topic"),
    ...mapScored(getAqeedahFuse(), query, "/aqeedah/[topic]", "Aqeedah", "topic"),
    ...mapScored(getLearnDuaFuse(), query, "/learn-dua/[topic]", "Learn Dua", "topic"),
    ...mapScored(getQuranGuideFuse(), query, "/learn-quran/[topic]", "Learn Qur'an", "topic"),
    ...mapScored(getRuqyahFuse(), query, "/ruqyah/[topic]", "Ruqyah", "topic"),
    ...mapScored(getEidFuse(), query, "/eid/[topic]", "Eid", "topic"),
    ...mapScored(getFridayFuse(), query, "/friday/[topic]", "Friday", "topic"),
    ...mapScored(getNewMuslimFuse(), query, "/new-muslim/[topic]", "New Muslim", "topic"),
    ...mapScored(getLaylatFuse(), query, "/laylat-al-qadr/[topic]", "Laylat al-Qadr", "topic"),
    ...mapScored(getFinanceFuse(), query, "/finance/[topic]", "Finance", "topic"),
    ...mapScored(getFidyahFuse(), query, "/fidyah/[topic]", "Fidyah", "topic"),
    ...mapScored(getJanazahFuse(), query, "/janazah/[topic]", "Janazah", "topic"),
    ...mapScored(getProphetsTreeFuse(), query, "/prophets/tree", "Prophets tree", null),
    ...mapScored(getZakatFuse(), query, "/zakat/[topic]", "Zakat", "topic"),
    ...mapScored(getSadaqahFuse(), query, "/sadaqah", "Sadaqah", null),
    ...mapScored(getSeerahFuse(), query, "/seerah", "Seerah", null),
    ...mapScored(getHistoryFuse(), query, "/history", "History", null),
    ...mapScored(getHajjFuse(), query, "/hajj/[topic]", "Hajj", "topic"),
    ...mapScored(getTravelFuse(), query, "/travel", "Travel", null),
    ...mapScored(getHaydFuse(), query, "/hayd", "Hayd", null),
    ...mapScored(getSickFuse(), query, "/sick", "Illness", null),
    ...mapScored(
      getSahabaFuse(),
      query,
      "/sahaba/[id]",
      "Sahaba",
      "id",
      (item) => (item as GuideTopic & { arabic?: string }).arabic,
    ),
  ];

  hits.sort((a, b) => a.score - b.score);

  return {
    learn: {
      results: hits.slice(0, perGroupLimit).map((h) => h.result),
      total: hits.length,
    },
  };
}
