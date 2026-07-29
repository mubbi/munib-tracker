import type { DuaItem, DurudItem, NameOfAllah, ZikrItem } from "@munib-tracker/shared/types";

import type { AudioTrack } from "@/providers/audio-player-provider";

/**
 * Builders that turn dua / zikr / durood / name content into `AudioTrack[]` for
 * the shared player (D9). A track is produced only when the item resolves an
 * `audioUri` — callers must hide the play control otherwise, so we never imply
 * audio that does not exist.
 */

type AudioContentItem = ZikrItem | DuaItem | DurudItem;

export function contentAudioTrack(item: AudioContentItem, subtitle?: string): AudioTrack | null {
  if (!item.audioUri) return null;
  return {
    id: item.id,
    title: item.title,
    subtitle,
    uri: item.audioUri,
  };
}

export function nameAudioTrack(name: NameOfAllah): AudioTrack | null {
  if (!name.audioUri) return null;
  return {
    id: name.id,
    title: name.transliteration,
    subtitle: name.translation,
    playlistPrimary: name.arabic,
    playlistPrimaryRtl: true,
    playlistSecondary: name.meaning ?? name.translation,
    uri: name.audioUri,
  };
}

/** Track id for the single-file continuous Asma recitation. */
export const NAMES_COMPLETE_TRACK_ID = "names:complete";

/** A single continuous recitation of all 99 names. */
const ALL_NAMES_COMPLETE_URI =
  "https://cdn.jsdelivr.net/gh/ProgrammerHasan/99-names-of-allah-audios@03c526366d460c3acb163c89fadb0201fd057b96/all_names_audio_2.mp3";

export function namesCompleteTrack(): AudioTrack {
  return {
    id: NAMES_COMPLETE_TRACK_ID,
    title: "Asma-ul-Husna",
    subtitle: "All 99 names",
    uri: ALL_NAMES_COMPLETE_URI,
  };
}

/** One track per name, for continuous name-by-name playback (auto-advances). */
export function allNameTracks(names: NameOfAllah[]): AudioTrack[] {
  return names.map(nameAudioTrack).filter((t): t is AudioTrack => t != null);
}

/** Whether an item has playable audio (used to show/hide the play control). */
export function hasAudio(item: { audioUri?: string }): boolean {
  return Boolean(item.audioUri);
}
