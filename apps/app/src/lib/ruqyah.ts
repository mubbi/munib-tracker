import { createLearnGuideAccessors } from "@/lib/learn-guide";

type RuqyahSection =
  typeof import("@munib-tracker/shared/content/ruqyah")["RUQYAH_SECTION_ORDER"][number];

const accessors = createLearnGuideAccessors<RuqyahSection>("RUQYAH_TOPICS", async () => {
  const { RUQYAH_TOPICS, RUQYAH_SECTION_ORDER } = await import(
    "@munib-tracker/shared/content/ruqyah"
  );
  return { topics: RUQYAH_TOPICS, sectionOrder: RUQYAH_SECTION_ORDER };
});

export const ensureRuqyahContent = accessors.ensureContent;
export const getRuqyahTopics = accessors.getTopics;
export const getRuqyahTopic = accessors.getTopic;
export const getRuqyahTopicsBySection = accessors.getTopicsBySection;
export const getRuqyahSectionOrder = accessors.getSectionOrder;
