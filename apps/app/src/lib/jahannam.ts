import {
  JAHANNAM_CORE_TOPICS,
  JAHANNAM_DUAS,
  JAHANNAM_GATES,
  JAHANNAM_HADITH,
  JAHANNAM_MAJOR_SIN_TOPICS,
  JAHANNAM_NAMES,
  JAHANNAM_REFERENCES,
  JAHANNAM_REFLECTIONS,
  JAHANNAM_REFUGE_DUA,
  JAHANNAM_SECTION_ORDER,
  JAHANNAM_TOPICS,
  JAHANNAM_VERSES,
} from "@munib-tracker/shared/content";
import type { JahannamSection, JahannamTopic } from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";
import { overlayList, overlayObject } from "@/lib/content-overlay-registry";

function getJahannamCoreTopics(): JahannamTopic[] {
  return localizeList(JAHANNAM_CORE_TOPICS, overlayList("JAHANNAM_CORE_TOPICS"));
}

export function getJahannamMajorSinTopics(): JahannamTopic[] {
  return localizeList(JAHANNAM_MAJOR_SIN_TOPICS, overlayList("JAHANNAM_MAJOR_SIN_TOPICS"));
}

export function getJahannamTopics(): JahannamTopic[] {
  // Compose from the LOCALIZED base arrays so composed topics are translated too.
  return [...getJahannamCoreTopics(), ...getJahannamMajorSinTopics()];
}

export function getJahannamTopic(id: string | undefined): JahannamTopic | undefined {
  return getJahannamTopics().find((topic) => topic.id === id);
}

export function getJahannamTopicsBySection(): Record<JahannamSection, JahannamTopic[]> {
  const map = Object.fromEntries(
    JAHANNAM_SECTION_ORDER.map((section) => [section, [] as JahannamTopic[]]),
  ) as Record<JahannamSection, JahannamTopic[]>;
  for (const topic of getJahannamTopics()) {
    map[topic.section].push(topic);
  }
  return map;
}

export function getJahannamLessonCount(): number {
  return JAHANNAM_TOPICS.length;
}

export function getJahannamNames() {
  return localizeList(JAHANNAM_NAMES, overlayList("JAHANNAM_NAMES"));
}

export function getJahannamGates() {
  return localizeList(JAHANNAM_GATES, overlayList("JAHANNAM_GATES"));
}

export function getJahannamVerses() {
  return localizeList(JAHANNAM_VERSES, overlayList("JAHANNAM_VERSES"));
}

export function getJahannamHadith() {
  return localizeList(JAHANNAM_HADITH, overlayList("JAHANNAM_HADITH"));
}

export function getJahannamDuas() {
  return localizeList(JAHANNAM_DUAS, overlayList("JAHANNAM_DUAS"));
}

export function getJahannamReflections() {
  return localizeList(JAHANNAM_REFLECTIONS, overlayList("JAHANNAM_REFLECTIONS"));
}

export function getJahannamReferences() {
  return localizeList(JAHANNAM_REFERENCES, overlayList("JAHANNAM_REFERENCES"));
}

export function getJahannamRefugeDua() {
  return localizeObject(JAHANNAM_REFUGE_DUA, overlayObject("JAHANNAM_REFUGE_DUA"));
}
