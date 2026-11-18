import { ARABIC_FONT_FILES } from "@/lib/arabic-font-files";
import { ARABIC_FONT_OPTIONS } from "@/lib/reading-typography";

describe("ARABIC_FONT_FILES", () => {
  it("bundles a font file for every bundled Arabic typeface", () => {
    expect(Object.keys(ARABIC_FONT_FILES).sort()).toEqual([
      "Amiri",
      "NotoNaskhArabic",
      "QPC_Hafs",
      "ScheherazadeNew",
    ]);
    for (const file of Object.values(ARABIC_FONT_FILES)) expect(file).toBeDefined();
  });

  it("keys match the picker's font families", () => {
    const families = ARABIC_FONT_OPTIONS.map((option) => option.fontFamily).filter(Boolean);
    for (const key of Object.keys(ARABIC_FONT_FILES)) expect(families).toContain(key);
  });
});
