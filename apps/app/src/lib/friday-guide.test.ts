import {
  FRIDAY_GUIDE_SECTION_ORDER,
  FRIDAY_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/friday-guide";

import {
  getFridayGuideSectionOrder,
  getFridayGuideTopic,
  getFridayGuideTopics,
  getFridayGuideTopicsBySection,
} from "@/lib/friday-guide";

describe("friday-guide accessors", () => {
  it("exposes every section with at least one topic on first call (no await)", () => {
    const order = getFridayGuideSectionOrder();
    expect(order).toEqual([...FRIDAY_GUIDE_SECTION_ORDER]);

    const topics = getFridayGuideTopics();
    expect(topics.length).toBe(FRIDAY_GUIDE_TOPICS.length);
    expect(topics.length).toBeGreaterThan(0);

    const bySection = getFridayGuideTopicsBySection();
    for (const section of order) {
      expect(bySection[section]?.length).toBeGreaterThan(0);
    }
  });

  it("resolves a known topic by id", () => {
    const topic = getFridayGuideTopic("virtues-of-friday");
    expect(topic?.title).toMatch(/virtues of Friday/i);
  });
});
