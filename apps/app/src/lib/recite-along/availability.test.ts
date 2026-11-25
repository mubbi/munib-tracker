import { setPlatform } from "@/test-support/platform";

import { isReciteAlongAvailable } from "./availability";
import { isQalqalahLetter, QALQALAH_LETTER_IDS } from "./tajweed";

describe("isReciteAlongAvailable", () => {
  it("is offered until the listener says this runtime is unsupported", () => {
    expect(isReciteAlongAvailable()).toBe(true);
    expect(isReciteAlongAvailable({ status: "not-downloaded" })).toBe(true);
    expect(isReciteAlongAvailable({ status: "ready" })).toBe(true);
    expect(isReciteAlongAvailable({ status: "unsupported" })).toBe(false);
  });

  it("is never offered on TV", () => {
    const restore = setPlatform({ isTV: true });
    try {
      expect(isReciteAlongAvailable({ status: "ready" })).toBe(false);
    } finally {
      restore();
    }
  });
});

describe("qalqalah letters", () => {
  it("are the five letters of qutbu jad", () => {
    expect(QALQALAH_LETTER_IDS).toHaveLength(5);
    expect(isQalqalahLetter("qaf")).toBe(true);
    expect(isQalqalahLetter("dal")).toBe(true);
    expect(isQalqalahLetter("kaf")).toBe(false);
  });
});
