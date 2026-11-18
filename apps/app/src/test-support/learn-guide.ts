import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

/**
 * Shared behaviour checks for sectioned Learn guide modules (`getXTopics`,
 * `getXTopic`, `getXTopicsBySection`). Requires the test file to mock
 * content-i18n with `@/test-support/mocks/content-i18n`.
 *
 *   describeSectionedGuide("Taharah", {
 *     getTopics: getTaharahTopics,
 *     getTopic: getTaharahTopic,
 *     getTopicsBySection: getTaharahTopicsBySection,
 *   });
 */
export function describeSectionedGuide<T extends { id: string }>(
  name: string,
  api: {
    getTopics: () => T[];
    getTopic: (id: string | undefined) => T | undefined;
    getTopicsBySection: () => Record<string, T[]>;
    sectionOrder?: readonly string[];
  },
): void {
  describe(`${name} guide accessors`, () => {
    afterEach(resetContentI18nMock);

    it("lists localized topics", () => {
      expect(api.getTopics().length).toBeGreaterThan(0);
    });

    it("finds a topic by id", () => {
      const first = api.getTopics()[0];
      expect(api.getTopic(first.id)).toEqual(first);
    });

    it.each([undefined, "", "missing-topic"])("returns undefined for id %p", (id) => {
      expect(api.getTopic(id)).toBeUndefined();
    });

    it("groups every topic under a known section", () => {
      const grouped = api.getTopicsBySection();
      if (api.sectionOrder) expect(Object.keys(grouped)).toEqual([...api.sectionOrder]);
      const groupedIds = new Set(Object.values(grouped).flatMap((list) => list.map((t) => t.id)));
      expect(api.getTopics().every((topic) => groupedIds.has(topic.id))).toBe(true);
    });

    it("drops topics whose section is unknown", () => {
      mockLocalizeList.mockReturnValueOnce([
        { id: "stray", section: "unknown-section", categories: ["unknown-section"] },
      ]);
      expect(Object.values(api.getTopicsBySection()).flat()).toEqual([]);
    });
  });
}

/**
 * Shared checks for `buildXProgress({ lessonsCompleted, lessonsTotal })`
 * snapshot builders used by Learn hubs.
 */
export function describeLessonProgress(
  name: string,
  build: (input: { lessonsCompleted: number; lessonsTotal: number }) => {
    lessonsCompleted: number;
    lessonsTotal: number;
    lessonProgress: number;
  },
): void {
  describe(`${name} lesson progress`, () => {
    it.each([
      [3, 4, 0.75],
      [0, 4, 0],
      [0, 0, 0],
    ])("%i of %i lessons → %p", (lessonsCompleted, lessonsTotal, lessonProgress) => {
      expect(build({ lessonsCompleted, lessonsTotal })).toEqual({
        lessonsCompleted,
        lessonsTotal,
        lessonProgress,
      });
    });
  });
}
