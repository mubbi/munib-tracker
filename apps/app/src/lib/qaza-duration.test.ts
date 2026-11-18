import i18n from "@/i18n";

import { formatDurationParts, formatQazaDailyTime, formatQazaDuration } from "./qaza-duration";

const t = ((
  key: string,
  opts?: { count?: number; first?: string; second?: string; third?: string },
) => {
  const count = opts?.count ?? 0;
  if (key === "qazaPlan.durationYears") return count === 1 ? "1 year" : `${count} years`;
  if (key === "qazaPlan.durationMonths") return count === 1 ? "1 month" : `${count} months`;
  if (key === "qazaPlan.durationDays") return count === 1 ? "1 day" : `${count} days`;
  if (key === "qazaPlan.durationTwo") return `${opts?.first} and ${opts?.second}`;
  if (key === "qazaPlan.durationThree") {
    return `${opts?.first}, ${opts?.second} and ${opts?.third}`;
  }
  return key;
}) as never;

describe("formatDurationParts", () => {
  it("formats years, months, and days", () => {
    expect(formatDurationParts({ years: 19, months: 2, days: 12 }, t)).toBe(
      "19 years, 2 months and 12 days",
    );
  });

  it("omits zero years and months", () => {
    expect(formatDurationParts({ years: 0, months: 0, days: 12 }, t)).toBe("12 days");
    expect(formatDurationParts({ years: 0, months: 2, days: 5 }, t)).toBe("2 months and 5 days");
  });
});

describe("formatDurationParts edge cases", () => {
  it("shows zero days for an empty duration", () => {
    expect(formatDurationParts({ years: 0, months: 0, days: 0 }, t)).toBe("0 days");
  });

  it("joins years and months without days", () => {
    expect(formatDurationParts({ years: 1, months: 1, days: 0 }, t)).toBe("1 year and 1 month");
  });
});

describe("formatQazaDuration", () => {
  it("breaks a day count into English years, months and days", () => {
    expect(formatQazaDuration(400, i18n.t)).toMatch(/^1 year, 1 month and \d+ days?$/);
  });
});

describe("formatQazaDailyTime", () => {
  it.each([
    [0, "—"],
    [-5, "—"],
    [45, "≈ 45 min"],
    [120, "≈ 2 hr"],
    [95, "≈ 1 hr 35 min"],
  ])("%p minutes → %s", (minutes, expected) => {
    expect(formatQazaDailyTime(minutes, i18n.t)).toBe(expected);
  });
});
