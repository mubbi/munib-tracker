import {
  LAST_DAY_HADITH,
  LAST_DAY_QUIZ,
  LAST_DAY_REFERENCES,
  LAST_DAY_SECTION_ORDER,
  LAST_DAY_TIMELINE,
  LAST_DAY_TOPICS,
  LAST_DAY_VERSES,
} from "@munib-tracker/shared/content";
import {
  LAST_DAY_HADITH_AR,
  LAST_DAY_HADITH_UR,
  LAST_DAY_QUIZ_AR,
  LAST_DAY_QUIZ_UR,
  LAST_DAY_REFERENCES_AR,
  LAST_DAY_REFERENCES_UR,
  LAST_DAY_TIMELINE_AR,
  LAST_DAY_TIMELINE_UR,
  LAST_DAY_TOPICS_AR,
  LAST_DAY_TOPICS_UR,
  LAST_DAY_VERSES_AR,
  LAST_DAY_VERSES_UR,
} from "@munib-tracker/shared/content-i18n";
import type { LastDaySection, LastDayTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

export function getLastDayTopics(): LastDayTopic[] {
  return localizeList(LAST_DAY_TOPICS, { ur: LAST_DAY_TOPICS_UR, ar: LAST_DAY_TOPICS_AR });
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
  return localizeList(LAST_DAY_TIMELINE, {
    ur: LAST_DAY_TIMELINE_UR,
    ar: LAST_DAY_TIMELINE_AR,
  }).sort((a, b) => a.order - b.order);
}

export function getLastDayVerses() {
  return localizeList(LAST_DAY_VERSES, { ur: LAST_DAY_VERSES_UR, ar: LAST_DAY_VERSES_AR });
}

export function getLastDayHadith() {
  return localizeList(LAST_DAY_HADITH, { ur: LAST_DAY_HADITH_UR, ar: LAST_DAY_HADITH_AR });
}

export function getLastDayQuiz() {
  return localizeList(LAST_DAY_QUIZ, { ur: LAST_DAY_QUIZ_UR, ar: LAST_DAY_QUIZ_AR });
}

export function getLastDayReferences() {
  return localizeList(LAST_DAY_REFERENCES, {
    ur: LAST_DAY_REFERENCES_UR,
    ar: LAST_DAY_REFERENCES_AR,
  });
}
