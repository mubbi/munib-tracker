import { averageRating, clampRating, groupByDate, type KhushuEntry } from "@/lib/khushu";

function entry(date: string, prayerId: KhushuEntry["prayerId"], rating: number): KhushuEntry {
  return {
    id: `${date}:${prayerId}`,
    date,
    prayerId,
    rating,
    createdAt: `${date}T00:00:00.000Z`,
    updatedAt: `${date}T00:00:00.000Z`,
  };
}

describe("khushu journal (NF-2.12)", () => {
  it("averages ratings and returns null when empty", () => {
    expect(averageRating([])).toBeNull();
    expect(averageRating([entry("2026-07-01", "fajr", 4), entry("2026-07-01", "dhuhr", 2)])).toBe(
      3,
    );
  });

  it("groups entries by date, newest first", () => {
    const groups = groupByDate([
      entry("2026-07-01", "fajr", 3),
      entry("2026-07-03", "asr", 5),
      entry("2026-07-01", "dhuhr", 4),
    ]);
    expect(groups.map((g) => g.date)).toEqual(["2026-07-03", "2026-07-01"]);
    expect(groups[1]?.entries).toHaveLength(2);
  });

  it("clamps ratings into the 1–5 range", () => {
    expect(clampRating(0)).toBe(1);
    expect(clampRating(9)).toBe(5);
    expect(clampRating(3.4)).toBe(3);
  });
});
