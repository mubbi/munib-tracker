import * as learnDua from "@munib-tracker/shared/content/learn-dua";
import * as learnDuaOccasions from "@munib-tracker/shared/content/learn-dua-occasions";
import type { LearnDuaOccasion, LearnDuaSection, LearnDuaTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/learn-dua` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = { ...learnDua, ...learnDuaOccasions };

export function isLearnDuaContentReady(): boolean {
  return true;
}

export async function ensureLearnDuaContent(): Promise<typeof corpus> {
  return corpus;
}

export function getLearnDuaTopics(): LearnDuaTopic[] {
  return localizeList(corpus.LEARN_DUA_TOPICS, overlayList("LEARN_DUA_TOPICS"));
}

export function getLearnDuaTopic(id: string | undefined): LearnDuaTopic | undefined {
  if (!id) return undefined;
  return getLearnDuaTopics().find((topic) => topic.id === id);
}

export function getLearnDuaTopicsBySection(): Record<LearnDuaSection, LearnDuaTopic[]> {
  const grouped = Object.fromEntries(
    corpus.LEARN_DUA_SECTION_ORDER.map((section) => [section, [] as LearnDuaTopic[]]),
  ) as Record<LearnDuaSection, LearnDuaTopic[]>;

  for (const topic of getLearnDuaTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getLearnDuaOccasions(): LearnDuaOccasion[] {
  return localizeList(corpus.LEARN_DUA_OCCASIONS, overlayList("LEARN_DUA_OCCASIONS"));
}

export function getLearnDuaLessonCount(): number {
  return corpus.LEARN_DUA_TOPICS.length;
}
