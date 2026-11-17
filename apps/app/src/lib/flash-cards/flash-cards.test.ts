import { describe, expect, it } from "@jest/globals";
import { TRAVEL_RAKATS } from "@munib-tracker/shared/content/travel-guide";
import { getQuestionsForSection, LEARN_QUIZ_SECTIONS } from "@/lib/flash-cards";
import {
  advanceAfterAnswer,
  advanceAfterSkip,
  pickRandomCard,
  startFlashDeck,
} from "@/lib/flash-cards/flash-card-deck";
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
import type { StudyMcq } from "@/lib/flash-cards/types";
import { getSurahMeta } from "@/lib/quran-meta";
import { condenseText } from "./mcq-helpers";

function fakeCard(id: string): StudyMcq {
  return {
    id,
    sourceId: "aqeedah",
    prompt: id,
    options: ["a", "b", "c", "d"],
    correctIndex: 0,
    explanation: "e",
  };
}

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

  it("condenses long options to a short, readable length", () => {
    const long = (word: string) =>
      `${word} first teaching sentence. ${"Additional lengthy commentary about the matter. ".repeat(6)}`;
    const card = buildMcq({
      id: "test:condensed",
      sourceId: "hadith",
      prompt: "Which teaching is this?",
      correct: long("Alpha"),
      distractorPool: [long("Beta"), long("Gamma"), long("Delta")],
      explanation: long("Alpha"),
      random: () => 0.2,
    });
    expect(card).not.toBeNull();
    expect(card?.options.every((option) => option.length <= 95)).toBe(true);
    expect(card?.options[card.correctIndex]?.startsWith("Alpha first teaching sentence.")).toBe(
      true,
    );
    expect(card?.explanation.length).toBeLessThanOrEqual(170);
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

describe("flash card deck cycle", () => {
  const pool = [fakeCard("a"), fakeCard("b"), fakeCard("c"), fakeCard("d")];

  it("starts with a shuffled remaining set and a current card", () => {
    const deck = startFlashDeck(pool, () => 0);
    expect(deck.remaining).toHaveLength(4);
    expect(deck.current).not.toBeNull();
    expect(deck.remaining.map((c) => c.id).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("does not repeat an answered card until the cycle is exhausted", () => {
    let deck = startFlashDeck(pool, () => 0);
    const seen = new Set<string>();
    for (let i = 0; i < 4; i++) {
      const id = deck.current?.id;
      expect(id).toBeTruthy();
      if (!id) return;
      expect(seen.has(id)).toBe(false);
      seen.add(id);
      deck = advanceAfterAnswer(deck.remaining, id, pool, () => 0);
    }
    expect(seen.size).toBe(4);
    expect(deck.remaining).toHaveLength(4);
  });

  it("skip keeps the card in remaining and draws a different one when possible", () => {
    const remaining = [...pool];
    const next = advanceAfterSkip(remaining, "a", () => 0.99);
    expect(next.remaining).toHaveLength(4);
    expect(next.current?.id).not.toBe("a");
  });

  it("pickRandomCard can exclude the current id", () => {
    const picked = pickRandomCard(pool, "a", () => 0);
    expect(picked?.id).not.toBe("a");
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
    expect(ids).toContain("janazah");
    expect(ids).toContain("fidyah");
    expect(ids).toContain("whiteDays");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps janazah/fidyah flash-bank-only (no dedicated quiz route)", () => {
    const janazah = LEARN_QUIZ_SECTIONS.find((s) => s.id === "janazah");
    const fidyah = LEARN_QUIZ_SECTIONS.find((s) => s.id === "fidyah");
    expect(janazah?.quizPath).toBeUndefined();
    expect(fidyah?.quizPath).toBeUndefined();
    expect(janazah?.collect().length).toBeGreaterThan(0);
    expect(fidyah?.collect().length).toBeGreaterThan(0);
  });

  it("exposes a White Days quiz path backed by guide topics", () => {
    const whiteDays = LEARN_QUIZ_SECTIONS.find((s) => s.id === "whiteDays");
    expect(whiteDays?.quizPath).toBe("/white-days/quiz");
    expect(whiteDays?.collect().length).toBeGreaterThan(0);
  });

  it("can sample travel questions without async content", () => {
    const questions = getQuestionsForSection("travel", (key) => key);
    // Even without i18n copy, TRAVEL_RAKATS alone can fill a quiz.
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(10);
  });
});

describe("condenseText", () => {
  it("keeps whole leading sentences within the limit", () => {
    const text = `Short first sentence here. A second one that is also fine. ${"Extra. ".repeat(100)}`;
    const out = condenseText(text, 70);
    expect(out.startsWith("Short first sentence here. A second one that is also fine.")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(70);
  });
  it("cuts a long single sentence with an ellipsis", () => {
    const out = condenseText("word ".repeat(60), 50);
    expect(out.length).toBeLessThanOrEqual(50);
    expect(out.endsWith("…")).toBe(true);
  });
});
