import { ZIKR_ITEMS } from "@munib-tracker/shared/content/zikr";

import zikrSources from "@/assets/data/hadith/zikr-sources.json";

import {
  currentStepIndex,
  loggedCount,
  nextStepIndex,
  parseSequenceEnding,
  SEQUENCE_ENDINGS,
  SEQUENCE_EVIDENCE,
  SEQUENCE_TOTAL,
  SEQUENCE_ZIKR,
  seedSequenceCounts,
  sequenceCount,
  sequenceSteps,
} from "./after-salah-sequence";

type Source = { reference: string; grade?: string; english?: string };
const sources = zikrSources as unknown as Record<string, { sources?: Source[] }>;

describe("after-Salah tasbeeh sequence (D69)", () => {
  it("walks bundled adhkar items only — never typed text", () => {
    for (const id of Object.values(SEQUENCE_ZIKR)) {
      const item = ZIKR_ITEMS.find((entry) => entry.id === id);
      expect(item?.categoryId).toBe("after_prayer");
      expect(item?.arabic.length).toBeGreaterThan(0);
    }
  });

  it("adds up to a hundred with either ending", () => {
    for (const ending of SEQUENCE_ENDINGS) {
      const steps = sequenceSteps(ending);
      expect(steps.reduce((sum, step) => sum + step.target, 0)).toBe(SEQUENCE_TOTAL);
    }
    expect(sequenceSteps("takbir34").map((s) => s.target)).toEqual([33, 33, 34]);
    expect(sequenceSteps("tahlil").map((s) => s.target)).toEqual([33, 33, 33, 1]);
  });

  it("cites a sahih source hadith that exists in the app's data for each ending (D11)", () => {
    const takbir = sources[SEQUENCE_EVIDENCE.takbir34.zikrId]?.sources ?? [];
    const muslim596 = takbir.find((s) => s.reference === SEQUENCE_EVIDENCE.takbir34.reference);
    expect(muslim596?.grade).toBe("Sahih");
    expect(muslim596?.english).toMatch(/thirty-three times[\s\S]*thirty-four times/);

    const tahlil = sources[SEQUENCE_EVIDENCE.tahlil.zikrId]?.sources ?? [];
    const muslim597 = tahlil.find((s) => s.reference === SEQUENCE_EVIDENCE.tahlil.reference);
    expect(muslim597?.grade).toBe("Sahih");
    expect(muslim597?.english).toMatch(/ninety-nine[\s\S]*complete a hundred/);
  });

  it("defaults to the 33 / 33 / 34 ending", () => {
    expect(parseSequenceEnding(undefined)).toBe("takbir34");
    expect(parseSequenceEnding("nonsense")).toBe("takbir34");
    expect(parseSequenceEnding("tahlil")).toBe("tahlil");
  });

  it("finds the current and next phrase", () => {
    const steps = sequenceSteps("takbir34");
    expect(currentStepIndex(steps, [0, 0, 0])).toBe(0);
    expect(currentStepIndex(steps, [33, 5, 0])).toBe(1);
    expect(currentStepIndex(steps, [33, 33, 34])).toBe(3);
    expect(nextStepIndex(steps, [33, 0, 0], 0)).toBe(1);
    // A skipped phrase is revisited after the last one.
    expect(nextStepIndex(steps, [0, 33, 34], 2)).toBe(0);
    expect(nextStepIndex(steps, [33, 33, 34], 2)).toBe(-1);
    expect(sequenceCount(steps, [33, 40, 2])).toBe(68);
  });

  it("continues from today's after-Salah log, treating a logged takbir as done", () => {
    const steps = sequenceSteps("takbir34");
    const log: Record<string, number> = {
      [SEQUENCE_ZIKR.tasbih]: 33,
      [SEQUENCE_ZIKR.tahmid]: 12,
      [SEQUENCE_ZIKR.takbir]: 33,
    };
    const counts = seedSequenceCounts(steps, (id) => ({ count: log[id] ?? 0, target: 33 }));
    expect(counts).toEqual([33, 12, 34]);
    expect(loggedCount(34, 33)).toBe(33);
    expect(loggedCount(-1, 33)).toBe(0);
  });
});
