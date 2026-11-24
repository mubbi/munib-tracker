import data from "./pronunciation-calibration.json";
import type { PronunciationCalibration, WordScore } from "./types";
import { clampCalibrationOffset } from "./verdict";

/**
 * Pinned thresholds (spike S3, `scripts/quran-pronunciation-eval.mjs`) and the
 * optional device-local offset ("Read this ayah once to calibrate").
 *
 * The pinned file is generated, never edited by hand, and locked to the model
 * version and the vocab / corpus hashes (`calibration.test.ts`). Its `mode` is
 * the D20 / D24 outcome: `full` when S3 met the gate, otherwise `skipped-only`.
 */
export const PINNED_CALIBRATION = data as unknown as PronunciationCalibration;

/** Stored at `DB_KEYS.quranPronunciationCalibration` (deviceLocal: not synced, not backed up). */
export type DeviceCalibration = { offset: number; at: string };

/** Words a calibration read needs before anything is saved. */
export const CALIBRATION_MIN_WORDS = 3;
/** Distance kept between the reader's weaker words and the Clear threshold. */
export const CALIBRATION_MARGIN = 0.5;

export type CalibrationReadOutcome =
  | { ok: true; offset: number }
  | { ok: false; reason: "not-enough" };

/**
 * A calibration read assumes the person read the ayah as well as they can. When
 * their weaker words (20th percentile of the per-word minimum GOP) sit below the
 * Clear threshold, the flag thresholds move down by the same distance (plus a
 * margin) so their voice is not flagged for its accent. Never tightens (≤ 0).
 */
export function offsetFromCalibrationRead(
  scores: readonly WordScore[],
  clearThreshold: number = PINNED_CALIBRATION.thresholds.clear,
): CalibrationReadOutcome {
  const values = scores
    .map((s) => s.minGop)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (values.length < CALIBRATION_MIN_WORDS) return { ok: false, reason: "not-enough" };
  const p20 = values[Math.floor((values.length - 1) * 0.2)];
  if (p20 >= clearThreshold) return { ok: true, offset: 0 };
  return { ok: true, offset: clampCalibrationOffset(p20 - clearThreshold - CALIBRATION_MARGIN) };
}

export function sanitizeDeviceCalibration(value: unknown): DeviceCalibration | null {
  if (!value || typeof value !== "object") return null;
  const { offset, at } = value as { offset?: unknown; at?: unknown };
  if (typeof offset !== "number" || typeof at !== "string") return null;
  return { offset: clampCalibrationOffset(offset), at };
}
