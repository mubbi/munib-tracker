import { describe, expect, it } from "@jest/globals";

import {
  __resetFlashCardWarmCachesForTests,
  ensureFlashCardContent,
  ensureSectionQuizContent,
  getFlashCardPool,
  getQuestionsForSection,
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

describe("flash card length", () => {
  it("keeps every prompt, option and explanation short", async () => {
    await ensureFlashCardContent();
    const pool = getFlashCardPool(() => "A short sample translation for a guide section.");
    expect(pool.length).toBeGreaterThan(50);
    for (const card of pool) {
      expect(card.prompt.length).toBeLessThanOrEqual(175);
      for (const option of card.options) expect(option.length).toBeLessThanOrEqual(100);
      expect(card.explanation.length).toBeLessThanOrEqual(175);
    }
  });
});

describe("getQuestionsForSection", () => {
  it.each(["hayd", "sick", "travel", "events"] as const)(
    "adds i18n guide cards for %s",
    async (section) => {
      await ensureSectionQuizContent(section);
      const questions = getQuestionsForSection(section);
      expect(questions.length).toBeGreaterThan(0);
      expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    },
  );

  it("returns nothing for an unknown section", async () => {
    await ensureSectionQuizContent("nope" as never);
    expect(getQuestionsForSection("nope" as never)).toEqual([]);
  });

  it("maps true/false questions", () => {
    expect(toQuizPlayerQuestions([sampleMcq("tf")])[0].type).toBe("true-false");
    expect(
      toQuizPlayerQuestions([{ ...sampleMcq("mc"), options: ["a", "b", "c", "d"] }])[0].type,
    ).toBe("multiple-choice");
  });

  it("uses the app translator by default for the global pool", () => {
    expect(getFlashCardPool().length).toBeGreaterThan(0);
  });
});
