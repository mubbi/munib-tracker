import { EID_GUIDE_SECTION_ORDER, EID_GUIDE_TOPICS } from "@munib-tracker/shared/content/eid-guide";

import {
  getEidGuideSectionOrder,
  getEidGuideTopic,
  getEidGuideTopics,
  getEidGuideTopicsBySection,
} from "@/lib/eid-guide";

describe("eid-guide accessors", () => {
  it("exposes every section with at least one topic on first call (no await)", () => {
    const order = getEidGuideSectionOrder();
    expect(order).toEqual([...EID_GUIDE_SECTION_ORDER]);

    const topics = getEidGuideTopics();
    expect(topics.length).toBe(EID_GUIDE_TOPICS.length);
    expect(topics.length).toBeGreaterThan(0);

    const bySection = getEidGuideTopicsBySection();
    for (const section of order) {
      expect(bySection[section]?.length).toBeGreaterThan(0);
    }
  });

  it("resolves a known topic by id", () => {
    const topic = getEidGuideTopic("eid-al-fitr");
    expect(topic?.title).toMatch(/Eid al-Fitr/i);
  });
});
