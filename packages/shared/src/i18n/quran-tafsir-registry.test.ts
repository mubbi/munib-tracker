import { describe, expect, it } from "vitest";

import {
  getTafsirEdition,
  QURAN_TAFSIR_EDITIONS,
  resolveDefaultTafsirId,
  tafsirEditionsForLanguage,
} from "./quran-tafsir-registry";

describe("quran-tafsir-registry", () => {
  it("includes Siraj (fawaz) and spa5k editions", () => {
    expect(QURAN_TAFSIR_EDITIONS.length).toBeGreaterThan(50);
    const siraj = getTafsirEdition("ar-tafsir-siraj");
    expect(siraj?.provider).toBe("fawaz");
    expect(siraj?.slug).toBe("ara-sirajtafseer");
    const jalalayn = getTafsirEdition("en-al-jalalayn");
    expect(jalalayn?.provider).toBe("spa5k");
  });

  it("resolves language defaults when cataloged", () => {
    expect(resolveDefaultTafsirId("en")).toBe("en-tafisr-ibn-kathir");
    expect(resolveDefaultTafsirId("ar")).toBe("ar-tafsir-muyassar");
    expect(resolveDefaultTafsirId("ur")).toBe("ur-tafseer-ibn-e-kaseer");
    expect(resolveDefaultTafsirId("xx-unknown")).toBeUndefined();
  });
});

describe("tafsir language helpers", () => {
  it("lists only editions for the requested language", () => {
    const en = tafsirEditionsForLanguage("en");

    expect(en.length).toBeGreaterThan(0);
    expect(en.every((edition) => edition.language === "en")).toBe(true);
  });

  it("lists nothing for an unknown language", () => {
    expect(tafsirEditionsForLanguage("zz")).toEqual([]);
  });

  it.each([
    ["EN-us", "en-tafisr-ibn-kathir"],
    ["zz", undefined],
    [null, undefined],
    ["", undefined],
  ])("resolveDefaultTafsirId(%j) -> %s", (language, expected) => {
    expect(resolveDefaultTafsirId(language)).toBe(expected);
  });
});
