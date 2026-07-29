import { HAJJ_CHECKLIST } from "@munib-tracker/shared/content/hajj-checklist";
import {
  HAJJ_GUIDE_SECTION_ORDER,
  HAJJ_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/hajj-guide";
import { UMRAH_CHECKLIST } from "@munib-tracker/shared/content/umrah-checklist";
import type { LearnGuideTopic, PilgrimageChecklistItem } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type HajjGuideSection = (typeof HAJJ_GUIDE_SECTION_ORDER)[number];

/**
 * English corpus is statically imported with the `/hajj` route chunk.
 * Lazy `import()` left the hub empty/partial on first paint.
 */
export function isHajjGuideContentReady(): boolean {
  return true;
}

export async function ensureHajjGuideContent(): Promise<void> {
  // Already warm — kept so screens / generateStaticParams share one API.
}

export function getHajjGuideTopics(): LearnGuideTopic[] {
  return localizeList(HAJJ_GUIDE_TOPICS, overlayList("HAJJ_GUIDE_TOPICS"));
}

export function getHajjGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getHajjGuideTopics().find((topic) => topic.id === id);
}

export function getHajjGuideSectionOrder(): readonly HajjGuideSection[] {
  return HAJJ_GUIDE_SECTION_ORDER;
}

export function getHajjGuideTopicsBySection(): Record<HajjGuideSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    HAJJ_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<HajjGuideSection, LearnGuideTopic[]>;
  for (const topic of getHajjGuideTopics()) {
    const bucket = grouped[topic.section as HajjGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getHajjChecklistItems(): PilgrimageChecklistItem[] {
  return localizeList(HAJJ_CHECKLIST, overlayList("HAJJ_CHECKLIST"));
}

export function getUmrahChecklistItems(): PilgrimageChecklistItem[] {
  return localizeList(UMRAH_CHECKLIST, overlayList("UMRAH_CHECKLIST"));
}
