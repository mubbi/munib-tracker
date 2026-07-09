import {
  LAST_DAY_HADITH,
  LAST_DAY_QUIZ,
  LAST_DAY_REFERENCES,
  LAST_DAY_SECTION_ORDER,
  LAST_DAY_TIMELINE,
  LAST_DAY_TOPICS,
  LAST_DAY_VERSES,
} from "@munib-tracker/shared/content";
import type { LastDaySection, LastDayTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

export function getLastDayTopics(): LastDayTopic[] {
  return localizeList(LAST_DAY_TOPICS, overlayList("LAST_DAY_TOPICS"));
}

export function getLastDayTopic(id: string | undefined): LastDayTopic | undefined {
  return getLastDayTopics().find((topic) => topic.id === id);
}

export function getLastDayTopicsBySection(): Record<LastDaySection, LastDayTopic[]> {
  const grouped = Object.fromEntries(
    LAST_DAY_SECTION_ORDER.map((section) => [section, [] as LastDayTopic[]]),
  ) as Record<LastDaySection, LastDayTopic[]>;

  for (const topic of getLastDayTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getLastDayLessonCount(): number {
  return LAST_DAY_TOPICS.length;
}

export function getLastDayTimeline() {
  return localizeList(LAST_DAY_TIMELINE, overlayList("LAST_DAY_TIMELINE"));
}

export function getLastDayVerses() {
  return localizeList(LAST_DAY_VERSES, overlayList("LAST_DAY_VERSES"));
}

export function getLastDayHadith() {
  return localizeList(LAST_DAY_HADITH, overlayList("LAST_DAY_HADITH"));
}

export function getLastDayQuiz() {
  return localizeList(LAST_DAY_QUIZ, overlayList("LAST_DAY_QUIZ"));
}

export function getLastDayReferences() {
  return localizeList(LAST_DAY_REFERENCES, overlayList("LAST_DAY_REFERENCES"));
}
