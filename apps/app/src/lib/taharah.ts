import * as taharah from "@munib-tracker/shared/content/taharah";
import * as taharahChecklist from "@munib-tracker/shared/content/taharah-checklist";
import type {
  TaharahChecklistItem,
  TaharahSection,
  TaharahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

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
  const grouped = Object.fromEntries(
    corpus.TAHARAH_SECTION_ORDER.map((section) => [section, [] as TaharahTopic[]]),
  ) as Record<TaharahSection, TaharahTopic[]>;

  for (const topic of getTaharahTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getTaharahChecklist(): TaharahChecklistItem[] {
  return localizeList(corpus.TAHARAH_CHECKLIST, overlayList("TAHARAH_CHECKLIST"));
}

export function getTaharahLessonCount(): number {
  return corpus.TAHARAH_TOPICS.length;
}
