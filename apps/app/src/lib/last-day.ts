import * as lastDay from "@munib-tracker/shared/content/last-day";
import * as lastDayHadith from "@munib-tracker/shared/content/last-day-hadith";
import * as lastDayQuiz from "@munib-tracker/shared/content/last-day-quiz";
import * as lastDayReferences from "@munib-tracker/shared/content/last-day-references";
import * as lastDayTimeline from "@munib-tracker/shared/content/last-day-timeline";
import * as lastDayVerses from "@munib-tracker/shared/content/last-day-verses";
import type { LastDaySection, LastDayTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/last-day` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = {
  ...lastDay,
  ...lastDayHadith,
  ...lastDayQuiz,
  ...lastDayReferences,
  ...lastDayTimeline,
  ...lastDayVerses,
};

export function isLastDayContentReady(): boolean {
  return true;
}

export async function ensureLastDayContent(): Promise<typeof corpus> {
  return corpus;
}

export function getLastDayTopics(): LastDayTopic[] {
  return localizeList(corpus.LAST_DAY_TOPICS, overlayList("LAST_DAY_TOPICS"));
}

export function getLastDayTopic(id: string | undefined): LastDayTopic | undefined {
  return getLastDayTopics().find((topic) => topic.id === id);
}

export function getLastDayTopicsBySection(): Record<LastDaySection, LastDayTopic[]> {
  const grouped = Object.fromEntries(
    corpus.LAST_DAY_SECTION_ORDER.map((section) => [section, [] as LastDayTopic[]]),
  ) as Record<LastDaySection, LastDayTopic[]>;

  for (const topic of getLastDayTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }

  // Keep the Scale catalog immediately after the Mizan theology lesson.
  const events = grouped.events;
  if (events?.length) {
    const heavyIdx = events.findIndex((t) => t.id === "heavy-on-the-scale");
    const scaleIdx = events.findIndex((t) => t.id === "scale");
    if (heavyIdx >= 0 && scaleIdx >= 0 && heavyIdx !== scaleIdx + 1) {
      const [heavy] = events.splice(heavyIdx, 1);
      const insertAt = events.findIndex((t) => t.id === "scale") + 1;
      events.splice(insertAt, 0, heavy);
    }
  }

  return grouped;
}

export function getLastDayLessonCount(): number {
  return corpus.LAST_DAY_TOPICS.length;
}

export function getLastDayTimeline() {
  return localizeList(corpus.LAST_DAY_TIMELINE, overlayList("LAST_DAY_TIMELINE"));
}

export function getLastDayVerses() {
  return localizeList(corpus.LAST_DAY_VERSES, overlayList("LAST_DAY_VERSES"));
}

export function getLastDayHadith() {
  return localizeList(corpus.LAST_DAY_HADITH, overlayList("LAST_DAY_HADITH"));
}

export function getLastDayQuiz() {
  return localizeList(corpus.LAST_DAY_QUIZ, overlayList("LAST_DAY_QUIZ"));
}

export function getLastDayReferences() {
  return localizeList(corpus.LAST_DAY_REFERENCES, overlayList("LAST_DAY_REFERENCES"));
}
