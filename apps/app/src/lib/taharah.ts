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
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

export function getTaharahTopics(): TaharahTopic[] {
  return localizeList(TAHARAH_TOPICS, overlayList("TAHARAH_TOPICS"));
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
  return localizeList(TAHARAH_CHECKLIST, overlayList("TAHARAH_CHECKLIST"));
}

export function getTaharahLessonCount(): number {
  return TAHARAH_TOPICS.length;
}
