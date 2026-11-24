import { describe, expect, it } from "vitest";
import { makeAyahNote as note } from "../test-support/factories";
import { QURAN_NOTE_BODY_MAX, QURAN_NOTES_MAX_BYTES } from "../types/quran-notes";
import {
  asQuranNotesMap,
  buildQuranNotesIndex,
  detectTextDirection,
  formatNoteRef,
  formatQuranNotesExport,
  gcQuranNoteTombstones,
  hashAyahText,
  highlightColorFor,
  isValidQuranNotesPayload,
  mergeQuranNotes,
  mergeQuranNotesCapped,
  normalizeNoteTag,
  normalizeNoteTags,
  noteAyahKey,
  quranNotesPayloadBytes,
  resolveNoteWordSpan,
  sanitizeAyahNote,
  suggestNoteTags,
  utf8ByteLength,
} from "./quran-notes";

const NOW = new Date("2026-11-23T12:00:00.000Z");

describe.concurrent("tag normalisation", () => {
  it("trims, strips #, collapses whitespace and lower-cases", () => {
    expect(normalizeNoteTag("  #Patience  ")).toBe("patience");
    expect(normalizeNoteTag("Mercy   of\tAllah")).toBe("mercy of allah");
    expect(normalizeNoteTag("   ")).toBe("");
    expect(normalizeNoteTag("صبر")).toBe("صبر");
  });

  it("dedupes, drops empties and caps at 10", () => {
    const many = Array.from({ length: 14 }, (_, i) => `t${i}`);
    expect(normalizeNoteTags(["Sabr", "sabr ", "#SABR", "", 3, "shukr"])).toEqual([
      "sabr",
      "shukr",
    ]);
    expect(normalizeNoteTags(many)).toHaveLength(10);
  });
});

describe.concurrent("sanitizeAyahNote / asQuranNotesMap", () => {
  it("rejects unrecognisable rows and clamps the body", () => {
    expect(sanitizeAyahNote(null)).toBeNull();
    expect(sanitizeAyahNote({ ...note("a"), surah: 115 })).toBeNull();
    expect(sanitizeAyahNote({ ...note("a"), updatedAt: "nope" })).toBeNull();
    const long = sanitizeAyahNote({ ...note("a"), body: "x".repeat(QURAN_NOTE_BODY_MAX + 50) });
    expect(long?.body).toHaveLength(QURAN_NOTE_BODY_MAX);
  });

  it("drops bad colours, backwards ranges and word spans on ranges", () => {
    const clean = sanitizeAyahNote({
      ...note("a"),
      color: "#ff0000",
      endAyah: 250,
      tags: ["  Tawakkul "],
    });
    expect(clean?.color).toBeUndefined();
    expect(clean?.endAyah).toBeUndefined();
    expect(clean?.tags).toEqual(["tawakkul"]);
    const ranged = sanitizeAyahNote({
      ...note("b"),
      endAyah: 257,
      words: { start: 0, end: 2 },
      textHash: "x",
    });
    expect(ranged?.endAyah).toBe(257);
    expect(ranged?.words).toBeUndefined();
  });

  it("re-keys by id and ignores garbage values", () => {
    const map = asQuranNotesMap({ wrongKey: note("a"), junk: 3 });
    expect(Object.keys(map)).toEqual(["a"]);
    expect(asQuranNotesMap([note("a")])).toEqual({});
  });
});

describe.concurrent("mergeQuranNotes", () => {
  it("keeps the later edit when two devices diverged", () => {
    const phone = note("n1", { body: "phone", updatedAt: "2026-11-20T10:00:00.000Z" });
    const tablet = note("n1", { body: "tablet", updatedAt: "2026-11-20T11:00:00.000Z" });
    const onlyPhone = note("n2", { body: "solo" });
    const merged = mergeQuranNotes({ n1: phone, n2: onlyPhone }, { n1: tablet }, NOW);
    expect(merged.n1?.body).toBe("tablet");
    expect(merged.n2?.body).toBe("solo");
    // Symmetric: the other device reaches the same map.
    expect(mergeQuranNotes({ n1: tablet }, { n1: phone, n2: onlyPhone }, NOW)).toEqual(merged);
  });

  it("a tombstone wins over an older edit", () => {
    const edit = note("n1", { body: "old edit", updatedAt: "2026-11-20T10:00:00.000Z" });
    const deleted = note("n1", {
      updatedAt: "2026-11-21T10:00:00.000Z",
      deletedAt: "2026-11-21T10:00:00.000Z",
    });
    expect(mergeQuranNotes({ n1: edit }, { n1: deleted }, NOW).n1?.deletedAt).toBeDefined();
    expect(mergeQuranNotes({ n1: deleted }, { n1: edit }, NOW).n1?.deletedAt).toBeDefined();
  });

  it("a newer edit beats an older tombstone", () => {
    const deleted = note("n1", {
      updatedAt: "2026-11-20T10:00:00.000Z",
      deletedAt: "2026-11-20T10:00:00.000Z",
    });
    const edit = note("n1", { body: "rewritten", updatedAt: "2026-11-22T10:00:00.000Z" });
    const merged = mergeQuranNotes({ n1: deleted }, { n1: edit }, NOW);
    expect(merged.n1?.deletedAt).toBeUndefined();
    expect(merged.n1?.body).toBe("rewritten");
  });

  it("a tombstone wins an exact tie", () => {
    const at = "2026-11-20T10:00:00.000Z";
    const edit = note("n1", { body: "same instant", updatedAt: at });
    const deleted = note("n1", { updatedAt: at, deletedAt: at });
    expect(mergeQuranNotes({ n1: edit }, { n1: deleted }, NOW).n1?.deletedAt).toBe(at);
  });

  it("garbage-collects tombstones older than 90 days", () => {
    const old = note("old", {
      updatedAt: "2026-07-01T00:00:00.000Z",
      deletedAt: "2026-07-01T00:00:00.000Z",
    });
    const recent = note("recent", {
      updatedAt: "2026-11-01T00:00:00.000Z",
      deletedAt: "2026-11-01T00:00:00.000Z",
    });
    const merged = mergeQuranNotes({ old }, { recent }, NOW);
    expect(Object.keys(merged)).toEqual(["recent"]);
    const map = { recent };
    expect(gcQuranNoteTombstones(map, NOW)).toBe(map);
  });
});

describe.concurrent("mergeQuranNotesCapped (H2: a merged blob must fit the sync cap)", () => {
  const body = (n: number) => "x".repeat(n);
  const at = (day: number) => `2026-11-${String(day).padStart(2, "0")}T00:00:00.000Z`;

  it("is the plain merge when the union fits", () => {
    const local = { a: note("a", { body: "one" }) };
    const remote = { b: note("b", { body: "two" }) };
    const result = mergeQuranNotesCapped(local, remote, NOW);
    expect(result).toEqual({
      value: mergeQuranNotes(local, remote, NOW),
      pending: 0,
      droppedTombstones: 0,
    });
  });

  it("drops the oldest tombstones first, deterministically on both devices", () => {
    const live = note("live", { body: body(400) });
    const oldTomb = note("t-old", { updatedAt: at(2), deletedAt: at(2) });
    const newTomb = note("t-new", { updatedAt: at(20), deletedAt: at(20) });
    const full = { live, "t-old": oldTomb, "t-new": newTomb };
    const cap = quranNotesPayloadBytes(full) - 10;
    const ab = mergeQuranNotesCapped({ live, "t-old": oldTomb }, { "t-new": newTomb }, NOW, cap);
    const ba = mergeQuranNotesCapped({ "t-new": newTomb }, { live, "t-old": oldTomb }, NOW, cap);
    expect(ab.pending).toBe(0);
    expect(ab.droppedTombstones).toBe(1);
    expect(Object.keys(ab.value).sort()).toEqual(["live", "t-new"]);
    expect(ba.value).toEqual(ab.value);
    expect(quranNotesPayloadBytes(ab.value)).toBeLessThanOrEqual(cap);
  });

  it("never drops a local live note: remote additions that don't fit are pending", () => {
    const mine = {
      m1: note("m1", { body: body(300), updatedAt: at(5) }),
      m2: note("m2", { body: body(300), updatedAt: at(6) }),
    };
    const theirs = {
      r1: note("r1", { body: body(300), updatedAt: at(7) }),
      r2: note("r2", { body: body(300), updatedAt: at(9) }),
    };
    const cap = quranNotesPayloadBytes({ ...mine, r2: theirs.r2 }) + 5;
    const result = mergeQuranNotesCapped(mine, theirs, NOW, cap);
    // Every local note survives; the newest remote note that fits is taken.
    expect(Object.keys(result.value).sort()).toEqual(["m1", "m2", "r2"]);
    expect(result.pending).toBe(1);
    expect(quranNotesPayloadBytes(result.value)).toBeLessThanOrEqual(cap);
  });

  it("still applies remote deletions of local notes when over the cap", () => {
    const mine = {
      m1: note("m1", { body: body(300), updatedAt: at(5) }),
      m2: note("m2", { body: body(300), updatedAt: at(6) }),
    };
    const theirs = {
      m1: note("m1", { updatedAt: at(10), deletedAt: at(10) }),
      r1: note("r1", { body: body(900), updatedAt: at(11) }),
    };
    const cap = quranNotesPayloadBytes(mine) + 50;
    const result = mergeQuranNotesCapped(mine, theirs, NOW, cap);
    expect(result.value.m1).toBeUndefined();
    expect(result.value.m2?.body).toBe(body(300));
    expect(result.pending).toBe(1);
  });

  it("keeps the local copy when a newer remote edit of the same note doesn't fit", () => {
    const mine = { m1: note("m1", { body: body(100), updatedAt: at(5) }) };
    const theirs = { m1: note("m1", { body: body(5000), updatedAt: at(8) }) };
    const cap = quranNotesPayloadBytes(mine) + 100;
    const result = mergeQuranNotesCapped(mine, theirs, NOW, cap);
    expect(result.value.m1?.body).toBe(body(100));
    expect(result.pending).toBe(1);
  });

  it("caps at the server's 1 MB by default", () => {
    const big = (prefix: string, day: number) => {
      const map: Record<string, ReturnType<typeof note>> = {};
      for (let i = 0; i < 130; i++) {
        map[`${prefix}${i}`] = note(`${prefix}${i}`, { body: body(4500), updatedAt: at(day) });
      }
      return map;
    };
    const result = mergeQuranNotesCapped(big("a", 3), big("b", 4), NOW);
    expect(quranNotesPayloadBytes(result.value)).toBeLessThanOrEqual(QURAN_NOTES_MAX_BYTES);
    expect(Object.keys(result.value).filter((id) => id.startsWith("a"))).toHaveLength(130);
    expect(result.pending).toBeGreaterThan(0);
    expect(isValidQuranNotesPayload({ value: result.value })).toBe(true);
  });
});

describe.concurrent("buildQuranNotesIndex", () => {
  it("indexes live notes by every covered ayah and by tag", () => {
    const index = buildQuranNotesIndex({
      a: note("a", {
        ayah: 255,
        endAyah: 257,
        tags: ["tawhid"],
        updatedAt: "2026-11-02T00:00:00Z",
      }),
      b: note("b", { ayah: 256, tags: ["tawhid", "deen"], color: "green" }),
      gone: note("gone", { deletedAt: "2026-11-03T00:00:00Z", tags: ["x"] }),
    });
    expect(index.live.map((n) => n.id)).toEqual(["a", "b"]);
    expect(index.byAyah[noteAyahKey(2, 255)]?.map((n) => n.id)).toEqual(["a"]);
    expect(index.byAyah[noteAyahKey(2, 256)]?.map((n) => n.id)).toEqual(["a", "b"]);
    expect(index.byAyah[noteAyahKey(2, 257)]?.map((n) => n.id)).toEqual(["a"]);
    expect(index.tags).toEqual(["tawhid", "deen"]);
    expect(index.byTag.x).toBeUndefined();
    expect(highlightColorFor(index.byAyah[noteAyahKey(2, 256)])).toBe("green");
  });

  it("formats refs and suggests tags", () => {
    expect(formatNoteRef(note("a"))).toBe("2:255");
    expect(formatNoteRef(note("a", { endAyah: 257 }))).toBe("2:255–257");
    expect(suggestNoteTags(["sabr", "shukr", "rasool"], "s", ["shukr"])).toEqual([
      "sabr",
      "rasool",
    ]);
  });
});

describe.concurrent("word spans and the textHash fallback", () => {
  const text = "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ";

  it("keeps the span while the bundled text is unchanged", () => {
    const n = note("a", { words: { start: 1, end: 2 }, textHash: hashAyahText(text) });
    expect(resolveNoteWordSpan(n, text, 5)).toEqual({ start: 1, end: 2 });
  });

  it("falls back to the whole ayah when the text changed or the span no longer fits", () => {
    const n = note("a", { words: { start: 1, end: 2 }, textHash: hashAyahText(text) });
    expect(resolveNoteWordSpan(n, `${text} `, 5)).toBeNull();
    expect(resolveNoteWordSpan(n, text, 2)).toBeNull();
    expect(resolveNoteWordSpan({ ...n, textHash: undefined }, text, 5)).toBeNull();
  });
});

describe.concurrent("direction, size and payload guard", () => {
  it("detects direction from the first strong character", () => {
    expect(detectTextDirection("یہ آیت صبر سکھاتی ہے")).toBe("rtl");
    expect(detectTextDirection("12. Patience")).toBe("ltr");
    expect(detectTextDirection("— ٱللَّهُ")).toBe("rtl");
    expect(detectTextDirection("123", "rtl")).toBe("rtl");
  });

  it("counts UTF-8 bytes", () => {
    expect(utf8ByteLength("a")).toBe(1);
    expect(utf8ByteLength("ص")).toBe(2);
    expect(utf8ByteLength("€")).toBe(3);
    expect(utf8ByteLength("😀")).toBe(4);
    expect(quranNotesPayloadBytes({})).toBe(2);
  });

  it("accepts real payloads and rejects oversize or malformed ones", () => {
    expect(isValidQuranNotesPayload({ value: null })).toBe(true);
    expect(isValidQuranNotesPayload({ value: { a: note("a") } })).toBe(true);
    expect(isValidQuranNotesPayload({ value: { b: note("a") } })).toBe(false);
    expect(isValidQuranNotesPayload({ value: { a: { id: "a" } } })).toBe(false);
    expect(isValidQuranNotesPayload({ value: {}, extra: 1 })).toBe(false);
    expect(isValidQuranNotesPayload({ value: [note("a")] })).toBe(false);
    expect(isValidQuranNotesPayload({ value: { a: note("a", { body: "x".repeat(5001) }) } })).toBe(
      false,
    );
    const big: Record<string, unknown> = {};
    for (let i = 0; i < 260; i++) big[`n${i}`] = note(`n${i}`, { body: "x".repeat(4000) });
    expect(quranNotesPayloadBytes(big as never)).toBeGreaterThan(QURAN_NOTES_MAX_BYTES);
    expect(isValidQuranNotesPayload({ value: big })).toBe(false);
  });
});

describe.concurrent("formatQuranNotesExport", () => {
  const labels = { title: "My Qur'an notes", myNote: "My note", tags: "Tags" };
  const surahName = (n: number) => (n === 2 ? "Al-Baqarah" : "Al-Fatihah");
  const notes = [
    note("b", {
      surah: 2,
      ayah: 255,
      body: "Ayat al-Kursi — protection",
      tags: ["night", "protection"],
    }),
    note("a", { surah: 1, ayah: 5, endAyah: 6, body: "یہ آیت مدد مانگنا سکھاتی ہے" }),
    note("gone", { surah: 1, ayah: 1, body: "deleted", deletedAt: "2026-11-02T00:00:00Z" }),
  ];

  it("heads each note with its ref, in reading order, as Markdown", () => {
    const md = formatQuranNotesExport(notes, { format: "markdown", labels, surahName });
    expect(md.startsWith("# My Qur'an notes")).toBe(true);
    expect(md.indexOf("### 1:5–6")).toBeLessThan(md.indexOf("### 2:255"));
    expect(md).toContain("## 2. Al-Baqarah");
    expect(md).toContain("**My note:**");
    expect(md).toContain("_Tags: #night #protection_");
    expect(md).not.toContain("deleted");
  });

  it("isolates RTL bodies so they render correctly in LTR text", () => {
    const text = formatQuranNotesExport(notes, { format: "text", labels, surahName });
    expect(text).toContain("[1:5–6]");
    expect(text).toContain("⁧یہ آیت مدد مانگنا سکھاتی ہے⁩");
    expect(text).toContain("⁦Ayat al-Kursi — protection⁩");
  });

  it("adds corpus ayah text and the edition credit only when requested", () => {
    const ayahText = (s: number, a: number) => `ayah-${s}-${a}`;
    const credit = "Arabic text: Tanzil (Uthmani)";
    const without = formatQuranNotesExport(notes, { format: "text", labels, surahName, credit });
    expect(without).not.toContain(credit);
    const md = formatQuranNotesExport(notes, {
      format: "markdown",
      labels,
      surahName,
      ayahText,
      credit,
    });
    expect(md).toContain("ayah-1-5");
    expect(md).toContain("ayah-1-6");
    expect(md.trimEnd().endsWith(`_${credit}_`)).toBe(true);
  });
});
