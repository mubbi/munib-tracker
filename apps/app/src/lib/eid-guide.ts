import { EID_GUIDE_SECTION_ORDER, EID_GUIDE_TOPICS } from "@munib-tracker/shared/content/eid-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type EidGuideSection = (typeof EID_GUIDE_SECTION_ORDER)[number];

/**
 * English corpus is statically imported with the `/eid` route chunk (small guide).
 * Lazy `import()` left the hub empty on first paint when the ensure effect lost
 * the race; sync getters always have topics ready.
 */
export async function ensureEidGuideContent(): Promise<void> {
  // Already warm — kept so screens / generateStaticParams share one API.
}

export function getEidGuideTopics(): LearnGuideTopic[] {
  return localizeList(EID_GUIDE_TOPICS, overlayList("EID_GUIDE_TOPICS"));
}

export function getEidGuideTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getEidGuideTopics().find((topic) => topic.id === id);
}

export function getEidGuideSectionOrder(): readonly EidGuideSection[] {
  return EID_GUIDE_SECTION_ORDER;
}

export function getEidGuideTopicsBySection(): Record<EidGuideSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    EID_GUIDE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<EidGuideSection, LearnGuideTopic[]>;
  for (const topic of getEidGuideTopics()) {
    const bucket = grouped[topic.section as EidGuideSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
