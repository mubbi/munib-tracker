import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MUNIB_AYAHS } from "./munib-ayahs";

const QURAN_DATA = resolve(__dirname, "../../../app/assets/data/quran");

function bundled(
  kind: "arabic" | "translation/en-pickthall" | "translation/ur-jalandhry",
  surah: number,
): Record<string, string> {
  const file = resolve(QURAN_DATA, kind, `${String(surah).padStart(3, "0")}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
}

describe("MUNIB_AYAHS", () => {
  it("match the app's bundled Qur'an text and Pickthall / Jalandhry translations exactly", () => {
    for (const { surah, ayah, arabic, translation, translationUr } of MUNIB_AYAHS) {
      expect(arabic, `${surah}:${ayah} Arabic`).toBe(bundled("arabic", surah)[String(ayah)]);
      expect(translation, `${surah}:${ayah} translation`).toBe(
        bundled("translation/en-pickthall", surah)[String(ayah)],
      );
      expect(translationUr, `${surah}:${ayah} Urdu`).toBe(
        bundled("translation/ur-jalandhry", surah)[String(ayah)],
      );
    }
  });
});
