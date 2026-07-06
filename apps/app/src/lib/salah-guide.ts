import {
  SALAH_GUIDE_JOURNEY_ORDER,
  SALAH_GUIDE_PHRASES,
  SALAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content";
import type {
  SalahGuideJourney,
  SalahGuidePhrase,
  SalahGuideTopic,
} from "@munib-tracker/shared/types";

/** All Learn Salah topics. */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return SALAH_GUIDE_TOPICS;
}

/** One topic by id, or undefined. */
export function getSalahGuideTopic(id: string | undefined): SalahGuideTopic | undefined {
  return SALAH_GUIDE_TOPICS.find((topic) => topic.id === id);
}

/** Topics grouped by learning journey phase. */
export function getSalahGuideTopicsByJourney(): Record<SalahGuideJourney, SalahGuideTopic[]> {
  const grouped = Object.fromEntries(
    SALAH_GUIDE_JOURNEY_ORDER.map((phase) => [phase, [] as SalahGuideTopic[]]),
  ) as Record<SalahGuideJourney, SalahGuideTopic[]>;

  for (const topic of SALAH_GUIDE_TOPICS) {
    grouped[topic.journey].push(topic);
  }
  return grouped;
}

/** Phrases recited in salah with meanings. */
export function getSalahGuidePhrases(): SalahGuidePhrase[] {
  return SALAH_GUIDE_PHRASES;
}

/** Total lesson count for progress tracking. */
export function getSalahGuideLessonCount(): number {
  return SALAH_GUIDE_TOPICS.length;
}
