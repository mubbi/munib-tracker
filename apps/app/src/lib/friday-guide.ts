import {
  FRIDAY_GUIDE_SECTION_ORDER,
  FRIDAY_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/friday-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type FridayGuideSection = (typeof FRIDAY_GUIDE_SECTION_ORDER)[number];

/**
 * English corpus is statically imported with the `/friday` route chunk (small guide).
 * Sync getters always have topics ready on first paint.
 */
export async function ensureFridayGuideContent(): Promise<void> {
  // Already warm — kept so screens / generateStaticParams share one API.
}

export function getFridayGuideTopics(): LearnGuideTopic[] {
  return localizeList(FRIDAY_GUIDE_TOPICS, overlayList("FRIDAY_GUIDE_TOPICS"));
}

export function getFridayGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getFridayGuideTopics().find((topic) => topic.id === id);
}

export function getFridayGuideSectionOrder(): readonly FridayGuideSection[] {
  return FRIDAY_GUIDE_SECTION_ORDER;
}

export function getFridayGuideTopicsBySection(): Record<FridayGuideSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    FRIDAY_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<FridayGuideSection, LearnGuideTopic[]>;
  for (const topic of getFridayGuideTopics()) {
    const bucket = grouped[topic.section as FridayGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
