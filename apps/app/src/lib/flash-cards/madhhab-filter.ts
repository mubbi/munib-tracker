import {
  type FiqhDomain,
  getFiqhDifference,
  type MadhhabId,
  resolveSchool,
} from "@munib-tracker/shared/fiqh";

import { preferencesStore } from "@/stores/preferences-store";

import type { StudyMcq } from "./types";

/** Resolves the school governing a fiqh domain (`null` = all views). */
export type SchoolResolver = (domain: FiqhDomain) => MadhhabId | null;

/** The user's school per domain, read from the preferences store (non-React callers). */
export const storeSchoolResolver: SchoolResolver = (domain) =>
  resolveSchool(preferencesStore.getState().prefs, domain);

/**
 * NF-3.0a (§4.1.4 "Flash cards / quizzes"): drops questions whose answer
 * depends on the school unless the user's school for that difference's domain
 * is one the authored answer is right for. In all-views mode every such
 * question is skipped — a single "correct" answer would silently pick a school.
 */
export function filterMcqsForMadhhab(
  items: readonly StudyMcq[],
  schoolFor: SchoolResolver = storeSchoolResolver,
): StudyMcq[] {
  return items.filter((item) => {
    if (!item.differenceId) return true;
    const school = schoolFor(getFiqhDifference(item.differenceId).domain);
    return school != null && (item.answerSchools ?? []).includes(school);
  });
}
