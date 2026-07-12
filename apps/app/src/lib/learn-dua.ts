import type { LearnDuaOccasion, LearnDuaSection, LearnDuaTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type LearnDuaContent = typeof import("@munib-tracker/shared/content/learn-dua") &
  typeof import("@munib-tracker/shared/content/learn-dua-occasions");
let contentCache: LearnDuaContent | undefined;
export async function ensureLearnDuaContent(): Promise<LearnDuaContent> {
  if (!contentCache) {
    const [topics, occasions] = await Promise.all([
      import("@munib-tracker/shared/content/learn-dua"),
      import("@munib-tracker/shared/content/learn-dua-occasions"),
    ]);
    contentCache = { ...topics, ...occasions };
  }
  return contentCache;
}
function content(): Partial<LearnDuaContent> {
  if (!contentCache) void ensureLearnDuaContent();
  return contentCache ?? {};
}

export function getLearnDuaTopics(): LearnDuaTopic[] {
  return localizeList(content().LEARN_DUA_TOPICS ?? [], overlayList("LEARN_DUA_TOPICS"));
}

export function getLearnDuaTopic(id: string | undefined): LearnDuaTopic | undefined {
  if (!id) return undefined;
  return getLearnDuaTopics().find((topic) => topic.id === id);
}

export function getLearnDuaTopicsBySection(): Record<LearnDuaSection, LearnDuaTopic[]> {
  const grouped = Object.fromEntries(
    (content().LEARN_DUA_SECTION_ORDER ?? []).map((section) => [section, [] as LearnDuaTopic[]]),
  ) as Record<LearnDuaSection, LearnDuaTopic[]>;

  for (const topic of getLearnDuaTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getLearnDuaOccasions(): LearnDuaOccasion[] {
  return localizeList(content().LEARN_DUA_OCCASIONS ?? [], overlayList("LEARN_DUA_OCCASIONS"));
}

export function getLearnDuaLessonCount(): number {
  return content().LEARN_DUA_TOPICS?.length ?? 0;
}
