import type { ZikrItem } from "@munib-tracker/shared/types";

import { phraseForArabic } from "./phrase-display";
import { type PhraseKey, phraseForZikr } from "./phrases";

/**
 * What a hands-free counter listens for (NF-3.20, D49): any zikr, not just the
 * eight catalog phrases.
 *
 * - `key` names the taught voice pattern on this device (`zikr:<id>`,
 *   `durood:<id>`, `custom:<id>`). Null for "Something else": it can still be
 *   taught, but only for the current session (there is nothing to name it by).
 * - `label` is what the UI calls it: the dataset title of a catalog zikr or
 *   durood, or the user's own custom tasbeeh title.
 * - `entry` is the dataset item whose Arabic (and translation) the listening
 *   panel shows; never typed text.
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

export function voiceZikrFromZikr(
  item: Pick<ZikrItem, "id" | "title"> & VoiceZikrEntry,
): VoiceZikr {
  return {
    key: `zikr:${item.id}`,
    label: item.title,
    entry: item,
    phrase: phraseForZikr(item.id) ?? phraseForArabic(item.arabic),
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

export function voiceZikrFromCustom(item: { id: string; title: string }): VoiceZikr {
  return {
    key: `custom:${item.id}`,
    label: item.title,
    entry: null,
    phrase: phraseForArabic(item.title),
  };
}

/** Two counters listen for the same thing (stable across renders). */
export function sameVoiceZikr(a: VoiceZikr | null, b: VoiceZikr | null): boolean {
  if (!a || !b) return a === b;
  return a.key === b.key && a.label === b.label;
}
