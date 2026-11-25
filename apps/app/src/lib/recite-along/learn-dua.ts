import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content/learn-dua";

import type { Passage } from "@/lib/quran-companion/types";

import { passageFromRef } from "./passages";

/**
 * Learn-dua phrases whose words are Qur'anic (D68): a recite-along on the cited
 * ayah(s). Read from the ENGLISH corpus's `reference` ("Qur'an 9:129 (the words);
 * …"), because overlays translate the reference string (e.g. "قرآن ۹:۱۲۹") —
 * the passage is the same in every language. Only a reference that STARTS with a
 * Qur'an citation counts, so a hadith reference that merely mentions the Qur'an
 * is never taken for one.
 */

const QURAN_REFERENCE = /^Qur'an (\d{1,3}):(\d{1,3})(?:\s*[–-]\s*(\d{1,3}))?/;

/** "Qur'an 43:13–14 (the words); …" → 43:13–14. Null for anything else. */
export function passageFromQuranReference(reference: string | undefined): Passage | null {
  const match = reference ? QURAN_REFERENCE.exec(reference.trim()) : null;
  if (!match) return null;
  return passageFromRef({
    surah: Number(match[1]),
    ayahFrom: Number(match[2]),
    ayahTo: match[3] ? Number(match[3]) : undefined,
  });
}

let byPhrase: Map<string, Passage> | null = null;

function phraseKey(topicId: string, phraseId: string): string {
  return `${topicId}/${phraseId}`;
}

/** The Qur'anic passage behind a learn-dua phrase, or null (most phrases are hadith duas). */
export function learnDuaPhrasePassage(topicId: string, phraseId: string): Passage | null {
  if (!byPhrase) {
    byPhrase = new Map();
    for (const topic of LEARN_DUA_TOPICS) {
      for (const phrase of topic.phrases ?? []) {
        const passage = passageFromQuranReference(phrase.reference);
        if (passage) byPhrase.set(phraseKey(topic.id, phrase.id), passage);
      }
    }
  }
  return byPhrase.get(phraseKey(topicId, phraseId)) ?? null;
}
