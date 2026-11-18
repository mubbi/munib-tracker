import * as registry from "@/lib/content-overlay-registry";
import {
  ensureProphetsContent,
  getProphetsLessonCount,
  getProphetsTimeline,
  getProphetsTopic,
  getProphetsTopics,
  getProphetsTopicsBySection,
  isProphetsContentReady,
} from "@/lib/prophets";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);
jest.mock("@/lib/content-overlay-registry", () => {
  const actual = jest.requireActual("@/lib/content-overlay-registry");
  return { ...actual, overlayList: jest.fn(actual.overlayList) };
});

const localizeList = mockLocalizeList;
const overlayList = registry.overlayList as jest.Mock;

afterEach(() => {
  resetContentI18nMock();
  overlayList.mockImplementation(jest.requireActual("@/lib/content-overlay-registry").overlayList);
});

describe("prophets content accessors", () => {
  it("is ready and counts lessons", async () => {
    expect(isProphetsContentReady()).toBe(true);
    const corpus = await ensureProphetsContent();
    expect(getProphetsLessonCount()).toBe(corpus.PROPHETS_TOPICS.length);
    expect(getProphetsTimeline().length).toBeGreaterThan(0);
  });

  it("finds topics by id and rejects empty ids", () => {
    const [first] = getProphetsTopics();
    expect(getProphetsTopic(first.id)?.id).toBe(first.id);
    expect(getProphetsTopic(undefined)).toBeUndefined();
    expect(getProphetsTopic("")).toBeUndefined();
    expect(getProphetsTopic("unknown")).toBeUndefined();
  });

  it("groups every topic by section", () => {
    const grouped = getProphetsTopicsBySection();
    expect(Object.values(grouped).flat()).toHaveLength(getProphetsTopics().length);
  });

  it("drops topics whose section is not in the section order", () => {
    localizeList.mockImplementationOnce(() => [{ id: "x", section: "bogus" }]);
    const grouped = getProphetsTopicsBySection();
    expect(Object.values(grouped).flat()).toEqual([]);
  });

  it("recomposes non-bio overlays around the bio overlay per locale", () => {
    const nonBio = ["c1", "c2", "c3", "t1", "t2", "e1", "e2"].map((id) => ({ title: id }));
    const bio = [{ title: "b1" }, { title: "b2" }];
    overlayList.mockImplementation((key: string) => {
      if (key === "PROPHETS_TOPICS") return { ur: nonBio, ar: nonBio };
      if (key === "PROPHETS_BIO_TOPICS") return { ur: bio, fr: bio };
      return {};
    });
    let captured: Record<string, { title: string }[]> = {};
    localizeList.mockImplementationOnce((base: unknown[], overlays) => {
      captured = overlays;
      return base;
    });
    getProphetsTopics();
    expect(Object.keys(captured)).toEqual(["ur"]);
    expect(captured.ur.map((o) => o.title)).toEqual([
      "c1",
      "c2",
      "c3",
      "b1",
      "b2",
      "t1",
      "t2",
      "e1",
      "e2",
    ]);
  });
});
