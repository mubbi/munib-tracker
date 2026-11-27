/**
 * The after-Salah tasbeeh as one sequence (D69): SubhanAllah 33 → Alhamdulillah
 * 33 → then either Allahu Akbar 34 (Sahih Muslim 596, Ka'b b. 'Ujrah) or Allahu
 * Akbar 33 + the tahlil once to complete the hundred (Sahih Muslim 597, Abu
 * Hurayrah). Both make 100. The counter moves from phrase to phrase by itself.
 *
 * Every phrase is a reference to a bundled adhkar item (Arabic, translation and
 * source hadith come from the dataset — nothing is typed here); the evidence
 * references are checked against `assets/data/hadith/zikr-sources.json` by
 * `after-salah-sequence.test.ts` and logged in `docs/proofs/hands-free-tasbeeh.md`.
 *
 * Pure: the screen (`app/tasbeeh/sequence.tsx`) owns the counts and the logging.
 */

export type SequenceEnding = "takbir34" | "tahlil";

export const SEQUENCE_ENDINGS: readonly SequenceEnding[] = ["takbir34", "tahlil"];

/** The bundled after-Salah adhkar items the sequence walks through. */
export const SEQUENCE_ZIKR = {
  tasbih: "after_prayer-tasbih",
  tahmid: "after_prayer-tahmid",
  takbir: "after_prayer-takbir",
  tahlil: "after_prayer-tahlil-hundred",
} as const;

export type SequenceStep = { zikrId: string; target: number };

const SEQUENCE_IDS: ReadonlySet<string> = new Set(Object.values(SEQUENCE_ZIKR));

/** The zikr is one of the sequence's phrases (entry point from the after-Salah adhkar). */
export function isSequenceZikrId(zikrId: string): boolean {
  return SEQUENCE_IDS.has(zikrId);
}

/** The source hadith for each ending (a reference that exists in the app's data). */
export const SEQUENCE_EVIDENCE: Record<SequenceEnding, { zikrId: string; reference: string }> = {
  takbir34: { zikrId: SEQUENCE_ZIKR.takbir, reference: "Sahih Muslim 596" },
  tahlil: { zikrId: SEQUENCE_ZIKR.tahlil, reference: "Sahih Muslim 597" },
};

export const SEQUENCE_TOTAL = 100;

export function sequenceSteps(ending: SequenceEnding): SequenceStep[] {
  const opening: SequenceStep[] = [
    { zikrId: SEQUENCE_ZIKR.tasbih, target: 33 },
    { zikrId: SEQUENCE_ZIKR.tahmid, target: 33 },
  ];
  return ending === "takbir34"
    ? [...opening, { zikrId: SEQUENCE_ZIKR.takbir, target: 34 }]
    : [
        ...opening,
        { zikrId: SEQUENCE_ZIKR.takbir, target: 33 },
        { zikrId: SEQUENCE_ZIKR.tahlil, target: 1 },
      ];
}

export function parseSequenceEnding(value: string | undefined | null): SequenceEnding {
  return value === "tahlil" ? "tahlil" : "takbir34";
}

/** Recitations counted so far across the whole sequence (each step capped at its target). */
export function sequenceCount(steps: readonly SequenceStep[], counts: readonly number[]): number {
  return steps.reduce((sum, step, i) => sum + Math.min(counts[i] ?? 0, step.target), 0);
}

/** The first step still short of its target, or `steps.length` when the sequence is complete. */
export function currentStepIndex(
  steps: readonly SequenceStep[],
  counts: readonly number[],
): number {
  const index = steps.findIndex((step, i) => (counts[i] ?? 0) < step.target);
  return index < 0 ? steps.length : index;
}

/** Where to go after `fromIndex` is finished: the next unfinished step (wrapping), or -1 when all are done. */
export function nextStepIndex(
  steps: readonly SequenceStep[],
  counts: readonly number[],
  fromIndex: number,
): number {
  for (let offset = 1; offset <= steps.length; offset += 1) {
    const index = (fromIndex + offset) % steps.length;
    if ((counts[index] ?? 0) < steps[index].target) return index;
  }
  return -1;
}

/**
 * Per-step counts from today's after-Salah log. The log keeps each zikr's own
 * target (the dataset says 33 for the takbir), so a takbir already logged as done
 * counts as done here even when this sequence asks for a 34th.
 */
export function seedSequenceCounts(
  steps: readonly SequenceStep[],
  logged: (zikrId: string) => { count: number; target: number },
): number[] {
  return steps.map((step) => {
    const { count, target } = logged(step.zikrId);
    if (target > 0 && count >= target) return step.target;
    return Math.max(0, Math.min(count, step.target));
  });
}

/** What the after-Salah log records for a step count (never past the zikr's own target). */
export function loggedCount(stepCount: number, datasetTarget: number): number {
  return Math.max(0, Math.min(stepCount, datasetTarget));
}
