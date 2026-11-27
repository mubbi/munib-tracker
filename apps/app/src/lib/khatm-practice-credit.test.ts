import {
  creditedAyahsForCycle,
  decodeAyahRanges,
  encodeAyahRanges,
  khatmCycleKey,
  sanitizePracticeCredited,
} from "./khatm-practice-credit";

describe("khatm practice credit record (D72)", () => {
  it("encodes sorted, merged ranges and drops invalid numbers", () => {
    expect(encodeAyahRanges([7, 1, 2, 3, 3, 255, 0, 6237, 2.5, 6236])).toBe("1-3,7,255,6236");
    expect(encodeAyahRanges([])).toBe("");
  });

  it("round-trips the whole Qur'an as one range", () => {
    const all = Array.from({ length: 6236 }, (_, i) => i + 1);
    const encoded = encodeAyahRanges(all);
    expect(encoded).toBe("1-6236");
    expect(decodeAyahRanges(encoded).size).toBe(6236);
  });

  it("decodes tolerantly", () => {
    expect([...decodeAyahRanges("1-3,7,x,9-8,6230-9999")]).toEqual([
      1, 2, 3, 7, 8, 9, 6230, 6231, 6232, 6233, 6234, 6235, 6236,
    ]);
    expect(decodeAyahRanges(undefined).size).toBe(0);
    expect(decodeAyahRanges(12).size).toBe(0);
  });

  it("keys a cycle by start date, length and unit", () => {
    const plan = { days: 30, startDate: "2026-07-01" };
    expect(khatmCycleKey(plan, "page")).toBe("2026-07-01|30|page");
  });

  it("only returns ayahs of the matching cycle", () => {
    const record = { cycle: "a", ayahs: "1-2" };
    expect([...creditedAyahsForCycle(record, "a")]).toEqual([1, 2]);
    expect(creditedAyahsForCycle(record, "b").size).toBe(0);
    expect(creditedAyahsForCycle(undefined, "a").size).toBe(0);
  });

  it("sanitizes the stored value", () => {
    expect(sanitizePracticeCredited({ cycle: "a", ayahs: "1" })).toEqual({
      cycle: "a",
      ayahs: "1",
    });
    expect(sanitizePracticeCredited({ cycle: 1, ayahs: "1" })).toBeUndefined();
    expect(sanitizePracticeCredited(null)).toBeUndefined();
  });
});
