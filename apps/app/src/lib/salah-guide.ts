import {
  SALAH_GUIDE_JOURNEY_ORDER,
  SALAH_GUIDE_PHRASES,
  SALAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content";
import {
  SALAH_GUIDE_PHRASES_AR,
  SALAH_GUIDE_PHRASES_UR,
  SALAH_GUIDE_TOPICS_AR,
  SALAH_GUIDE_TOPICS_UR,
} from "@munib-tracker/shared/content-i18n";
import type {
  SalahGuideJourney,
  SalahGuidePhrase,
  SalahGuideTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

/** All Learn Salah topics, localized for the active app locale. */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return localizeList(SALAH_GUIDE_TOPICS, { ur: SALAH_GUIDE_TOPICS_UR, ar: SALAH_GUIDE_TOPICS_AR });
}

/** One topic by id, or undefined. */
export function getSalahGuideTopic(id: string | undefined): SalahGuideTopic | undefined {
  return getSalahGuideTopics().find((topic) => topic.id === id);
}

/** Topics grouped by learning journey phase. */
export function getSalahGuideTopicsByJourney(): Record<SalahGuideJourney, SalahGuideTopic[]> {
  const grouped = Object.fromEntries(
    SALAH_GUIDE_JOURNEY_ORDER.map((phase) => [phase, [] as SalahGuideTopic[]]),
  ) as Record<SalahGuideJourney, SalahGuideTopic[]>;

  for (const topic of getSalahGuideTopics()) {
    grouped[topic.journey].push(topic);
  }
  return grouped;
}

/** Phrases recited in salah with meanings, localized for the active app locale. */
export function getSalahGuidePhrases(): SalahGuidePhrase[] {
  return localizeList(SALAH_GUIDE_PHRASES, {
    ur: SALAH_GUIDE_PHRASES_UR,
    ar: SALAH_GUIDE_PHRASES_AR,
  });
}

/** Total lesson count for progress tracking. */
export function getSalahGuideLessonCount(): number {
  return SALAH_GUIDE_TOPICS.length;
}
