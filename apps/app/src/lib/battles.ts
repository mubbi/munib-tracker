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

type BattlesContent = typeof import("@munib-tracker/shared/content/battles") &
  typeof import("@munib-tracker/shared/content/battles-figures") &
  typeof import("@munib-tracker/shared/content/battles-glossary") &
  typeof import("@munib-tracker/shared/content/battles-lessons") &
  typeof import("@munib-tracker/shared/content/battles-timeline") &
  typeof import("@munib-tracker/shared/content/battles-verses");
let contentCache: BattlesContent | undefined;

export async function ensureBattlesContent(): Promise<BattlesContent> {
  if (!contentCache) {
    const modules = await Promise.all([
      import("@munib-tracker/shared/content/battles"),
      import("@munib-tracker/shared/content/battles-figures"),
      import("@munib-tracker/shared/content/battles-glossary"),
      import("@munib-tracker/shared/content/battles-lessons"),
      import("@munib-tracker/shared/content/battles-timeline"),
      import("@munib-tracker/shared/content/battles-verses"),
    ]);
    contentCache = Object.assign({}, ...modules) as BattlesContent;
  }
  return contentCache;
}

function content(): Partial<BattlesContent> {
  if (!contentCache) void ensureBattlesContent();
  return contentCache ?? {};
}

export function getBattlesTopics(): BattlesTopic[] {
  return localizeList(content().BATTLES_TOPICS ?? [], overlayList("BATTLES_TOPICS"));
}

export function getBattlesTopic(id: string | undefined): BattlesTopic | undefined {
  if (!id) return undefined;
  return getBattlesTopics().find((topic) => topic.id === id);
}

export function getBattlesSectionOrder(): readonly BattlesSection[] {
  return content().BATTLES_SECTION_ORDER ?? [];
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
  return content().BATTLES_TOPICS?.length ?? 0;
}

export function getBattlesTimeline() {
  return localizeList(content().BATTLES_TIMELINE ?? [], overlayList("BATTLES_TIMELINE"));
}

export function getBattlesGlossary() {
  return localizeList(content().BATTLES_GLOSSARY ?? [], overlayList("BATTLES_GLOSSARY"));
}

export function getBattlesFigures() {
  return localizeList(content().BATTLES_FIGURES ?? [], overlayList("BATTLES_FIGURES"));
}

export function getBattlesLessonCards() {
  return localizeList(content().BATTLES_LESSON_CARDS ?? [], overlayList("BATTLES_LESSON_CARDS"));
}

export function getBattlesVerses() {
  return localizeList(content().BATTLES_VERSES ?? [], overlayList("BATTLES_VERSES"));
}

export function getBattlesAfterProphet(): BattlesAfterProphetItem[] {
  const base: BattlesAfterProphetItem[] = [...(content().BATTLES_AFTER_PROPHET ?? [])];
  return localizeList(base, overlayList("BATTLES_AFTER_PROPHET"));
}
