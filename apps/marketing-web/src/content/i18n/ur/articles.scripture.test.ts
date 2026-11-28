import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLES, articleHref } from "@/content/resources";
import type { Block } from "@/content/types";
import { TRANSLATIONS } from "./articles";

const JALANDHRY = resolve(
  __dirname,
  "../../../../../app/assets/data/quran/translation/ur-jalandhry",
);
const NOTE = "ترجمہ: فتح محمد جالندھری";
const PARTIAL_NOTE = `${NOTE} (آیت کا ایک حصہ)`;

function jalandhry(surah: number, ayah: number): string | undefined {
  const file = resolve(JALANDHRY, `${String(surah).padStart(3, "0")}.json`);
  return (JSON.parse(readFileSync(file, "utf8")) as Record<string, string>)[String(ayah)];
}

type Evidence = Extract<Block, { type: "evidence" }>;
const evidence = (body: readonly Block[]) =>
  body.filter((b): b is Evidence => b.type === "evidence");

const quranBlocks = TRANSLATIONS.flatMap((a) =>
  evidence(a.body)
    .filter((b) => b.kind === "quran")
    .map((b) => [`${a.slug} ${b.href}`, b] as const),
);

describe("Urdu article scripture", () => {
  it.each(quranBlocks)("%s uses the bundled Jalandhry text verbatim", (_, block) => {
    const ayah = /\/quran\/(\d+)\?ayah=(\d+)$/.exec(block.href ?? "");
    const passage = /\/quran\/passage\?surah=(\d+)&from=(\d+)&to=(\d+)$/.exec(block.href ?? "");
    const match = ayah ?? passage;
    expect(
      match,
      "Qur'an evidence needs a web-app /quran/<surah>?ayah=<n> or /quran/passage?surah=&from=&to= href",
    ).not.toBeNull();
    const surah = Number(match?.[1]);
    const from = Number(match?.[2]);
    const to = Number(passage?.[3] ?? from);
    // A range quotes each ayah verbatim, joined with the ayah-end sign.
    const ayahs = Array.from({ length: to - from + 1 }, (_, i) => jalandhry(surah, from + i));
    const bundled = ayahs.every(Boolean) ? ayahs.join(" ۝ ") : undefined;
    expect(block.translationLang).toBeUndefined();
    if (block.note === PARTIAL_NOTE) {
      // An excerpt of the ayah (the English quotes only part of it too).
      expect(bundled).toBeTruthy();
      expect(block.translation && bundled?.includes(block.translation)).toBe(true);
    } else {
      expect(block.note).toBe(NOTE);
      expect(block.translation).toBe(bundled);
    }
  });

  it("gives every evidence block a meaning, falling back to English only when marked", () => {
    for (const article of TRANSLATIONS) {
      const english = ARTICLES.find((a) => articleHref(a) === articleHref(article));
      const en = evidence(english?.body ?? []);
      evidence(article.body).forEach((block, i) => {
        expect(block.translation, `${article.slug} #${i}`).toBeTruthy();
        if (block.translationLang === "en") {
          expect(block.translation).toBe(en[i]?.translation);
        } else {
          expect(block.translation).not.toBe(en[i]?.translation);
          expect(block.translation).toMatch(/[؀-ۿ]/);
        }
      });
    }
  });
});
