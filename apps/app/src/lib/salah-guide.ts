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

/** Topics grouped by learning journey phase. */
export function getSalahGuideTopicsByJourney(): Record<SalahGuideJourney, SalahGuideTopic[]> {
  const grouped = Object.fromEntries(
    (content().SALAH_GUIDE_JOURNEY_ORDER ?? []).map((phase) => [phase, [] as SalahGuideTopic[]]),
  ) as Record<SalahGuideJourney, SalahGuideTopic[]>;

  for (const topic of getSalahGuideTopics()) {
    grouped[topic.journey].push(topic);
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
