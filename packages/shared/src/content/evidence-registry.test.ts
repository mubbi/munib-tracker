import { describe, expect, it } from "vitest";

import { parseCorpusId, refFormatIssue, refKey } from "./content-verification";
import { fromFiqhRef, SHARED_EVIDENCE_REGISTRY } from "./evidence-registry";

describe("content verification helpers", () => {
  it("parses corpus ids", () => {
    expect(parseCorpusId("bukhari:6464")).toEqual({
      kind: "hadith",
      collection: "bukhari",
      number: 6464,
    });
    expect(parseCorpusId("quran:4:11")).toEqual({ kind: "quran", surah: 4, ayah: 11 });
    expect(parseCorpusId("bukhari:64a")).toBeNull();
    expect(parseCorpusId("bukhari")).toBeNull();
  });

  it("keys refs stably", () => {
    expect(refKey({ kind: "quran", surah: 23, ayah: 1, ayahTo: 2 })).toBe("quran:23:1-2");
    expect(refKey({ kind: "hadith", collection: "muslim", number: 1688 })).toBe("muslim:1688");
  });

  it("flags malformed or out-of-range refs", () => {
    expect(refFormatIssue({ kind: "quran", surah: 115, ayah: 1 })).not.toBeNull();
    expect(refFormatIssue({ kind: "quran", surah: 2, ayah: 287 })).not.toBeNull();
    expect(refFormatIssue({ kind: "quran", surah: 2, ayah: 5, ayahTo: 4 })).not.toBeNull();
    expect(refFormatIssue({ kind: "hadith", collection: "bukhri", number: 1 })).not.toBeNull();
    expect(refFormatIssue({ kind: "hadith", collection: "tirmidhi", number: 3957 })).not.toBeNull();
    expect(refFormatIssue({ kind: "hadith", collection: "bukhari", number: 0 })).not.toBeNull();
    expect(refFormatIssue({ kind: "hadith", collection: "nawawi40", number: 42 })).toBeNull();
    expect(refFormatIssue({ kind: "hadith", collection: "bukhari", number: 7563 })).toBeNull();
  });

  it("maps classical-work refs to nothing (cited by title)", () => {
    expect(fromFiqhRef({ kind: "book", work: "mughni" })).toBeNull();
    expect(fromFiqhRef({ kind: "quran", surah: 48, ayahFrom: 27 })).toEqual({
      kind: "quran",
      surah: 48,
      ayah: 27,
    });
  });
});

describe("SHARED_EVIDENCE_REGISTRY", () => {
  it("collects every shared catalog, each entry with a proof log", () => {
    const prefixes = new Set(SHARED_EVIDENCE_REGISTRY.map((e) => e.source.split(/[.:]/)[0]));
    for (const p of ["fiqh", "dhulHijjah", "umrah", "fasting", "sunnahHabits", "coach"]) {
      expect(prefixes).toContain(p);
    }
    for (const entry of SHARED_EVIDENCE_REGISTRY) {
      expect(entry.proofs.length).toBeGreaterThan(0);
      for (const proof of entry.proofs) expect(proof).toMatch(/^docs\/proofs\/[\w-]+\.md$/);
    }
  });

  it.each(SHARED_EVIDENCE_REGISTRY.map((e) => [`${e.source} → ${refKey(e.ref)}`, e] as const))(
    "%s passes the format check",
    (_label, entry) => {
      expect(refFormatIssue(entry.ref)).toBeNull();
    },
  );
});
