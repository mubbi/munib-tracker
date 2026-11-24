import type { AyahNote } from "@munib-tracker/shared/types";
import { hashAyahText } from "@munib-tracker/shared/utils";

import { resolveAyahAnnotation, segmentAyahForSpans } from "./reader-annotations";

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
    expect(a.wordSpans).toEqual([{ start: 1, end: 2, color: "rose" }]);
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
  });
});

describe("segmentAyahForSpans", () => {
  it("keeps every character and tints the span with its inner space", () => {
    const segments = segmentAyahForSpans(TEXT, [{ start: 1, end: 2, color: "green" }]);
    expect(segments.map((s) => s.text).join("")).toBe(TEXT);
    expect(segments.filter((s) => s.color === "green").map((s) => s.text)).toEqual(["لِلَّهِ رَبِّ"]);
  });

  it("returns one plain run without spans", () => {
    expect(segmentAyahForSpans(TEXT, [])).toEqual([{ text: TEXT, color: null }]);
  });
});
