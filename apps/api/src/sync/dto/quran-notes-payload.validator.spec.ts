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
});
