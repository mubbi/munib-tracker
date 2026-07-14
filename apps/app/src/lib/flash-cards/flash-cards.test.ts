import { describe, expect, it } from "@jest/globals";
import { TRAVEL_RAKATS } from "@munib-tracker/shared/content/travel-guide";
import { getQuestionsForSection, LEARN_QUIZ_SECTIONS } from "@/lib/flash-cards";
import { mcqsFromGlossary } from "@/lib/flash-cards/from-glossary";
import { mcqsFromTravelRakats } from "@/lib/flash-cards/from-hajj-travel";
import { mcqsFromQuranMeta } from "@/lib/flash-cards/from-quran-meta";
import { mcqsFromTopics } from "@/lib/flash-cards/from-topics";
import {
  buildMcq,
  dedupeMcqs,
  pickDistractors,
  sampleMcqs,
  truncateText,
} from "@/lib/flash-cards/mcq-helpers";
import { getSurahMeta } from "@/lib/quran-meta";

describe("flash-cards mcq helpers", () => {
  it("truncates long text with an ellipsis", () => {
    const long = "a ".repeat(80);
    const truncated = truncateText(long, 40);
    expect(truncated.length).toBeLessThanOrEqual(42);
    expect(truncated.endsWith("…")).toBe(true);
  });

  it("picks three unique distractors excluding the correct answer", () => {
    const distractors = pickDistractors("alpha", ["alpha", "beta", "gamma", "delta", "epsilon"]);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain("alpha");
  });

  it("builds a four-option MCQ when the pool is large enough", () => {
    const card = buildMcq({
      id: "test:1",
      sourceId: "aqeedah",
      prompt: "What is tawheed?",
      correct: "Oneness of Allah",
      distractorPool: ["A bridge", "A scale", "A trumpet", "A gate"],
      explanation: "Tawheed is the oneness of Allah.",
      random: () => 0.2,
    });
    expect(card).not.toBeNull();
    expect(card?.options).toHaveLength(4);
    expect(card?.options[card.correctIndex]).toBe("Oneness of Allah");
  });

  it("returns null when fewer than three distractors exist", () => {
    const card = buildMcq({
      id: "test:2",
      sourceId: "aqeedah",
      prompt: "Short pool",
      correct: "only",
      distractorPool: ["a", "b"],
      explanation: "n/a",
    });
    expect(card).toBeNull();
  });
});

describe("flash-cards generators", () => {
  it("creates topic cards when at least four topics exist", () => {
    const topics = [
      { id: "a", title: "A", summary: "Summary A content here" },
      { id: "b", title: "B", summary: "Summary B content here" },
      { id: "c", title: "C", summary: "Summary C content here" },
      { id: "d", title: "D", summary: "Summary D content here" },
    ];
    const cards = mcqsFromTopics("aqeedah", topics);
    expect(cards.length).toBeGreaterThanOrEqual(4);
    expect(cards.every((c) => c.options.length === 4)).toBe(true);
  });

  it("creates glossary cards", () => {
    const terms = [
      { id: "1", term: "Iman", definition: "Faith" },
      { id: "2", term: "Islam", definition: "Submission" },
      { id: "3", term: "Ihsan", definition: "Excellence" },
      { id: "4", term: "Taqwa", definition: "God-consciousness" },
    ];
    const cards = mcqsFromGlossary("aqeedah", terms);
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it("builds Qur'an meta cards from surah list", () => {
    const cards = mcqsFromQuranMeta(getSurahMeta().slice(0, 20));
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((c) => c.sourceId === "quran")).toBe(true);
  });

  it("builds travel Qasr rakat cards", () => {
    const cards = mcqsFromTravelRakats(TRAVEL_RAKATS);
    expect(cards.length).toBeGreaterThanOrEqual(4);
    expect(cards.every((c) => c.sourceId === "travel")).toBe(true);
  });

  it("samples a capped quiz set", () => {
    const pool = Array.from({ length: 30 }, (_, i) => ({
      id: `q-${i}`,
      sourceId: "aqeedah" as const,
      prompt: `Q${i}`,
      options: ["a", "b", "c", "d"],
      correctIndex: 0,
      explanation: "e",
    }));
    const sampled = sampleMcqs(dedupeMcqs(pool), 10);
    expect(sampled).toHaveLength(10);
  });
});

describe("learn quiz section registry", () => {
  it("registers every learn hub we expose quizzes for", () => {
    const ids = LEARN_QUIZ_SECTIONS.map((s) => s.id);
    expect(ids).toContain("aqeedah");
    expect(ids).toContain("travel");
    expect(ids).toContain("events");
    expect(ids).toContain("hayd");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("can sample travel questions without async content", () => {
    const questions = getQuestionsForSection("travel", (key) => key);
    // Even without i18n copy, TRAVEL_RAKATS alone can fill a quiz.
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(10);
  });
});
