import {
  camelZakatDue,
  cattleZakatDue,
  computeAgricultureDue,
  computeZakat,
  goldPureGrams,
  goldValueFromWeight,
  lowerNisab,
  metalValue,
  nisabFromGoldPrice,
  nisabFromSilverPrice,
  sheepZakatDue,
  silverFineGrams,
  silverValueFromWeight,
  toGrams,
} from "@/lib/zakat";

describe("computeZakat", () => {
  it("returns 2.5% when net wealth meets nisab", () => {
    const r = computeZakat({ cash: 10000, debts: 2000 }, 5000);
    expect(r.netWealth).toBe(8000);
    expect(r.meetsNisab).toBe(true);
    expect(r.due).toBe(200);
    expect(r.wealthDue).toBe(200);
    expect(r.totalDue).toBe(200);
  });

  it("owes nothing below nisab", () => {
    const r = computeZakat({ cash: 3000 }, 5000);
    expect(r.meetsNisab).toBe(false);
    expect(r.due).toBe(0);
  });

  it("includes property and trade vehicles in gross", () => {
    const r = computeZakat(
      {
        cash: 1000,
        investmentPlots: 2000,
        installmentPlotsPaid: 500,
        investmentProperty: 1000,
        tradeVehicles: 500,
      },
      1000,
    );
    expect(r.netWealth).toBe(5000);
    expect(r.due).toBe(125);
  });

  it("adds ushr and optional livestock cash to totalDue", () => {
    const r = computeZakat({ cash: 10000 }, 1000, {
      agriculture: { harvestValue: 1000, irrigation: "natural" },
      livestock: { sheep: 40, sheepValue: 200 },
    });
    expect(r.wealthDue).toBe(250);
    expect(r.agricultureDue).toBe(100);
    expect(r.livestockAnimals.sheep).toBe(1);
    expect(r.livestockCashEstimate).toBe(200);
    expect(r.totalDue).toBe(550);
  });

  it("uses 5% ushr for irrigated crops", () => {
    expect(computeAgricultureDue({ harvestValue: 2000, irrigation: "irrigated" })).toBe(100);
  });
});

describe("metal unit conversions", () => {
  it("converts tola and karat into pure gold value", () => {
    // 1 tola of 22k at 100/g 24k spot
    const pure = goldPureGrams(1, "tola", 22);
    expect(pure).toBeCloseTo(11.6638038 * (22 / 24), 5);
    expect(goldValueFromWeight(1, "tola", 22, 100)).toBeCloseTo(pure * 100, 5);
  });

  it("converts silver purity", () => {
    expect(silverFineGrams(10, "g", 925)).toBeCloseTo(9.25);
    expect(silverValueFromWeight(10, "g", 925, 2)).toBeCloseTo(18.5);
  });

  it("converts oz and kg to grams", () => {
    expect(toGrams(1, "oz")).toBeCloseTo(31.1034768);
    expect(toGrams(1, "kg")).toBe(1000);
  });
});

describe("livestock scales", () => {
  it("computes sheep brackets", () => {
    expect(sheepZakatDue(39)).toBe(0);
    expect(sheepZakatDue(40)).toBe(1);
    expect(sheepZakatDue(121)).toBe(2);
    expect(sheepZakatDue(400)).toBe(4);
  });

  it("computes cattle tabi/musinnah", () => {
    expect(cattleZakatDue(30)).toEqual({ tabi: 1, musinnah: 0 });
    expect(cattleZakatDue(40)).toEqual({ tabi: 0, musinnah: 1 });
    expect(cattleZakatDue(60)).toEqual({ tabi: 2, musinnah: 0 });
  });

  it("computes camel early brackets", () => {
    expect(camelZakatDue(5).sheep).toBe(1);
    expect(camelZakatDue(25).bintMakhad).toBe(1);
    expect(camelZakatDue(36).bintLabun).toBe(1);
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
