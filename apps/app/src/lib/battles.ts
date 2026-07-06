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

export function getBattlesTopics(): BattlesTopic[] {
  return BATTLES_TOPICS;
}

export function getBattlesTopic(id: string | undefined): BattlesTopic | undefined {
  return BATTLES_TOPICS.find((topic) => topic.id === id);
}

export function getBattlesTopicsBySection(): Record<BattlesSection, BattlesTopic[]> {
  const grouped = Object.fromEntries(
    BATTLES_SECTION_ORDER.map((section) => [section, [] as BattlesTopic[]]),
  ) as Record<BattlesSection, BattlesTopic[]>;

  for (const topic of BATTLES_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getBattlesLessonCount(): number {
  return BATTLES_TOPICS.length;
}

export function getBattlesTimeline() {
  return BATTLES_TIMELINE;
}

export function getBattlesGlossary() {
  return BATTLES_GLOSSARY;
}

export function getBattlesFigures() {
  return BATTLES_FIGURES;
}

export function getBattlesLessonCards() {
  return BATTLES_LESSON_CARDS;
}

export function getBattlesVerses() {
  return BATTLES_VERSES;
}

export function getBattlesAfterProphet() {
  return BATTLES_AFTER_PROPHET;
}
