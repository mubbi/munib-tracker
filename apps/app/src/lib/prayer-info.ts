import type { HadithItem, PrayerId } from "@munib-tracker/shared/types";
import { ensureBundledCollection, getBundledCollection } from "@/lib/hadith";
import type { DailyScheduleEntryId } from "@/lib/prayer-times";

/** Schedule entries and tracked prayers that have learn-more content. */
export type PrayerInfoId = DailyScheduleEntryId | PrayerId;

export type PrayerInfoReference =
  | { type: "hadith"; id: string }
  | { type: "quran"; surah: number; ayah: number };

export interface PrayerInfoEntry {
  refs: PrayerInfoReference[];
}

/** Curated references into bundled hadith + Qur'an for each prayer/marker. */
export const PRAYER_INFO: Record<PrayerInfoId, PrayerInfoEntry> = {
  tahajjud: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:500" },
      { type: "hadith", id: "riyad_assalihin:492" },
      { type: "quran", surah: 17, ayah: 79 },
    ],
  },
  fajr: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:368" },
      { type: "hadith", id: "riyad_assalihin:421" },
      { type: "quran", surah: 17, ayah: 78 },
    ],
  },
  sunrise: {
    refs: [{ type: "quran", surah: 6, ayah: 97 }],
  },
  ishraq: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:461" },
      { type: "quran", surah: 91, ayah: 1 },
    ],
  },
  duha: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:461" },
      { type: "hadith", id: "riyad_assalihin:460" },
    ],
  },
  dhuhr: {
    refs: [
      { type: "hadith", id: "nawawi40:29" },
      { type: "hadith", id: "nawawi40:3" },
      { type: "quran", surah: 62, ayah: 9 },
    ],
  },
  asr: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:368" },
      { type: "quran", surah: 2, ayah: 238 },
    ],
  },
  maghrib: {
    refs: [
      { type: "hadith", id: "nawawi40:26" },
      { type: "quran", surah: 30, ayah: 17 },
    ],
  },
  isha: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:384" },
      { type: "quran", surah: 24, ayah: 58 },
    ],
  },
  witr: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:490" },
      { type: "hadith", id: "riyad_assalihin:427" },
    ],
  },
  tahiyyatul_masjid: {
    refs: [{ type: "hadith", id: "riyad_assalihin:465" }],
  },
  hajat_istikhara: {
    refs: [
      { type: "hadith", id: "riyad_assalihin:38" },
      { type: "quran", surah: 2, ayah: 186 },
    ],
  },
};

export function resolveHadithItem(hadithId: string): HadithItem | undefined {
  const collectionId = hadithId.split(":")[0];
  const bundled = getBundledCollection(collectionId);
  return bundled?.items.find((item) => item.id === hadithId);
}

/** Resolve after ensuring the bundled collection chunk is loaded. */
export async function ensureHadithItem(hadithId: string): Promise<HadithItem | undefined> {
  const collectionId = hadithId.split(":")[0];
  if (collectionId) await ensureBundledCollection(collectionId);
  return resolveHadithItem(hadithId);
}

export function hadithCollectionId(hadithId: string): string {
  return hadithId.split(":")[0] ?? hadithId;
}

/** Short excerpt for the info sheet (full text opens in the hadith reader). */
export function hadithExcerpt(item: HadithItem, max = 220): string {
  const text = item.english.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}
