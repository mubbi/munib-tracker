import {
  ensureJahannamContent,
  getJahannamDuas,
  getJahannamGates,
  getJahannamHadith,
  getJahannamLessonCount,
  getJahannamMajorSinTopics,
  getJahannamNames,
  getJahannamReferences,
  getJahannamReflections,
  getJahannamRefugeDua,
  getJahannamTopic,
  getJahannamTopics,
  getJahannamTopicsBySection,
  getJahannamVerses,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

const localizeList = mockLocalizeList;

type Topic = ReturnType<typeof getJahannamTopics>[number];
const topic = (id: string, section: string) => ({ id, section }) as unknown as Topic;

afterEach(resetContentI18nMock);

describe("jahannam content accessors", () => {
  it("reports the corpus as always ready", async () => {
    expect(isJahannamContentReady()).toBe(true);
    const corpus = await ensureJahannamContent();
    expect(corpus.JAHANNAM_SECTION_ORDER.length).toBeGreaterThan(0);
  });

  it("composes core + major-sin topics and finds by id", () => {
    const topics = getJahannamTopics();
    const majors = getJahannamMajorSinTopics();
    expect(topics.length).toBeGreaterThan(majors.length);
    expect(topics.slice(-majors.length).map((t) => t.id)).toEqual(majors.map((t) => t.id));
    expect(getJahannamTopic(topics[0].id)).toEqual(topics[0]);
    expect(getJahannamTopic("does-not-exist")).toBeUndefined();
    expect(getJahannamTopic(undefined)).toBeUndefined();
  });

  it("returns non-empty lesson collections", () => {
    expect(getJahannamLessonCount()).toBeGreaterThan(0);
    for (const list of [
      getJahannamNames(),
      getJahannamGates(),
      getJahannamVerses(),
      getJahannamHadith(),
      getJahannamDuas(),
      getJahannamReflections(),
      getJahannamReferences(),
    ]) {
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    }
    expect(getJahannamRefugeDua()).toEqual(expect.any(Object));
  });

  it("groups every topic into its section bucket", () => {
    const grouped = getJahannamTopicsBySection();
    const total = Object.values(grouped).reduce((n, list) => n + list.length, 0);
    expect(total).toBe(getJahannamTopics().length);
  });

  it("moves destructive-sins directly after major-sins and drops unknown sections", () => {
    // Core list then major-sin list — both pass through localizeList.
    localizeList
      .mockImplementationOnce(() => [
        topic("destructive-sins", "warnings"),
        topic("a", "warnings"),
        topic("major-sins", "warnings"),
        topic("orphan", "no-such-section"),
      ])
      .mockImplementationOnce(() => [topic("b", "warnings")]);
    const grouped = getJahannamTopicsBySection();
    expect(grouped.warnings.map((t) => t.id)).toEqual(["a", "major-sins", "destructive-sins", "b"]);
    expect(
      Object.values(grouped)
        .flat()
        .map((t) => t.id),
    ).not.toContain("orphan");
  });

  it("leaves the warnings order alone when already adjacent or a lesson is missing", () => {
    localizeList
      .mockImplementationOnce(() => [
        topic("major-sins", "warnings"),
        topic("destructive-sins", "warnings"),
      ])
      .mockImplementationOnce(() => []);
    expect(getJahannamTopicsBySection().warnings.map((t) => t.id)).toEqual([
      "major-sins",
      "destructive-sins",
    ]);

    localizeList
      .mockImplementationOnce(() => [topic("x", "warnings")])
      .mockImplementationOnce(() => []);
    expect(getJahannamTopicsBySection().warnings.map((t) => t.id)).toEqual(["x"]);

    localizeList.mockImplementationOnce(() => []).mockImplementationOnce(() => []);
    expect(getJahannamTopicsBySection().warnings).toEqual([]);
  });
});
