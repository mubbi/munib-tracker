import type {
  SalahGuideJourney,
  SalahGuidePhrase,
  SalahGuideTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type SalahGuideContent = typeof import("@munib-tracker/shared/content/salah-guide") &
  typeof import("@munib-tracker/shared/content/salah-guide-phrases");
let contentCache: SalahGuideContent | undefined;
export function isSalahGuideContentReady(): boolean {
  return contentCache !== undefined;
}
export async function ensureSalahGuideContent(): Promise<SalahGuideContent> {
  if (!contentCache) {
    const [guide, phrases] = await Promise.all([
      import("@munib-tracker/shared/content/salah-guide"),
      import("@munib-tracker/shared/content/salah-guide-phrases"),
    ]);
    contentCache = { ...guide, ...phrases };
  }
  return contentCache;
}
function content(): Partial<SalahGuideContent> {
  if (!contentCache) void ensureSalahGuideContent();
  return contentCache ?? {};
}

/** All Learn Salah topics, localized for the active app locale. */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return localizeList(content().SALAH_GUIDE_TOPICS ?? [], overlayList("SALAH_GUIDE_TOPICS"));
}

/** One topic by id, or undefined. */
export function getSalahGuideTopic(id: string | undefined): SalahGuideTopic | undefined {
  return getSalahGuideTopics().find((topic) => topic.id === id);
}

/** Fallback when the lazy content chunk has not loaded yet — matches SALAH_GUIDE_JOURNEY_ORDER. */
const FALLBACK_JOURNEY_ORDER: readonly SalahGuideJourney[] = [
  "why",
  "prepare",
  "learn",
  "practice",
  "perfect",
  "consistency",
];

/** Topics grouped by learning journey phase. */
export function getSalahGuideTopicsByJourney(): Record<SalahGuideJourney, SalahGuideTopic[]> {
  const order = content().SALAH_GUIDE_JOURNEY_ORDER ?? FALLBACK_JOURNEY_ORDER;
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
  return localizeList(content().SALAH_GUIDE_PHRASES ?? [], overlayList("SALAH_GUIDE_PHRASES"));
}

export function getPrayerRakats() {
  return content().PRAYER_RAKATS ?? [];
}

export function getSalahGuideLessonCount(): number {
  return content().SALAH_GUIDE_TOPICS?.length ?? 0;
}
