import {
  calculateAllSchools,
  calculateMirath,
  type MirathHeirShare,
  type MirathInput,
} from "@munib-tracker/shared/mirath";

import { estateInputFrom } from "./estate";
import {
  compareCell,
  compareRowCount,
  compareTableHeirs,
  debtsExceedEstate,
  heirAmountLine,
  heirBarWidthPercent,
  partitionHeirs,
} from "./results-view";

const usd = (gross: number, debts = 0) => ({
  gross,
  funeral: 0,
  debts,
  bequests: 0,
  currency: "USD",
});
const male = (heirs: MirathInput["heirs"], estate?: MirathInput["estate"]): MirathInput => ({
  school: "hanafi",
  deceased: { gender: "male" },
  heirs,
  ...(estate && { estate }),
});
const shareOf = (input: MirathInput, heir: MirathHeirShare["heir"]) => {
  const share = calculateMirath(input).heirs.find((h) => h.heir === heir);
  if (!share) throw new Error(`no ${heir} row`);
  return share;
};

describe("mirath results view helpers", () => {
  it("partitions inheriting heirs from excluded ones, keeping engine order", () => {
    // A son excludes the full brother.
    const { inheriting, excluded } = partitionHeirs(
      calculateMirath(male({ son: 1, full_brother: 1 })),
    );
    expect(inheriting.map((h) => h.heir)).toEqual(["son"]);
    expect(excluded.map((h) => h.heir)).toEqual(["full_brother"]);
  });

  it("flags debts above the estate", () => {
    expect(debtsExceedEstate(calculateMirath(male({ son: 2 }, usd(100, 150))))).toBe(true);
    expect(debtsExceedEstate(calculateMirath(male({ son: 2 }, usd(100, 50))))).toBe(false);
  });

  it("clamps the share bar to 1–100%", () => {
    expect(heirBarWidthPercent(0.2)).toBe(1);
    expect(heirBarWidthPercent(37.5)).toBe(37.5);
    expect(heirBarWidthPercent(120)).toBe(100);
  });

  describe("heirAmountLine", () => {
    it("is null without an estate amount", () => {
      expect(heirAmountLine(shareOf(male({ son: 1 }), "son"))).toBeNull();
    });

    it("is null for an excluded heir", () => {
      expect(
        heirAmountLine(shareOf(male({ son: 1, full_brother: 1 }, usd(100)), "full_brother")),
      ).toBeNull();
    });

    it("shows a single amount for one heir", () => {
      expect(heirAmountLine(shareOf(male({ son: 1 }, usd(100)), "son"))).toEqual({
        kind: "total",
        amount: 100,
      });
    });

    it("shows the per-head amount when the group divides evenly", () => {
      expect(heirAmountLine(shareOf(male({ son: 2 }, usd(100)), "son"))).toEqual({
        kind: "each",
        amount: 100,
        each: 50,
      });
    });

    it("shows a per-head range when the cents don't divide evenly", () => {
      // Four wives share ⅛ of 100 = 12.50 → 3.12–3.13 each.
      expect(heirAmountLine(shareOf(male({ wife: 4, son: 1 }, usd(100)), "wife"))).toEqual({
        kind: "range",
        amount: 12.5,
        low: 3.12,
        high: 3.13,
      });
    });
  });

  describe("four-school table", () => {
    const results = calculateAllSchools({
      deceased: { gender: "male" },
      heirs: { wife: 2, son: 1 },
    });

    it("lists the counted heirs in canonical order", () => {
      expect(compareTableHeirs(results)).toEqual(["wife", "son"]);
    });

    it("reads the head count per row, defaulting to 1", () => {
      expect(compareRowCount(results, "wife")).toBe(2);
      expect(compareRowCount(results, "son")).toBe(1);
      expect(compareRowCount(results, "mother")).toBe(1);
    });

    it("renders each school's fraction, or a dash when the heir gets nothing", () => {
      expect(compareCell(results, "maliki", "wife")).toBe("1/8");
      expect(compareCell(results, "shafii", "son")).toBe("7/8");
      expect(compareCell(results, "hanbali", "mother")).toBe("—");
    });
  });
});

describe("estateInputFrom", () => {
  it("stays undefined until a positive gross is entered", () => {
    expect(estateInputFrom({}, "USD")).toBeUndefined();
    expect(estateInputFrom({ gross: 0, debts: 10 }, "USD")).toBeUndefined();
  });

  it("fills blank deductions with 0 and carries the currency", () => {
    expect(estateInputFrom({ gross: 1000, debts: 200 }, "GBP")).toEqual({
      gross: 1000,
      funeral: 0,
      debts: 200,
      bequests: 0,
      currency: "GBP",
    });
  });
});
