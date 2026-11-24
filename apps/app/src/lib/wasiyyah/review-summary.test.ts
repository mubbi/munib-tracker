import { wasiyyahSummaryLine } from "./review-summary";
import { emptyWasiyyahData } from "./wasiyyah";

const K = "privateUx.wasiyyah.summary";
const base = emptyWasiyyahData("2026-11-23", "USD");

describe("wasiyyahSummaryLine", () => {
  it("flags a missing testator name and shows the name once given", () => {
    expect(wasiyyahSummaryLine("testator", base)).toMatchObject({
      key: `${K}.nameMissing`,
      missing: true,
    });
    expect(
      wasiyyahSummaryLine("testator", {
        ...base,
        testator: { name: " Aminah ", date: "2026-11-23" },
      }),
    ).toMatchObject({ key: null, text: "Aminah" });
  });

  it("flags an unreadable testator date (it blocks saving)", () => {
    expect(
      wasiyyahSummaryLine("testator", {
        ...base,
        testator: { name: "Aminah", date: "2026-02-30" },
      }),
    ).toMatchObject({ key: `${K}.dateInvalid`, missing: true });
  });

  it("counts confirmed debt lines and says when there are none", () => {
    expect(wasiyyahSummaryLine("debts", base).key).toBe(`${K}.none`);
    const debts = [
      { id: "a", source: "debt", label: "Bilal", confirmed: true },
      { id: "b", source: "debt", label: "Yusuf", confirmed: false },
    ] as never;
    expect(wasiyyahSummaryLine("debts", { ...base, debts })).toMatchObject({
      key: `${K}.confirmed`,
      values: { done: 1, total: 2 },
    });
  });

  it("lists guardians and the executor as typed, and counts named witnesses", () => {
    expect(
      wasiyyahSummaryLine("people", { ...base, guardians: ["Ali", " "], executor: "Umar" }),
    ).toMatchObject({ key: null, text: "Ali, Umar" });
    expect(wasiyyahSummaryLine("witnesses", { ...base, witnesses: ["Ali", ""] })).toMatchObject({
      key: `${K}.named`,
      values: { done: 1, total: 2 },
    });
  });

  it("reports whether an inheritance calculation is attached", () => {
    expect(wasiyyahSummaryLine("distribution", base).key).toBe(`${K}.noSnapshot`);
    expect(wasiyyahSummaryLine("distribution", { ...base, mirathSnapshot: {} as never }).key).toBe(
      `${K}.snapshot`,
    );
  });
});
