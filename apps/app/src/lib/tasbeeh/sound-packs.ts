/**
 * Tasbeeh sound packs (NF-3.19, D16/D28). Short, natural, percussive clicks
 * only — wood, resin, stone, glass, pearl and a mechanical clicker. No music,
 * no bells (Muslim 2114), no melodic chimes. Every file is CC0 (Kenney) and
 * listed with its source in `assets/audio/tasbeeh/README.md` and the credits.
 *
 * The audio `require()` map lives in `sound-files.ts` and is only loaded once
 * sound is switched on, so the counter never pulls audio into the first load.
 */

export const TASBEEH_SOUND_PACKS = [
  "woodSoft",
  "woodHard",
  "resin",
  "stone",
  "glass",
  "pearl",
  "clicker",
  "lcd",
] as const;

export type TasbeehSoundPackId = (typeof TASBEEH_SOUND_PACKS)[number];

/** Each pack has three sounds: a bead click, a lower spacer click and the "strand settles" completion. */
export type TasbeehSoundKind = "bead" | "spacer" | "complete";

export function isSoundPackId(id: string): id is TasbeehSoundPackId {
  return (TASBEEH_SOUND_PACKS as readonly string[]).includes(id);
}

/** Default phone volume (0–1) — soft enough for a quiet room. */
export const DEFAULT_TASBEEH_VOLUME = 0.6;
