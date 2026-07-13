import { createLearnGuideAccessors } from "@/lib/learn-guide";

type NewMuslimSection =
  typeof import("@munib-tracker/shared/content/new-muslim")["NEW_MUSLIM_SECTION_ORDER"][number];

const accessors = createLearnGuideAccessors<NewMuslimSection>("NEW_MUSLIM_TOPICS", async () => {
  const { NEW_MUSLIM_TOPICS, NEW_MUSLIM_SECTION_ORDER } = await import(
    "@munib-tracker/shared/content/new-muslim"
  );
  return { topics: NEW_MUSLIM_TOPICS, sectionOrder: NEW_MUSLIM_SECTION_ORDER };
});

export const ensureNewMuslimContent = accessors.ensureContent;
export const getNewMuslimTopics = accessors.getTopics;
export const getNewMuslimTopic = accessors.getTopic;
export const getNewMuslimTopicsBySection = accessors.getTopicsBySection;
export const getNewMuslimSectionOrder = accessors.getSectionOrder;
