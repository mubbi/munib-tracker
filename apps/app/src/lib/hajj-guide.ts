import { HAJJ_CHECKLIST } from "@munib-tracker/shared/content/hajj-checklist";
import {
  HAJJ_GUIDE_SECTION_ORDER,
  HAJJ_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/hajj-guide";
import { UMRAH_CHECKLIST } from "@munib-tracker/shared/content/umrah-checklist";
import type { PilgrimageChecklistItem } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/hajj` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: HAJJ_GUIDE_TOPICS,
  sectionOrder: HAJJ_GUIDE_SECTION_ORDER,
  overlayKey: "HAJJ_GUIDE_TOPICS",
});

export function isHajjGuideContentReady(): boolean {
  return true;
}

export const ensureHajjGuideContent = ensureBundledGuideContent;
export const getHajjGuideTopics = guide.getTopics;
export const getHajjGuideTopic = guide.getTopic;
export const getHajjGuideSectionOrder = guide.getSectionOrder;
export const getHajjGuideTopicsBySection = guide.getTopicsBySection;

export function getHajjChecklistItems(): PilgrimageChecklistItem[] {
  return localizeList(HAJJ_CHECKLIST, overlayList("HAJJ_CHECKLIST"));
}

export function getUmrahChecklistItems(): PilgrimageChecklistItem[] {
  return localizeList(UMRAH_CHECKLIST, overlayList("UMRAH_CHECKLIST"));
}

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const hajjGuideConfig: LearnGuideConfig = { ns: "hajj", basePath: "/hajj", guide };
