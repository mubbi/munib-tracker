import {
  ensureBattlesContent,
  getBattlesAfterProphet,
  getBattlesFigures,
  getBattlesGlossary,
  getBattlesLessonCards,
  getBattlesLessonCount,
  getBattlesSectionOrder,
  getBattlesTimeline,
  getBattlesTopic,
  getBattlesTopics,
  getBattlesTopicsBySection,
  getBattlesVerses,
  isBattlesContentReady,
} from "@/lib/battles";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);
const localizeList = mockLocalizeList;

afterEach(resetContentI18nMock);

describe("battles content accessors", () => {
  it("is ready and exposes the corpus", async () => {
    expect(isBattlesContentReady()).toBe(true);
    const corpus = await ensureBattlesContent();
    expect(getBattlesLessonCount()).toBe(corpus.BATTLES_TOPICS.length);
    expect(getBattlesSectionOrder()).toBe(corpus.BATTLES_SECTION_ORDER);
  });

  it("finds topics by id", () => {
    const [first] = getBattlesTopics();
    expect(getBattlesTopic(first.id)?.id).toBe(first.id);
    expect(getBattlesTopic(undefined)).toBeUndefined();
    expect(getBattlesTopic("nope")).toBeUndefined();
  });

  it("groups topics by section and drops unknown sections", () => {
    const grouped = getBattlesTopicsBySection();
    expect(Object.keys(grouped)).toEqual([...getBattlesSectionOrder()]);
    expect(Object.values(grouped).flat()).toHaveLength(getBattlesTopics().length);
    localizeList.mockImplementationOnce(() => [{ id: "z", section: "nowhere" }]);
    expect(Object.values(getBattlesTopicsBySection()).flat()).toEqual([]);
  });

  it("returns the supporting collections", () => {
    for (const list of [
      getBattlesTimeline(),
      getBattlesGlossary(),
      getBattlesFigures(),
      getBattlesLessonCards(),
      getBattlesVerses(),
    ]) {
      expect(list.length).toBeGreaterThan(0);
    }
    const after = getBattlesAfterProphet();
    expect(after.length).toBeGreaterThan(0);
    expect(after[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), year: expect.any(Number) }),
    );
  });
});
