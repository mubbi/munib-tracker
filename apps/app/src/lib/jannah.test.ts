import {
  ensureJannahContent,
  getJannahDuas,
  getJannahFirdawsDua,
  getJannahGates,
  getJannahHubTopics,
  getJannahPathTopics,
  getJannahPromised,
  getJannahTopic,
  getJannahTopics,
  getJannahTopicsByHub,
  getJannahVerses,
  isJannahContentReady,
  jannahImportanceKey,
} from "@/lib/jannah";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);
const localizeList = mockLocalizeList;

afterEach(resetContentI18nMock);

describe("jannah content accessors", () => {
  it("is ready and exposes the corpus", async () => {
    expect(isJannahContentReady()).toBe(true);
    const corpus = await ensureJannahContent();
    expect(corpus.JANNAH_TOPICS.length).toBe(getJannahTopics().length);
  });

  it("finds a topic by id", () => {
    const [first] = getJannahTopics();
    expect(getJannahTopic(first.id)?.id).toBe(first.id);
    expect(getJannahTopic(undefined)).toBeUndefined();
    expect(getJannahTopic("missing")).toBeUndefined();
  });

  it("splits path deeds from hub topics", async () => {
    const corpus = await ensureJannahContent();
    const path = getJannahPathTopics();
    const hub = getJannahHubTopics();
    expect(path.map((t) => t.id)).toEqual(
      corpus.JANNAH_PATH_TOPIC_IDS.filter((id) => getJannahTopic(id)),
    );
    expect(path.length + hub.length).toBe(getJannahTopics().length);
    const pathIds = new Set(path.map((t) => t.id));
    expect(hub.some((t) => pathIds.has(t.id))).toBe(false);
  });

  it("skips path ids whose topic is missing", () => {
    localizeList.mockImplementationOnce(() => []);
    expect(getJannahPathTopics()).toEqual([]);
  });

  it("filters topics by hub", () => {
    const [first] = getJannahTopics();
    const byHub = getJannahTopicsByHub(first.hub);
    expect(byHub.length).toBeGreaterThan(0);
    expect(byHub.every((t) => t.hub === first.hub)).toBe(true);
  });

  it("returns the supporting collections", () => {
    expect(getJannahGates().length).toBeGreaterThan(0);
    expect(getJannahVerses().length).toBeGreaterThan(0);
    expect(getJannahDuas().length).toBeGreaterThan(0);
    expect(getJannahPromised().length).toBeGreaterThan(0);
    expect(getJannahFirdawsDua()).toEqual(expect.any(Object));
    expect(jannahImportanceKey("high" as never)).toBe("high");
  });
});
