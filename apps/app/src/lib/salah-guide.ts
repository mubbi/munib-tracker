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
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/** All Learn Salah topics, localized for the active app locale. */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return localizeList(SALAH_GUIDE_TOPICS, overlayList("SALAH_GUIDE_TOPICS"));
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

export function getSalahGuidePhrases(): SalahGuidePhrase[] {
  return localizeList(SALAH_GUIDE_PHRASES, overlayList("SALAH_GUIDE_PHRASES"));
}

export function getSalahGuideLessonCount(): number {
  return SALAH_GUIDE_TOPICS.length;
}
