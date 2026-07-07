import type {
  HadithCollection,
  HadithCollectionData,
  HadithItem,
  HadithSection,
} from "@munib-tracker/shared/types";

import { HadithRepository } from "@/db";
import { fetchStaticJson } from "@/lib/static-json-fetch";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * D6 — full hadith collections fetched on demand from fawazahmed0/hadith-api
 * (no key). Cache-first over AsyncStorage. Each collection is grouped into its
 * "books" (sections) so users browse a limited set at a time rather than the
 * whole corpus at once. Empty numbering placeholders are dropped.
 */

const HADITH_CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

interface RemoteCollectionDef {
  id: string; // fawazahmed0 book slug
  nameEnglish: string;
  nameArabic: string;
}

const REMOTE_DEFS: RemoteCollectionDef[] = [
  { id: "bukhari", nameEnglish: "Sahih al-Bukhari", nameArabic: "صحيح البخاري" },
  { id: "muslim", nameEnglish: "Sahih Muslim", nameArabic: "صحيح مسلم" },
  { id: "abudawud", nameEnglish: "Sunan Abu Dawud", nameArabic: "سنن أبي داود" },
  { id: "tirmidhi", nameEnglish: "Jami' at-Tirmidhi", nameArabic: "جامع الترمذي" },
  { id: "nasai", nameEnglish: "Sunan an-Nasa'i", nameArabic: "سنن النسائي" },
  { id: "ibnmajah", nameEnglish: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه" },
];

export const REMOTE_COLLECTIONS: HadithCollection[] = REMOTE_DEFS.map((d) => ({
  id: d.id,
  nameEnglish: d.nameEnglish,
  nameArabic: d.nameArabic,
  bundled: false,
}));

export function isRemoteCollection(id: string): boolean {
  return REMOTE_DEFS.some((d) => d.id === id);
}

export function getRemoteCollection(id: string): HadithCollection | undefined {
  return REMOTE_COLLECTIONS.find((c) => c.id === id);
}

interface RemoteHadith {
  hadithnumber: number;
  text: string;
  grades?: Array<{ name: string; grade: string }>;
}

interface SectionDetail {
  hadithnumber_first: number;
  hadithnumber_last: number;
}

interface RemoteEdition {
  metadata?: {
    sections?: Record<string, string>;
    section_details?: Record<string, SectionDetail>;
  };
  hadiths: RemoteHadith[];
}

async function fetchEdition(name: string): Promise<RemoteEdition> {
  return fetchStaticJson<RemoteEdition>(`${HADITH_CDN}/${name}.min.json`);
}

/**
 * Cache-first fetch of a full collection, grouped into sections. On a cache miss
 * both language editions are fetched, paired by number, assigned to a section,
 * empty entries dropped, then cached.
 */
export async function fetchRemoteCollection(id: string): Promise<HadithCollectionData> {
  const cached = (await HadithRepository.getCachedBook(id)) as HadithCollectionData | null;
  if (cached?.items) return cached;

  const def = REMOTE_DEFS.find((d) => d.id === id);
  if (!def) throw new Error(`Unknown collection: ${id}`);

  const [english, arabic] = await Promise.all([
    fetchEdition(`eng-${id}`),
    fetchEdition(`ara-${id}`),
  ]);
  const arabicByNumber = new Map(arabic.hadiths.map((h) => [h.hadithnumber, h.text]));

  // Section lookup by hadith number range.
  const sectionNames = english.metadata?.sections ?? {};
  const sectionDetails = english.metadata?.section_details ?? {};
  const sectionRanges = Object.entries(sectionDetails)
    .map(([sid, d]) => ({ id: sid, name: sectionNames[sid] ?? "", ...d }))
    .filter((s) => s.name)
    .sort((a, b) => a.hadithnumber_first - b.hadithnumber_first);
  const sectionFor = (num: number) =>
    sectionRanges.find((s) => num >= s.hadithnumber_first && num <= s.hadithnumber_last);

  const items: HadithItem[] = [];
  for (const h of english.hadiths) {
    const text = (h.text ?? "").trim();
    if (!text) continue; // drop empty numbering placeholders
    const section = sectionFor(h.hadithnumber);
    const grade = h.grades?.find((g) => g.grade);
    const item: HadithItem = {
      id: `${id}:${h.hadithnumber}`,
      collection: id,
      number: String(h.hadithnumber),
      arabic: (arabicByNumber.get(h.hadithnumber) ?? "").trim(),
      english: text,
      reference: `${def.nameEnglish} ${h.hadithnumber}`,
    };
    if (section) {
      item.book = section.name;
      item.chapterId = section.id;
    }
    if (grade?.grade) {
      item.grade = grade.grade;
      item.gradedBy = grade.name;
    }
    items.push(item);
  }

  const counts = new Map<string, number>();
  for (const it of items) counts.set(it.chapterId ?? "", (counts.get(it.chapterId ?? "") ?? 0) + 1);
  const sections: HadithSection[] = sectionRanges
    .map((s) => ({ id: s.id, name: s.name, count: counts.get(s.id) ?? 0 }))
    .filter((s) => s.count > 0);

  // Persist to disk only when the user allows saving hadith locally; otherwise
  // it stays in the session cache and refetches next launch.
  const persist = preferencesStore.getState().prefs.cacheHadithLocally !== false;
  const data: HadithCollectionData = { sections, items };
  await HadithRepository.setCachedBook(id, data, persist);
  return data;
}
