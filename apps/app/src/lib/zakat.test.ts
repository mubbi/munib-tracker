import {
  computeZakat,
  lowerNisab,
  metalValue,
  nisabFromGoldPrice,
  nisabFromSilverPrice,
} from "@/lib/zakat";

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
      {
        cash: 1000,
        gold: 2000,
        silver: 500,
        stocks: 1000,
        business: 1000,
        receivables: 500,
        rentalIncome: 500,
        otherAssets: 500,
        debts: -100,
      },
      1000,
    );
    expect(r.netWealth).toBe(7000);
    expect(r.due).toBe(175);
  });
});

describe("nisab helpers", () => {
  it("computes metal value from grams and price", () => {
    expect(metalValue(10, 50)).toBe(500);
    expect(metalValue(-5, 50)).toBe(0);
  });

  it("derives nisab from spot prices", () => {
    expect(nisabFromGoldPrice(100)).toBe(8748);
    expect(nisabFromSilverPrice(1)).toBe(612.36);
  });

  it("picks the lower positive nisab", () => {
    expect(lowerNisab(8748, 612)).toBe(612);
    expect(lowerNisab(0, 500)).toBe(500);
    expect(lowerNisab(0, 0)).toBe(0);
  });
});
