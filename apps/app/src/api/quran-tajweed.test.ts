import { parseTajweedMarkup } from "@/api/quran-tajweed";

describe("parseTajweedMarkup", () => {
  it("parses live alquran.cloud single-bracket markup", () => {
    const raw = "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ";
    const segments = parseTajweedMarkup(raw);
    expect(segments).toEqual([
      { text: "بِسْمِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "للَّهِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "رَّحْمَ" },
      { text: "ـٰ", rule: "madda_normal" },
      { text: "نِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "رَّح" },
      { text: "ِي", rule: "madda_necessary" },
      { text: "مِ" },
    ]);
  });

  it("also accepts double-closing-bracket samples", () => {
    const segments = parseTajweedMarkup("[h:1[ٱ]][l[ل]][n[ل]]هِ");
    expect(segments).toEqual([
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "ل", rule: "madda_normal" },
      { text: "هِ" },
    ]);
  });

  it("returns plain text when markup has no tags", () => {
    expect(parseTajweedMarkup("بِسْمِ")).toEqual([{ text: "بِسْمِ" }]);
  });
});
