import {
  WHITE_DAYS_GUIDE_SECTION_ORDER,
  WHITE_DAYS_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/white-days-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type WhiteDaysGuideSection = (typeof WHITE_DAYS_GUIDE_SECTION_ORDER)[number];

/**
 * English corpus ships with the `/white-days` route chunk (small guide) — sync
 * getters always have topics ready on first paint.
 */
export async function ensureWhiteDaysGuideContent(): Promise<void> {
  // Already warm — kept so screens / generateStaticParams share one API.
}

export function getWhiteDaysGuideTopics(): LearnGuideTopic[] {
  return localizeList(WHITE_DAYS_GUIDE_TOPICS, overlayList("WHITE_DAYS_GUIDE_TOPICS"));
}

export function getWhiteDaysGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getWhiteDaysGuideTopics().find((topic) => topic.id === id);
}

export function getWhiteDaysGuideSectionOrder(): readonly WhiteDaysGuideSection[] {
  return WHITE_DAYS_GUIDE_SECTION_ORDER;
}

export function getWhiteDaysGuideTopicsBySection(): Record<
  WhiteDaysGuideSection,
  LearnGuideTopic[]
> {
  const grouped = Object.fromEntries(
    WHITE_DAYS_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<WhiteDaysGuideSection, LearnGuideTopic[]>;
  for (const topic of getWhiteDaysGuideTopics()) {
    const bucket = grouped[topic.section as WhiteDaysGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
