import { useCallback, useEffect, useRef } from "react";

import {
  applyTasbeehAudioMode,
  createTasbeehSoundEngine,
  loadTasbeehAudioDeps,
  type TasbeehAudioDeps,
  type TasbeehSoundEngine,
} from "./sound";
import type { TasbeehSoundKind, TasbeehSoundPackId } from "./sound-packs";

type Options = {
  enabled: boolean;
  pack: TasbeehSoundPackId;
  volume: number;
  /** The shared Qur'an / Adhan player is playing — leave its audio session alone. */
  sharedPlaying: boolean;
  /** Injectable for tests. */
  loadDeps?: () => Promise<TasbeehAudioDeps | null>;
};

/**
 * Owns the tasbeeh click engine for a mounted counter: preloads the pack when
 * sound is on, swaps it when the pack changes, applies the counting audio
 * session while the shared player is idle and restores the playback session on
 * unmount. Returns a stable `play(kind)`.
 */
export function useTasbeehSound({
  enabled,
  pack,
  volume,
  sharedPlaying,
  loadDeps = loadTasbeehAudioDeps,
}: Options): (kind: TasbeehSoundKind) => void {
  const engineRef = useRef<TasbeehSoundEngine | null>(null);
  const depsRef = useRef<TasbeehAudioDeps | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    void loadDeps().then((deps) => {
      if (cancelled || !deps) return;
      depsRef.current = deps;
      engineRef.current = createTasbeehSoundEngine(deps, pack, volumeRef.current);
    });
    return () => {
      cancelled = true;
      engineRef.current?.release();
      engineRef.current = null;
    };
  }, [enabled, pack, loadDeps]);

  useEffect(() => {
    engineRef.current?.setVolume(volume);
  }, [volume]);

  // Counting session only while sound is on and nothing else of ours is playing.
  useEffect(() => {
    if (!enabled) return undefined;
    let applied = false;
    let cancelled = false;
    void loadDeps().then((deps) => {
      if (cancelled || !deps) return;
      depsRef.current = deps;
      if (!sharedPlaying) {
        applied = true;
        void applyTasbeehAudioMode(deps, true);
      }
    });
    return () => {
      cancelled = true;
      const deps = depsRef.current;
      if (applied && deps) void applyTasbeehAudioMode(deps, false);
    };
  }, [enabled, sharedPlaying, loadDeps]);

  return useCallback((kind: TasbeehSoundKind) => {
    engineRef.current?.play(kind);
  }, []);
}
