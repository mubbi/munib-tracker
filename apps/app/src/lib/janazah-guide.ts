import {
  JANAZAH_GUIDE_SECTION_ORDER,
  JANAZAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/janazah-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type JanazahGuideSection = (typeof JANAZAH_GUIDE_SECTION_ORDER)[number];

export async function ensureJanazahGuideContent(): Promise<void> {
  // Sync corpus — kept for API parity with other guides.
}

export function getJanazahGuideTopics(): LearnGuideTopic[] {
  return localizeList(JANAZAH_GUIDE_TOPICS, overlayList("JANAZAH_GUIDE_TOPICS"));
}

export function getJanazahGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getJanazahGuideTopics().find((topic) => topic.id === id);
}

export function getJanazahGuideSectionOrder(): readonly JanazahGuideSection[] {
  return JANAZAH_GUIDE_SECTION_ORDER;
}

export function getJanazahGuideTopicsBySection(): Record<JanazahGuideSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    JANAZAH_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<JanazahGuideSection, LearnGuideTopic[]>;
  for (const topic of getJanazahGuideTopics()) {
    const bucket = grouped[topic.section as JanazahGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
