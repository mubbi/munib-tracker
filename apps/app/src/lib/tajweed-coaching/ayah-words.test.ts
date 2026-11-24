import { bundledAyahWords, markupSegments } from "@/test-support/tajweed-coaching";

import { studyWordTajweed, tajweedMarkupWords } from "./ayah-words";
import { categoryFromParam, planItemCategory, planItemKey, RULE_CATEGORY } from "./categories";

describe("RULE_CATEGORY (NF-3.15 step 4)", () => {
  it("maps qalqalah and the nasal rules onto the two drill heads", () => {
    expect(RULE_CATEGORY.qalqalah).toBe("qalqalah");
    for (const rule of [
      "ghunnah",
      "idgham_ghunnah",
      "ikhafa",
      "ikhafa_shafawi",
      "iqlab",
      "idgham_shafawi",
    ] as const) {
      expect(RULE_CATEGORY[rule]).toBe("ghunna");
    }
  });

  it("sends rules with no head to listen-and-repeat groups and ignores silent letters", () => {
    for (const rule of [
      "madda_normal",
      "madda_permissible",
      "madda_necessary",
      "madda_obligatory",
    ] as const) {
      expect(RULE_CATEGORY[rule]).toBe("madd");
    }
    expect(RULE_CATEGORY.ham_wasl).toBe("ham_wasl");
    expect(RULE_CATEGORY.laam_shamsiyah).toBe("laam_shamsiyah");
    expect(RULE_CATEGORY.idgham_wo_ghunnah).toBe("idgham_wo_ghunnah");
    expect(RULE_CATEGORY.slnt).toBeNull();
  });

  it("round-trips plan keys and route params", () => {
    expect(planItemKey("qalqalah")).toBe("qalqalah");
    expect(planItemKey("madd")).toBe("listen:madd");
    expect(planItemCategory("listen:madd")).toBe("madd");
    expect(planItemCategory("listen:nope")).toBeNull();
    expect(planItemCategory("unknown")).toBeNull();
    expect(categoryFromParam("ham_wasl")).toBe("ham_wasl");
    expect(categoryFromParam("listen:madd")).toBeNull();
    expect(categoryFromParam(undefined)).toBeNull();
  });
});

describe("tajweedMarkupWords", () => {
  it("splits segments into words and keeps the rules inside each word", () => {
    const words = bundledAyahWords(112, 3);
    const out = tajweedMarkupWords(markupSegments(words, { 1: "qalqalah", 3: "qalqalah" }));
    expect(out.map((w) => w.text)).toEqual(words);
    expect(out.map((w) => w.rules)).toEqual([[], ["qalqalah"], [], ["qalqalah"]]);
  });

  it("drops marks-only tokens (waqf signs) like the practice row", () => {
    const words = bundledAyahWords(112, 1);
    const segments = [...markupSegments(words, {}), { text: " ۛ " }];
    expect(tajweedMarkupWords(segments)).toHaveLength(words.length);
  });
});

describe("studyWordTajweed", () => {
  it("maps rules onto study words even when the markup prepends the basmala", () => {
    const study = bundledAyahWords(112, 3);
    const basmala = bundledAyahWords(1, 1);
    const segments = markupSegments(study, { 1: "qalqalah", 3: "qalqalah" }, basmala);
    const out = studyWordTajweed(segments, study);
    expect(out).toHaveLength(study.length);
    expect(out[1].categories).toEqual(["qalqalah"]);
    expect(out[3].categories).toEqual(["qalqalah"]);
    expect(out[0].categories).toEqual([]);
  });

  it("detects shaddah from the Uthmani study text as gemination", () => {
    const study = bundledAyahWords(112, 2);
    const out = studyWordTajweed(
      markupSegments(study, { 0: "ham_wasl", 1: "laam_shamsiyah" }),
      study,
    );
    expect(out[0].categories).toEqual(["gemination", "ham_wasl"]);
    expect(out[1].categories).toEqual(["gemination", "laam_shamsiyah"]);
  });

  it("never guesses a rule onto a study word the markup doesn't match", () => {
    const study = bundledAyahWords(112, 1);
    const other = bundledAyahWords(112, 3);
    const out = studyWordTajweed(markupSegments(other, { 1: "qalqalah" }), study);
    expect(out.every((w) => !w.categories.includes("qalqalah"))).toBe(true);
  });
});
