import type { PracticeErrorCode } from "@/lib/quran-companion/types";

import type { NoFitReason, StudyWordVerdict } from "./types";

/**
 * State machine for one "Check pronunciation" take (pure):
 *
 *   idle → preparing → listening → assessing → result | no-fit
 *                 ↘ error (any step)        reset → idle
 *
 * The verdicts live in memory only. What is persisted is decided by the screen
 * (`summary.ts`): word states, never audio, GOP values or transcripts.
 */

export type CheckStatus =
  | "idle"
  | "preparing"
  | "listening"
  | "assessing"
  | "result"
  | "no-fit"
  | "error";

export type CheckState = {
  status: CheckStatus;
  /** Wall-clock start of the take (ms). */
  startedAt: number | null;
  verdicts: StudyWordVerdict[] | null;
  noFit: NoFitReason | null;
  error: PracticeErrorCode | null;
  /** The take hit the length cap and was stopped for the person. */
  capped: boolean;
};

export type CheckEvent =
  | { type: "prepare" }
  | { type: "listening"; at: number }
  | { type: "stop"; capped?: boolean }
  | { type: "assessed"; verdicts: StudyWordVerdict[] }
  | { type: "no-fit"; reason: NoFitReason }
  | { type: "failed"; code: PracticeErrorCode }
  | { type: "reset" };

export const INITIAL_CHECK: CheckState = {
  status: "idle",
  startedAt: null,
  verdicts: null,
  noFit: null,
  error: null,
  capped: false,
};

/** Longest take we keep (an ayah of up to ~30 s plus a margin). Memory only. */
export const MAX_TAKE_MS = 40_000;
/** Shorter than this is not a take (a tap on Start then Stop). */
export const MIN_TAKE_MS = 600;

export function reduceCheck(state: CheckState, event: CheckEvent): CheckState {
  switch (event.type) {
    case "prepare":
      if (state.status === "preparing" || state.status === "listening") return state;
      return { ...INITIAL_CHECK, status: "preparing" };
    case "listening":
      if (state.status !== "preparing") return state;
      return { ...state, status: "listening", startedAt: event.at };
    case "stop":
      if (state.status === "preparing") return { ...INITIAL_CHECK };
      if (state.status !== "listening") return state;
      return { ...state, status: "assessing", capped: !!event.capped };
    case "assessed":
      if (state.status !== "assessing") return state;
      return { ...state, status: "result", verdicts: event.verdicts };
    case "no-fit":
      if (state.status !== "assessing") return state;
      return { ...state, status: "no-fit", noFit: event.reason };
    case "failed":
      return { ...state, status: "error", error: event.code };
    case "reset":
      return { ...INITIAL_CHECK };
    default:
      return state;
  }
}

export function isBusy(state: CheckState): boolean {
  return (
    state.status === "preparing" || state.status === "listening" || state.status === "assessing"
  );
}
