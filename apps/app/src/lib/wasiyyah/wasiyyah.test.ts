import type { WasiyyahBequest, WasiyyahData, WasiyyahDebtLine } from "@munib-tracker/shared/types";

import { makeDebt, makeVow } from "@/lib/debts/test-fixtures";

import {
  canSaveWasiyyah,
  computeWasiyyah,
  emptyWasiyyahData,
  importDebtLines,
  importTrustLines,
  normalizeWasiyyahData,
  openIOweTotal,
} from "./wasiyyah";

function will(overrides: Partial<WasiyyahData> = {}): WasiyyahData {
  return {
    ...emptyWasiyyahData("2026-11-23", "USD"),
    testator: { name: "Aminah", date: "2026-11-23" },
    witnesses: ["Ali", "Umar"],
    ...overrides,
  };
}
const bequest = (o: Partial<WasiyyahBequest>): WasiyyahBequest => ({
  id: "b1",
  beneficiary: "Masjid fund",
  kind: "charity",
  isHeir: false,
  ...o,
});
const line = (o: Partial<WasiyyahDebtLine>): WasiyyahDebtLine => ({
  id: "l1",
  source: "debt",
  label: "Yusuf",
  confirmed: true,
  currency: "USD",
  ...o,
});
const codes = (issues: { code: string }[]) => issues.map((i) => i.code);

describe("computeWasiyyah — funeral → debts → bequests ≤ ⅓ (Bukhari 2742)", () => {
  it("passes a bequest exactly at one-third of the net", () => {
    const c = computeWasiyyah(
      will({
        estimatedEstate: 10_000,
        funeralCost: 400,
        debts: [line({ amount: 600 })],
        bequests: [bequest({ amount: 3000 })],
      }),
      "hanafi",
    );
    expect(c.limitView).toMatchObject({ netAfterDebts: 9000, limit: 3000, used: 3000, room: 0 });
    expect(c.errors).toEqual([]);
    expect(canSaveWasiyyah(c)).toBe(true);
  });

  it("blocks bequests over one-third (excess needs heirs' consent)", () => {
    const c = computeWasiyyah(
      will({ estimatedEstate: 9000, bequests: [bequest({ amount: 3001 })] }),
      "shafii",
    );
    expect(codes(c.errors)).toContain("over_third");
    expect(canSaveWasiyyah(c)).toBe(false);
  });

  it("checks percent bequests against the net and without an estate", () => {
    expect(
      codes(computeWasiyyah(will({ bequests: [bequest({ percent: 34 })] }), null).errors),
    ).toContain("over_third");
    expect(computeWasiyyah(will({ bequests: [bequest({ percent: 33 })] }), null).errors).toEqual(
      [],
    );
  });

  it("warns that fixed amounts need an estimated estate", () => {
    const c = computeWasiyyah(will({ bequests: [bequest({ amount: 100 })] }), "hanbali");
    expect(codes(c.warnings)).toContain("estate_needed");
    expect(c.errors).toEqual([]);
  });

  it("ignores unconfirmed and other-currency lines (warned), counts are not money", () => {
    const c = computeWasiyyah(
      will({
        estimatedEstate: 1000,
        debts: [
          line({ id: "a", amount: 100 }),
          line({ id: "b", amount: 50, confirmed: false }),
          line({ id: "c", amount: 70, currency: "GBP" }),
          line({ id: "d", source: "qaza_salah", count: 12, currency: undefined }),
        ],
      }),
      "shafii",
    );
    expect(c.debtsToPeople).toBe(100);
    expect(c.excludedLines).toBe(1);
    expect(codes(c.warnings)).toContain("lines_excluded");
  });

  it("warns when funeral and debts exceed the estate", () => {
    const c = computeWasiyyah(
      will({ estimatedEstate: 100, debts: [line({ amount: 200 })] }),
      "maliki",
    );
    expect(codes(c.warnings)).toContain("debts_exceed_estate");
    expect(c.limitView?.limit).toBe(0);
  });
});

describe("computeWasiyyah — madhhab: zakat / kaffarah still owed (wasiyyah.debtsToAllah)", () => {
  const data = will({
    estimatedEstate: 9300,
    debts: [line({ source: "zakat", amount: 300, label: "" })],
    bequests: [bequest({ amount: 2900 })],
  });

  it("Shafi'i / Hanbali: from the whole estate first", () => {
    const c = computeWasiyyah(data, "shafii");
    expect(c.limitView).toMatchObject({
      view: "capital",
      netAfterDebts: 9000,
      limit: 3000,
      used: 2900,
    });
    expect(c.errors).toEqual([]);
  });

  it("Hanafi / Maliki: from the one-third (counts against the bequests)", () => {
    const c = computeWasiyyah(data, "hanafi");
    expect(c.limitView).toMatchObject({
      view: "third",
      netAfterDebts: 9300,
      limit: 3100,
      used: 3200,
    });
    expect(codes(c.errors)).toContain("over_third");
  });

  it("all views: applies the stricter result and labels it", () => {
    const c = computeWasiyyah(data, null);
    expect(c.applied).toBe("stricter");
    expect(c.limitView?.view).toBe("third");
  });
});

describe("computeWasiyyah — no bequest to an heir (Abu Dawud 2870, Tirmidhi 2120)", () => {
  it("blocks until acknowledged, then keeps a printed consent note", () => {
    const heir = bequest({
      id: "h",
      beneficiary: "Son",
      kind: "person",
      isHeir: true,
      heirType: "son",
    });
    expect(codes(computeWasiyyah(will({ bequests: [heir] }), "hanafi").errors)).toEqual([
      "heir_unacknowledged",
    ]);
    const ack = computeWasiyyah(
      will({ bequests: [{ ...heir, heirAcknowledged: true }] }),
      "hanafi",
    );
    expect(ack.errors).toEqual([]);
    expect(ack.warnings).toContainEqual({ code: "heir_bequest", bequestId: "h" });
  });
});

describe("required sections and witnesses", () => {
  it("requires the testator's name and nudges for two witnesses", () => {
    const c = computeWasiyyah(
      will({ testator: { name: " ", date: "2026-11-23" }, witnesses: ["Ali", ""] }),
      null,
    );
    expect(codes(c.errors)).toEqual(["testator_name_required"]);
    expect(codes(c.warnings)).toContain("witnesses_missing");
  });
});

describe("import from the debts record (NF-3.8)", () => {
  const debts = [
    makeDebt({ id: "d1", amount: 100, payments: [{ id: "p", date: "2026-11-02", amount: 40 }] }),
    makeDebt({ id: "d2", direction: "owed_to_me" }),
    makeDebt({ id: "d3", status: "settled" }),
    makeDebt({ id: "t1", direction: "trust_held", amount: undefined, item: "Ring" }),
  ];

  it("imports open 'I owe' balances, obligations and vows, keeping confirmations and manual lines", () => {
    const manual = line({ id: "m", source: "manual", label: "Other" });
    const first = importDebtLines([manual], {
      debts,
      obligations: [
        { id: "qaza_salah", count: 7, route: "/qaza" },
        { id: "zakat", amount: 250, currency: "USD", route: "/zakat" },
        { id: "vows", count: 1, route: "/debts" },
      ],
      vows: [makeVow(), makeVow({ id: "v2", fulfilled: true })],
    });
    expect(first.map((l) => [l.source, l.amount ?? l.count ?? null])).toEqual([
      ["debt", 60],
      ["qaza_salah", 7],
      ["zakat", 250],
      ["vow", null],
      ["manual", null],
    ]);
    const confirmed = first.map((l) => ({ ...l, confirmed: true }));
    const again = importDebtLines(confirmed, { debts, obligations: [], vows: [] });
    expect(again.find((l) => l.source === "debt")?.confirmed).toBe(true);
    expect(again.some((l) => l.source === "zakat")).toBe(false);
  });

  it("imports trusts I hold", () => {
    expect(importTrustLines([], debts)).toEqual([
      { id: "trust:t1", sourceId: "t1", counterparty: "Yusuf", item: "Ring", confirmed: false },
    ]);
  });

  it("totals open debts in one currency for the review snapshot", () => {
    expect(openIOweTotal(debts, "USD")).toBe(60);
  });
});

describe("normalizeWasiyyahData", () => {
  it("trims and drops empty bequests / guardians", () => {
    const n = normalizeWasiyyahData(
      will({ guardians: [" Ali ", ""], bequests: [bequest({ beneficiary: "  " })], executor: " " }),
    );
    expect(n.guardians).toEqual(["Ali"]);
    expect(n.bequests).toEqual([]);
    expect(n.executor).toBeUndefined();
  });
});
