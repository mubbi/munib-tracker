/**
 * Tasbeeh click engine (NF-3.19). A small round-robin pool of `expo-audio`
 * players per sound, preloaded when sound is switched on, so a click starts
 * within a frame of the tap. `expo-audio` and the audio files are imported
 * lazily: with sound off (the phone default) nothing audio-related loads.
 *
 * Rules: a click is skipped — never the count — when taps come under 40 ms
 * apart (the completion "strand settles" cue is never skipped); ticks mix with other audio and never pause Qur'an or the Adhan; the
 * iOS silent switch is respected whenever the shared player is idle.
 */

import type { AudioMode } from "expo-audio";
import { Platform } from "react-native";

import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";

import type { TasbeehSoundKind, TasbeehSoundPackId } from "./sound-packs";

/** Taps closer than this skip the click (the count still happens). */
export const MIN_SOUND_GAP_MS = 40;

/** Players per sound: enough for rapid taps without one restarting mid-click. */
export const POOL_SIZES: Record<TasbeehSoundKind, number> = { bead: 4, spacer: 2, complete: 1 };

/**
 * Session for counting: mix with anything already playing and honour the iOS
 * silent switch. Only applied while the shared Qur'an / Adhan player is idle —
 * switching the app-wide session under an active recitation would silence it.
 */
export const TASBEEH_AUDIO_MODE: Partial<AudioMode> = {
  playsInSilentMode: false,
  shouldPlayInBackground: false,
  interruptionMode: "mixWithOthers",
  allowsRecording: false,
};

/** True when a click should play for a tap at `now` after the last click at `lastAt`. */
export function shouldPlaySound(now: number, lastAt: number | null): boolean {
  return lastAt === null || now - lastAt >= MIN_SOUND_GAP_MS;
}

/** The slice of an `expo-audio` player the engine uses. */
export interface PooledPlayer {
  volume: number;
  seekTo: (seconds: number) => Promise<void> | void;
  play: () => void;
  remove?: () => void;
  release?: () => void;
}

export interface TasbeehAudioDeps {
  createAudioPlayer: (source: number) => PooledPlayer;
  setAudioModeAsync: (mode: Partial<AudioMode>) => Promise<void>;
  files: Record<TasbeehSoundPackId, Record<TasbeehSoundKind, number>>;
}

/** Loads `expo-audio` + the bundled files on first use; `null` when audio is unavailable. */
export async function loadTasbeehAudioDeps(): Promise<TasbeehAudioDeps | null> {
  try {
    const [audio, files] = await Promise.all([import("expo-audio"), import("./sound-files")]);
    if (typeof audio.createAudioPlayer !== "function") return null;
    return {
      createAudioPlayer: (source) => audio.createAudioPlayer(source) as unknown as PooledPlayer,
      setAudioModeAsync: audio.setAudioModeAsync,
      files: files.TASBEEH_SOUND_FILES,
    };
  } catch {
    return null;
  }
}

export interface TasbeehSoundEngine {
  /** Plays a click; returns false when it was skipped (too soon after the last one, or released). */
  play: (kind: TasbeehSoundKind, now?: number) => boolean;
  setVolume: (volume: number) => void;
  release: () => void;
}

export function createTasbeehSoundEngine(
  deps: TasbeehAudioDeps,
  pack: TasbeehSoundPackId,
  volume: number,
): TasbeehSoundEngine {
  const pools = {} as Record<TasbeehSoundKind, PooledPlayer[]>;
  const cursor: Record<TasbeehSoundKind, number> = { bead: 0, spacer: 0, complete: 0 };
  for (const kind of Object.keys(POOL_SIZES) as TasbeehSoundKind[]) {
    pools[kind] = [];
    for (let i = 0; i < POOL_SIZES[kind]; i++) {
      try {
        const player = deps.createAudioPlayer(deps.files[pack][kind]);
        player.volume = volume;
        pools[kind].push(player);
      } catch {
        // A player that fails to load just leaves a smaller pool.
      }
    }
  }
  let lastAt: number | null = null;
  let released = false;

  return {
    play(kind, now = Date.now()) {
      if (released) return false;
      // The completion cue always plays, even right after the final click.
      if (kind !== "complete" && !shouldPlaySound(now, lastAt)) return false;
      const pool = pools[kind];
      if (pool.length === 0) return false;
      lastAt = now;
      const player = pool[cursor[kind] % pool.length];
      cursor[kind] = (cursor[kind] + 1) % pool.length;
      try {
        const seek = player.seekTo(0);
        if (seek && typeof (seek as Promise<void>).catch === "function") {
          (seek as Promise<void>).catch(() => {});
        }
        player.play();
      } catch {
        return false;
      }
      return true;
    },
    setVolume(next) {
      for (const pool of Object.values(pools)) {
        for (const player of pool) player.volume = next;
      }
    },
    release() {
      if (released) return;
      released = true;
      for (const pool of Object.values(pools)) {
        for (const player of pool) {
          try {
            if (player.remove) player.remove();
            else player.release?.();
          } catch {
            // Already released.
          }
        }
      }
    },
  };
}

/**
 * Applies the counting session (or restores the shared playback session). Web
 * has no session to set. Never throws.
 */
export async function applyTasbeehAudioMode(
  deps: Pick<TasbeehAudioDeps, "setAudioModeAsync">,
  counting: boolean,
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await deps.setAudioModeAsync(counting ? TASBEEH_AUDIO_MODE : PLAYBACK_AUDIO_MODE);
  } catch {
    // Non-fatal: clicks still play under the shared session.
  }
}

/**
 * Settings "Test" button: plays one bead click and one spacer click from `pack`
 * on a short-lived engine. Resolves to false when audio is unavailable.
 */
export async function previewTasbeehSound(
  pack: TasbeehSoundPackId,
  volume: number,
  loadDeps: () => Promise<TasbeehAudioDeps | null> = loadTasbeehAudioDeps,
): Promise<boolean> {
  const deps = await loadDeps();
  if (!deps) return false;
  const engine = createTasbeehSoundEngine(deps, pack, volume);
  const played = engine.play("bead");
  setTimeout(() => engine.play("spacer"), 260);
  setTimeout(() => engine.release(), 1200);
  return played;
}
