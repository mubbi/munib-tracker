import { describe, expect, it } from "vitest";

import { isScriptureMeaningCatalogKey } from "./scripture-meaning";

describe.concurrent("isScriptureMeaningCatalogKey", () => {
  it("matches catalog keys that carry scripture meaning text", () => {
    for (const key of [
      "learn.salah.quran.3.excerpt",
      "fasting.hadith.12.excerpt",
      "guide.localRefExcerpt",
      "qazaPlan.consistencyHadith",
      "tahajjud.virtueBody",
      "dhulHijjah.virtue",
      "onboarding.brandDuaTranslation",
    ]) {
      expect(isScriptureMeaningCatalogKey(key)).toBe(true);
    }
  });

  it("ignores ordinary UI strings", () => {
    for (const key of [
      "learn.salah.quran.3.title",
      "settings.title",
      "x.qazaPlan.consistencyHadith",
      "quran.excerpt",
    ]) {
      expect(isScriptureMeaningCatalogKey(key)).toBe(false);
    }
  });
});
