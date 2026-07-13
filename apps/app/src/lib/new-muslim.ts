import {
  NEW_MUSLIM_SECTION_ORDER,
  NEW_MUSLIM_TOPICS,
} from "@munib-tracker/shared/content/new-muslim";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type NewMuslimSection = (typeof NEW_MUSLIM_SECTION_ORDER)[number];

/** English corpus ships with the `/new-muslim` route chunk — sync for reliable first paint. */
export async function ensureNewMuslimContent(): Promise<void> {}

export function getNewMuslimTopics(): LearnGuideTopic[] {
  return localizeList(NEW_MUSLIM_TOPICS, overlayList("NEW_MUSLIM_TOPICS"));
}

export function getNewMuslimTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getNewMuslimTopics().find((topic) => topic.id === id);
}

export function getNewMuslimSectionOrder(): readonly NewMuslimSection[] {
  return NEW_MUSLIM_SECTION_ORDER;
}

export function getNewMuslimTopicsBySection(): Record<NewMuslimSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    NEW_MUSLIM_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<NewMuslimSection, LearnGuideTopic[]>;
  for (const topic of getNewMuslimTopics()) {
    const bucket = grouped[topic.section as NewMuslimSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
