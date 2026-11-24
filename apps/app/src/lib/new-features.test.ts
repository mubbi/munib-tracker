import {
  introduceToHomeOrder,
  isWithinNewWindow,
  NEW_BADGE_DAYS,
  NEW_FEATURES,
  type NewFeaturesSeenMap,
  stampFirstSeen,
} from "./new-features";

const NOW = new Date("2026-11-17T10:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

describe("new feature badges", () => {
  it("registers Qur'an practice after the Qur'an tile", () => {
    expect(NEW_FEATURES).toContainEqual({ id: "quranPractice", homeAnchor: "quran" });
    expect(NEW_BADGE_DAYS).toBe(15);
  });

  it("shows the badge for 15 days from the first sighting, then hides it", () => {
    const start = NOW.toISOString();
    expect(isWithinNewWindow(start, new Date(NOW.getTime() + 14 * DAY))).toBe(true);
    expect(isWithinNewWindow(start, new Date(NOW.getTime() + 15 * DAY))).toBe(false);
    expect(isWithinNewWindow(undefined, NOW)).toBe(true);
    expect(isWithinNewWindow("not a date", NOW)).toBe(false);
  });

  it("stamps the first sighting once and never moves it", () => {
    const first = stampFirstSeen({}, NOW);
    expect(first.quranPractice.firstSeenAt).toBe(NOW.toISOString());
    const later = stampFirstSeen(first, new Date(NOW.getTime() + 3 * DAY));
    expect(later).toBe(first);
  });

  /** Features that add a home tile; tests isolate one by marking the others introduced. */
  const ANCHORED = NEW_FEATURES.filter((f) => f.homeAnchor);
  const othersIntroduced = (id: string): NewFeaturesSeenMap =>
    Object.fromEntries(
      ANCHORED.filter((f) => f.id !== id).map((f) => [
        f.id,
        { firstSeenAt: NOW.toISOString(), homeIntroduced: true },
      ]),
    );

  it("adds the tile once to a customised home grid, after its anchor", () => {
    const { order, seen } = introduceToHomeOrder(
      ["qibla", "quran", "tasbeeh"],
      othersIntroduced("quranPractice"),
    );
    expect(order).toEqual(["qibla", "quran", "quranPractice", "tasbeeh"]);
    expect(seen.quranPractice.homeIntroduced).toBe(true);
    // Removed afterwards → stays removed.
    expect(introduceToHomeOrder(["qibla", "quran"], seen).order).toBeNull();
  });

  it.each(ANCHORED.map((f) => [f.id, f.homeAnchor as string]))(
    "inserts %s right after its anchor %s",
    (id, anchor) => {
      const { order } = introduceToHomeOrder(["qibla", anchor, "zikr"], othersIntroduced(id));
      expect(order).toEqual(["qibla", anchor, id, "zikr"]);
    },
  );

  it("introduces every anchored feature in one pass", () => {
    const { order, seen } = introduceToHomeOrder(["qibla"], {});
    expect(order).toEqual(expect.arrayContaining(["qibla", ...ANCHORED.map((f) => f.id)]));
    expect(order).toHaveLength(1 + ANCHORED.length);
    for (const f of ANCHORED) expect(seen[f.id].homeIntroduced).toBe(true);
  });

  it("puts the tile first when the anchor is not on the grid", () => {
    expect(introduceToHomeOrder(["qibla"], othersIntroduced("quranPractice")).order).toEqual([
      "quranPractice",
      "qibla",
    ]);
  });

  it("leaves the default order alone (the defaults already include it)", () => {
    const { order, seen } = introduceToHomeOrder(undefined, {});
    expect(order).toBeNull();
    for (const f of ANCHORED) expect(seen[f.id].homeIntroduced).toBe(true);
  });

  it("does not duplicate a tile the person already added", () => {
    expect(
      introduceToHomeOrder(["quranPractice", "quran"], othersIntroduced("quranPractice")).order,
    ).toBeNull();
  });
});
