import { DHUL_HIJJAH_ZIKR } from "@munib-tracker/shared/content/dhul-hijjah";
import type { ZikrItem } from "@munib-tracker/shared/types";

import { phraseForArabic } from "./phrase-display";
import { type PhraseKey, phraseForZikr } from "./phrases";

/**
 * What a hands-free counter listens for (NF-3.20, D49): any zikr, not just the
 * eight catalog phrases.
 *
 * - `key` names the taught voice pattern on this device (`zikr:<id>`,
 *   `durood:<id>`, `dua:<id>`, `custom:<id>`). Null for "Something else": it can
 *   still be taught, but only for the current session (nothing to name it by).
 * - `label` is what the UI calls it: the dataset title of a catalog zikr, durood
 *   or dua, or the user's own custom tasbeeh / adhkar title.
 * - `entry` is the item whose Arabic (and translation) the listening panel
 *   shows: dataset text, or the user's own adhkar entry shown back to them.
 * - `phrase` is the catalog phrase for the model-based spotter (switched off,
 *   D24), when there is one.
 */
export type VoiceZikr = {
  key: string | null;
  label: string | null;
  entry: VoiceZikrEntry | null;
  phrase: PhraseKey | null;
};

/** The dataset fields the panel needs (zikr and durood items both have them). */
export type VoiceZikrEntry = Pick<ZikrItem, "arabic" | "translation" | "translations">;

export const SOMETHING_ELSE: VoiceZikr = { key: null, label: null, entry: null, phrase: null };

/**
 * Counter ids that only re-count a bundled zikr under their own daily total
 * (NF-3.3 Dhul-Hijjah takbir / tahlil / tahmid copy an adhkar item's text). They
 * share that zikr's taught voice pattern: the words, and the voice, are the same.
 */
const VOICE_SOURCE_IDS: ReadonlyMap<string, string> = new Map(
  DHUL_HIJJAH_ZIKR.map((z) => [z.id, z.sourceId]),
);

/** The zikr id whose taught voice pattern a counter for `zikrId` uses. */
export function voiceSourceZikrId(zikrId: string): string {
  return VOICE_SOURCE_IDS.get(zikrId) ?? zikrId;
}

export function voiceZikrFromZikr(
  item: Pick<ZikrItem, "id" | "title"> & VoiceZikrEntry,
): VoiceZikr {
  const sourceId = voiceSourceZikrId(item.id);
  return {
    key: `zikr:${sourceId}`,
    label: item.title,
    entry: item,
    phrase: phraseForZikr(sourceId) ?? phraseForArabic(item.arabic),
  };
}

export function voiceZikrFromDurood(
  item: { id: string; title: string } & VoiceZikrEntry,
): VoiceZikr {
  return {
    key: `durood:${item.id}`,
    label: item.title,
    entry: item,
    phrase: phraseForArabic(item.arabic),
  };
}

/**
 * A dua repeated as zikr (e.g. the Laylat al-Qadr dua, Tirmidhi 3513): its own
 * taught pattern (`dua:<id>`), the dataset Arabic on the listening panel.
 */
export function voiceZikrFromDua(item: { id: string; title: string } & VoiceZikrEntry): VoiceZikr {
  return {
    key: `dua:${item.id}`,
    label: item.title,
    entry: item,
    phrase: phraseForArabic(item.arabic),
  };
}

/**
 * The user's own zikr: a custom tasbeeh (title only) or an adhkar-builder entry
 * (`arabic` / `translation` the user wrote). With Arabic, the listening panel
 * shows it back and the long-text rule (`isVoiceZikrSayable`) can measure it.
 */
export function voiceZikrFromCustom(item: {
  id: string;
  title: string;
  arabic?: string | null;
  translation?: string | null;
}): VoiceZikr {
  const arabic = item.arabic?.trim() ?? "";
  return {
    key: `custom:${item.id}`,
    label: item.title,
    entry: arabic ? { arabic, translation: item.translation?.trim() ?? "" } : null,
    phrase: phraseForArabic(arabic || item.title),
  };
}

/** Two counters listen for the same thing (stable across renders). */
export function sameVoiceZikr(a: VoiceZikr | null, b: VoiceZikr | null): boolean {
  if (!a || !b) return a === b;
  return a.key === b.key && a.label === b.label;
}

/**
 * The dua the Prophet ﷺ taught Aisha for Laylat al-Qadr (Sunan al-Tirmidhi 3513),
 * counted from the Ramadan last-ten card (`/tasbeeh/dua/[id]`).
 */
export const LAYLAT_AL_QADR_DUA_ID = "sunnah-laylat-qadr-afw";
