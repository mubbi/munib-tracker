import { getPageLayout, getSurahAyahs } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import { QURAN_TOTAL_PAGES } from "@/lib/quran-meta";

import { mapPageWords } from "./mushaf-word-spans";

/**
 * Spike N1 — run over all 604 bundled pages. The numbers asserted here are the
 * ones recorded in docs/proofs/ayah-notes.md; a page that does not map exactly
 * falls back to an ayah tint (D24).
 */
describe("spike N1: mushaf word boxes from bundled word counts", () => {
  const results = Array.from({ length: QURAN_TOTAL_PAGES }, (_, i) => mapPageWords(i + 1));
  const exactPages = results
    .map((r, i) => (r.wordExact ? i + 1 : null))
    .filter((p): p is number => p != null);
  const fallbackPages = results
    .map((r, i) => (r.wordExact ? null : i + 1))
    .filter((p): p is number => p != null);

  it("maps the large majority of pages word-exactly", () => {
    // eslint-disable-next-line no-console -- spike report, read into the proof log
    console.info(
      `N1: ${exactPages.length}/${QURAN_TOTAL_PAGES} pages word-exact; fallback pages: ${fallbackPages.join(", ")}`,
    );
    expect(exactPages.length / QURAN_TOTAL_PAGES).toBeGreaterThan(0.9);
  });

  it("assigns every word of a word-exact page exactly once, in order", () => {
    for (const page of exactPages.slice(0, 60)) {
      const { lines } = mapPageWords(page);
      const seen = new Map<string, number[]>();
      for (const tokens of Object.values(lines)) {
        for (const t of tokens) {
          if (t.surah == null || t.ayah == null || t.word == null) continue;
          const key = `${t.surah}:${t.ayah}`;
          seen.set(key, [...(seen.get(key) ?? []), t.word]);
        }
      }
      for (const [key, words] of seen) {
        const [s, a] = key.split(":").map(Number);
        const count = splitAyahWords(getSurahAyahs(s)[a - 1]?.arabic ?? "").length;
        // Contiguous run of word indexes (an ayah may continue from / onto another page).
        expect(words).toEqual(words.map((_, i) => words[0] + i));
        expect(words[words.length - 1]).toBeLessThan(count);
      }
    }
  });

  it("Al-Fatihah (page 1) maps word-exactly, 1:7 has nine words", () => {
    const { lines, wordExact } = mapPageWords(1);
    expect(wordExact).toBe(true);
    const last = Object.values(lines)
      .flat()
      .filter((t) => t.ayah === 7 && !t.end);
    expect(last).toHaveLength(splitAyahWords(getSurahAyahs(1)[6]?.arabic ?? "").length);
  });

  it("a page whose counts do not fit is flagged for the ayah-tint fallback", () => {
    const layout = getPageLayout(1);
    const broken = {
      ...layout,
      // Drop one glyph token from the last line: the counts no longer fit.
      lines: layout.lines.map((line, i) =>
        i === layout.lines.length - 1 && line.type === "text"
          ? { ...line, glyphs: line.glyphs.split(" ").slice(1).join(" ") }
          : line,
      ),
    };
    expect(mapPageWords(1, broken).wordExact).toBe(false);
  });
});
