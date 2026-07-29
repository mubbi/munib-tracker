import { describe, expect, it } from "vitest";

import {
  HADITH_TRANSLATED_LOCALES,
  hadithEditionSlug,
  hasHadithTranslationEdition,
} from "./hadith-editions";

describe("hadith-editions", () => {
  it("maps OSS locales to fawazahmed0 prefixes", () => {
    expect(hadithEditionSlug("ur", "bukhari")).toBe("urd-bukhari");
    expect(hadithEditionSlug("bn", "muslim")).toBe("ben-muslim");
    expect(hadithEditionSlug("ms", "bukhari")).toBeNull();
  });

  it("lists translated locales", () => {
    expect(HADITH_TRANSLATED_LOCALES).toContain("ur");
    expect(HADITH_TRANSLATED_LOCALES).toContain("fr");
    expect(hasHadithTranslationEdition("tr")).toBe(true);
    expect(hasHadithTranslationEdition("fa")).toBe(false);
  });
});
