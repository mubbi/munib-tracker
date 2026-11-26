import type { DurudItem } from "@munib-tracker/shared/types";
import { useCallback, useRef } from "react";

import { contentAudioTrack } from "@/lib/audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

/** Only a recorded, dataset-verified recitation counts — rows hide Play otherwise. */
export function duroodHasAudio(item: Pick<DurudItem, "audioUri">): boolean {
  return Boolean(item.audioUri);
}

/**
 * List variant of the reader's Play: which row's durood is playing, and play /
 * pause by item through the shared player. One hook for the whole list keeps
 * memoized rows cheap (they get plain props). Track ids are the durood ids —
 * the same ids the reading card uses, so both controls agree on "playing".
 */
export function useDuroodListAudio(sourceHref?: string): {
  playingId: string | null;
  toggle: (item: DurudItem) => void;
} {
  const audio = useAudioPlayerContext();
  const active = (audio.isPlaying || audio.isBuffering) && !audio.isQueueFinished;
  const playingId = active && audio.current ? audio.current.id : null;

  const audioRef = useRef(audio);
  audioRef.current = audio;

  const toggle = useCallback(
    (item: DurudItem) => {
      const live = audioRef.current;
      if (live.current?.id === item.id && !live.isQueueFinished) {
        live.toggle();
        return;
      }
      const track = contentAudioTrack(item, item.reference);
      if (!track) return;
      live.play([track], 0, sourceHref ? { sourceHref } : undefined);
    },
    [sourceHref],
  );

  return { playingId, toggle };
}
