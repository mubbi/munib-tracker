import type { Ayah } from "@munib-tracker/shared/types";
import { ayahTracks, singleAyahTrack } from "@/lib/quran-audio";
import type { AudioTrack } from "@/providers/audio-player-types";

/**
 * Step-by-step salah phrase audio — authentic open streams:
 * - Hisnul Muslim (sheikhhanif CDN) for in-prayer adhkar
 * - everyayah.com for Al-Fatihah
 * - Wikimedia Commons Adhan_wiki (CC BY-SA 3.0) for Allahu Akbar via clipStart/clipEnd
 *
 * Track ids: `how-to-pray:{stepIndex}:{sub}` so the UI can highlight the active step.
 *
 * Prefer remote `uri` streams (same pattern as dua/zikr) — bundled Metro `require()`
 * sources have failed silently on some platforms when `replace()` rejects them.
 */

const HISN =
  "https://cdn.jsdelivr.net/gh/sheikhhanif/Hisnul_Muslim_Database@07533fa1494d02c4b24aecb3ad7267e09219c956/audio";

/** Sunni lecture of the adhan — used only for the opening takbir segment. */
const ADHAN_WIKI_MP3 =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/16/Adhan_wiki.oga/Adhan_wiki.oga.mp3";

/** Opening “Allahu Akbar ×4” block in Adhan_wiki (seconds). */
const TAKBIR_CLIP = { start: 0, end: 10.4 } as const;

const HOW_TO_PRAY_PREFIX = "how-to-pray:";

function hisnUri(n: number): string {
  return `${HISN}/${n}hm.mp3`;
}

function trackId(stepIndex: number, sub = 0): string {
  return `${HOW_TO_PRAY_PREFIX}${stepIndex}:${sub}`;
}

export function isHowToPrayTrack(id: string | undefined): boolean {
  return typeof id === "string" && id.startsWith(HOW_TO_PRAY_PREFIX);
}

export function howToPrayStepIndexFromId(id: string | undefined): number | null {
  if (!id || !isHowToPrayTrack(id)) return null;
  const m = /^how-to-pray:(\d+)/.exec(id);
  return m ? Number(m[1]) : null;
}

function remote(
  stepIndex: number,
  sub: number,
  title: string,
  uri: string,
  subtitle?: string,
): AudioTrack {
  return {
    id: trackId(stepIndex, sub),
    title,
    subtitle: subtitle ?? "Step-by-step salah",
    uri,
  };
}

function fatihaAyahs(): Ayah[] {
  return [1, 2, 3, 4, 5, 6, 7].map((ayah) => ({
    surah: 1,
    ayah,
    global: ayah,
    arabic: "",
    juz: 1,
    sajda: false,
    hizb: 1,
    page: 1,
  }));
}

/**
 * 0-based step index → clips for that row on `/salah-guide/how-to-pray`.
 * Steps without Arabic (niyyah, stand, etc.) are omitted.
 */
export function howToPrayClipsByStep(reciterDir: string): Map<number, AudioTrack[]> {
  const map = new Map<number, AudioTrack[]>();

  // 2. Opening takbir (index 1) — Wikimedia Adhan_wiki clip (CC BY-SA 3.0)
  map.set(1, [
    {
      ...remote(1, 0, "Allahu Akbar", ADHAN_WIKI_MP3),
      clipStart: TAKBIR_CLIP.start,
      clipEnd: TAKBIR_CLIP.end,
    },
  ]);

  // 3. Istiftah (hisn-28)
  map.set(2, [remote(2, 0, "Subhanaka Allahumma…", hisnUri(28))]);

  // 4. Ta'awwudh (hisn-193) + Basmalah (Fatiha 1:1)
  map.set(3, [
    remote(3, 0, "A'udhu billahi…", hisnUri(193)),
    {
      ...singleAyahTrack(reciterDir, "Al-Fatihah", 1, 1),
      id: trackId(3, 1),
      title: "Bismillahir-Rahmanir-Rahim",
      subtitle: "Step-by-step salah",
    },
  ]);

  // 5. Al-Fatihah (full)
  map.set(
    4,
    ayahTracks(reciterDir, "Al-Fatihah", 1, fatihaAyahs()).map((t, i) => ({
      ...t,
      id: trackId(4, i),
      subtitle: "Step-by-step salah",
    })),
  );

  // 7. Ruku (hisn-33)
  map.set(6, [remote(6, 0, "Subhana Rabbiyal-'Adheem", hisnUri(33))]);

  // 8. Rising — tasmi' then tahmid (hisn-38 + 39)
  map.set(7, [
    remote(7, 0, "Sami'Allahu liman hamidah", hisnUri(38)),
    remote(7, 1, "Rabbana wa lakal-hamd", hisnUri(39)),
  ]);

  // 9 & 11. Sujud (hisn-41)
  map.set(8, [remote(8, 0, "Subhana Rabbiyal-A'la", hisnUri(41))]);
  map.set(10, [remote(10, 0, "Subhana Rabbiyal-A'la", hisnUri(41))]);

  // 10. Jalsah (hisn-48)
  map.set(9, [remote(9, 0, "Rabbi ighfir li", hisnUri(48))]);

  // 13 & 14. Tashahhud (hisn-52) — final sitting reuses At-Tahiyyat audio
  map.set(12, [remote(12, 0, "At-Tahiyyat", hisnUri(52))]);
  map.set(13, [remote(13, 0, "At-Tahiyyat", hisnUri(52))]);

  // 15. Salawat (hisn-53)
  map.set(14, [remote(14, 0, "Allahumma salli 'ala Muhammad…", hisnUri(53))]);

  // 16. Four trials (hisn-55)
  map.set(15, [remote(15, 0, "Allahumma inni a'udhu…", hisnUri(55))]);

  // 17. Taslim — no clean single-phrase OSS clip that matches السلام عليكم ورحمة الله
  // alone in a salah-ending context; skip rather than attaching a mismatched dua.

  return map;
}

/** Flattened queue in step order for “Play all phrases”. */
export function howToPrayPhraseQueue(reciterDir: string): AudioTrack[] {
  const byStep = howToPrayClipsByStep(reciterDir);
  const tracks: AudioTrack[] = [];
  const indices = [...byStep.keys()].sort((a, b) => a - b);
  for (const i of indices) {
    const clips = byStep.get(i);
    if (clips) tracks.push(...clips);
  }
  return tracks;
}

function phraseRemote(phraseId: string, sub: number, title: string, uri: string): AudioTrack {
  return {
    id: `salah-phrase:${phraseId}:${sub}`,
    title,
    subtitle: "Words of salah",
    uri,
  };
}

/** Phrase-bank ids on `/salah-guide/phrases` → same authentic streams. */
export function salahGuidePhraseAudio(phraseId: string, reciterDir: string): AudioTrack[] | null {
  switch (phraseId) {
    case "wudu-dua":
      return [phraseRemote(phraseId, 0, "Ashhadu…", hisnUri(13))];
    case "takbir":
      return [
        {
          ...phraseRemote(phraseId, 0, "Allahu Akbar", ADHAN_WIKI_MP3),
          clipStart: TAKBIR_CLIP.start,
          clipEnd: TAKBIR_CLIP.end,
        },
      ];
    case "subhanaka":
      return [phraseRemote(phraseId, 0, "Subhanaka Allahumma…", hisnUri(28))];
    case "fatiha":
      return ayahTracks(reciterDir, "Al-Fatihah", 1, fatihaAyahs()).map((t, i) => ({
        ...t,
        id: `salah-phrase:fatiha:${i}`,
        subtitle: "Words of salah",
      }));
    case "ruku-dhikr":
      return [phraseRemote(phraseId, 0, "Subhana Rabbiyal-'Adheem", hisnUri(33))];
    case "rising-ruku":
      return [
        phraseRemote(phraseId, 0, "Sami'Allahu liman hamidah", hisnUri(38)),
        phraseRemote(phraseId, 1, "Rabbana wa lakal-hamd", hisnUri(39)),
      ];
    case "sujud-dhikr":
      return [phraseRemote(phraseId, 0, "Subhana Rabbiyal-A'la", hisnUri(41))];
    case "sitting-dhikr":
      return [phraseRemote(phraseId, 0, "Rabbi ighfir li", hisnUri(48))];
    case "tashahhud":
      return [phraseRemote(phraseId, 0, "At-Tahiyyat", hisnUri(52))];
    case "salawat":
      return [phraseRemote(phraseId, 0, "Allahumma salli…", hisnUri(53))];
    case "dua-before-salam":
      return [phraseRemote(phraseId, 0, "Allahumma inni a'udhu…", hisnUri(55))];
    case "salam":
      return null;
    default:
      return null;
  }
}
