import type { AyahNote } from "@munib-tracker/shared/types";
import { hashAyahText } from "@munib-tracker/shared/utils";

import {
  ayahTintColor,
  resolveAyahAnnotation,
  segmentAyahForSpans,
  wordNoteId,
  wordSpanAt,
  wordSpanColor,
} from "./reader-annotations";

const TEXT = "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ";

function note(id: string, overrides: Partial<AyahNote> = {}): AyahNote {
  return {
    id,
    surah: 1,
    ayah: 2,
    body: "",
    tags: [],
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("resolveAyahAnnotation", () => {
  it("is empty without notes", () => {
    expect(resolveAyahAnnotation(undefined, 2, TEXT)).toMatchObject({
      color: null,
      hasNote: false,
    });
  });

  it("draws word spans while the text hash matches", () => {
    const span = note("w", {
      color: "rose",
      words: { start: 1, end: 2 },
      textHash: hashAyahText(TEXT),
    });
    const a = resolveAyahAnnotation([span], 2, TEXT);
    expect(a.color).toBeNull();
    expect(a.wordSpans).toEqual([{ start: 1, end: 2, color: "rose", noteId: "w", hasNote: false }]);
    expect(a.hasNote).toBe(false);
  });

  it("falls back to a whole-ayah tint when the bundled text changed", () => {
    const span = note("w", {
      color: "rose",
      words: { start: 1, end: 2 },
      textHash: hashAyahText("old"),
    });
    const a = resolveAyahAnnotation([span], 2, TEXT);
    expect(a.color).toBe("rose");
    expect(a.wordSpans).toEqual([]);
  });

  it("flags a written note and opens the newest one with text", () => {
    const a = resolveAyahAnnotation(
      [note("hl", { color: "gold" }), note("txt", { body: "My reflection" })],
      2,
      TEXT,
    );
    expect(a).toMatchObject({ color: "gold", hasNote: true, latestNoteId: "txt" });
    expect(a.ayahNoteIds).toEqual(["txt"]);
  });

  it("keeps a written word-span note without a colour as an underline-only span", () => {
    const words = note("w", {
      body: "On the Lord of the worlds",
      words: { start: 2, end: 3 },
      textHash: hashAyahText(TEXT),
    });
    const a = resolveAyahAnnotation([words], 2, TEXT);
    expect(a.wordSpans).toEqual([{ start: 2, end: 3, color: null, noteId: "w", hasNote: true }]);
    expect(a.color).toBeNull();
    expect(ayahTintColor(a)).toBeNull();
    expect(a.ayahNoteIds).toEqual([]);
  });

  it("ayahTintColor prefers the whole-ayah colour, then the first coloured span", () => {
    const span = note("w", {
      color: "blue",
      words: { start: 0, end: 0 },
      textHash: hashAyahText(TEXT),
    });
    expect(ayahTintColor(resolveAyahAnnotation([span], 2, TEXT))).toBe("blue");
    expect(
      ayahTintColor(resolveAyahAnnotation([span, note("hl", { color: "gold" })], 2, TEXT)),
    ).toBe("gold");
    expect(ayahTintColor(undefined)).toBeNull();
  });
});

describe("word span lookups", () => {
  const spans = [
    { start: 1, end: 2, color: null, noteId: "a", hasNote: true },
    { start: 0, end: 3, color: "rose" as const, noteId: "b", hasNote: false },
  ];
  it("wordSpanColor skips uncoloured spans", () => {
    expect(wordSpanColor(spans, 1)).toBe("rose");
    expect(wordSpanColor(spans, 9)).toBeNull();
    expect(wordSpanColor(spans, null)).toBeNull();
  });
  it("wordNoteId only returns written notes", () => {
    expect(wordNoteId(spans, 2)).toBe("a");
    expect(wordNoteId(spans, 0)).toBeNull();
  });
  it("wordSpanAt returns the newest covering span", () => {
    expect(wordSpanAt(spans, 1)?.noteId).toBe("a");
    expect(wordSpanAt(spans, 3)?.noteId).toBe("b");
    expect(wordSpanAt(spans, null)).toBeNull();
  });
});

describe("segmentAyahForSpans", () => {
  it("keeps every character and tints the span with its inner space", () => {
    const segments = segmentAyahForSpans(TEXT, [
      { start: 1, end: 2, color: "green", noteId: "n", hasNote: false },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(TEXT);
    expect(segments.filter((s) => s.color === "green").map((s) => s.text)).toEqual(["لِلَّهِ رَبِّ"]);
  });

  it("marks the words of a written note (and the space inside the span) with its id", () => {
    const segments = segmentAyahForSpans(TEXT, [
      { start: 1, end: 2, color: null, noteId: "n", hasNote: true },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(TEXT);
    const noted = segments.filter((s) => s.noteId === "n");
    expect(noted.map((s) => s.text)).toEqual(["لِلَّهِ رَبِّ"]);
    expect(noted[0]?.color).toBeNull();
    // Spaces next to the span (outside it) carry no note.
    expect(segments[0]?.noteId).toBeUndefined();
  });

  it("returns one plain run without spans", () => {
    expect(segmentAyahForSpans(TEXT, [])).toEqual([{ text: TEXT, color: null }]);
  });
});
