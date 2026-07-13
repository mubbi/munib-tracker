import { createLearnGuideAccessors } from "@/lib/learn-guide";

type EidGuideSection =
  typeof import("@munib-tracker/shared/content/eid-guide")["EID_GUIDE_SECTION_ORDER"][number];

const accessors = createLearnGuideAccessors<EidGuideSection>("EID_GUIDE_TOPICS", async () => {
  const { EID_GUIDE_TOPICS, EID_GUIDE_SECTION_ORDER } = await import(
    "@munib-tracker/shared/content/eid-guide"
  );
  return { topics: EID_GUIDE_TOPICS, sectionOrder: EID_GUIDE_SECTION_ORDER };
});

export const ensureEidGuideContent = accessors.ensureContent;
export const getEidGuideTopics = accessors.getTopics;
export const getEidGuideTopic = accessors.getTopic;
export const getEidGuideTopicsBySection = accessors.getTopicsBySection;
export const getEidGuideSectionOrder = accessors.getSectionOrder;
