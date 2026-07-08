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
import {
  BATTLES_AFTER_PROPHET_AR,
  BATTLES_AFTER_PROPHET_UR,
  BATTLES_FIGURES_AR,
  BATTLES_FIGURES_UR,
  BATTLES_GLOSSARY_AR,
  BATTLES_GLOSSARY_UR,
  BATTLES_LESSON_CARDS_AR,
  BATTLES_LESSON_CARDS_UR,
  BATTLES_TIMELINE_AR,
  BATTLES_TIMELINE_UR,
  BATTLES_TOPICS_AR,
  BATTLES_TOPICS_UR,
  BATTLES_VERSES_AR,
  BATTLES_VERSES_UR,
} from "@munib-tracker/shared/content-i18n";
import type { BattlesSection, BattlesTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

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
  return localizeList(BATTLES_TOPICS, { ur: BATTLES_TOPICS_UR, ar: BATTLES_TOPICS_AR });
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
  return localizeList(BATTLES_TIMELINE, { ur: BATTLES_TIMELINE_UR, ar: BATTLES_TIMELINE_AR });
}

export function getBattlesGlossary() {
  return localizeList(BATTLES_GLOSSARY, { ur: BATTLES_GLOSSARY_UR, ar: BATTLES_GLOSSARY_AR });
}

export function getBattlesFigures() {
  return localizeList(BATTLES_FIGURES, { ur: BATTLES_FIGURES_UR, ar: BATTLES_FIGURES_AR });
}

export function getBattlesLessonCards() {
  return localizeList(BATTLES_LESSON_CARDS, {
    ur: BATTLES_LESSON_CARDS_UR,
    ar: BATTLES_LESSON_CARDS_AR,
  });
}

export function getBattlesVerses() {
  return localizeList(BATTLES_VERSES, { ur: BATTLES_VERSES_UR, ar: BATTLES_VERSES_AR });
}

export function getBattlesAfterProphet(): BattlesAfterProphetItem[] {
  return localizeList(BATTLES_AFTER_PROPHET_BASE, {
    ur: BATTLES_AFTER_PROPHET_UR,
    ar: BATTLES_AFTER_PROPHET_AR,
  });
}
