import {
  TAHARAH_CHECKLIST,
  TAHARAH_SECTION_ORDER,
  TAHARAH_TOPICS,
} from "@munib-tracker/shared/content";
import type {
  TaharahChecklistItem,
  TaharahSection,
  TaharahTopic,
} from "@munib-tracker/shared/types";

export function getTaharahTopics(): TaharahTopic[] {
  return TAHARAH_TOPICS;
}

export function getTaharahTopic(id: string | undefined): TaharahTopic | undefined {
  return TAHARAH_TOPICS.find((topic) => topic.id === id);
}

export function getTaharahTopicsBySection(): Record<TaharahSection, TaharahTopic[]> {
  const grouped = Object.fromEntries(
    TAHARAH_SECTION_ORDER.map((section) => [section, [] as TaharahTopic[]]),
  ) as Record<TaharahSection, TaharahTopic[]>;

  for (const topic of TAHARAH_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getTaharahChecklist(): TaharahChecklistItem[] {
  return TAHARAH_CHECKLIST;
}

export function getTaharahLessonCount(): number {
  return TAHARAH_TOPICS.length;
}
