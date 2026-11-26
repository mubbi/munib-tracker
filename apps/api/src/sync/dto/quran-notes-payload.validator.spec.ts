import { describe, expect, it } from "vitest";

import { isValidQuranNotesRecord } from "./quran-notes-payload.validator";
import { SYNC_ENTITIES } from "./sync.dto";

const note = {
  id: "n1",
  surah: 38,
  ayah: 29,
  body: "Reflect on its verses",
  tags: ["tadabbur"],
  color: "gold",
  createdAt: "2026-11-23T00:00:00.000Z",
  updatedAt: "2026-11-23T00:00:00.000Z",
};

const valid = (data: unknown) => isValidQuranNotesRecord("quran_notes", data);

describe("quran_notes sync payload", () => {
  it("is a whitelisted sync entity", () => {
    expect(SYNC_ENTITIES).toContain("quran_notes");
  });

  it("accepts a notes map and a cleared (null) value", () => {
    expect(valid({ value: { n1: note } })).toBe(true);
    expect(valid({ value: null })).toBe(true);
  });

  it("rejects malformed notes, extra keys and oversize payloads", () => {
    expect(valid({ value: { n1: { id: "n1" } } })).toBe(false);
    expect(valid({ value: {}, extra: true })).toBe(false);
    const big: Record<string, unknown> = {};
    for (let i = 0; i < 260; i++) big[`n${i}`] = { ...note, id: `n${i}`, body: "x".repeat(4000) };
    expect(valid({ value: big })).toBe(false);
  });

  it("leaves other entities alone", () => {
    expect(isValidQuranNotesRecord("prayer_logs", { anything: 1 })).toBe(true);
  });
  it("accepts the optional span, colour, tags and tombstone fields when well-formed", () => {
    const full = {
      ...note,
      endAyah: 30,
      words: { start: 0, end: 4 },
      deletedAt: "2026-11-24T00:00:00.000Z",
      body: null,
      tags: null,
      color: null,
    };
    expect(valid({ value: { n1: full } })).toBe(true);
  });

  it.each<[string, Record<string, unknown>]>([
    ["a non-object note", { n1: "text" }],
    ["an id that doesn't match its key", { n1: { ...note, id: "n2" } }],
    ["an over-long id", { ["x".repeat(129)]: { ...note, id: "x".repeat(129) } }],
    ["surah 0", { n1: { ...note, surah: 0 } }],
    ["surah 115", { n1: { ...note, surah: 115 } }],
    ["a fractional ayah", { n1: { ...note, ayah: 1.5 } }],
    ["ayah 287", { n1: { ...note, ayah: 287 } }],
    ["a non-ISO createdAt", { n1: { ...note, createdAt: "yesterday" } }],
    ["a short updatedAt", { n1: { ...note, updatedAt: "2026" } }],
    ["a non-string body", { n1: { ...note, body: 42 } }],
    ["an over-long body", { n1: { ...note, body: "x".repeat(5001) } }],
    ["tags that aren't a list", { n1: { ...note, tags: "a,b" } }],
    ["too many tags", { n1: { ...note, tags: Array.from({ length: 11 }, (_, i) => `t${i}`) } }],
    ["a non-string tag", { n1: { ...note, tags: [1] } }],
    ["an over-long tag", { n1: { ...note, tags: ["t".repeat(65)] } }],
    ["an unknown colour", { n1: { ...note, color: "red" } }],
    ["an out-of-range endAyah", { n1: { ...note, endAyah: 0 } }],
    ["a word span that isn't an object", { n1: { ...note, words: [0, 1] } }],
    ["a negative word index", { n1: { ...note, words: { start: -1, end: 2 } } }],
    ["a missing word end", { n1: { ...note, words: { start: 0 } } }],
    ["a non-ISO deletedAt", { n1: { ...note, deletedAt: "soon" } }],
  ])("rejects %s", (_label, value) => {
    expect(valid({ value })).toBe(false);
  });

  it("rejects non-object envelopes and values, and values that can't be serialised", () => {
    expect(valid(null)).toBe(false);
    expect(valid([])).toBe(false);
    expect(valid({})).toBe(false);
    expect(valid({ value: [] })).toBe(false);
    expect(valid({ value: "notes" })).toBe(false);
    expect(valid({ value: { n1: { ...note, big: 10n } } })).toBe(false);
  });
});
