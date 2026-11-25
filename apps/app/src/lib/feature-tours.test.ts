import {
  EXPLORE_TOUR,
  FEATURE_TOURS,
  getFeatureTour,
  JANNAH_TOUR,
  tourForDevice,
} from "@/lib/feature-tours";

describe("feature tours (NF-2.24)", () => {
  it("exposes the explore tour with several steps", () => {
    expect(getFeatureTour("explore")).toBe(EXPLORE_TOUR);
    expect(EXPLORE_TOUR.steps.length).toBeGreaterThan(2);
  });

  it("exposes the jannah tour", () => {
    expect(getFeatureTour("jannah")).toBe(JANNAH_TOUR);
    expect(JANNAH_TOUR.steps.length).toBeGreaterThan(1);
  });

  it("gives every tour and every step a unique id", () => {
    const tourIds = FEATURE_TOURS.map((t) => t.id);
    expect(new Set(tourIds).size).toBe(tourIds.length);
    for (const tour of FEATURE_TOURS) {
      const stepIds = tour.steps.map((s) => s.id);
      expect(new Set(stepIds).size).toBe(stepIds.length);
    }
  });

  it("returns undefined for an unknown tour", () => {
    expect(getFeatureTour("nope")).toBeUndefined();
  });
});

describe("phone-only tour stops (D68 / D69)", () => {
  const phoneOnly = ["quranPractice", "reciteToFind", "handsFreeSequence"];

  it("tours practice, recite-to-find and the hands-free sequence on phones", () => {
    const ids = tourForDevice(EXPLORE_TOUR, false).steps.map((s) => s.id);
    for (const id of phoneOnly) expect(ids).toContain(id);
    expect(EXPLORE_TOUR.steps.find((s) => s.id === "reciteToFind")?.route).toBe(
      "/verse-detector?mode=recite",
    );
  });

  it("drops the microphone stops on TV", () => {
    const ids = tourForDevice(EXPLORE_TOUR, true).steps.map((s) => s.id);
    for (const id of phoneOnly) expect(ids).not.toContain(id);
    expect(ids).toContain("tracker");
    expect(tourForDevice(JANNAH_TOUR, true)).toBe(JANNAH_TOUR);
  });
});
