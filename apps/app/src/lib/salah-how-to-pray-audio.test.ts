import { describe, expect, it } from "@jest/globals";

import {
  howToPrayClipsByStep,
  howToPrayPhraseQueue,
  howToPrayStepIndexFromId,
  isHowToPrayTrack,
  salahGuidePhraseAudio,
} from "@/lib/salah-how-to-pray-audio";

const RECITER = "Alafasy_128kbps";

describe("salah how-to-pray audio", () => {
  it("maps arabic steps to authentic clips", () => {
    const byStep = howToPrayClipsByStep(RECITER);
    // Opening takbir, istiftah, ta'awwudh, fatiha, ruku, rising, sujud×2, jalsah,
    // tashahhud×2, salawat, four-trial dua — not taslim.
    expect(byStep.size).toBe(13);
    expect(byStep.has(1)).toBe(true);
    expect(byStep.has(16)).toBe(false); // taslim gap
  });

  it("builds a play-all queue with stable step ids", () => {
    const queue = howToPrayPhraseQueue(RECITER);
    expect(queue.length).toBeGreaterThan(12);
    expect(isHowToPrayTrack(queue[0]?.id)).toBe(true);
    expect(howToPrayStepIndexFromId(queue[0]?.id)).toBe(1);
  });

  it("covers the words-of-salah bank except closing salam", () => {
    const covered = [
      "wudu-dua",
      "takbir",
      "subhanaka",
      "fatiha",
      "ruku-dhikr",
      "rising-ruku",
      "sujud-dhikr",
      "sitting-dhikr",
      "tashahhud",
      "salawat",
      "dua-before-salam",
    ];
    for (const id of covered) {
      expect(salahGuidePhraseAudio(id, RECITER)?.length).toBeGreaterThan(0);
    }
    expect(salahGuidePhraseAudio("salam", RECITER)).toBeNull();
  });

  it("streams Allahu Akbar from Wikimedia with a timed clip (not a broken empty uri)", () => {
    const [takbir] = salahGuidePhraseAudio("takbir", RECITER) ?? [];
    expect(takbir?.uri).toContain("wikimedia.org");
    expect(takbir?.uri).toContain("Adhan_wiki");
    expect(takbir?.source).toBeUndefined();
    expect(takbir?.clipEnd).toBeGreaterThan(takbir?.clipStart ?? 0);
  });
});
