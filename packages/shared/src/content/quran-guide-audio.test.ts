import { describe, expect, it } from "vitest";

import {
  QURAN_GUIDE_EXAMPLE_AUDIO,
  QURAN_GUIDE_LETTER_AUDIO_URI,
  QURAN_GUIDE_VOCAB_AUDIO,
  resolveExampleAudio,
  resolveLetterAudioUri,
  resolveVocabAudio,
} from "./quran-guide-audio";
import { QURAN_GUIDE_LETTERS } from "./quran-guide-letters";
import { QURAN_GUIDE_TAJWEED } from "./quran-guide-tajweed";
import { QURAN_GUIDE_VOCABULARY } from "./quran-guide-vocabulary";

describe("quran-guide-audio", () => {
  it("covers every letter id with a pronunciation URI", () => {
    for (const letter of QURAN_GUIDE_LETTERS) {
      expect(resolveLetterAudioUri(letter.id), letter.id).toBeTruthy();
      expect((QURAN_GUIDE_LETTER_AUDIO_URI as Record<string, string>)[letter.id]).toMatch(
        /^https:\/\//,
      );
    }
  });

  it("maps primary tajweed examples to ayah audio", () => {
    for (const lesson of QURAN_GUIDE_TAJWEED) {
      for (const example of lesson.examples) {
        expect(resolveExampleAudio(example), `${lesson.id}: ${example}`).toBeTruthy();
      }
    }
  });

  it("maps every vocabulary headword to a timed word clip", () => {
    for (const word of QURAN_GUIDE_VOCABULARY) {
      const audio = resolveVocabAudio(word.id);
      expect(audio, word.id).toBeTruthy();
      if (audio == null) continue;
      const { clipStart, clipEnd } = audio;
      expect(clipStart != null && clipEnd != null, word.id).toBe(true);
      if (clipStart == null || clipEnd == null) continue;
      expect(clipEnd, word.id).toBeGreaterThan(clipStart);
    }
    expect(Object.keys(QURAN_GUIDE_VOCAB_AUDIO)).toHaveLength(QURAN_GUIDE_VOCABULARY.length);
  });

  it("keeps example clip ranges ordered when present", () => {
    for (const [key, audio] of Object.entries(QURAN_GUIDE_EXAMPLE_AUDIO)) {
      expect(audio.surah).toBeGreaterThanOrEqual(1);
      expect(audio.ayah).toBeGreaterThanOrEqual(1);
      if (audio.clipStart != null && audio.clipEnd != null) {
        expect(audio.clipEnd, key).toBeGreaterThan(audio.clipStart);
      }
    }
  });
});
