import { getFiqhDifference } from "@munib-tracker/shared/fiqh";

import { groupPositions, otherPositions } from "./position-groups";

const WITR = getFiqhDifference("witr.status");

describe("groupPositions", () => {
  it("groups schools that share a position, in catalog order", () => {
    expect(groupPositions(WITR).map((g) => g.schools)).toEqual([
      ["hanafi"],
      ["shafii", "maliki", "hanbali"],
    ]);
  });

  it("keeps every school separate when all four differ", () => {
    expect(groupPositions(getFiqhDifference("witr.form"))).toHaveLength(4);
  });

  it("respects a school subset", () => {
    expect(groupPositions(WITR, ["maliki", "hanbali"]).map((g) => g.schools)).toEqual([
      ["maliki", "hanbali"],
    ]);
  });
});

describe("otherPositions", () => {
  it("separates schools sharing the selected view from the differing ones", () => {
    expect(otherPositions(WITR, "shafii")).toEqual({
      sameView: ["maliki", "hanbali"],
      differing: [{ schools: ["hanafi"], summaryKey: WITR.positions.hanafi.summaryKey }],
    });
  });

  it("groups the differing views for a school that stands alone", () => {
    const { sameView, differing } = otherPositions(WITR, "hanafi");
    expect(sameView).toEqual([]);
    expect(differing.map((g) => g.schools)).toEqual([["shafii", "maliki", "hanbali"]]);
  });
});
