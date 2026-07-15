import * as battles from "@munib-tracker/shared/content/battles";
import * as battlesFigures from "@munib-tracker/shared/content/battles-figures";
import * as battlesGlossary from "@munib-tracker/shared/content/battles-glossary";
import * as battlesLessons from "@munib-tracker/shared/content/battles-lessons";
import * as battlesTimeline from "@munib-tracker/shared/content/battles-timeline";
import * as battlesVerses from "@munib-tracker/shared/content/battles-verses";
import type { BattlesSection, BattlesTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/** Widened shape of a post-prophetic battle entry (the source array is `as const`). */
export interface BattlesAfterProphetItem {
  id: string;
  title: string;
  year: number;
  body: string;
  location: string;
}

/**
 * English corpus is statically imported with the `/battles` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = {
  ...battles,
  ...battlesFigures,
  ...battlesGlossary,
  ...battlesLessons,
  ...battlesTimeline,
  ...battlesVerses,
};

export function isBattlesContentReady(): boolean {
  return true;
}

export async function ensureBattlesContent(): Promise<typeof corpus> {
  return corpus;
}

export function getBattlesTopics(): BattlesTopic[] {
  return localizeList(corpus.BATTLES_TOPICS, overlayList("BATTLES_TOPICS"));
}

export function getBattlesTopic(id: string | undefined): BattlesTopic | undefined {
  if (!id) return undefined;
  return getBattlesTopics().find((topic) => topic.id === id);
}

export function getBattlesSectionOrder(): readonly BattlesSection[] {
  return corpus.BATTLES_SECTION_ORDER;
}

export function getBattlesTopicsBySection(): Record<BattlesSection, BattlesTopic[]> {
  const grouped = Object.fromEntries(
    getBattlesSectionOrder().map((section) => [section, [] as BattlesTopic[]]),
  ) as Record<BattlesSection, BattlesTopic[]>;

  for (const topic of getBattlesTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getBattlesLessonCount(): number {
  return corpus.BATTLES_TOPICS.length;
}

export function getBattlesTimeline() {
  return localizeList(corpus.BATTLES_TIMELINE, overlayList("BATTLES_TIMELINE"));
}

export function getBattlesGlossary() {
  return localizeList(corpus.BATTLES_GLOSSARY, overlayList("BATTLES_GLOSSARY"));
}

export function getBattlesFigures() {
  return localizeList(corpus.BATTLES_FIGURES, overlayList("BATTLES_FIGURES"));
}

export function getBattlesLessonCards() {
  return localizeList(corpus.BATTLES_LESSON_CARDS, overlayList("BATTLES_LESSON_CARDS"));
}

export function getBattlesVerses() {
  return localizeList(corpus.BATTLES_VERSES, overlayList("BATTLES_VERSES"));
}

export function getBattlesAfterProphet(): BattlesAfterProphetItem[] {
  const base: BattlesAfterProphetItem[] = [...corpus.BATTLES_AFTER_PROPHET];
  return localizeList(base, overlayList("BATTLES_AFTER_PROPHET"));
}
