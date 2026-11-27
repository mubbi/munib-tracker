import { addMonthsToDay, dueDayPresets, isValidDay, normalizeDayInput } from "./day";

describe("records day helpers", () => {
  it("accepts only real calendar days", () => {
    expect(isValidDay("2026-11-23")).toBe(true);
    expect(isValidDay("2026-02-30")).toBe(false);
    expect(isValidDay("23-11-2026")).toBe(false);
    expect(isValidDay("")).toBe(false);
  });

  it("normalises forgiving input to YYYY-MM-DD", () => {
    expect(normalizeDayInput("2026-11-23")).toBe("2026-11-23");
    expect(normalizeDayInput(" 2026/1/5 ")).toBe("2026-01-05");
    expect(normalizeDayInput("2026.12.31")).toBe("2026-12-31");
    // Arabic-Indic and Persian digits (ar / ur / fa keyboards).
    expect(normalizeDayInput("٢٠٢٦-١١-٢٣")).toBe("2026-11-23");
    expect(normalizeDayInput("۲۰۲۶/۱/۵")).toBe("2026-01-05");
  });

  it("rejects impossible or day-first dates rather than guessing", () => {
    expect(normalizeDayInput("2026-02-30")).toBeNull();
    expect(normalizeDayInput("05/01/2026")).toBeNull();
    expect(normalizeDayInput("tomorrow")).toBeNull();
  });

  it("adds months, clamping to the end of a shorter month", () => {
    expect(addMonthsToDay("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonthsToDay("2028-01-31", 1)).toBe("2028-02-29");
    expect(addMonthsToDay("2026-11-23", 3)).toBe("2027-02-23");
  });

  it("offers week / month / three-month due-date presets", () => {
    expect(dueDayPresets("2026-11-23")).toEqual([
      { id: "week", day: "2026-11-30" },
      { id: "month", day: "2026-12-23" },
      { id: "threeMonths", day: "2027-02-23" },
    ]);
  });
});
