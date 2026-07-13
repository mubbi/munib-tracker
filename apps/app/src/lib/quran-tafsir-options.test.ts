import { describe, expect, it } from "@jest/globals";

import { resolvePreferredTafsirId } from "./quran-tafsir-options";

describe("resolvePreferredTafsirId", () => {
  it("treats empty string as explicit none", () => {
    expect(resolvePreferredTafsirId("", "en", "en")).toBeUndefined();
  });

  it("uses a stored edition when valid", () => {
    expect(resolvePreferredTafsirId("en-al-jalalayn", "ur", "ar")).toBe("en-al-jalalayn");
  });

  it("falls back to locale defaults when unset", () => {
    expect(resolvePreferredTafsirId(undefined, "en", "ar")).toBe("en-tafisr-ibn-kathir");
    expect(resolvePreferredTafsirId(undefined, "xx", "ar")).toBe("ar-tafsir-muyassar");
  });
});
