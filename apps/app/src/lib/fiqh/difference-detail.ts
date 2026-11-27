import {
  type GuideTopicLink,
  guideTopicsForDifference,
} from "@munib-tracker/shared/content/fiqh-guide-links";
import {
  CLASSICAL_WORKS,
  type FiqhContentRef,
  type FiqhDifference,
  type FiqhDifferenceId,
  type HadithCollectionKey,
  MADHHAB_IDS,
  type MadhhabId,
} from "@munib-tracker/shared/fiqh";
import type { TFunction } from "i18next";

import { getEidGuideTopic } from "@/lib/eid-guide";
import { getFidyahGuideTopic } from "@/lib/fidyah-guide";
import { getFridayGuideTopic } from "@/lib/friday-guide";
import { getHajjGuideTopic } from "@/lib/hajj-guide";
import { getJanazahGuideTopic } from "@/lib/janazah-guide";
import { getSalahGuideTopic } from "@/lib/salah-guide";
import { getTaharahTopic } from "@/lib/taharah";

/**
 * NF-3.0a difference detail (`/fiqh/[id]`): evidence formatting and localized
 * "Read more in the guide" links. Pure helpers — the route only renders.
 */
export { differenceFromSlug, differenceSlug } from "@/lib/fiqh/difference-slug";

/** Collection names as the app's hadith screens show them (fawazahmed0 corpus). */
const HADITH_COLLECTION_NAMES: Record<HadithCollectionKey, string> = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  abudawud: "Sunan Abu Dawud",
  tirmidhi: "Jami' at-Tirmidhi",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
};

export type DifferenceRefLink =
  | { pathname: "/quran/[surah]"; params: { surah: string; ayah: string } }
  | { pathname: "/hadith/[collection]"; params: { collection: string; q: string } };

export interface DifferenceRefView {
  key: string;
  label: string;
  /** In-app reader route (Qur'an / hadith); classical works have none. */
  link?: DifferenceRefLink;
  /** Hadith critics differ on the grading (shown as a caption). */
  disputed: boolean;
}

export function formatFiqhRef(ref: FiqhContentRef, t: TFunction): DifferenceRefView {
  if (ref.kind === "quran") {
    const ayah = ref.ayahTo ? `${ref.ayahFrom}–${ref.ayahTo}` : String(ref.ayahFrom);
    return {
      key: `q:${ref.surah}:${ayah}`,
      label: t("fiqhRetrofit.detail.quranRef", { surah: ref.surah, ayah }),
      link: {
        pathname: "/quran/[surah]",
        params: { surah: String(ref.surah), ayah: String(ref.ayahFrom) },
      },
      disputed: false,
    };
  }
  if (ref.kind === "hadith") {
    const name = HADITH_COLLECTION_NAMES[ref.collection];
    // Muslim: the corpus number opens the reader; print (Abd al-Baqi) number in brackets.
    const label = ref.arabicNumber
      ? `${name} ${ref.number} (${ref.arabicNumber})`
      : `${name} ${ref.number}`;
    return {
      key: `h:${ref.collection}:${ref.number}`,
      label,
      link: {
        pathname: "/hadith/[collection]",
        params: { collection: ref.collection, q: String(ref.number) },
      },
      disputed: ref.grade === "disputed",
    };
  }
  return { key: `b:${ref.work}`, label: CLASSICAL_WORKS[ref.work].title, disputed: false };
}

export interface DifferenceEvidence {
  /** Evidence every school discusses. */
  shared: DifferenceRefView[];
  /** Each school's own evidence and manuals, in catalog order. */
  bySchool: Array<{ school: MadhhabId; refs: DifferenceRefView[] }>;
}

function dedupe(refs: DifferenceRefView[]): DifferenceRefView[] {
  const seen = new Set<string>();
  return refs.filter((ref) => {
    if (seen.has(ref.key)) return false;
    seen.add(ref.key);
    return true;
  });
}

export function differenceEvidence(diff: FiqhDifference, t: TFunction): DifferenceEvidence {
  return {
    shared: dedupe((diff.refs ?? []).map((ref) => formatFiqhRef(ref, t))),
    bySchool: MADHHAB_IDS.map((school) => ({
      school,
      refs: dedupe((diff.positions[school].refs ?? []).map((ref) => formatFiqhRef(ref, t))),
    })),
  };
}

const LOCALIZED_TITLE: Record<string, (id: string) => { title: string } | undefined> = {
  "/salah-guide": getSalahGuideTopic,
  "/taharah": getTaharahTopic,
  "/friday": getFridayGuideTopic,
  "/eid": getEidGuideTopic,
  "/janazah": getJanazahGuideTopic,
  "/hajj": getHajjGuideTopic,
  "/fidyah": getFidyahGuideTopic,
};

/** Guide topics that discuss this difference, with titles in the app locale. */
export function differenceGuideLinks(id: FiqhDifferenceId): GuideTopicLink[] {
  return guideTopicsForDifference(id).map((link) => ({
    ...link,
    title: LOCALIZED_TITLE[link.basePath]?.(link.topicId)?.title ?? link.title,
  }));
}
