import { identityAlignment } from "./align-words";
import {
  ayahOutcome,
  beginTake,
  countWords,
  createAyahState,
  createSessionState,
  reduceSession,
  tryAgainIndexes,
  visibleWordStates,
} from "./reduce-session";
import type { CompanionEvent } from "./types";

const WORDS = ["a", "b", "c", "d"];

function session(alignment = identityAlignment(4)) {
  return beginTake(createSessionState([createAyahState(2, WORDS, alignment)]), 2);
}

const pos = (matched: number[], engineWord = Math.max(0, ...matched)): CompanionEvent => ({
  type: "position",
  surah: 1,
  ayah: 2,
  engineWord,
  totalWords: 4,
  matched,
});

function run(events: CompanionEvent[], start = session()) {
  return events.reduce(reduceSession, start);
}

describe("reduceSession", () => {
  it("marks matched words and keeps unheard words upcoming", () => {
    const s = run([pos([0, 1])]);
    expect(s.ayahs[2].states).toEqual(["matched", "matched", "upcoming", "upcoming"]);
    expect(s.ayahs[2].activeIndex).toBe(1);
  });

  it("a gap inside the spoken span is not sure, never red", () => {
    const s = run([pos([0, 2, 3])]);
    expect(s.ayahs[2].states).toEqual(["matched", "uncertain", "matched", "matched"]);
    expect(countWords(s.ayahs[2]).confirmedMismatch).toBe(0);
  });

  it("a confirmed mismatch marks the covered words", () => {
    const s = run([
      pos([0]),
      { type: "confirmedMismatch", surah: 1, ayah: 2, engineWord: 1, words: 2, reason: "missing" },
    ]);
    expect(tryAgainIndexes(s.ayahs[2])).toEqual([1, 2]);
    expect(s.ayahs[2].reasons[1]).toBe("missing");
  });

  it("a self-correction clears the mismatch to corrected", () => {
    const s = run([
      pos([0]),
      { type: "confirmedMismatch", surah: 1, ayah: 2, engineWord: 1, words: 1, reason: "wrong" },
      pos([0, 1, 2, 3]),
    ]);
    expect(s.ayahs[2].states[1]).toBe("corrected");
    expect(tryAgainIndexes(s.ayahs[2])).toEqual([]);
  });

  it("a word already heard when flagged does not count as corrected", () => {
    const s = run([
      pos([0, 1]),
      { type: "confirmedMismatch", surah: 1, ayah: 2, engineWord: 1, words: 1, reason: "vowel" },
      pos([0, 1, 2]),
    ]);
    expect(s.ayahs[2].states[1]).toBe("confirmedMismatch");
  });

  it("a mismatch on an unmapped word stays neutral", () => {
    const alignment = identityAlignment(4);
    alignment.engineToStudy[3] = [];
    alignment.studyToEngine[3] = [];
    const s = run(
      [
        {
          type: "confirmedMismatch",
          surah: 1,
          ayah: 2,
          engineWord: 3,
          words: 1,
          reason: "missing",
        },
      ],
      session(alignment),
    );
    expect(s.ayahs[2].states[3]).toBe("upcoming");
  });

  it("counts not-reached words at the end", () => {
    const s = run([pos([0, 1]), { type: "completed" }]);
    expect(s.status).toBe("settled");
    expect(countWords(s.ayahs[2])).toMatchObject({ matched: 2, notReached: 2 });
  });

  it("listen-only rows (no alignment) stay idle", () => {
    const s = run([pos([0, 1])], session(null as never));
    expect(s.ayahs[2].states.every((st) => st === "idle")).toBe(true);
  });

  it("failed keeps the text and records the code", () => {
    const s = run([{ type: "failed", code: "engine-runtime" }]);
    expect(s.status).toBe("failed");
    expect(s.failure).toBe("engine-runtime");
    expect(s.ayahs[2].words).toEqual(WORDS);
  });
});

describe("ayahOutcome (ladder)", () => {
  it("success when fully reached with no mismatch and few not-sure words", () => {
    expect(ayahOutcome(run([pos([0, 1, 2, 3])]).ayahs[2])).toBe("success");
  });

  it("lapse on a confirmed mismatch", () => {
    const s = run([
      pos([0, 1, 2, 3]),
      { type: "confirmedMismatch", surah: 1, ayah: 2, engineWord: 2, words: 1, reason: "wrong" },
    ]);
    expect(ayahOutcome(s.ayahs[2])).toBe("lapse");
  });

  it("uncertain neither advances nor lapses", () => {
    expect(ayahOutcome(run([pos([0, 3])]).ayahs[2])).toBe("neutral");
  });

  it("a partial take is neutral", () => {
    expect(ayahOutcome(run([pos([0, 1])]).ayahs[2])).toBe("neutral");
  });

  it("listen-only is neutral", () => {
    expect(ayahOutcome(createAyahState(2, WORDS, null))).toBe("neutral");
  });
});

describe("visibleWordStates (feedback timing)", () => {
  const flagged = run([
    pos([0]),
    { type: "confirmedMismatch", surah: 1, ayah: 2, engineWord: 1, words: 1, reason: "missing" },
  ]).ayahs[2];

  it("ayah timing hides the mismatch while the take is live", () => {
    expect(visibleWordStates(flagged, "ayah", true)[1]).toBe("upcoming");
    expect(visibleWordStates(flagged, "ayah", false)[1]).toBe("confirmedMismatch");
  });

  it("live timing shows it at once", () => {
    expect(visibleWordStates(flagged, "live", true)[1]).toBe("confirmedMismatch");
  });

  it("end timing shows no marks on the session screen", () => {
    expect(visibleWordStates(flagged, "end", false).every((s) => s === "idle")).toBe(true);
  });
});
