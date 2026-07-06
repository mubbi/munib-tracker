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

export function getLastDayTopics(): LastDayTopic[] {
  return LAST_DAY_TOPICS;
}

export function getLastDayTopic(id: string | undefined): LastDayTopic | undefined {
  return LAST_DAY_TOPICS.find((topic) => topic.id === id);
}

export function getLastDayTopicsBySection(): Record<LastDaySection, LastDayTopic[]> {
  const grouped = Object.fromEntries(
    LAST_DAY_SECTION_ORDER.map((section) => [section, [] as LastDayTopic[]]),
  ) as Record<LastDaySection, LastDayTopic[]>;

  for (const topic of LAST_DAY_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getLastDayLessonCount(): number {
  return LAST_DAY_TOPICS.length;
}

export function getLastDayTimeline() {
  return [...LAST_DAY_TIMELINE].sort((a, b) => a.order - b.order);
}

export function getLastDayVerses() {
  return LAST_DAY_VERSES;
}

export function getLastDayHadith() {
  return LAST_DAY_HADITH;
}

export function getLastDayQuiz() {
  return LAST_DAY_QUIZ;
}

export function getLastDayReferences() {
  return LAST_DAY_REFERENCES;
}
