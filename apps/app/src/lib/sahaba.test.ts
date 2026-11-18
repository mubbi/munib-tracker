import {
  ensureSahabaContent,
  getBattlesFigureIdForSahaba,
  getSahabaCategoryOrder,
  getSahabaProfile,
  getSahabaProfiles,
  getSahabaProfilesByCategory,
  isSahabaContentReady,
} from "@/lib/sahaba";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Sahaba", {
  getTopics: getSahabaProfiles,
  getTopic: getSahabaProfile,
  getTopicsBySection: getSahabaProfilesByCategory,
  sectionOrder: getSahabaCategoryOrder(),
});

describe("Sahaba extras", () => {
  it("is always ready", async () => {
    expect(isSahabaContentReady()).toBe(true);
    await expect(ensureSahabaContent()).resolves.toBeUndefined();
  });

  it.each([
    ["khalid-ibn-al-walid", "khalid"],
    ["abu-bakr", "abu-bakr"],
    ["bilal", undefined],
  ])("maps %s to battles figure %p", (sahabaId, figureId) => {
    expect(getBattlesFigureIdForSahaba(sahabaId)).toBe(figureId);
  });
});
