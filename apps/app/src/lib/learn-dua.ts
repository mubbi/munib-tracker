import {
  LEARN_DUA_OCCASIONS,
  LEARN_DUA_SECTION_ORDER,
  LEARN_DUA_TOPICS,
} from "@munib-tracker/shared/content";
import {
  LEARN_DUA_OCCASIONS_AR,
  LEARN_DUA_OCCASIONS_UR,
  LEARN_DUA_TOPICS_AR,
  LEARN_DUA_TOPICS_UR,
} from "@munib-tracker/shared/content-i18n";
import type { LearnDuaOccasion, LearnDuaSection, LearnDuaTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

export function getLearnDuaTopics(): LearnDuaTopic[] {
  return localizeList(LEARN_DUA_TOPICS, { ur: LEARN_DUA_TOPICS_UR, ar: LEARN_DUA_TOPICS_AR });
}

export function getLearnDuaTopic(id: string | undefined): LearnDuaTopic | undefined {
  if (!id) return undefined;
  return getLearnDuaTopics().find((topic) => topic.id === id);
}

export function getLearnDuaTopicsBySection(): Record<LearnDuaSection, LearnDuaTopic[]> {
  const grouped = Object.fromEntries(
    LEARN_DUA_SECTION_ORDER.map((section) => [section, [] as LearnDuaTopic[]]),
  ) as Record<LearnDuaSection, LearnDuaTopic[]>;

  for (const topic of getLearnDuaTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getLearnDuaOccasions(): LearnDuaOccasion[] {
  return localizeList(LEARN_DUA_OCCASIONS, {
    ur: LEARN_DUA_OCCASIONS_UR,
    ar: LEARN_DUA_OCCASIONS_AR,
  });
}

export function getLearnDuaLessonCount(): number {
  return LEARN_DUA_TOPICS.length;
}
