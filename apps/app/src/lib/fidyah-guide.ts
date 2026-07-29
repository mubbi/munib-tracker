import {
  FIDYAH_GUIDE_SECTION_ORDER,
  FIDYAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/fidyah-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type FidyahGuideSection = (typeof FIDYAH_GUIDE_SECTION_ORDER)[number];

export async function ensureFidyahGuideContent(): Promise<void> {
  // Sync corpus — kept for API parity with other guides.
}

export function getFidyahGuideTopics(): LearnGuideTopic[] {
  return localizeList(FIDYAH_GUIDE_TOPICS, overlayList("FIDYAH_GUIDE_TOPICS"));
}

export function getFidyahGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getFidyahGuideTopics().find((topic) => topic.id === id);
}

export function getFidyahGuideSectionOrder(): readonly FidyahGuideSection[] {
  return FIDYAH_GUIDE_SECTION_ORDER;
}

export function getFidyahGuideTopicsBySection(): Record<FidyahGuideSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    FIDYAH_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<FidyahGuideSection, LearnGuideTopic[]>;
  for (const topic of getFidyahGuideTopics()) {
    const bucket = grouped[topic.section as FidyahGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
