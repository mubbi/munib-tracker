/**
 * Voice-tasbeeh session state machine (NF-3.20). Pure: the hook dispatches
 * events with timestamps; nothing here touches the microphone or the model.
 *
 * idle → preparing → listening → stopped(reason) → (preparing …)
 *
 * Auto-stops: target reached, silence (30/60/120 s), app backgrounded, audio
 * interrupted, screen left, error. A hit only counts while listening, outside an
 * announcement mute window, and never past the target (the shell's single
 * `countOnce()` also enforces the limit).
 */

export type VoiceStopReason =
  | "user"
  | "target"
  | "silence"
  | "background"
  | "interrupted"
  | "left"
  | "error";

export type VoiceSessionStatus = "idle" | "preparing" | "listening" | "stopped";

export type VoiceSessionState = {
  status: VoiceSessionStatus;
  stopReason: VoiceStopReason | null;
  /** Stable practice error code when `stopReason === "error"`. */
  errorCode: string | null;
  /** Wall-clock ms of the last speech or count (silence auto-stop). */
  lastActivityAt: number;
  lastCountAt: number | null;
  /** First speech heard since the last count (stuck hint), or null. */
  uncountedSpeechSince: number | null;
  /** Counts made by voice in this session. */
  counted: number;
  /** Hits are ignored until this wall-clock ms (screen-reader announcement). */
  mutedUntil: number;
};

export type VoiceSessionEvent =
  | { type: "prepare"; at: number }
  | { type: "listening"; at: number }
  | { type: "speech"; at: number }
  | { type: "hit"; at: number; atLimit: boolean }
  | { type: "mute"; at: number; durationMs: number }
  | { type: "tick"; at: number; silenceStopSec: number }
  | { type: "stop"; at: number; reason: VoiceStopReason; errorCode?: string };

export const STUCK_HINT_MS = 10_000;

export const INITIAL_VOICE_SESSION: VoiceSessionState = {
  status: "idle",
  stopReason: null,
  errorCode: null,
  lastActivityAt: 0,
  lastCountAt: null,
  uncountedSpeechSince: null,
  counted: 0,
  mutedUntil: 0,
};

export type VoiceSessionResult = {
  state: VoiceSessionState;
  /** True when this event produced one count (the hook calls `countOnce()` once). */
  count: boolean;
};

const isActive = (s: VoiceSessionState) => s.status === "listening" || s.status === "preparing";

function stop(
  state: VoiceSessionState,
  reason: VoiceStopReason,
  errorCode: string | null = null,
): VoiceSessionState {
  return { ...state, status: "stopped", stopReason: reason, errorCode, uncountedSpeechSince: null };
}

export function reduceVoiceSession(
  state: VoiceSessionState,
  event: VoiceSessionEvent,
): VoiceSessionResult {
  const keep = (next: VoiceSessionState): VoiceSessionResult => ({ state: next, count: false });
  switch (event.type) {
    case "prepare":
      if (isActive(state)) return keep(state);
      return keep({
        ...INITIAL_VOICE_SESSION,
        status: "preparing",
        lastActivityAt: event.at,
      });
    case "listening":
      if (state.status !== "preparing") return keep(state);
      return keep({ ...state, status: "listening", lastActivityAt: event.at });
    case "speech":
      if (state.status !== "listening") return keep(state);
      return keep({
        ...state,
        lastActivityAt: event.at,
        uncountedSpeechSince: state.uncountedSpeechSince ?? event.at,
      });
    case "mute":
      return keep({
        ...state,
        mutedUntil: Math.max(state.mutedUntil, event.at + event.durationMs),
      });
    case "hit": {
      if (state.status !== "listening") return keep(state);
      if (event.at < state.mutedUntil) return keep(state);
      if (event.atLimit) return keep(stop(state, "target"));
      return {
        state: {
          ...state,
          counted: state.counted + 1,
          lastCountAt: event.at,
          lastActivityAt: event.at,
          uncountedSpeechSince: null,
        },
        count: true,
      };
    }
    case "tick":
      if (state.status !== "listening") return keep(state);
      if (event.at - state.lastActivityAt >= event.silenceStopSec * 1000) {
        return keep(stop(state, "silence"));
      }
      return keep(state);
    case "stop":
      if (!isActive(state)) return keep(state);
      return keep(stop(state, event.reason, event.errorCode ?? null));
    default:
      return keep(state);
  }
}

/** "Say the phrase clearly, or tap to count" — speech heard, nothing counted for 10 s. */
export function isStuck(state: VoiceSessionState, now: number): boolean {
  return (
    state.status === "listening" &&
    state.uncountedSpeechSince != null &&
    now - state.uncountedSpeechSince >= STUCK_HINT_MS
  );
}

/** Screen-reader announcements are capped at milestones while listening (the phone's own voice could be counted). */
export function effectiveAnnouncements(
  setting: "every" | "milestones" | "off",
  listening: boolean,
): "every" | "milestones" | "off" {
  if (listening && setting === "every") return "milestones";
  return setting;
}
