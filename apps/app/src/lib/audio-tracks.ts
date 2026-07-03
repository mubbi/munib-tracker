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
    uri: name.audioUri,
  };
}

/** Whether an item has playable audio (used to show/hide the play control). */
export function hasAudio(item: { audioUri?: string }): boolean {
  return Boolean(item.audioUri);
}
