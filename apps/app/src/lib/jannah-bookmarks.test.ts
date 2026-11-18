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

describe("jannah-bookmarks edge cases", () => {
  it.each([
    ["Jami` at-Tirmidhi", "tirmidhi"],
    ["Sunan Abi Dawud", null],
    ["Sunan Abu Dawud", "abudawud"],
    ["AbuDawud", "abudawud"],
    ["Sunan an-Nasa'i", "nasai"],
    ["Sunan Ibn Majah", "ibnmajah"],
    ["Nawawi's Forty", "nawawi40"],
    ["Riyāḍ aṣ-Ṣāliḥīn", "riyad_assalihin"],
    ["Salihin", "riyad_assalihin"],
    ["Muwatta Malik", null],
  ])("matches %p → %p", (label, slug) => {
    expect(matchHadithCollectionSlug(label)).toBe(slug);
  });

  it("finds no number in a citation without digits", () => {
    expect(extractHadithCitationNumber("Book of Faith")).toBeNull();
  });

  it.each([
    ["Muwatta Malik", "12"],
    ["Sahih al-Bukhari", "no number"],
  ])("has no bookmark target for %p / %p", (collection, citation) => {
    expect(resolveHadithBookmarkTarget(collection, citation)).toBeNull();
  });
});
