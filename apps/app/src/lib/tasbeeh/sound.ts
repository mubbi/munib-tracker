/**
 * Tasbeeh click engine (NF-3.19). A round-robin pool of `expo-audio` players per
 * sound, preloaded when sound is switched on, so a click starts within a frame
 * of the count. `expo-audio` and the audio files are imported lazily: with
 * sound off (the phone default) nothing audio-related loads.
 *
 * Rules:
 * - Every count that really happened gets its click. Counts that land in the
 *   same instant (a fast swipe, a burst of taps) are spaced
 *   {@link CLICK_SPACING_MS} apart instead of being dropped, so they stay
 *   audible as separate clicks; only a runaway backlog (more than
 *   {@link MAX_QUEUED_CLICKS} waiting) is trimmed — never the count itself.
 * - A player is only ever replayed from position 0: one that has played before
 *   is rewound and started once the seek has resolved (on iOS, `play()` on a
 *   finished player before its seek lands plays nothing). Players re-arm
 *   themselves (rewind while idle) when a click finishes, so the next use of
 *   that player starts at once.
 * - The completion "strand settles" cue always plays at once.
 * - Ticks mix with other audio and never pause Qur'an or the Adhan; the iOS
 *   silent switch is respected whenever the shared player is idle.
 */

import type { AudioMode } from "expo-audio";
import { Platform } from "react-native";

import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";

import type { TasbeehSoundKind, TasbeehSoundPackId } from "./sound-packs";

/** Clicks for counts in the same instant are spaced this far apart (never dropped). */
export const CLICK_SPACING_MS = 28;
/** Most clicks waiting for their slot; beyond this a burst is trimmed (the counts are not). */
export const MAX_QUEUED_CLICKS = 8;

/**
 * Players per sound: enough that a fast swipe never has to restart a player that
 * is still sounding (a bead click is ~120–200 ms; 8 players cover 40 counts / s).
 */
export const POOL_SIZES: Record<TasbeehSoundKind, number> = { bead: 8, spacer: 3, complete: 1 };

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

/** The slice of an `expo-audio` player the engine uses. */
export interface PooledPlayer {
  volume: number;
  seekTo: (seconds: number) => Promise<void> | void;
  play: () => void;
  /** `expo-audio` status events: used to re-arm a player when its click finishes. */
  addListener?: (
    event: "playbackStatusUpdate",
    listener: (status: { didJustFinish?: boolean }) => void,
  ) => { remove: () => void } | undefined;
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
  /**
   * Plays a click — now, or a moment later when another click is sounding in
   * this same instant. Returns false only when nothing can play (no players,
   * released, or a runaway burst was trimmed).
   */
  play: (kind: TasbeehSoundKind, now?: number) => boolean;
  setVolume: (volume: number) => void;
  release: () => void;
}

type Slot = {
  player: PooledPlayer;
  /** At position 0 and idle: `play()` starts the click straight away. */
  armed: boolean;
  /** A rewind in flight; resolves once the player is back at 0. */
  rewinding: Promise<void> | null;
  subscription: { remove: () => void } | undefined;
};

function isThenable(value: unknown): value is Promise<void> {
  return value != null && typeof (value as Promise<void>).then === "function";
}

export function createTasbeehSoundEngine(
  deps: TasbeehAudioDeps,
  pack: TasbeehSoundPackId,
  volume: number,
): TasbeehSoundEngine {
  const pools = {} as Record<TasbeehSoundKind, Slot[]>;
  const cursor: Record<TasbeehSoundKind, number> = { bead: 0, spacer: 0, complete: 0 };
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let released = false;

  /** Seeks a player back to 0; resolves when it is there (null = done synchronously / failed). */
  const rewind = (slot: Slot): Promise<void> | null => {
    let seek: unknown;
    try {
      seek = slot.player.seekTo(0);
    } catch {
      return null;
    }
    if (!isThenable(seek)) {
      slot.armed = true;
      return null;
    }
    const pending: Promise<void> = seek.then(
      () => {
        if (slot.rewinding === pending) {
          slot.rewinding = null;
          slot.armed = true;
        }
      },
      () => {
        if (slot.rewinding === pending) slot.rewinding = null;
      },
    );
    slot.rewinding = pending;
    return pending;
  };

  for (const kind of Object.keys(POOL_SIZES) as TasbeehSoundKind[]) {
    pools[kind] = [];
    for (let i = 0; i < POOL_SIZES[kind]; i++) {
      try {
        const player = deps.createAudioPlayer(deps.files[pack][kind]);
        player.volume = volume;
        // A freshly loaded player sits at 0: its first click needs no seek.
        const slot: Slot = { player, armed: true, rewinding: null, subscription: undefined };
        try {
          slot.subscription = player.addListener?.("playbackStatusUpdate", (status) => {
            if (!status?.didJustFinish || released) return;
            // Re-arm while idle, so the next round of the pool starts instantly.
            slot.armed = false;
            void rewind(slot);
          });
        } catch {
          // No status events: every replay of this player seeks first.
        }
        pools[kind].push(slot);
      } catch {
        // A player that fails to load just leaves a smaller pool.
      }
    }
  }

  const start = (slot: Slot) => {
    if (released) return;
    try {
      slot.player.play();
    } catch {
      // A player that fails mid-session just misses this one click.
    }
  };

  const fire = (kind: TasbeehSoundKind): boolean => {
    const pool = pools[kind];
    if (released || pool.length === 0) return false;
    const slot = pool[cursor[kind] % pool.length];
    cursor[kind] = (cursor[kind] + 1) % pool.length;
    if (slot.armed) {
      slot.armed = false;
      start(slot);
      return true;
    }
    // Played before (or still sounding): rewind, then start once the seek lands.
    const pending = slot.rewinding ?? rewind(slot);
    slot.armed = false;
    if (pending) {
      void pending.then(() => {
        slot.armed = false;
        start(slot);
      });
    } else {
      start(slot);
    }
    return true;
  };

  /** Earliest time the next spaced click may sound. */
  let nextFreeAt = Number.NEGATIVE_INFINITY;
  let queued = 0;

  return {
    play(kind, now = Date.now()) {
      if (released || pools[kind].length === 0) return false;
      // The completion cue always plays at once, even right after the final click.
      if (kind === "complete") return fire(kind);
      const at = Math.max(now, nextFreeAt);
      const delay = at - now;
      if (delay > 0 && queued >= MAX_QUEUED_CLICKS) return false;
      nextFreeAt = at + CLICK_SPACING_MS;
      if (delay <= 0) return fire(kind);
      queued += 1;
      const timer = setTimeout(() => {
        timers.delete(timer);
        queued -= 1;
        fire(kind);
      }, delay);
      timers.add(timer);
      return true;
    },
    setVolume(next) {
      for (const pool of Object.values(pools)) {
        for (const slot of pool) slot.player.volume = next;
      }
    },
    release() {
      if (released) return;
      released = true;
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      for (const pool of Object.values(pools)) {
        for (const slot of pool) {
          try {
            slot.subscription?.remove();
          } catch {
            // Already gone.
          }
          try {
            if (slot.player.remove) slot.player.remove();
            else slot.player.release?.();
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
