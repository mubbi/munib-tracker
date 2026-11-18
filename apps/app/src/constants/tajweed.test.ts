import { getTajweedRule, quranComRecitationId, TAJWEED_RULES } from "./tajweed";

describe("getTajweedRule", () => {
  it("finds a rule by id", () => {
    expect(getTajweedRule("qalqalah")).toBe(TAJWEED_RULES.find((r) => r.id === "qalqalah"));
  });

  it("returns undefined without an id", () => {
    expect(getTajweedRule(undefined)).toBeUndefined();
  });
});

describe("quranComRecitationId", () => {
  it.each([
    ["Alafasy_128kbps", 7],
    ["Unknown_reciter", null],
  ])("maps %p to %p", (dir, expected) => {
    expect(quranComRecitationId(dir)).toBe(expected);
  });
});
