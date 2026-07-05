import { computeZakat } from "@/lib/zakat";

describe("computeZakat", () => {
  it("returns 2.5% when net wealth meets nisab", () => {
    const r = computeZakat({ cash: 10000, debts: 2000 }, 5000);
    expect(r.netWealth).toBe(8000);
    expect(r.meetsNisab).toBe(true);
    expect(r.due).toBe(200); // 2.5% of 8000
  });

  it("owes nothing below nisab", () => {
    const r = computeZakat({ cash: 3000 }, 5000);
    expect(r.meetsNisab).toBe(false);
    expect(r.due).toBe(0);
  });

  it("clamps negatives and sums all asset types", () => {
    const r = computeZakat(
      { cash: 1000, gold: 2000, silver: 500, business: 1000, otherAssets: 500, debts: -100 },
      1000,
    );
    expect(r.netWealth).toBe(5000);
    expect(r.due).toBe(125);
  });
});
