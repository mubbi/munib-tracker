import {
  JAHANNAM_DUAS,
  JAHANNAM_GATES,
  JAHANNAM_HADITH,
  JAHANNAM_MAJOR_SIN_IDS,
  JAHANNAM_NAMES,
  JAHANNAM_REFERENCES,
  JAHANNAM_REFLECTIONS,
  JAHANNAM_SECTION_ORDER,
  JAHANNAM_TOPICS,
  JAHANNAM_VERSES,
} from "@munib-tracker/shared/content";
import type { JahannamSection, JahannamTopic } from "@munib-tracker/shared/types";

export function getJahannamTopics(): JahannamTopic[] {
  return JAHANNAM_TOPICS;
}

export function getJahannamTopic(id: string | undefined): JahannamTopic | undefined {
  return JAHANNAM_TOPICS.find((topic) => topic.id === id);
}

export function getJahannamTopicsBySection(): Record<JahannamSection, JahannamTopic[]> {
  const map = Object.fromEntries(
    JAHANNAM_SECTION_ORDER.map((section) => [section, [] as JahannamTopic[]]),
  ) as Record<JahannamSection, JahannamTopic[]>;
  for (const topic of JAHANNAM_TOPICS) {
    map[topic.section].push(topic);
  }
  return map;
}

export function getJahannamMajorSinTopics(): JahannamTopic[] {
  return JAHANNAM_MAJOR_SIN_IDS.map((id) => JAHANNAM_TOPICS.find((t) => t.id === id)).filter(
    (t): t is JahannamTopic => t != null,
  );
}

export function getJahannamLessonCount(): number {
  return JAHANNAM_TOPICS.length;
}

export function getJahannamNames() {
  return JAHANNAM_NAMES;
}

export function getJahannamGates() {
  return JAHANNAM_GATES;
}

export function getJahannamVerses() {
  return JAHANNAM_VERSES;
}

export function getJahannamHadith() {
  return JAHANNAM_HADITH;
}

export function getJahannamDuas() {
  return JAHANNAM_DUAS;
}

export function getJahannamReflections() {
  return JAHANNAM_REFLECTIONS;
}

export function getJahannamReferences() {
  return JAHANNAM_REFERENCES;
}
