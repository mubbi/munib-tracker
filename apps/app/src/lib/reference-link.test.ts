import { parseReference, referenceHref } from "./reference-link";

describe("parseReference", () => {
  it("parses a numeric Qur'an reference", () => {
    expect(parseReference("Quran 2:255")).toEqual({ kind: "quran", surah: 2, ayah: 255 });
  });

  it("parses the Qur'an ayah even when a hadith is also cited", () => {
    expect(parseReference("Quran 2:255 · An-Nasa'i")).toEqual({
      kind: "quran",
      surah: 2,
      ayah: 255,
    });
  });

  it("parses a Qur'an reference by surah name (QS. format)", () => {
    expect(parseReference("QS. Al-Baqarah: 255")).toEqual({ kind: "quran", surah: 2, ayah: 255 });
  });

  it("rejects an out-of-range ayah", () => {
    expect(parseReference("Quran 2:9999")).toBeNull();
  });

  // Hadith references are intentionally NOT linked — the Hisnul Muslim (ʿAbd
  // al-Bāqī) hadith numbering does not match the app's hadith reader
  // (fawazahmed0), so a number-based link would open the wrong hadith.
  it("does not link hadith references (numbering schemes differ)", () => {
    expect(parseReference("Sahih al-Bukhari 6306")).toBeNull();
    expect(parseReference("Muslim [591](1/414).")).toBeNull();
    expect(parseReference("HR. Muslim No. 713")).toBeNull();
    expect(
      parseReference("Al-Bukhârî [6312], see Fatĥ al-Bârî (11/113) and Muslim [2711](4/2083)."),
    ).toBeNull();
    expect(parseReference("Bukhari & Muslim")).toBeNull();
  });

  it("returns null for empty/absent/unfamiliar references", () => {
    expect(parseReference(undefined)).toBeNull();
    expect(parseReference("")).toBeNull();
    expect(parseReference("Some unfamiliar source")).toBeNull();
  });
});

describe("referenceHref", () => {
  it("builds a Qur'an deep link with the ayah param", () => {
    expect(referenceHref({ kind: "quran", surah: 2, ayah: 255 })).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
  });
});
