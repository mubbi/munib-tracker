import { describe, expect, it } from "vitest";

import { QURAN_GUIDE_TAJWEED } from "./quran-guide-tajweed";
import {
  TAJWEED_CLASSICAL_SOURCES,
  TAJWEED_COACHING_GUIDE,
  TAJWEED_COACHING_GUIDE_VERSION,
} from "./tajweed-coaching-guide";

const entries = Object.values(TAJWEED_COACHING_GUIDE);

/** Runs of two or more Arabic letters (a typed word). Single letters naming a letter are fine. */
const ARABIC_WORD = /[ء-يٱ-ۓ]{2,}/u;

describe.concurrent("tajweed coaching guide", () => {
  it("has a positive content version", () => {
    expect(TAJWEED_COACHING_GUIDE_VERSION).toBeGreaterThan(0);
  });

  it("keys every entry by its own category id", () => {
    for (const [key, entry] of Object.entries(TAJWEED_COACHING_GUIDE)) {
      expect(entry.id).toBe(key);
    }
  });

  it("cites at least one known classical work per entry (D11)", () => {
    for (const entry of entries) {
      expect(entry.sources.length, entry.id).toBeGreaterThan(0);
      for (const source of entry.sources) {
        expect(TAJWEED_CLASSICAL_SOURCES[source], `${entry.id}:${source}`).toBeDefined();
      }
    }
  });

  it("never types a Qur'an word — only single letters (examples come from the corpus)", () => {
    for (const entry of entries) {
      const text = [entry.title, entry.summary, ...entry.explanation, ...entry.howTo, entry.note]
        .filter(Boolean)
        .join("\n");
      expect(ARABIC_WORD.test(text), entry.id).toBe(false);
    }
  });

  it("never frames the card as a judgement of the reciter", () => {
    for (const entry of entries) {
      const text = [entry.summary, ...entry.explanation, ...entry.howTo, entry.note].join(" ");
      expect(text).not.toMatch(/\b(mistake|wrong|error|fail(ed)?|score)\b/i);
    }
  });

  it("links only to Learn Qur'an tajweed lessons that exist", () => {
    const lessons = new Set(QURAN_GUIDE_TAJWEED.map((lesson) => lesson.id));
    for (const entry of entries) {
      if (entry.lessonId) expect(lessons.has(entry.lessonId), entry.id).toBe(true);
    }
  });
});
