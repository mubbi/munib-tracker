/**
 * Kids-mode content (NF-3.16, D27): a curated subset of the BUNDLED datasets,
 * chosen by reference only — no new kids-specific sources, no hand-typed text,
 * existing audio only. Every id below is checked against the bundled corpus
 * (and for `audioUri`) by `kids-content.test.ts`; the selection and its
 * references are recorded in `docs/proofs/family-kids.md`.
 *
 * Text is always rendered from the dataset (`@munib-tracker/shared/content/*`
 * via `lib/content-loaders.ts`), never from this file.
 */

import type {
  DuaItem,
  ProphetsTopic,
  SalahGuideTopic,
  ZikrItem,
} from "@munib-tracker/shared/types";

/**
 * Hisnul Muslim / curated duas (`DUA_ITEMS` ids), short daily moments a child
 * meets. Only items whose source the corpus grades sahih/hasan — "entering the
 * home" (Abu Dawud 5096, graded da'if) is deliberately left out (proof log §3).
 */
export const KIDS_DUA_IDS = [
  "hisn-1", // Upon waking up — Bukhari 6312
  "hisn-105", // Before sleeping (Bismika Allahumma) — Bukhari 6324 (dataset cites Abu Dawud 5045)
  "hisn-178", // Before eating — Abu Dawud 3767, Tirmidhi 1858
  "daily-after-eating", // After eating — Abu Dawud & Tirmidhi
  "hisn-5", // Wearing clothes — Abu Dawud 4023
  "daily-leaving-home", // Leaving home — Abu Dawud & Tirmidhi
  "hisn-10", // Entering the toilet — Bukhari 142, Muslim 375
  "hisn-11", // Leaving the toilet — Tirmidhi 7, Abu Dawud 30
  "hisn-12", // Starting wudu — Abu Dawud 101
  "hisn-188", // Sneezing — Bukhari 6224
  "hisn-198", // Thanking someone (Jazak Allahu khayran) — Tirmidhi 2035
  "quranic-hasanah", // Rabbana atina — Qur'an 2:201
] as const;

/** Daily adhkar (`ZIKR_ITEMS` ids) — short, with audio. */
export const KIDS_ADHKAR_IDS = [
  "anytime-subhanallah-bihamdihi", // Bukhari & Muslim
  "anytime-istighfar", // Muslim 2702
  "after_prayer-istighfar-three", // Muslim 591
  "before_prayer-taawwudh", // Qur'an 16:98
  "before_sleep-name", // Bukhari 6324
  "before_sleep-tasbih-fatimah", // Bukhari 3705, Muslim 2727
  "evening-refuge", // Muslim
] as const;

/**
 * Short surahs taught first (Juz 'Amma + al-Fatihah). Opened in the normal
 * reader, which uses the existing reciter audio.
 */
export const KIDS_SURAHS = [1, 103, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] as const;

/**
 * Kids salah path (E12, D27): a curated, age-appropriate subset of the bundled
 * Salah guide (`SALAH_GUIDE_TOPICS`), rendered BY ID through
 * {@link kidsSalahTopicView} — summary + procedural steps + madhhab notes only.
 * Order = the path: wudu basics → the five daily Salah → how to pray.
 *
 * Deliberately left out (proof log §5d): taharah/ghusl (janabah, hayd and
 * nifas), tayammum, who-must-pray (hayd/nifas exemption), conditions,
 * pillars/nullifiers, qada and every other adult fiqh topic. Kids mode has no
 * hayd UI (plan NF-3.16 "Excused").
 */
export const KIDS_SALAH_TOPIC_IDS = ["wudu", "prayer-times", "how-to-pray"] as const;
export type KidsSalahTopicId = (typeof KIDS_SALAH_TOPIC_IDS)[number];

/**
 * Prophets for kids (E12, D27): the bundled biographies (`PROPHETS_BIO_TOPICS`)
 * suitable for children, by id, in the dataset's chronological order. Rendered
 * through {@link kidsProphetView} — summary, body and profile; no hadith
 * excerpts and no outbound links.
 *
 * Excluded (proof log §5e): `lut` (the people's sexual immorality is the core
 * of the bio) and `yusuf` (the bio narrates the attempted seduction). Parents
 * can read those with their child in the full Learn section.
 */
export const KIDS_PROPHET_IDS = [
  "adam",
  "idris",
  "nuh",
  "hud",
  "salih",
  "ibrahim",
  "ismail",
  "ishaq",
  "yaqub",
  "shuayb",
  "ayyub",
  "dhul-kifl",
  "musa",
  "harun",
  "dawud",
  "sulayman",
  "ilyas",
  "al-yasa",
  "yunus",
  "zakariyya",
  "yahya",
  "isa",
  "muhammad",
] as const;

/** Bundled bios deliberately NOT offered in kids mode (see above). */
export const KIDS_PROPHETS_EXCLUDED = ["lut", "yusuf"] as const;

/** Learn-tab destinations: the curated kids screens + existing letters / Names hubs. */
export const KIDS_LEARN_ROUTES = {
  salahGuide: "/kids/salah",
  prophets: "/kids/prophets",
  letters: "/learn-quran/letters",
  names: "/names-of-allah",
} as const;

const SALAH_SET = new Set<string>(KIDS_SALAH_TOPIC_IDS);
const PROPHET_SET = new Set<string>(KIDS_PROPHET_IDS);

export function isKidsSalahTopicId(id: string | undefined): id is KidsSalahTopicId {
  return id != null && SALAH_SET.has(id);
}

export function isKidsProphetId(id: string | undefined): boolean {
  return id != null && PROPHET_SET.has(id);
}

/** The kids view of a Salah guide topic: summary + steps + madhhab notes only. */
export function kidsSalahTopicView(topic: SalahGuideTopic): KidsSalahTopicView | null {
  if (!isKidsSalahTopicId(topic.id)) return null;
  return {
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    steps: topic.steps ?? [],
    differenceIds: topic.differenceIds ?? [],
  };
}

export type KidsSalahTopicView = {
  id: KidsSalahTopicId;
  title: string;
  summary: string;
  steps: NonNullable<SalahGuideTopic["steps"]>;
  differenceIds: NonNullable<SalahGuideTopic["differenceIds"]>;
};

/** The kids view of a prophet bio: summary, body and profile — no hadith, no links. */
export function kidsProphetView(topic: ProphetsTopic): KidsProphetView | null {
  if (!isKidsProphetId(topic.id)) return null;
  return {
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    body: topic.body,
    profile: topic.profile ?? null,
  };
}

export type KidsProphetView = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  profile: ProphetsTopic["profile"] | null;
};

const SURAH_SET = new Set<number>(KIDS_SURAHS);
const DUA_SET = new Set<string>(KIDS_DUA_IDS);
const ZIKR_SET = new Set<string>(KIDS_ADHKAR_IDS);

/**
 * Adhkar sets a child can open as a guided session: the categories of the
 * curated adhkar (bundled ids are `<category>-<slug>`; `kids-content.test.ts`
 * checks each against the corpus). The session itself shows only the curated
 * items of the set ({@link kidsSessionItems}), never the whole adult set.
 */
export const KIDS_SESSION_CATEGORIES: readonly string[] = [
  ...new Set(KIDS_ADHKAR_IDS.map((id) => id.slice(0, id.indexOf("-")))),
];
const SESSION_CATEGORY_SET = new Set<string>(KIDS_SESSION_CATEGORIES);

/** A guided adhkar session in kids mode: only the curated adhkar of the set (D27). */
export function kidsSessionItems<T extends { id: string }>(items: readonly T[]): T[] {
  return items.filter((item) => ZIKR_SET.has(item.id));
}

/**
 * Where a bounced kids-mode path lands instead of `/kids`. The reader's
 * "Practise" (and any practice link) on a curated short surah opens the kids
 * recite-along for it (D68); the practice hub opens the kids surah picker.
 * Anything else goes home to `/kids`.
 */
export function kidsRedirectFor(
  rawPath: string,
  params: Record<string, string | string[] | undefined> = {},
): string {
  const path = (rawPath.split("?")[0] ?? "").replace(/\/+$/, "") || "/";
  if (path === "/quran/practice/session") {
    const raw = params.surah;
    const surah = Number(Array.isArray(raw) ? raw[0] : raw);
    return SURAH_SET.has(surah) ? `/kids/recite?surah=${surah}` : "/kids/recite";
  }
  if (path === "/quran/practice") return "/kids/recite";
  return "/kids";
}

/**
 * While a child session is active, navigation is limited to the kids shell
 * (which hosts the curated salah path and prophets screens) and the curated
 * content above (D7 "read kids content"), including counting the curated
 * adhkar (guided session, counter, after-Salah sequence). The adult `/salah-guide` and
 * `/prophets` hubs are NOT reachable — they carry hayd/nifas/janabah and other
 * adult material (A2). Anything else bounces back to `/kids`.
 */
export function isKidsAllowedPath(rawPath: string): boolean {
  const path = (rawPath.split("?")[0] ?? "").replace(/\/+$/, "") || "/";
  if (path === "/kids" || path.startsWith("/kids/")) return true;
  if (path === KIDS_LEARN_ROUTES.letters || path === KIDS_LEARN_ROUTES.names) return true;
  // Child-device link / graduation sign-in entry points stay reachable.
  if (path.startsWith("/oauth") || path === "/oauth2redirect") return true;
  const surah = path.match(/^\/quran\/(\d{1,3})$/);
  if (surah) return SURAH_SET.has(Number(surah[1]));
  const dua = path.match(/^\/dua\/detail\/([^/]+)$/);
  if (dua) return DUA_SET.has(decodeURIComponent(dua[1] as string));
  const zikr = path.match(/^\/zikr\/detail\/([^/]+)$/);
  if (zikr) return ZIKR_SET.has(decodeURIComponent(zikr[1] as string));
  // Counting the curated adhkar: a guided session (filtered to the curated items),
  // a single counter, and the after-Salah 33 / 33 / 34 sequence — the same
  // phrases as the curated Tasbih Fatimah (Bukhari 3705, Muslim 2727).
  const session = path.match(/^\/zikr\/session\/([^/]+)$/);
  if (session) return SESSION_CATEGORY_SET.has(decodeURIComponent(session[1] as string));
  if (path === "/tasbeeh/sequence") return true;
  const counter = path.match(/^\/tasbeeh\/([^/]+)$/);
  if (counter) return ZIKR_SET.has(decodeURIComponent(counter[1] as string));
  return false;
}

export type KidsDuaListItem = { kind: "dua"; item: DuaItem } | { kind: "zikr"; item: ZikrItem };

/**
 * The kids Duas tab list: curated duas then adhkar, in `KIDS_DUA_IDS` /
 * `KIDS_ADHKAR_IDS` order, picked from the loaded datasets by id (a missing id
 * is skipped, never invented).
 */
export function pickKidsDuaList(
  duas: readonly DuaItem[],
  adhkar: readonly ZikrItem[],
): KidsDuaListItem[] {
  const duaById = new Map(duas.map((d) => [d.id, d]));
  const zikrById = new Map(adhkar.map((z) => [z.id, z]));
  const out: KidsDuaListItem[] = [];
  for (const id of KIDS_DUA_IDS) {
    const item = duaById.get(id);
    if (item) out.push({ kind: "dua", item });
  }
  for (const id of KIDS_ADHKAR_IDS) {
    const item = zikrById.get(id);
    if (item) out.push({ kind: "zikr", item });
  }
  return out;
}
