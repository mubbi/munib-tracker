import { MADHHAB_RULES } from "@munib-tracker/shared/fiqh";

import type { ZakatCalculatorDraft } from "@/db/repositories/zakat-calculator-repository";

import {
  ALL_VIEWS_ZAKAT_FIQH,
  buildObligationsSummary,
  estimateZakatDueFromDraft,
  estimateZakatFromDraft,
  type ZakatFiqhInput,
} from "./obligations";

const school = (id: keyof typeof MADHHAB_RULES): ZakatFiqhInput => ({
  zakat: MADHHAB_RULES[id].zakat,
  customBasis: null,
});

function zakatDraft(overrides: Partial<ZakatCalculatorDraft> = {}): ZakatCalculatorDraft {
  return {
    currencyCode: "USD",
    numberFormat: "comma_dot",
    values: { cash: "10,000" },
    nisab: "5,000",
    nisabManual: true,
    goldWeight: "",
    goldUnit: "g",
    goldKarat: 24,
    goldPrice: "",
    silverWeight: "",
    silverUnit: "g",
    silverPurity: 999,
    silverPrice: "",
    nisabGoldPrice: "",
    nisabSilverPrice: "",
    pricesManual: true,
    sheepCount: "",
    cattleCount: "",
    camelCount: "",
    sheepValue: "",
    cattleValue: "",
    camelValue: "",
    harvestValue: "",
    irrigation: "natural",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("estimateZakatDueFromDraft", () => {
  it("applies 2.5% above nisab and 0 below / without a draft", () => {
    expect(estimateZakatDueFromDraft(zakatDraft())).toBe(250);
    expect(estimateZakatDueFromDraft(zakatDraft({ values: { cash: "1,000" } }))).toBe(0);
    expect(estimateZakatDueFromDraft(null)).toBe(0);
  });

  describe("madhhab-aware, same setup as /zakat (§4.1.4 zakat row)", () => {
    it("counts personal jewellery only where the school holds it zakatable", () => {
      const draft = zakatDraft({ values: { cash: "10,000", personalJewellery: "2,000" } });
      expect(estimateZakatDueFromDraft(draft, school("hanafi"))).toBe(300);
      expect(estimateZakatDueFromDraft(draft, school("shafii"))).toBe(250);
      expect(estimateZakatDueFromDraft(draft, school("maliki"))).toBe(250);
      // All views: the /zakat headline counts it (rows show the amount without it).
      expect(estimateZakatDueFromDraft(draft, ALL_VIEWS_ZAKAT_FIQH)).toBe(300);
    });

    it("uses the school's nisab basis instead of always the lower nisab", () => {
      // Gold nisab 87.48 g × 100 = 8,748; silver nisab 612.36 g × 1 = 612.36.
      const draft = zakatDraft({
        values: { cash: "5,000" },
        nisabManual: false,
        nisabGoldPrice: "100",
        nisabSilverPrice: "1",
      });
      expect(estimateZakatFromDraft(draft, school("hanafi"))).toEqual({
        due: 125,
        basis: "lower",
        allViews: false,
      });
      expect(estimateZakatFromDraft(draft, school("shafii"))).toEqual({
        due: 0,
        basis: "gold",
        allViews: false,
      });
      // All views: the user's saved basis, else lower — and the line says which.
      expect(estimateZakatFromDraft(draft)).toEqual({ due: 125, basis: "lower", allViews: true });
      expect(estimateZakatFromDraft(draft, { zakat: null, customBasis: "gold" })).toEqual({
        due: 0,
        basis: "gold",
        allViews: true,
      });
    });

    it("applies the gold + silver combining rule", () => {
      const draft = zakatDraft({
        values: { gold: "5,000", silver: "5,000" },
        nisabManual: false,
        nisabGoldPrice: "100",
        nisabSilverPrice: "1",
      });
      // Hanafi pools gold and silver by value: 10,000 ≥ nisab.
      expect(estimateZakatDueFromDraft(draft, school("hanafi"))).toBe(250);
      // Shafi'i keeps them apart: gold 5,000 < 8,748 (nothing); silver 5,000 ≥ 612.36.
      expect(estimateZakatDueFromDraft(draft, school("shafii"))).toBe(125);
    });
  });
});

describe("buildObligationsSummary", () => {
  it("lists qaza, fasts, zakat, fidyah/kaffarah and vows that are outstanding", () => {
    const lines = buildObligationsSummary({
      qazaCounters: [
        { prayerId: "fajr", remaining: 3, completed: 0 },
        { prayerId: "isha", remaining: 2, completed: 1 },
      ],
      roza: { remaining: 4 },
      zakatDraft: zakatDraft(),
      fidyahDraft: {
        currencyCode: "USD",
        scenario: "kaffarah",
        days: "1",
        mealCost: "5",
        updatedAt: "",
      },
      unfulfilledVows: 1,
    });
    expect(lines).toEqual([
      { id: "qaza_salah", count: 5, route: "/qaza" },
      { id: "qaza_fast", count: 4, route: "/qaza" },
      {
        id: "zakat",
        amount: 250,
        currency: "USD",
        route: "/zakat",
        zakatBasis: "lower",
        zakatAllViews: true,
      },
      { id: "kaffarah", count: 1, amount: 300, currency: "USD", route: "/fidyah" },
      { id: "vows", count: 1, route: "/debts" },
    ]);
  });

  it("is empty when nothing is owed", () => {
    expect(
      buildObligationsSummary({
        qazaCounters: [],
        roza: { remaining: 0 },
        zakatDraft: null,
        fidyahDraft: null,
        unfulfilledVows: 0,
      }),
    ).toEqual([]);
  });
});
