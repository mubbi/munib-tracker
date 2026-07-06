import {
  LEARN_DUA_OCCASIONS,
  LEARN_DUA_SECTION_ORDER,
  LEARN_DUA_TOPICS,
} from "@munib-tracker/shared/content";
import type { LearnDuaOccasion, LearnDuaSection, LearnDuaTopic } from "@munib-tracker/shared/types";

export function getLearnDuaTopics(): LearnDuaTopic[] {
  return LEARN_DUA_TOPICS;
}

export function getLearnDuaTopic(id: string | undefined): LearnDuaTopic | undefined {
  return LEARN_DUA_TOPICS.find((topic) => topic.id === id);
}

export function getLearnDuaTopicsBySection(): Record<LearnDuaSection, LearnDuaTopic[]> {
  const grouped = Object.fromEntries(
    LEARN_DUA_SECTION_ORDER.map((section) => [section, [] as LearnDuaTopic[]]),
  ) as Record<LearnDuaSection, LearnDuaTopic[]>;

  for (const topic of LEARN_DUA_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getLearnDuaOccasions(): LearnDuaOccasion[] {
  return LEARN_DUA_OCCASIONS;
}

export function getLearnDuaLessonCount(): number {
  return LEARN_DUA_TOPICS.length;
}
