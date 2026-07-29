import { noteFor } from "@/components/moon-phase-sheet";

describe("noteFor", () => {
  it("prioritizes White Days over month-turn on days 13–15", () => {
    expect(noteFor(15, 30, "full")).toBe("whiteDays");
  });

  it("flags the start of a new Islamic month", () => {
    expect(noteFor(1, 30, "waxingCrescent")).toBe("newMonth");
    expect(noteFor(2, 29, "new")).toBe("newMonth");
  });

  it("flags the last two days as crescent-sighting nights", () => {
    expect(noteFor(29, 30, "new")).toBe("monthTurn");
    expect(noteFor(30, 30, "waxingCrescent")).toBe("monthTurn");
    expect(noteFor(28, 29, "waningCrescent")).toBe("monthTurn");
  });

  it("falls back to full or general mid-month", () => {
    expect(noteFor(10, 30, "full")).toBe("full");
    expect(noteFor(10, 30, "waxingGibbous")).toBe("general");
  });
});
