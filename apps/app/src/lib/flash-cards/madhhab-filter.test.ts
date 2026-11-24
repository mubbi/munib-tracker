import { SALAH_GUIDE_QUIZ } from "@munib-tracker/shared/content/salah-guide-quiz";
import type { MadhhabId } from "@munib-tracker/shared/fiqh";

import { mcqsFromSalahGuideQuiz } from "./from-existing-quizzes";
import { filterMcqsForMadhhab } from "./madhhab-filter";
import type { StudyMcq } from "./types";

const base: StudyMcq = {
  id: "x",
  sourceId: "salahGuide",
  prompt: "Q",
  options: ["a", "b"],
  correctIndex: 0,
  explanation: "E",
};
const tagged: StudyMcq = {
  ...base,
  id: "tagged",
  differenceId: "rawatib.preset",
  answerSchools: ["hanafi"],
};
const school = (s: MadhhabId | null) => (): MadhhabId | null => s;

describe("filterMcqsForMadhhab (NF-3.0a)", () => {
  it("keeps school-independent questions in every mode", () => {
    expect(filterMcqsForMadhhab([base], school(null))).toEqual([base]);
  });

  it("skips school-dependent questions in all-views mode", () => {
    expect(filterMcqsForMadhhab([base, tagged], school(null))).toEqual([base]);
  });

  it("keeps them only for the schools whose answer they give", () => {
    expect(filterMcqsForMadhhab([tagged], school("hanafi"))).toEqual([tagged]);
    expect(filterMcqsForMadhhab([tagged], school("shafii"))).toEqual([]);
  });

  it("resolves the school for the difference's domain", () => {
    const seen: string[] = [];
    filterMcqsForMadhhab([tagged], (domain) => {
      seen.push(domain);
      return "hanafi";
    });
    expect(seen).toEqual(["salah"]);
  });

  it("shows the hadith-worded rawatib questions in every mode", () => {
    const mcqs = mcqsFromSalahGuideQuiz(SALAH_GUIDE_QUIZ);
    const rawatib = mcqs.find((m) => m.id === "salahGuide:authored:rawatib-total");
    expect(rawatib?.differenceId).toBeUndefined();
    for (const s of [null, "maliki", "hanafi"] as const) {
      expect(filterMcqsForMadhhab(mcqs, school(s)).some((m) => m.id === rawatib?.id)).toBe(true);
    }
  });
});
