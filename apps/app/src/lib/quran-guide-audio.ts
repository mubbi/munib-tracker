import {
  AL_FATIHA_PRACTICE_AUDIO,
  QURAN_GUIDE_MEMORIZATION_LISTEN,
  resolveExampleAudio,
  resolveGlyphAudioUri,
  resolveLetterAudioUri,
  resolveVocabAudio,
} from "@munib-tracker/shared/content/quran-guide-audio";
import type { Ayah, QuranGuideAyahAudio } from "@munib-tracker/shared/types";

import { ayahTracks, singleAyahTrack } from "@/lib/quran-audio";
import { getSurahByNumber } from "@/lib/quran-meta";
import type { AudioTrack } from "@/providers/audio-player-types";

export {
  AL_FATIHA_PRACTICE_AUDIO,
  QURAN_GUIDE_MEMORIZATION_LISTEN,
  resolveExampleAudio,
  resolveGlyphAudioUri,
  resolveLetterAudioUri,
  resolveVocabAudio,
};

export function surahDisplayName(surah: number): string {
  return getSurahByNumber(surah)?.nameTransliteration ?? `Surah ${surah}`;
}

/** Build a recitation track from a Learn Qur'an ayah audio ref (with optional clip). */
export function guideAyahTrack(
  reciterDir: string,
  audio: QuranGuideAyahAudio,
  titleOverride?: string,
): AudioTrack {
  const name = surahDisplayName(audio.surah);
  const base = singleAyahTrack(reciterDir, name, audio.surah, audio.ayah);
  return {
    ...base,
    id: `guide:${audio.surah}:${audio.ayah}:${audio.clipStart ?? 0}-${audio.clipEnd ?? "end"}`,
    title: titleOverride ?? name,
    subtitle: `Ayah ${audio.ayah}`,
    ...(audio.clipStart != null ? { clipStart: audio.clipStart } : null),
    ...(audio.clipEnd != null ? { clipEnd: audio.clipEnd } : null),
  };
}

/** Consecutive ayahs for a Jannah / daily ref range. */
export function guideAyahRangeTracks(
  reciterDir: string,
  surah: number,
  ayahFrom: number,
  ayahTo?: number,
): AudioTrack[] {
  const name = surahDisplayName(surah);
  const end = Math.max(ayahFrom, ayahTo ?? ayahFrom);
  const tracks: AudioTrack[] = [];
  for (let ayah = ayahFrom; ayah <= end; ayah++) {
    tracks.push(singleAyahTrack(reciterDir, name, surah, ayah));
  }
  return tracks;
}

export function letterPronunciationTrack(letterId: string, title: string): AudioTrack | null {
  const uri = resolveLetterAudioUri(letterId);
  if (!uri) return null;
  return {
    id: `letter:${letterId}`,
    title,
    subtitle: "Letter pronunciation",
    uri,
  };
}

export function isLetterPronunciationTrack(id: string | undefined): boolean {
  return typeof id === "string" && id.startsWith("letter:");
}

export function letterIdFromTrack(id: string | undefined): string | null {
  if (!isLetterPronunciationTrack(id) || !id) return null;
  return id.slice("letter:".length) || null;
}

/** Ordered pronunciation queue for Learn Qur'an → Arabic letters “Play all”. */
export function allLetterPronunciationTracks(
  letters: Array<{ id: string; name: string }>,
): AudioTrack[] {
  const tracks: AudioTrack[] = [];
  for (const letter of letters) {
    const track = letterPronunciationTrack(letter.id, letter.name);
    if (track) tracks.push(track);
  }
  return tracks;
}

export function glyphPronunciationTrack(glyph: string, title: string): AudioTrack | null {
  const uri = resolveGlyphAudioUri(glyph);
  if (!uri) return null;
  return {
    id: `glyph:${glyph}`,
    title,
    subtitle: "Letter pronunciation",
    uri,
  };
}

export function isGlyphPronunciationTrack(id: string | undefined): boolean {
  return typeof id === "string" && id.startsWith("glyph:");
}

export function glyphFromTrack(id: string | undefined): string | null {
  if (!isGlyphPronunciationTrack(id) || !id) return null;
  return id.slice("glyph:".length) || null;
}

/** Pronunciation pairs in screen order — each pair’s letters, left then right. */
export function pronunciationGlyphTracks(pairs: Array<{ letters: string[] }>): AudioTrack[] {
  const tracks: AudioTrack[] = [];
  for (const pair of pairs) {
    for (const letter of pair.letters) {
      const track = glyphPronunciationTrack(letter, letter);
      if (track) tracks.push(track);
    }
  }
  return tracks;
}

export function examplePhraseTrack(
  reciterDir: string,
  example: string,
  title?: string,
): AudioTrack | null {
  const audio = resolveExampleAudio(example);
  if (!audio) return null;
  return guideAyahTrack(reciterDir, audio, title ?? example);
}

/** Timed headword clip for a Qur'anic vocabulary entry (not the full ayah). */
export function vocabWordTrack(
  reciterDir: string,
  vocabId: string,
  title?: string,
): AudioTrack | null {
  const audio = resolveVocabAudio(vocabId);
  if (!audio) return null;
  return guideAyahTrack(reciterDir, audio, title);
}

/** Continuous murattal of Al-Fatiha (7 ayahs) for practice / listen CTAs. */
export function alFatihaTracks(reciterDir: string): AudioTrack[] {
  const name = surahDisplayName(1);
  const ayahs: Ayah[] = [1, 2, 3, 4, 5, 6, 7].map((ayah) => ({
    surah: 1,
    ayah,
    global: ayah,
    arabic: "",
    juz: 1,
    sajda: false,
    hizb: 1,
    page: 1,
  }));
  return ayahTracks(reciterDir, name, 1, ayahs);
}
