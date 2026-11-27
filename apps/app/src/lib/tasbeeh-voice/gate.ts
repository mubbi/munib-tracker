import type { TasbeehVoicePreferences, TasbeehVoiceSensitivity } from "@munib-tracker/shared/types";

import type { PhraseKey } from "./phrases";

/**
 * Confidence gate (NF-3.20 step 6, D16). A spotter hit counts only when its mean
 * per-frame log-likelihood ratio (`SpotHit.score`, ≤ 0) is at or above the
 * threshold. Strict is the default; Balanced trades a little over-count safety
 * for fewer missed counts. Thresholds come from spike S1/S2 (proof log,
 * "measured on reference + synthetic audio"): Strict is the loosest sweep value
 * whose over-count stayed ≤ 0.5%, Balanced the loosest ≤ 1.5%.
 *
 * Personal calibration adds a per-phrase offset (this device only). It can relax
 * the threshold for a quieter or accented voice, but never below
 * {@link CALIBRATION_FLOOR} — over-counting stays a release-blocking bug.
 */

export const SENSITIVITY_THRESHOLDS: Record<TasbeehVoiceSensitivity, number> = {
  strict: -0.5,
  balanced: -0.8,
};

/** Calibration may relax a threshold by at most this much. */
export const MAX_CALIBRATION_RELAX = 0.3;
/** …and never below this absolute threshold. */
export const CALIBRATION_FLOOR = -1;
/** Calibration may tighten (for a very clear voice) by at most this much. */
export const MAX_CALIBRATION_TIGHTEN = 0.2;

export const DEFAULT_TASBEEH_VOICE: TasbeehVoicePreferences = {
  sensitivity: "strict",
  silenceStopSec: 60,
};

export function resolveTasbeehVoicePrefs(
  value: Partial<TasbeehVoicePreferences> | null | undefined,
): TasbeehVoicePreferences {
  const sensitivity = value?.sensitivity === "balanced" ? "balanced" : "strict";
  const silenceStopSec =
    value?.silenceStopSec === 30 || value?.silenceStopSec === 120 ? value.silenceStopSec : 60;
  return { sensitivity, silenceStopSec };
}

export type PhraseCalibration = { thresholdOffset: number; at: string };
export type TasbeehVoiceCalibration = Partial<Record<PhraseKey, PhraseCalibration>>;

export function clampOffset(offset: number): number {
  if (!Number.isFinite(offset)) return 0;
  return Math.max(-MAX_CALIBRATION_RELAX, Math.min(MAX_CALIBRATION_TIGHTEN, offset));
}

/** The threshold a hit must reach for `phrase` with these settings. */
export function thresholdFor(
  sensitivity: TasbeehVoiceSensitivity,
  calibration?: PhraseCalibration | null,
): number {
  const base = SENSITIVITY_THRESHOLDS[sensitivity];
  const offset = clampOffset(calibration?.thresholdOffset ?? 0);
  return Math.max(CALIBRATION_FLOOR, base + offset);
}

export function passesGate(score: number, threshold: number): boolean {
  return Number.isFinite(score) && score >= threshold;
}

/** Calibration asks for this many repetitions… */
export const CALIBRATION_REPS = 5;
/** …and needs at least this many heard to save anything. */
export const CALIBRATION_MIN_HEARD = 3;
/** Distance kept between the user's weaker repetitions and the threshold. */
export const CALIBRATION_MARGIN = 0.15;

export type CalibrationOutcome =
  | { ok: true; thresholdOffset: number }
  | { ok: false; reason: "not-enough" };

/**
 * Turn the scores of the calibration repetitions (heard at a loose threshold)
 * into an offset: the threshold moves to just under the user's weaker
 * repetitions (20th percentile − margin), clamped by the limits above.
 */
export function calibrationFromScores(
  scores: readonly number[],
  sensitivity: TasbeehVoiceSensitivity,
): CalibrationOutcome {
  const heard = scores.filter(Number.isFinite).sort((a, b) => a - b);
  if (heard.length < CALIBRATION_MIN_HEARD) return { ok: false, reason: "not-enough" };
  const p20 = heard[Math.floor((heard.length - 1) * 0.2)];
  const target = p20 - CALIBRATION_MARGIN;
  const base = SENSITIVITY_THRESHOLDS[sensitivity];
  return { ok: true, thresholdOffset: clampOffset(target - base) };
}

/** Loose threshold used only while calibrating (scores are collected, nothing counts). */
export const CALIBRATION_LISTEN_THRESHOLD = CALIBRATION_FLOOR - 0.2;
