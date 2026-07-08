import {
  TAHARAH_CHECKLIST,
  TAHARAH_SECTION_ORDER,
  TAHARAH_TOPICS,
} from "@munib-tracker/shared/content";
import {
  TAHARAH_CHECKLIST_AR,
  TAHARAH_CHECKLIST_UR,
  TAHARAH_TOPICS_AR,
  TAHARAH_TOPICS_UR,
} from "@munib-tracker/shared/content-i18n";
import type {
  TaharahChecklistItem,
  TaharahSection,
  TaharahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

export function getTaharahTopics(): TaharahTopic[] {
  return localizeList(TAHARAH_TOPICS, { ur: TAHARAH_TOPICS_UR, ar: TAHARAH_TOPICS_AR });
}

export function getTaharahTopic(id: string | undefined): TaharahTopic | undefined {
  if (!id) return undefined;
  return getTaharahTopics().find((topic) => topic.id === id);
}

export function getTaharahTopicsBySection(): Record<TaharahSection, TaharahTopic[]> {
  const grouped = Object.fromEntries(
    TAHARAH_SECTION_ORDER.map((section) => [section, [] as TaharahTopic[]]),
  ) as Record<TaharahSection, TaharahTopic[]>;

  for (const topic of getTaharahTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getTaharahChecklist(): TaharahChecklistItem[] {
  return localizeList(TAHARAH_CHECKLIST, { ur: TAHARAH_CHECKLIST_UR, ar: TAHARAH_CHECKLIST_AR });
}

export function getTaharahLessonCount(): number {
  return TAHARAH_TOPICS.length;
}
