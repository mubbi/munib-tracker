import type { LastDaySection, LastDayTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type LastDayContent = typeof import("@munib-tracker/shared/content/last-day") &
  typeof import("@munib-tracker/shared/content/last-day-hadith") &
  typeof import("@munib-tracker/shared/content/last-day-quiz") &
  typeof import("@munib-tracker/shared/content/last-day-references") &
  typeof import("@munib-tracker/shared/content/last-day-timeline") &
  typeof import("@munib-tracker/shared/content/last-day-verses");
let contentCache: LastDayContent | undefined;
export async function ensureLastDayContent(): Promise<LastDayContent> {
  if (!contentCache) {
    const modules = await Promise.all([
      import("@munib-tracker/shared/content/last-day"),
      import("@munib-tracker/shared/content/last-day-hadith"),
      import("@munib-tracker/shared/content/last-day-quiz"),
      import("@munib-tracker/shared/content/last-day-references"),
      import("@munib-tracker/shared/content/last-day-timeline"),
      import("@munib-tracker/shared/content/last-day-verses"),
    ]);
    contentCache = Object.assign({}, ...modules) as LastDayContent;
  }
  return contentCache;
}
function content(): Partial<LastDayContent> {
  if (!contentCache) void ensureLastDayContent();
  return contentCache ?? {};
}

export function getLastDayTopics(): LastDayTopic[] {
  return localizeList(content().LAST_DAY_TOPICS ?? [], overlayList("LAST_DAY_TOPICS"));
}

export function getLastDayTopic(id: string | undefined): LastDayTopic | undefined {
  return getLastDayTopics().find((topic) => topic.id === id);
}

export function getLastDayTopicsBySection(): Record<LastDaySection, LastDayTopic[]> {
  const grouped = Object.fromEntries(
    (content().LAST_DAY_SECTION_ORDER ?? []).map((section) => [section, [] as LastDayTopic[]]),
  ) as Record<LastDaySection, LastDayTopic[]>;

  for (const topic of getLastDayTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getLastDayLessonCount(): number {
  return content().LAST_DAY_TOPICS?.length ?? 0;
}

export function getLastDayTimeline() {
  return localizeList(content().LAST_DAY_TIMELINE ?? [], overlayList("LAST_DAY_TIMELINE"));
}

export function getLastDayVerses() {
  return localizeList(content().LAST_DAY_VERSES ?? [], overlayList("LAST_DAY_VERSES"));
}

export function getLastDayHadith() {
  return localizeList(content().LAST_DAY_HADITH ?? [], overlayList("LAST_DAY_HADITH"));
}

export function getLastDayQuiz() {
  return localizeList(content().LAST_DAY_QUIZ ?? [], overlayList("LAST_DAY_QUIZ"));
}

export function getLastDayReferences() {
  return localizeList(content().LAST_DAY_REFERENCES ?? [], overlayList("LAST_DAY_REFERENCES"));
}
