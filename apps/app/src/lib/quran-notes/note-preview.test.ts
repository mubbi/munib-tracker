import type { AyahNote } from "@munib-tracker/shared/types";

import {
  buildNotePreview,
  clipAtWord,
  NOTE_PREVIEW_TITLE_MAX,
  notePreviewSpeech,
  orderNotesForPreview,
  POPOVER_GAP,
  POPOVER_MARGIN,
  placePopover,
} from "./note-preview";

function note(id: string, overrides: Partial<AyahNote> = {}): AyahNote {
  return {
    id,
    surah: 2,
    ayah: 255,
    body: "",
    tags: [],
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("clipAtWord", () => {
  it("leaves short text alone and collapses whitespace", () => {
    expect(clipAtWord("  a   short\nline ", 40)).toBe("a short line");
  });

  it("cuts at the last word boundary and adds an ellipsis", () => {
    expect(clipAtWord("one two three four five", 12)).toBe("one two…");
  });

  it("hard-cuts a single very long word", () => {
    expect(clipAtWord("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdefghij…");
  });

  it("drops trailing punctuation before the ellipsis (Arabic comma too)", () => {
    expect(clipAtWord("الصبر، والشكر، والرضا بالقضاء", 15)).toBe("الصبر، والشكر…");
  });
});

describe("buildNotePreview", () => {
  it("uses the first line as the title and the rest as the excerpt", () => {
    const p = buildNotePreview(
      note("a", {
        body: "Ayat al-Kursi\n\nRecite after every Salah.\nAnd before sleep.",
        tags: ["protection"],
        color: "gold",
      }),
    );
    expect(p).toMatchObject({
      id: "a",
      ref: "2:255",
      title: "Ayat al-Kursi",
      excerpt: "Recite after every Salah. And before sleep.",
      tags: ["protection"],
      moreTags: 0,
      color: "gold",
      dir: "ltr",
      highlightOnly: false,
    });
  });

  it("continues the excerpt after a clipped first line without repeating words", () => {
    const words = Array.from({ length: 30 }, (_, i) => `word${i}`).join(" ");
    const p = buildNotePreview(note("a", { body: words }));
    expect(p.title.length).toBeLessThanOrEqual(NOTE_PREVIEW_TITLE_MAX + 1);
    expect(p.title.endsWith("…")).toBe(true);
    const shown = p.title.slice(0, -1).split(" ");
    expect(p.excerpt.startsWith(`word${shown.length} `)).toBe(true);
  });

  it("detects RTL bodies and range refs", () => {
    const p = buildNotePreview(note("u", { body: "صبر کی تلقین", endAyah: 257 }));
    expect(p.dir).toBe("rtl");
    expect(p.ref).toBe("2:255–257");
  });

  it("caps tags with an overflow count and flags highlight-only notes", () => {
    const tagged = buildNotePreview(note("t", { tags: ["a", "b", "c", "d", "e"] }));
    expect(tagged.tags).toEqual(["a", "b", "c"]);
    expect(tagged.moreTags).toBe(2);
    expect(tagged.highlightOnly).toBe(false);
    expect(buildNotePreview(note("h", { color: "rose" })).highlightOnly).toBe(true);
  });
});

describe("orderNotesForPreview", () => {
  const written = note("w", { body: "text" });
  const tagged = note("t", { tags: ["x"] });
  const colour = note("c", { color: "blue" });

  it("puts written notes before highlight-only ones", () => {
    expect(orderNotesForPreview([colour, written, tagged]).map((n) => n.id)).toEqual([
      "w",
      "t",
      "c",
    ]);
  });

  it("leads with the pointed-at note", () => {
    expect(orderNotesForPreview([written, tagged], "t").map((n) => n.id)).toEqual(["t", "w"]);
    expect(orderNotesForPreview([written], "missing").map((n) => n.id)).toEqual(["w"]);
    expect(orderNotesForPreview(undefined)).toEqual([]);
  });
});

describe("notePreviewSpeech", () => {
  it("speaks the title, or the tags of an untitled note", () => {
    expect(notePreviewSpeech(buildNotePreview(note("a", { body: "Patience" })))).toBe("Patience");
    expect(notePreviewSpeech(buildNotePreview(note("b", { tags: ["sabr", "shukr"] })))).toBe(
      "#sabr #shukr",
    );
    expect(notePreviewSpeech(undefined)).toBe("");
  });
});

describe("placePopover", () => {
  const viewport = { width: 1200, height: 800 };
  const size = { width: 320, height: 160 };

  it("places the card below the anchor, aligned to its leading edge", () => {
    const anchor = { x: 400, y: 100, width: 40, height: 30 };
    expect(placePopover(anchor, size, viewport)).toEqual({
      left: 400,
      top: 100 + 30 + POPOVER_GAP,
      placement: "below",
    });
  });

  it("aligns to the anchor's right edge in RTL", () => {
    const anchor = { x: 700, y: 100, width: 40, height: 30 };
    expect(placePopover(anchor, size, viewport, true).left).toBe(740 - 320);
  });

  it("flips above when there is no room below", () => {
    const anchor = { x: 400, y: 700, width: 40, height: 30 };
    const placed = placePopover(anchor, size, viewport);
    expect(placed.placement).toBe("above");
    expect(placed.top).toBe(700 - POPOVER_GAP - 160);
  });

  it("clamps inside the viewport margins", () => {
    const anchor = { x: 1150, y: 100, width: 30, height: 30 };
    expect(placePopover(anchor, size, viewport).left).toBe(1200 - POPOVER_MARGIN - 320);
    const left = placePopover({ x: -50, y: 100, width: 10, height: 10 }, size, viewport, true);
    expect(left.left).toBe(POPOVER_MARGIN);
  });
});
