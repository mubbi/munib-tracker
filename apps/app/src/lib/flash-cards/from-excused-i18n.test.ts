import { describe, expect, it } from "@jest/globals";
import { EXCUSED_GUIDES } from "@munib-tracker/shared/content/excused-guide";

import { mcqsFromHaydGuide, mcqsFromSickGuide, mcqsFromTravelGuideCopy } from "./from-excused-i18n";

function mockTranslate(namespace: "hayd" | "sick" | "travel") {
  const config = EXCUSED_GUIDES[namespace === "travel" ? "sick" : namespace];
  const sectionKeys =
    namespace === "travel"
      ? ["before", "during", "after", "combining"]
      : (config.extraSections ?? ["overview", "prayer", "fasting", "purification"]);

  return (key: string): string => {
    const obligationMatch = key.match(/^(\w+)\.obligations\.(\d+)$/);
    if (obligationMatch) {
      return `${obligationMatch[1]} obligation ${obligationMatch[2]}`;
    }

    const sectionMatch = key.match(/^(\w+)\.(\w+)\.(title|body)$/);
    if (sectionMatch) {
      const [, , section, part] = sectionMatch;
      if (sectionKeys.includes(section)) {
        return part === "title" ? `${section} title` : `${section} body text`;
      }
    }

    const titleMatch = key.match(/^(\w+)\.title$/);
    if (titleMatch) return `${titleMatch[1]} guide`;

    return key;
  };
}

describe("from-excused-i18n", () => {
  it("builds hayd guide MCQs when translations resolve", () => {
    const cards = mcqsFromHaydGuide(mockTranslate("hayd"));
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((c) => c.options.length === 4)).toBe(true);
  });

  it("builds sick guide MCQs when translations resolve", () => {
    const cards = mcqsFromSickGuide(mockTranslate("sick"));
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0]?.sourceId).toBe("sick");
  });

  it("returns empty when fewer than four topics resolve", () => {
    const sparse = (key: string) => (key.endsWith(".title") ? "" : key);
    expect(mcqsFromHaydGuide(sparse)).toEqual([]);
  });

  it("builds travel guide MCQs from travel copy keys", () => {
    const cards = mcqsFromTravelGuideCopy((key) => {
      if (key === "travel.title") return "Travel guide";
      if (key.startsWith("travel.obligations.")) {
        return `Travel obligation ${key.split(".").pop()}`;
      }
      if (key.endsWith(".title")) return key.replace(".title", " title");
      if (key.endsWith(".body")) return key.replace(".body", " body");
      return key;
    });
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.some((c) => c.sourceId === "travel")).toBe(true);
  });
});
