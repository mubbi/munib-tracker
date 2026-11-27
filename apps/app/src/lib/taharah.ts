import * as taharah from "@munib-tracker/shared/content/taharah";
import * as taharahChecklist from "@munib-tracker/shared/content/taharah-checklist";
import type {
  TaharahChecklistItem,
  TaharahSection,
  TaharahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";
import { groupBySection } from "@/lib/sectioned-guide";

/**
 * English corpus is statically imported with the `/taharah` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = { ...taharah, ...taharahChecklist };

export function isTaharahContentReady(): boolean {
  return true;
}

export async function ensureTaharahContent(): Promise<typeof corpus> {
  return corpus;
}

export function getTaharahTopics(): TaharahTopic[] {
  return localizeList(corpus.TAHARAH_TOPICS, overlayList("TAHARAH_TOPICS"));
}

export function getTaharahTopic(id: string | undefined): TaharahTopic | undefined {
  if (!id) return undefined;
  return getTaharahTopics().find((topic) => topic.id === id);
}

export function getTaharahTopicsBySection(): Record<TaharahSection, TaharahTopic[]> {
  return groupBySection(getTaharahTopics(), corpus.TAHARAH_SECTION_ORDER);
}

export function getTaharahChecklist(): TaharahChecklistItem[] {
  return localizeList(corpus.TAHARAH_CHECKLIST, overlayList("TAHARAH_CHECKLIST"));
}

export function getTaharahLessonCount(): number {
  return corpus.TAHARAH_TOPICS.length;
}
