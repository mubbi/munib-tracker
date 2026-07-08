import {
  AQEDAH_GLOSSARY,
  AQEDAH_SECTION_ORDER,
  AQEDAH_TOPICS,
} from "@munib-tracker/shared/content";
import {
  AQEDAH_GLOSSARY_AR,
  AQEDAH_GLOSSARY_UR,
  AQEDAH_TOPICS_AR,
  AQEDAH_TOPICS_UR,
} from "@munib-tracker/shared/content-i18n";
import type {
  AqeedahGlossaryTerm,
  AqeedahSection,
  AqeedahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

export function getAqeedahTopics(): AqeedahTopic[] {
  return localizeList(AQEDAH_TOPICS, { ur: AQEDAH_TOPICS_UR, ar: AQEDAH_TOPICS_AR });
}

export function getAqeedahTopic(id: string | undefined): AqeedahTopic | undefined {
  if (!id) return undefined;
  return getAqeedahTopics().find((topic) => topic.id === id);
}

export function getAqeedahTopicsBySection(): Record<AqeedahSection, AqeedahTopic[]> {
  const grouped = Object.fromEntries(
    AQEDAH_SECTION_ORDER.map((section) => [section, [] as AqeedahTopic[]]),
  ) as Record<AqeedahSection, AqeedahTopic[]>;

  for (const topic of getAqeedahTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getAqeedahGlossary(): AqeedahGlossaryTerm[] {
  return localizeList(AQEDAH_GLOSSARY, { ur: AQEDAH_GLOSSARY_UR, ar: AQEDAH_GLOSSARY_AR });
}

export function getAqeedahLessonCount(): number {
  return AQEDAH_TOPICS.length;
}
