/**
 * Regression: every Learn English corpus must be sync-warm on first read.
 * Lazy `import()` + ensure races caused empty/partial hubs on first visit.
 */
import { getAqeedahTopics, isAqeedahContentReady } from "@/lib/aqeedah";
import { getBattlesTopics, isBattlesContentReady } from "@/lib/battles";
import { getEidGuideTopics } from "@/lib/eid-guide";
import { getHajjGuideSections, isHajjGuideContentReady } from "@/lib/hajj-guide";
import { getIslamicHistoryEvents, isIslamicHistoryContentReady } from "@/lib/islamic-history";
import { getJahannamTopics, isJahannamContentReady } from "@/lib/jahannam";
import { getJannahTopics, isJannahContentReady } from "@/lib/jannah";
import { getLastDayTopics, isLastDayContentReady } from "@/lib/last-day";
import { getLaylatAlQadrTopics } from "@/lib/laylat-al-qadr";
import { getLearnDuaTopics, isLearnDuaContentReady } from "@/lib/learn-dua";
import { LEARN_SECTION_ROUTES } from "@/lib/library-menu";
import { getNewMuslimTopics } from "@/lib/new-muslim";
import { getProphetsTopics, isProphetsContentReady } from "@/lib/prophets";
import { getQuranGuideTopics, isQuranGuideContentReady } from "@/lib/quran-guide";
import { getRuqyahTopics } from "@/lib/ruqyah";
import { getSahabaProfiles, isSahabaContentReady } from "@/lib/sahaba";
import {
  getSalahGuideTopics,
  getSalahGuideTopicsByJourney,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { getSeerahEvents, isSeerahContentReady } from "@/lib/seerah";
import { getTaharahTopics, isTaharahContentReady } from "@/lib/taharah";

describe("learn corpora first-visit readiness", () => {
  const readyChecks: Array<[string, () => boolean, () => number]> = [
    ["salah", isSalahGuideContentReady, () => getSalahGuideTopics().length],
    ["jannah", isJannahContentReady, () => getJannahTopics().length],
    ["jahannam", isJahannamContentReady, () => getJahannamTopics().length],
    ["last-day", isLastDayContentReady, () => getLastDayTopics().length],
    ["battles", isBattlesContentReady, () => getBattlesTopics().length],
    ["quran", isQuranGuideContentReady, () => getQuranGuideTopics().length],
    ["taharah", isTaharahContentReady, () => getTaharahTopics().length],
    ["prophets", isProphetsContentReady, () => getProphetsTopics().length],
    ["aqeedah", isAqeedahContentReady, () => getAqeedahTopics().length],
    ["learn-dua", isLearnDuaContentReady, () => getLearnDuaTopics().length],
    ["hajj", isHajjGuideContentReady, () => getHajjGuideSections().length],
    ["seerah", isSeerahContentReady, () => getSeerahEvents().length],
    ["sahaba", isSahabaContentReady, () => getSahabaProfiles().length],
    ["history", isIslamicHistoryContentReady, () => getIslamicHistoryEvents().length],
  ];

  it.each(readyChecks)("%s is sync-ready with non-empty content", (_name, isReady, count) => {
    expect(isReady()).toBe(true);
    expect(count()).toBeGreaterThan(0);
  });

  it("small sync guides expose topics without ensure", () => {
    expect(getEidGuideTopics().length).toBeGreaterThan(0);
    expect(getRuqyahTopics().length).toBeGreaterThan(0);
    expect(getNewMuslimTopics().length).toBeGreaterThan(0);
    expect(getLaylatAlQadrTopics().length).toBeGreaterThan(0);
  });

  it("salah journey grouping includes every topic on first read", () => {
    const topics = getSalahGuideTopics();
    const grouped = getSalahGuideTopicsByJourney();
    const journeyTotal = Object.values(grouped).reduce((sum, list) => sum + list.length, 0);
    expect(journeyTotal).toBe(topics.length);
    expect(topics.length).toBeGreaterThan(10);
  });

  it("LEARN_SECTION_ROUTES covers every learn hub prefix", () => {
    const expected = [
      "/salah-guide",
      "/jannah",
      "/last-day",
      "/jahannam",
      "/battles",
      "/learn-quran",
      "/taharah",
      "/hayd",
      "/sick",
      "/prophets",
      "/aqeedah",
      "/learn-dua",
      "/travel",
      "/hajj",
      "/seerah",
      "/events",
      "/sahaba",
      "/history",
      "/laylat-al-qadr",
      "/eid",
      "/ruqyah",
      "/new-muslim",
      "/flash-cards",
    ];
    for (const route of expected) {
      expect(LEARN_SECTION_ROUTES).toContain(route);
    }
  });
});
