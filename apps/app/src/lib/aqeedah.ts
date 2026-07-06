import {
  AQEDAH_GLOSSARY,
  AQEDAH_SECTION_ORDER,
  AQEDAH_TOPICS,
} from "@munib-tracker/shared/content";
import type {
  AqeedahGlossaryTerm,
  AqeedahSection,
  AqeedahTopic,
} from "@munib-tracker/shared/types";

export function getAqeedahTopics(): AqeedahTopic[] {
  return AQEDAH_TOPICS;
}

export function getAqeedahTopic(id: string | undefined): AqeedahTopic | undefined {
  return AQEDAH_TOPICS.find((topic) => topic.id === id);
}

export function getAqeedahTopicsBySection(): Record<AqeedahSection, AqeedahTopic[]> {
  const grouped = Object.fromEntries(
    AQEDAH_SECTION_ORDER.map((section) => [section, [] as AqeedahTopic[]]),
  ) as Record<AqeedahSection, AqeedahTopic[]>;

  for (const topic of AQEDAH_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getAqeedahGlossary(): AqeedahGlossaryTerm[] {
  return AQEDAH_GLOSSARY;
}

export function getAqeedahLessonCount(): number {
  return AQEDAH_TOPICS.length;
}
