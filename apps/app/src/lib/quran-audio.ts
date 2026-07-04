import type { Ayah } from "@munib-tracker/shared/types";

import type { AudioTrack } from "@/providers/audio-player-provider";

/**
 * Builds `AudioTrack[]` for Qur'an recitation. Playback itself is handled by the
 * existing `useAudioPlayerContext()` (play/pause/queue/auto-advance) — this file
 * only produces the tracks to hand to `play()`.
 */

const EVERYAYAH = "https://everyayah.com/data";
const QURANICAUDIO = "https://download.quranicaudio.com/quran";

export interface Reciter {
  dir: string; // everyayah directory
  name: string;
}

/** Per-ayah reciters available on everyayah.com (D3). */
export const RECITERS: Reciter[] = [
  { dir: "Alafasy_128kbps", name: "Mishary Alafasy" },
  { dir: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit (Murattal)" },
  { dir: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary" },
  { dir: "Minshawy_Murattal_128kbps", name: "Al-Minshawi (Murattal)" },
];

export const DEFAULT_RECITER_DIR = RECITERS[0].dir;

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

/** Short Arabic opening shown in the player playlist. */
function ayahPreview(arabic: string, maxChars = 42): string {
  const text = arabic.replace(/\s+/g, " ").trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}…`;
}

/** everyayah file id: zero-padded surah(3) + ayah(3), e.g. 001001. */
function ayahFileId(surah: number, ayah: number): string {
  return `${pad3(surah)}${pad3(ayah)}`;
}

/** One recitation track per ayah for continuous playback (auto-advances). */
export function ayahTracks(
  reciterDir: string,
  surahName: string,
  surah: number,
  ayahs: Ayah[],
): AudioTrack[] {
  return ayahs.map((a) => ({
    id: `${surah}:${a.ayah}`,
    title: surahName,
    subtitle: `Ayah ${a.ayah}`,
    preview: ayahPreview(a.arabic),
    uri: `${EVERYAYAH}/${reciterDir}/${ayahFileId(surah, a.ayah)}.mp3`,
  }));
}

/** A single-ayah recitation track. */
export function singleAyahTrack(
  reciterDir: string,
  surahName: string,
  surah: number,
  ayah: number,
): AudioTrack {
  return {
    id: `${surah}:${ayah}`,
    title: surahName,
    subtitle: `Ayah ${ayah}`,
    uri: `${EVERYAYAH}/${reciterDir}/${ayahFileId(surah, ayah)}.mp3`,
  };
}

/**
 * Per-surah English audio-translation (D4, Saheeh International / Ibrahim Walk)
 * streamed from QuranicAudio.
 */
export function surahTranslationTrack(surah: number, surahName: string): AudioTrack {
  return {
    id: `translation:${surah}`,
    title: `${surahName} — English`,
    subtitle: "Audio translation",
    uri: `${QURANICAUDIO}/english/Ibrahim_Walk_192kbps/${pad3(surah)}.mp3`,
  };
}
