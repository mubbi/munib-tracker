import { DEFAULT_ENGINE } from "@/constants/recitation-models";

import type { QuranCompanionPrefs } from "./types";

/**
 * Defaults from §9.5. Translation / transliteration visibility is the app-wide
 * `prefs.readingDisplay` (D13), no longer a practice field.
 */
export const DEFAULT_COMPANION_PREFS: QuranCompanionPrefs = {
  schemaVersion: 1,
  defaultMode: "follow",
  rangePreset: "ayah",
  feedbackTiming: "ayah",
  showTajweedColors: false,
  practiceView: "ayah",
  hearBeforeRecite: "off",
  autoAdvance: true,
  keepAwake: true,
  startFrom: "lastPractice",
  dailyRevisionLimit: 10,
  includeHifzReview: true,
  revisionReminder: false,
  coachDismissed: false,
  engineChoice: DEFAULT_ENGINE,
  wifiOnlyDownload: true,
  feedCoachingFromAssessment: true,
  tajweedInRevisionReminder: true,
};

const MODES = new Set(["follow", "check", "hide-words", "hide-ayahs"]);
const LIMITS = new Set([5, 10, 20]);
const VIEWS = new Set(["ayah", "page", "mushaf"]);

/**
 * Merge a stored/remote value onto the defaults, dropping invalid fields. Returns
 * `null` for a blob written by a newer schema so it is left untouched.
 */
export function coercePrefs(value: unknown): QuranCompanionPrefs | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_COMPANION_PREFS };
  }
  const v = value as Partial<QuranCompanionPrefs> & { schemaVersion?: number };
  if (typeof v.schemaVersion === "number" && v.schemaVersion > 1) return null;
  const merged: QuranCompanionPrefs = { ...DEFAULT_COMPANION_PREFS, ...v, schemaVersion: 1 };
  if (!MODES.has(merged.defaultMode)) merged.defaultMode = DEFAULT_COMPANION_PREFS.defaultMode;
  if (!VIEWS.has(merged.practiceView)) merged.practiceView = DEFAULT_COMPANION_PREFS.practiceView;
  if (typeof merged.feedCoachingFromAssessment !== "boolean") {
    merged.feedCoachingFromAssessment = DEFAULT_COMPANION_PREFS.feedCoachingFromAssessment;
  }
  if (typeof merged.tajweedInRevisionReminder !== "boolean") {
    merged.tajweedInRevisionReminder = DEFAULT_COMPANION_PREFS.tajweedInRevisionReminder;
  }
  if (!LIMITS.has(merged.dailyRevisionLimit)) {
    merged.dailyRevisionLimit = DEFAULT_COMPANION_PREFS.dailyRevisionLimit;
  }
  if (
    merged.engineChoice !== "tilawa-zipformer" &&
    merged.engineChoice !== "tilawa-fastconformer"
  ) {
    merged.engineChoice = DEFAULT_COMPANION_PREFS.engineChoice;
  }
  return merged;
}

/**
 * True for the exact defaults with no `lastPassage` (blob-sync `isPristine`, §10)
 * so a brand-new install never pushes defaults over an account with settings.
 * Legacy reading toggles in old blobs are ignored (only default keys are compared).
 */
export function isPristineCompanionPrefs(value: unknown): boolean {
  if (value == null || typeof value !== "object") return true;
  const v = value as Record<string, unknown>;
  if (v.lastPassage != null || v.pronunciationConsentAt != null) return false;
  for (const [key, def] of Object.entries(DEFAULT_COMPANION_PREFS)) {
    if (key in v && v[key] !== def) return false;
  }
  return true;
}
