import type { HadithCollection, HadithItem } from "@munib-tracker/shared/types";

import { HadithRepository } from "@/db";

/**
 * D6 — full hadith collections fetched on demand from fawazahmed0/hadith-api
 * (no key). Cache-first over AsyncStorage (`hadith-repository`): an opened
 * collection is cached and re-read offline afterward.
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
  reference?: { book: number; hadith: number };
  grades?: Array<{ name: string; grade: string }>;
}

async function fetchEdition(name: string): Promise<RemoteHadith[]> {
  const res = await fetch(`${HADITH_CDN}/${name}.min.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${name}`);
  const json = (await res.json()) as { hadiths: RemoteHadith[] };
  return json.hadiths;
}

/**
 * Cache-first fetch of a full collection (Arabic + English paired by number).
 * On a cache miss both language editions are fetched, paired, cached, returned.
 */
export async function fetchRemoteCollection(id: string): Promise<HadithItem[]> {
  const cached = await HadithRepository.getCachedBook(id);
  if (cached) return cached;

  const def = REMOTE_DEFS.find((d) => d.id === id);
  if (!def) throw new Error(`Unknown collection: ${id}`);

  const [english, arabic] = await Promise.all([
    fetchEdition(`eng-${id}`),
    fetchEdition(`ara-${id}`),
  ]);

  const arabicByNumber = new Map(arabic.map((h) => [h.hadithnumber, h.text]));

  const items: HadithItem[] = english.map((h) => {
    const grade = h.grades?.find((g) => g.grade)?.grade;
    const gradedBy = h.grades?.find((g) => g.grade)?.name;
    const item: HadithItem = {
      id: `${id}:${h.hadithnumber}`,
      collection: id,
      number: String(h.hadithnumber),
      arabic: arabicByNumber.get(h.hadithnumber) ?? "",
      english: h.text,
      reference: `${def.nameEnglish} ${h.hadithnumber}`,
    };
    if (grade) item.grade = grade;
    if (gradedBy) item.gradedBy = gradedBy;
    return item;
  });

  await HadithRepository.setCachedBook(id, items);
  return items;
}
