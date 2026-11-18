import {
  advanceAfterAnswer,
  advanceAfterSkip,
  pickRandomCard,
  startFlashDeck,
} from "./flash-card-deck";
import {
  buildMcq,
  condenseText,
  dedupeMcqs,
  isCompactCard,
  sampleMcqs,
  shuffleArray,
  truncateText,
} from "./mcq-helpers";
import type { StudyMcq } from "./types";

const card = (id: string): StudyMcq => ({
  id,
  sourceId: "aqeedah",
  prompt: id,
  options: ["a", "b", "c", "d"],
  correctIndex: 0,
  explanation: "",
});

describe("text helpers", () => {
  it("cuts mid-word when there is no late space", () => {
    expect(truncateText("abcdefghij klm", 10)).toBe("abcdefghij…");
  });

  it("cuts at a clause break when the first sentence is too long", () => {
    const text = `${"word ".repeat(12)}clause; ${"more ".repeat(20)}`;
    expect(condenseText(text, 80)).toMatch(/clause…$/);
  });

  it("cuts at the last space without a clause break", () => {
    expect(condenseText(`${"alpha ".repeat(30)}`, 40)).toMatch(/alpha…$/);
  });

  it("cuts mid-word for one enormous word", () => {
    expect(condenseText("x".repeat(100), 20)).toBe(`${"x".repeat(19)}…`);
  });

  it("judges compact cards by prompt and option length", () => {
    expect(isCompactCard({ prompt: "p", options: ["a"] })).toBe(true);
    expect(isCompactCard({ prompt: "p".repeat(300), options: ["a"] })).toBe(false);
    expect(isCompactCard({ prompt: "p", options: ["a".repeat(200)] })).toBe(false);
  });
});

describe("buildMcq guards", () => {
  const base = {
    id: "x",
    sourceId: "aqeedah" as const,
    prompt: "Which?",
    correct: "Right",
    distractorPool: ["A", "B", "C"],
    explanation: "E",
  };

  it.each([
    ["an empty prompt", { prompt: "  " }],
    ["an empty answer", { correct: "" }],
    ["an overlong prompt", { prompt: "p".repeat(200) }],
  ])("rejects %s", (_label, overrides) => {
    expect(buildMcq({ ...base, ...overrides })).toBeNull();
  });

  it("builds with a deterministic shuffle", () => {
    const mcq = buildMcq({ ...base, random: () => 0 });
    expect(mcq?.options[mcq.correctIndex]).toBe("Right");
  });
});

describe("collections", () => {
  it("dedupes by id keeping the first", () => {
    expect(dedupeMcqs([card("a"), card("a"), card("b")]).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("returns every card when the sample is larger than the pool", () => {
    expect(sampleMcqs([card("a"), card("b")], 5)).toHaveLength(2);
  });

  it("shuffles without losing items", () => {
    expect(shuffleArray([1, 2, 3], () => 0.5).sort()).toEqual([1, 2, 3]);
  });
});

describe("flash deck edge cases", () => {
  it("has no card for an empty pool", () => {
    expect(pickRandomCard([])).toBeNull();
    expect(startFlashDeck([]).current).toBeNull();
  });

  it("falls back to the excluded card when it is the only one", () => {
    expect(pickRandomCard([card("a")], "a")?.id).toBe("a");
  });

  it("reshuffles the full pool after the last answer", () => {
    const pool = [card("a"), card("b")];
    const next = advanceAfterAnswer([card("a")], "a", pool, () => 0);
    expect(next.remaining).toHaveLength(2);
  });

  it("skip keeps the remaining pool intact", () => {
    expect(advanceAfterSkip([card("a"), card("b")], "a", () => 0).current?.id).toBe("b");
  });
});
