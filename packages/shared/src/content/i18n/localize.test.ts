import { describe, expect, it } from "vitest";
import { AQEDAH_TOPICS } from "../aqeedah";
import { AQEDAH_TOPICS_UR } from "./aqeedah.ur";
import { localizeContent, localizeContentList } from "./localize";

describe("localizeContent", () => {
  it("overrides strings from the overlay and keeps English when missing", () => {
    const base = { title: "Hello", summary: "World" };
    expect(localizeContent(base, { title: "Salam" })).toEqual({ title: "Salam", summary: "World" });
  });

  it("ignores empty/whitespace overlay strings (falls back to English)", () => {
    const base = { title: "Hello" };
    expect(localizeContent(base, { title: "   " })).toEqual({ title: "Hello" });
  });

  it("never overrides protected structural keys", () => {
    const base = { id: "x", route: "/x", surah: 2, citation: "8", title: "Hello" };
    const merged = localizeContent(base, {
      id: "y",
      route: "/y",
      surah: 99,
      citation: "999",
      title: "Salam",
    });
    expect(merged).toEqual({ id: "x", route: "/x", surah: 2, citation: "8", title: "Salam" });
  });

  it("merges arrays element-by-element and keeps English for missing indices", () => {
    const base = { body: ["a", "b", "c"] };
    expect(localizeContent(base, { body: ["alif", "", undefined] })).toEqual({
      body: ["alif", "b", "c"],
    });
  });

  it("merges nested objects (e.g. quran excerpts) without touching numbers", () => {
    const base = { quran: [{ surah: 2, ayahFrom: 177, excerpt: "Righteousness…" }] };
    const merged = localizeContent(base, { quran: [{ excerpt: "نیکی…" }] });
    expect(merged).toEqual({ quran: [{ surah: 2, ayahFrom: 177, excerpt: "نیکی…" }] });
  });

  it("does not mutate the English base", () => {
    const base = { title: "Hello", body: ["a"] };
    const snapshot = JSON.parse(JSON.stringify(base));
    localizeContent(base, { title: "Salam", body: ["alif"] });
    expect(base).toEqual(snapshot);
  });
});

describe("localizeContentList against real aqeedah data", () => {
  const localized = localizeContentList(AQEDAH_TOPICS, AQEDAH_TOPICS_UR);
  const first = localized[0];
  const enFirst = AQEDAH_TOPICS[0];
  if (!first || !enFirst) throw new Error("aqeedah topics missing");

  it("translates the covered intro topics", () => {
    expect(first.title).toBe("تعارف");
    expect(first.summary).not.toBe(enFirst.summary);
    expect(first.body[0]).toContain("عقیدہ");
  });

  it("preserves structural identity (ids, surah/ayah, citations, routes)", () => {
    expect(first.id).toBe(enFirst.id);
    expect(first.quran?.[0]?.surah).toBe(enFirst.quran?.[0]?.surah);
    expect(first.hadith?.[0]?.citation).toBe(enFirst.hadith?.[0]?.citation);
    expect(first.appLinks?.[0]?.route).toBe(enFirst.appLinks?.[0]?.route);
    expect(first.appLinks?.[0]?.label).toBe("اللہ کے نام");
  });

  it("falls back to English for uncovered topics (short overlay)", () => {
    // A one-item overlay must translate only index 0 and keep the rest English.
    const partial = localizeContentList(AQEDAH_TOPICS, [{ title: "صرف پہلا" }]);
    const lastIndex = AQEDAH_TOPICS.length - 1;
    expect(partial[0]?.title).toBe("صرف پہلا");
    expect(partial[lastIndex]?.title).toBe(AQEDAH_TOPICS[lastIndex]?.title);
  });

  it("returns the English list unchanged when no overlay is provided", () => {
    expect(localizeContentList(AQEDAH_TOPICS, undefined)).toBe(AQEDAH_TOPICS);
  });
});
