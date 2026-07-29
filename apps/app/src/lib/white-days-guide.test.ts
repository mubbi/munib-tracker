import {
  WHITE_DAYS_GUIDE_SECTION_ORDER,
  WHITE_DAYS_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/white-days-guide";

import {
  getWhiteDaysGuideSectionOrder,
  getWhiteDaysGuideTopic,
  getWhiteDaysGuideTopics,
  getWhiteDaysGuideTopicsBySection,
} from "@/lib/white-days-guide";

describe("white-days-guide accessors", () => {
  it("exposes every section with at least one topic on first call (no await)", () => {
    const order = getWhiteDaysGuideSectionOrder();
    expect(order).toEqual([...WHITE_DAYS_GUIDE_SECTION_ORDER]);

    const topics = getWhiteDaysGuideTopics();
    expect(topics.length).toBe(WHITE_DAYS_GUIDE_TOPICS.length);
    expect(topics.length).toBeGreaterThan(0);

    const bySection = getWhiteDaysGuideTopicsBySection();
    for (const section of order) {
      expect(bySection[section]?.length).toBeGreaterThan(0);
    }
  });

  it("resolves a known topic by id", () => {
    const topic = getWhiteDaysGuideTopic("what-are-the-white-days");
    expect(topic?.title).toMatch(/white days/i);
  });

  it("returns undefined for an unknown id", () => {
    expect(getWhiteDaysGuideTopic(undefined)).toBeUndefined();
    expect(getWhiteDaysGuideTopic("does-not-exist")).toBeUndefined();
  });
});
