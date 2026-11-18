import events from "./__fixtures__/tilawa-events.json";
import { mapTilawaEvent, type TilawaMessage } from "./map-tilawa-event";

const ON = { confirmedMismatchEnabled: true };
const OFF = { confirmedMismatchEnabled: false };

function mapAll(list: unknown[], options = ON) {
  return (list as TilawaMessage[]).map((m) => mapTilawaEvent(m, options)).filter(Boolean);
}

describe("mapTilawaEvent (recorded engine output)", () => {
  it("correct Al-Fatiha produces positions and no mismatch", () => {
    const mapped = mapAll(events.fatihaCorrect);
    expect(mapped.some((e) => e?.type === "position")).toBe(true);
    expect(mapped.some((e) => e?.type === "confirmedMismatch")).toBe(false);
  });

  it("correct Ayat al-Kursi produces no mismatch", () => {
    const mapped = mapAll(events.ayatAlKursiCorrect);
    expect(mapped.some((e) => e?.type === "confirmedMismatch")).toBe(false);
  });

  it("a skipped ayah becomes a confirmed mismatch covering the ayah", () => {
    const mapped = mapAll(events.skippedAyah3);
    const miss = mapped.find((e) => e?.type === "confirmedMismatch");
    expect(miss).toMatchObject({
      type: "confirmedMismatch",
      surah: 1,
      ayah: 3,
      reason: "skipped-ayah",
    });
    expect(miss && "words" in miss ? miss.words : 0).toBeGreaterThan(0);
  });

  it("a cut word raises no issue — the gap is only in matched indexes", () => {
    const mapped = mapAll(events.wordCut12);
    expect(mapped.some((e) => e?.type === "confirmedMismatch")).toBe(false);
    const last = [...mapped].reverse().find((e) => e?.type === "position");
    expect(last && "matched" in last ? last.matched.length : 0).toBeLessThan(4);
  });

  it("degrades issues to uncertain when the build has no proven mismatch events", () => {
    const mapped = mapAll(events.skippedAyah3, OFF);
    expect(mapped.some((e) => e?.type === "confirmedMismatch")).toBe(false);
    expect(mapped.some((e) => e?.type === "uncertain")).toBe(true);
  });
});

describe("mapTilawaEvent (shapes)", () => {
  it("ignores unknown and display-only messages", () => {
    expect(mapTilawaEvent({ type: "verse_match" } as TilawaMessage, ON)).toBeNull();
    expect(mapTilawaEvent({ type: "raw_transcript" } as TilawaMessage, ON)).toBeNull();
    expect(mapTilawaEvent({ type: "something_new" } as TilawaMessage, ON)).toBeNull();
  });

  it("never invents a mismatch from a short matched list", () => {
    const e = mapTilawaEvent(
      {
        type: "word_progress",
        surah: 1,
        ayah: 2,
        word_index: 3,
        total_words: 4,
        matched_indices: [0],
      },
      ON,
    );
    expect(e).toEqual({
      type: "position",
      surah: 1,
      ayah: 2,
      engineWord: 3,
      totalWords: 4,
      matched: [0],
    });
  });

  it("maps repetition notes to extra words, not mismatches", () => {
    const e = mapTilawaEvent(
      {
        type: "correction_note",
        issue: { surah: 1, ayah: 2, word: 1, kind: "possible_repetition" },
      },
      ON,
    );
    expect(e).toEqual({ type: "extra", surah: 1, ayah: 2, engineWord: 1 });
  });

  it("maps unclear_ayah to not sure", () => {
    const e = mapTilawaEvent(
      {
        type: "correction",
        totalWords: 4,
        state: {
          phase: "error",
          issue: { surah: 1, ayah: 3, word: 0, wordIndex: 8, kind: "unclear_ayah", words: 2 },
        },
      },
      ON,
    );
    expect(e).toMatchObject({ type: "uncertain", ayah: 3, words: 2 });
  });

  it("ignores a correction event that is not in the error phase", () => {
    expect(
      mapTilawaEvent(
        { type: "correction", totalWords: 4, state: { phase: "idle", issue: null } },
        ON,
      ),
    ).toBeNull();
  });
});
