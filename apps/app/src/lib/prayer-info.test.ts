import { describe, expect, it, jest } from "@jest/globals";
import type { HadithItem } from "@munib-tracker/shared/types";

jest.mock("@/lib/hadith", () => ({
  getBundledCollection: jest.fn(),
  ensureBundledCollection: jest.fn(),
}));

import { getBundledCollection } from "@/lib/hadith";

import { hadithCollectionId, hadithExcerpt, PRAYER_INFO, resolveHadithItem } from "./prayer-info";

const mockGetBundledCollection = getBundledCollection as jest.MockedFunction<
  typeof getBundledCollection
>;

describe("PRAYER_INFO", () => {
  it("includes learn-more refs for every daily prayer marker", () => {
    for (const id of ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const) {
      expect(PRAYER_INFO[id].refs.length).toBeGreaterThan(0);
    }
  });

  it("uses valid hadith or quran reference shapes", () => {
    for (const entry of Object.values(PRAYER_INFO)) {
      for (const ref of entry.refs) {
        if (ref.type === "hadith") {
          expect(ref.id).toMatch(/^[a-z0-9_]+:\d+$/);
        } else {
          expect(ref.surah).toBeGreaterThan(0);
          expect(ref.ayah).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("hadithCollectionId", () => {
  it("extracts the collection prefix", () => {
    expect(hadithCollectionId("nawawi40:29")).toBe("nawawi40");
    expect(hadithCollectionId("no-colon")).toBe("no-colon");
  });
});

describe("hadithExcerpt", () => {
  const item: HadithItem = {
    id: "test:1",
    collection: "test",
    reference: "1",
    arabic: "",
    english: "  Actions   are judged by intentions.  ",
    narrator: "Umar",
  };

  it("collapses whitespace", () => {
    expect(hadithExcerpt(item)).toBe("Actions are judged by intentions.");
  });

  it("truncates long text with an ellipsis", () => {
    const long = "x ".repeat(200);
    const excerpt = hadithExcerpt({ ...item, english: long }, 50);
    expect(excerpt.length).toBeLessThanOrEqual(51);
    expect(excerpt.endsWith("…")).toBe(true);
  });
});

describe("resolveHadithItem", () => {
  it("finds a bundled hadith by id", () => {
    const item = resolveHadithItem("nawawi40:1");
    expect(item?.id).toBe("nawawi40:1");
    expect(item?.collection).toBe("nawawi40");
    expect(item?.english).toContain("niyyah");
  });

  it("returns undefined when the collection is missing", () => {
    mockGetBundledCollection.mockReturnValue(undefined);
    expect(resolveHadithItem("missing:1")).toBeUndefined();
  });
});
