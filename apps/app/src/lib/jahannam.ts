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
import {
  JAHANNAM_CORE_TOPICS_AR,
  JAHANNAM_CORE_TOPICS_UR,
  JAHANNAM_DUAS_AR,
  JAHANNAM_DUAS_UR,
  JAHANNAM_GATES_AR,
  JAHANNAM_GATES_UR,
  JAHANNAM_HADITH_AR,
  JAHANNAM_HADITH_UR,
  JAHANNAM_MAJOR_SIN_TOPICS_AR,
  JAHANNAM_MAJOR_SIN_TOPICS_UR,
  JAHANNAM_NAMES_AR,
  JAHANNAM_NAMES_UR,
  JAHANNAM_REFERENCES_AR,
  JAHANNAM_REFERENCES_UR,
  JAHANNAM_REFLECTIONS_AR,
  JAHANNAM_REFLECTIONS_UR,
  JAHANNAM_REFUGE_DUA_AR,
  JAHANNAM_REFUGE_DUA_UR,
  JAHANNAM_VERSES_AR,
  JAHANNAM_VERSES_UR,
} from "@munib-tracker/shared/content-i18n";
import type { JahannamSection, JahannamTopic } from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";

function getJahannamCoreTopics(): JahannamTopic[] {
  return localizeList(JAHANNAM_CORE_TOPICS, {
    ur: JAHANNAM_CORE_TOPICS_UR,
    ar: JAHANNAM_CORE_TOPICS_AR,
  });
}

export function getJahannamMajorSinTopics(): JahannamTopic[] {
  return localizeList(JAHANNAM_MAJOR_SIN_TOPICS, {
    ur: JAHANNAM_MAJOR_SIN_TOPICS_UR,
    ar: JAHANNAM_MAJOR_SIN_TOPICS_AR,
  });
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
  return localizeList(JAHANNAM_NAMES, { ur: JAHANNAM_NAMES_UR, ar: JAHANNAM_NAMES_AR });
}

export function getJahannamGates() {
  return localizeList(JAHANNAM_GATES, { ur: JAHANNAM_GATES_UR, ar: JAHANNAM_GATES_AR });
}

export function getJahannamVerses() {
  return localizeList(JAHANNAM_VERSES, { ur: JAHANNAM_VERSES_UR, ar: JAHANNAM_VERSES_AR });
}

export function getJahannamHadith() {
  return localizeList(JAHANNAM_HADITH, { ur: JAHANNAM_HADITH_UR, ar: JAHANNAM_HADITH_AR });
}

export function getJahannamDuas() {
  return localizeList(JAHANNAM_DUAS, { ur: JAHANNAM_DUAS_UR, ar: JAHANNAM_DUAS_AR });
}

export function getJahannamReflections() {
  return localizeList(JAHANNAM_REFLECTIONS, {
    ur: JAHANNAM_REFLECTIONS_UR,
    ar: JAHANNAM_REFLECTIONS_AR,
  });
}

export function getJahannamReferences() {
  return localizeList(JAHANNAM_REFERENCES, {
    ur: JAHANNAM_REFERENCES_UR,
    ar: JAHANNAM_REFERENCES_AR,
  });
}

export function getJahannamRefugeDua() {
  return localizeObject(JAHANNAM_REFUGE_DUA, {
    ur: JAHANNAM_REFUGE_DUA_UR,
    ar: JAHANNAM_REFUGE_DUA_AR,
  });
}
