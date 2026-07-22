import { describe, expect, it } from "@jest/globals";

import { computeFidyahEstimate } from "./fidyah";

describe("computeFidyahEstimate", () => {
  it("multiplies days by meal cost for fidyah", () => {
    const result = computeFidyahEstimate({ scenario: "fidyah", days: 10, mealCost: 5 });
    expect(result.mealsDue).toBe(10);
    expect(result.amountEstimate).toBe(50);
    expect(result.consecutiveFastDays).toBeNull();
  });

  it("uses sixty meals per unit for kaffarah feeding option", () => {
    const result = computeFidyahEstimate({ scenario: "kaffarah", days: 1, mealCost: 4 });
    expect(result.mealsDue).toBe(60);
    expect(result.amountEstimate).toBe(240);
    expect(result.consecutiveFastDays).toBe(60);
  });

  it("clamps negative inputs", () => {
    const result = computeFidyahEstimate({ scenario: "fidyah", days: -3, mealCost: -2 });
    expect(result.days).toBe(0);
    expect(result.mealCost).toBe(0);
    expect(result.amountEstimate).toBe(0);
  });
});
