import {
  ensureSalahGuideContent,
  getPrayerRakats,
  getSalahGuideLessonCount,
  getSalahGuidePhrases,
  getSalahGuideTopics,
  getSalahGuideTopicsByJourney,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";

describe("salah-guide sync corpus", () => {
  it("is ready before ensure and exposes full topic data on first read", () => {
    expect(isSalahGuideContentReady()).toBe(true);
    const topics = getSalahGuideTopics();
    expect(topics.length).toBeGreaterThan(10);
    expect(getSalahGuideLessonCount()).toBe(topics.length);

    const byJourney = getSalahGuideTopicsByJourney();
    const journeyTotal = Object.values(byJourney).reduce((sum, list) => sum + list.length, 0);
    expect(journeyTotal).toBe(topics.length);

    expect(getSalahGuidePhrases().length).toBeGreaterThan(0);
    expect(getPrayerRakats().length).toBeGreaterThan(0);
  });

  it("ensure resolves immediately with the same corpus", async () => {
    const corpus = await ensureSalahGuideContent();
    expect(corpus.SALAH_GUIDE_TOPICS.length).toBe(getSalahGuideLessonCount());
  });
});
