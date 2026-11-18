import { RECITATION_MODELS } from "@/constants/recitation-models";
import type { DueItem } from "@/lib/quran-companion/due-queue";
import type { RecitationModelManifest } from "@/lib/quran-companion/model/types";
import type { EngineId, MemorizationRecord, PracticeSummary } from "@/lib/quran-companion/types";

/** A manifest matching the pinned files of `engine` (so the listener reads as "ready"). */
export function buildRecitationManifest(
  engine: EngineId = "tilawa-zipformer",
  overrides: Partial<RecitationModelManifest> = {},
): RecitationModelManifest {
  const spec = RECITATION_MODELS[engine];
  return {
    engine,
    version: spec.version,
    files: spec.files.map(({ fileName, bytes, sha256, md5 }) => ({ fileName, bytes, sha256, md5 })),
    downloadedAt: "2026-07-03T00:00:00.000Z",
    ...overrides,
  };
}

/** An overdue "practising" ladder row. */
export function buildMemorizationRecord(
  overrides: Partial<MemorizationRecord> = {},
): MemorizationRecord {
  return {
    status: "practising",
    successStreak: 2,
    intervalDays: 3,
    nextReviewAt: "2020-01-01",
    lastAttemptAt: "2019-12-29",
    lapses: 1,
    ...overrides,
  };
}

export function buildPracticeSummary(overrides: Partial<PracticeSummary> = {}): PracticeSummary {
  return {
    id: "s1",
    mode: "check",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    startedAt: "2026-07-03T10:00:00.000Z",
    endedAt: "2026-07-03T10:05:00.000Z",
    durationMs: 300_000,
    engine: "none",
    engineVersion: "",
    matched: 7,
    uncertain: 0,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 0,
    weakAyahs: [],
    ...overrides,
  };
}

export function buildDueItem(overrides: Partial<DueItem> = {}): DueItem {
  const surah = overrides.surah ?? 1;
  const ayah = overrides.ayah ?? 1;
  return {
    key: `${surah}:${ayah}`,
    surah,
    ayah,
    overdueDays: 0,
    lapses: 0,
    source: "memorization",
    ...overrides,
  };
}
