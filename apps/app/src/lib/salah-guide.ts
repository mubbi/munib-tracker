import * as salahGuide from "@munib-tracker/shared/content/salah-guide";
import * as salahPhrases from "@munib-tracker/shared/content/salah-guide-phrases";
import type {
  SalahGuideJourney,
  SalahGuidePhrase,
  SalahGuideTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/salah-guide` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint when the ensure effect
 * lost the race; sync getters always have topics ready on first visit.
 */
const corpus = { ...salahGuide, ...salahPhrases };

export function isSalahGuideContentReady(): boolean {
  return true;
}

export async function ensureSalahGuideContent(): Promise<typeof corpus> {
  return corpus;
}

/** All Learn Salah topics, localized for the active app locale. */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return localizeList(corpus.SALAH_GUIDE_TOPICS, overlayList("SALAH_GUIDE_TOPICS"));
}

/** One topic by id, or undefined. */
export function getSalahGuideTopic(id: string | undefined): SalahGuideTopic | undefined {
  return getSalahGuideTopics().find((topic) => topic.id === id);
}

/** Topics grouped by learning journey phase. */
export function getSalahGuideTopicsByJourney(): Record<SalahGuideJourney, SalahGuideTopic[]> {
  const order = corpus.SALAH_GUIDE_JOURNEY_ORDER;
  const grouped = Object.fromEntries(
    order.map((phase) => [phase, [] as SalahGuideTopic[]]),
  ) as Record<SalahGuideJourney, SalahGuideTopic[]>;

  for (const topic of getSalahGuideTopics()) {
    const bucket = grouped[topic.journey];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getSalahGuidePhrases(): SalahGuidePhrase[] {
  return localizeList(corpus.SALAH_GUIDE_PHRASES, overlayList("SALAH_GUIDE_PHRASES"));
}

export function getPrayerRakats() {
  return corpus.PRAYER_RAKATS;
}

export function getSalahGuideLessonCount(): number {
  return corpus.SALAH_GUIDE_TOPICS.length;
}
