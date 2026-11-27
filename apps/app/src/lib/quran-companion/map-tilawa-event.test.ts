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

describe("mapTilawaEvent (free recitation verse events)", () => {
  const FREE = { confirmedMismatchEnabled: false, verseEvents: true };

  it("drops verse-level messages unless verse events are on (practice)", () => {
    const match = {
      type: "verse_match",
      surah: 2,
      ayah: 255,
      confidence: 0.9,
    } as TilawaMessage;
    expect(mapTilawaEvent(match, ON)).toBeNull();
    expect(mapTilawaEvent(match, FREE)).toEqual({
      type: "verseMatch",
      surah: 2,
      ayah: 255,
      confidence: 0.9,
    });
  });

  it("maps ranked candidates, clamps confidence and keeps a multi-ayah span", () => {
    const e = mapTilawaEvent(
      {
        type: "verse_candidate",
        candidates: [
          { surah: 1, ayah: 1, ayah_end: 3, confidence: 1.4, rank: 0 },
          { surah: 112, ayah: 1, ayah_end: null, confidence: 0.4, rank: 1 },
          { surah: 0, ayah: 1, confidence: 0.9 },
          { surah: 115, ayah: 1, confidence: 0.9 },
        ],
        stable: true,
        final_flush: false,
      },
      FREE,
    );
    expect(e).toEqual({
      type: "verseCandidates",
      candidates: [
        { surah: 1, ayah: 1, ayahEnd: 3, confidence: 1 },
        { surah: 112, ayah: 1, confidence: 0.4 },
      ],
      stable: true,
      final: false,
    });
  });

  it("drops a candidate list with no valid ayah", () => {
    expect(
      mapTilawaEvent(
        { type: "verse_candidate", candidates: [], stable: false, final_flush: true },
        FREE,
      ),
    ).toBeNull();
  });

  it("maps the recorded final sequence", () => {
    const fatiha = (events.fatihaCorrect as TilawaMessage[]).find(
      (m) => m.type === "final_sequence",
    ) as TilawaMessage;
    const e = mapTilawaEvent(fatiha, FREE);
    expect(e?.type).toBe("verseSequence");
    expect(e && "verses" in e ? e.verses.map((v) => v.ayah) : []).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("still maps word progress and issues the same way", () => {
    const mapped = mapAll(events.fatihaCorrect, FREE);
    expect(mapped.filter((e) => e?.type === "position").length).toBe(80);
  });
});
