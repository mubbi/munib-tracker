import type { LearnGuideTopic } from "@munib-tracker/shared/types";

import { buildJannahHadithRef, buildJannahQuranRef } from "@/test-support/fixtures/jannah";

/**
 * A fully-populated Learn guide topic (summary, body, evidence, actions, app
 * links, disclaimer and madhhab note). Override fields with `undefined` to
 * exercise the optional-section branches.
 */
export function buildLearnGuideTopic(overrides: Partial<LearnGuideTopic> = {}): LearnGuideTopic {
  return {
    id: "night-of-power",
    section: "basics",
    title: "The Night of Power",
    summary: "Better than a thousand months.",
    body: ["Seek it in the last ten nights.", "Spend it in worship."],
    quran: [buildJannahQuranRef({ surah: 97, ayahFrom: 1, ayahTo: 5, label: "Qur'an 97:1-5" })],
    hadith: [buildJannahHadithRef()],
    actions: ["Pray at night", "Make dua"],
    appLinks: [{ label: "Open Qur'an", route: "/quran" }],
    disclaimer: "Educational summary.",
    madhhabNote: "Schools differ on details.",
    ...overrides,
  };
}
