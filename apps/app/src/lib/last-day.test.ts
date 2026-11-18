import {
  ensureLastDayContent,
  getLastDayHadith,
  getLastDayLessonCount,
  getLastDayQuiz,
  getLastDayReferences,
  getLastDayTimeline,
  getLastDayTopic,
  getLastDayTopics,
  getLastDayTopicsBySection,
  getLastDayVerses,
  isLastDayContentReady,
} from "@/lib/last-day";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

const localizeList = mockLocalizeList;
type Topic = ReturnType<typeof getLastDayTopics>[number];
const topic = (id: string, section: string) => ({ id, section }) as unknown as Topic;

afterEach(resetContentI18nMock);

describe("last-day content accessors", () => {
  it("is always ready and exposes the corpus", async () => {
    expect(isLastDayContentReady()).toBe(true);
    const corpus = await ensureLastDayContent();
    expect(corpus.LAST_DAY_TOPICS.length).toBe(getLastDayLessonCount());
  });

  it("finds topics by id", () => {
    const topics = getLastDayTopics();
    expect(topics.length).toBeGreaterThan(0);
    expect(getLastDayTopic(topics[1].id)?.id).toBe(topics[1].id);
    expect(getLastDayTopic("nope")).toBeUndefined();
    expect(getLastDayTopic(undefined)).toBeUndefined();
  });

  it("returns the auxiliary collections", () => {
    for (const list of [
      getLastDayTimeline(),
      getLastDayVerses(),
      getLastDayHadith(),
      getLastDayQuiz(),
      getLastDayReferences(),
    ]) {
      expect(list.length).toBeGreaterThan(0);
    }
  });

  it("groups every real topic and keeps heavy-on-the-scale after scale", () => {
    const grouped = getLastDayTopicsBySection();
    const total = Object.values(grouped).reduce((n, l) => n + l.length, 0);
    expect(total).toBe(getLastDayTopics().length);
    const events = grouped.events.map((t) => t.id);
    if (events.includes("scale") && events.includes("heavy-on-the-scale")) {
      expect(events.indexOf("heavy-on-the-scale")).toBe(events.indexOf("scale") + 1);
    }
  });

  it("reorders a misplaced heavy-on-the-scale and drops unknown sections", () => {
    localizeList.mockImplementationOnce(() => [
      topic("heavy-on-the-scale", "events"),
      topic("bridge", "events"),
      topic("scale", "events"),
      topic("pool", "events"),
      topic("orphan", "missing-section"),
    ]);
    const grouped = getLastDayTopicsBySection();
    expect(grouped.events.map((t) => t.id)).toEqual([
      "bridge",
      "scale",
      "heavy-on-the-scale",
      "pool",
    ]);
    expect(Object.values(grouped).flat()).toHaveLength(4);
  });

  it("keeps order when already adjacent, when scale is missing, or events is empty", () => {
    localizeList.mockImplementationOnce(() => [
      topic("scale", "events"),
      topic("heavy-on-the-scale", "events"),
    ]);
    expect(getLastDayTopicsBySection().events.map((t) => t.id)).toEqual([
      "scale",
      "heavy-on-the-scale",
    ]);
    localizeList.mockImplementationOnce(() => [topic("heavy-on-the-scale", "events")]);
    expect(getLastDayTopicsBySection().events.map((t) => t.id)).toEqual(["heavy-on-the-scale"]);
    localizeList.mockImplementationOnce(() => []);
    expect(getLastDayTopicsBySection().events).toEqual([]);
  });
});
