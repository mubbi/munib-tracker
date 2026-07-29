import { describe, expect, it } from "@jest/globals";

import {
  extractHadithCitationNumber,
  matchHadithCollectionSlug,
  resolveHadithBookmarkTarget,
} from "./jannah-bookmarks";

describe("jannah-bookmarks", () => {
  it("maps common collection labels to slugs", () => {
    expect(matchHadithCollectionSlug("Sahih al-Bukhari")).toBe("bukhari");
    expect(matchHadithCollectionSlug("Sahih Muslim")).toBe("muslim");
    expect(matchHadithCollectionSlug("Sunan al-Tirmidhi")).toBe("tirmidhi");
  });

  it("extracts the first number from a citation", () => {
    expect(extractHadithCitationNumber("7312")).toBe("7312");
    expect(extractHadithCitationNumber("Book 81, Hadith 15")).toBe("81");
  });

  it("builds a hadith bookmark target", () => {
    expect(resolveHadithBookmarkTarget("Sahih al-Bukhari", "7312")).toEqual({
      id: "bukhari:7312",
      collection: "bukhari",
      number: "7312",
    });
  });
});
