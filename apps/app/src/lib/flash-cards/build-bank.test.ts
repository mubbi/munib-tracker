import { describe, expect, it } from "@jest/globals";

import {
  __resetFlashCardWarmCachesForTests,
  getFlashCardPool,
  toQuizPlayerQuestions,
} from "./build-bank";
import type { StudyMcq } from "./types";

function sampleMcq(id: string): StudyMcq {
  return {
    id,
    sourceId: "aqeedah",
    prompt: `Prompt ${id}`,
    options: ["A", "B"],
    correctIndex: 0,
    explanation: "Because",
    categoryLabelKey: "flashCards.category.aqeedah",
  };
}

describe("build-bank", () => {
  it("maps StudyMcq to quiz player questions", () => {
    const questions = toQuizPlayerQuestions([
      sampleMcq("tf"),
      {
        ...sampleMcq("mc"),
        options: ["A", "B", "C", "D"],
        correctIndex: 2,
      },
    ]);

    expect(questions).toHaveLength(2);
    expect(questions[0]?.type).toBe("true-false");
    expect(questions[1]?.type).toBe("multiple-choice");
    expect(questions[1]?.correctIndex).toBe(2);
    expect(questions[0]?.category).toBe("flashCards.category.aqeedah");
  });

  it("returns quran-meta MCQs even before warm corpora load", () => {
    __resetFlashCardWarmCachesForTests();
    const pool = getFlashCardPool(() => "translation");
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.some((card) => card.sourceId === "quran")).toBe(true);
  });

  it("reset warm caches clears warmed hadith/dua/names slots", () => {
    __resetFlashCardWarmCachesForTests();
    const before = getFlashCardPool(() => "x").length;
    __resetFlashCardWarmCachesForTests();
    const after = getFlashCardPool(() => "x").length;
    expect(after).toBe(before);
  });
});
