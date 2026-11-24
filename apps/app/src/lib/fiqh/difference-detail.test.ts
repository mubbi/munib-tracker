import { getFiqhDifference } from "@munib-tracker/shared/fiqh";

import i18n from "@/i18n";
import {
  differenceEvidence,
  differenceFromSlug,
  differenceGuideLinks,
  differenceSlug,
  formatFiqhRef,
} from "@/lib/fiqh/difference-detail";

const t = i18n.t.bind(i18n);

describe("difference slugs", () => {
  it("round-trips every catalog id through a dot-free slug", () => {
    expect(differenceSlug("witr.status")).toBe("witr-status");
    expect(differenceFromSlug("witr-status")).toBe("witr.status");
    expect(differenceFromSlug(["qasr-distance"])).toBe("qasr.distance");
  });

  it("rejects unknown or empty slugs", () => {
    expect(differenceFromSlug("nope-nope")).toBeNull();
    expect(differenceFromSlug(undefined)).toBeNull();
  });
});

describe("formatFiqhRef", () => {
  it("links a Qur'an ref to the reader at the ayah", () => {
    expect(formatFiqhRef({ kind: "quran", surah: 4, ayahFrom: 101 }, t)).toMatchObject({
      label: "Qur'an 4:101",
      link: { pathname: "/quran/[surah]", params: { surah: "4", ayah: "101" } },
    });
  });

  it("labels Muslim with the corpus and print numbers, and flags disputed grades", () => {
    expect(
      formatFiqhRef(
        {
          kind: "hadith",
          collection: "muslim",
          number: 2036,
          arabicNumber: "881.01",
          grade: "sahih",
        },
        t,
      ),
    ).toMatchObject({ label: "Sahih Muslim 2036 (881.01)", disputed: false });
    expect(
      formatFiqhRef({ kind: "hadith", collection: "abudawud", number: 181, grade: "disputed" }, t),
    ).toMatchObject({
      label: "Sunan Abu Dawud 181",
      disputed: true,
      link: { params: { collection: "abudawud", q: "181" } },
    });
  });

  it("names classical works without a link", () => {
    const view = formatFiqhRef({ kind: "book", work: "minhaj" }, t);
    expect(view.label).toBe("Minhaj al-Talibin (al-Nawawi)");
    expect(view.link).toBeUndefined();
  });
});

describe("differenceEvidence / differenceGuideLinks", () => {
  it("groups shared evidence and each school's own refs, deduped", () => {
    const evidence = differenceEvidence(getFiqhDifference("jumuah.sunnah"), t);
    expect(evidence.bySchool.map((s) => s.school)).toEqual([
      "hanafi",
      "shafii",
      "maliki",
      "hanbali",
    ]);
    const hanbali = evidence.bySchool[3]?.refs.map((r) => r.label) ?? [];
    expect(hanbali).toContain("Sahih al-Bukhari 937");
    expect(new Set(hanbali).size).toBe(hanbali.length);
  });

  it("links the guide topics that discuss a difference", () => {
    expect(differenceGuideLinks("jumuah.sunnah").map((l) => l.href)).toEqual([
      "/salah-guide/jumuah",
      "/friday/jumuah-obligation",
    ]);
  });
});
