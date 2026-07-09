import {
  BATTLES_AFTER_PROPHET,
  BATTLES_FIGURES,
  BATTLES_GLOSSARY,
  BATTLES_LESSON_CARDS,
  BATTLES_SECTION_ORDER,
  BATTLES_TIMELINE,
  BATTLES_TOPICS,
  BATTLES_VERSES,
} from "@munib-tracker/shared/content";
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

// Widen the `as const` source so overlays (plain strings) merge without literal-type clashes.
const BATTLES_AFTER_PROPHET_BASE: BattlesAfterProphetItem[] = [...BATTLES_AFTER_PROPHET];

export function getBattlesTopics(): BattlesTopic[] {
  return localizeList(BATTLES_TOPICS, overlayList("BATTLES_TOPICS"));
}

export function getBattlesTopic(id: string | undefined): BattlesTopic | undefined {
  if (!id) return undefined;
  return getBattlesTopics().find((topic) => topic.id === id);
}

export function getBattlesTopicsBySection(): Record<BattlesSection, BattlesTopic[]> {
  const grouped = Object.fromEntries(
    BATTLES_SECTION_ORDER.map((section) => [section, [] as BattlesTopic[]]),
  ) as Record<BattlesSection, BattlesTopic[]>;

  for (const topic of getBattlesTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getBattlesLessonCount(): number {
  return BATTLES_TOPICS.length;
}

export function getBattlesTimeline() {
  return localizeList(BATTLES_TIMELINE, overlayList("BATTLES_TIMELINE"));
}

export function getBattlesGlossary() {
  return localizeList(BATTLES_GLOSSARY, overlayList("BATTLES_GLOSSARY"));
}

export function getBattlesFigures() {
  return localizeList(BATTLES_FIGURES, overlayList("BATTLES_FIGURES"));
}

export function getBattlesLessonCards() {
  return localizeList(BATTLES_LESSON_CARDS, overlayList("BATTLES_LESSON_CARDS"));
}

export function getBattlesVerses() {
  return localizeList(BATTLES_VERSES, overlayList("BATTLES_VERSES"));
}

export function getBattlesAfterProphet(): BattlesAfterProphetItem[] {
  return localizeList(BATTLES_AFTER_PROPHET_BASE, overlayList("BATTLES_AFTER_PROPHET"));
}
