import {
  NEW_MUSLIM_SECTION_ORDER,
  NEW_MUSLIM_TOPICS,
} from "@munib-tracker/shared/content/new-muslim";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/new-muslim` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: NEW_MUSLIM_TOPICS,
  sectionOrder: NEW_MUSLIM_SECTION_ORDER,
  overlayKey: "NEW_MUSLIM_TOPICS",
});

export const ensureNewMuslimContent = ensureBundledGuideContent;
export const getNewMuslimTopics = guide.getTopics;
export const getNewMuslimTopic = guide.getTopic;
export const getNewMuslimSectionOrder = guide.getSectionOrder;
export const getNewMuslimTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const newMuslimGuideConfig: LearnGuideConfig = {
  ns: "newMuslim",
  basePath: "/new-muslim",
  guide,
};
