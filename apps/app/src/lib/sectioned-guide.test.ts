import type { LearnGuideTopic } from "@munib-tracker/shared/types";

import { createSectionedGuide, groupBySection, moveAfter } from "@/lib/sectioned-guide";
import { buildLearnGuideTopic } from "@/test-support/fixtures/learn-guide";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

const item = (id: string, section: string) => ({ id, section });

describe("groupBySection", () => {
  it("keeps the section order and gives every section an array", () => {
    const grouped = groupBySection([item("a", "two"), item("b", "one")], ["one", "two", "three"]);
    expect(Object.keys(grouped)).toEqual(["one", "two", "three"]);
    expect(grouped).toEqual({ one: [item("b", "one")], two: [item("a", "two")], three: [] });
  });

  it("drops items whose section is not listed", () => {
    expect(groupBySection([item("a", "stray")], ["one"])).toEqual({ one: [] });
  });

  it("preserves the input order inside a section", () => {
    const grouped = groupBySection([item("a", "one"), item("b", "one")], ["one"]);
    expect(grouped.one.map((x) => x.id)).toEqual(["a", "b"]);
  });
});

describe("moveAfter", () => {
  const ids = (list: { id: string }[] | undefined) => list?.map((x) => x.id);

  it.each([
    [["a", "b", "c", "d"], "d", "a", ["a", "d", "b", "c"]],
    [["d", "a", "b"], "d", "b", ["a", "b", "d"]],
    [["a", "d", "b"], "d", "a", ["a", "d", "b"]],
    [["a", "b"], "missing", "a", ["a", "b"]],
    [["a", "b"], "a", "missing", ["a", "b"]],
  ])("%j: move %s after %s → %j", (start, id, anchor, expected) => {
    const list = start.map((x) => ({ id: x }));
    expect(ids(moveAfter(list, id, anchor))).toEqual(expected);
  });

  it("tolerates a missing bucket", () => {
    expect(moveAfter(undefined, "a", "b")).toBeUndefined();
  });
});

describe("createSectionedGuide", () => {
  const topics: LearnGuideTopic[] = [
    buildLearnGuideTopic({ id: "first", section: "intro" }),
    buildLearnGuideTopic({ id: "second", section: "practice" }),
    buildLearnGuideTopic({ id: "third", section: "intro" }),
  ];
  const guide = createSectionedGuide({
    topics,
    sectionOrder: ["intro", "practice"] as const,
    overlayKey: "TEST_GUIDE_TOPICS",
  });

  describeSectionedGuide("Synthetic", {
    getTopics: guide.getTopics,
    getTopic: guide.getTopic,
    getTopicsBySection: guide.getTopicsBySection,
    sectionOrder: guide.getSectionOrder(),
  });

  it("groups by the configured order", () => {
    const grouped = guide.getTopicsBySection();
    expect(grouped.intro.map((t) => t.id)).toEqual(["first", "third"]);
    expect(grouped.practice.map((t) => t.id)).toEqual(["second"]);
  });
});
