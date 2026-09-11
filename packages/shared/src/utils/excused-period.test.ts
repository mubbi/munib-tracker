import { describe, expect, it } from "vitest";
import { makePrayerLog as log } from "../test-support/factories";
import {
  datesNeedingExcuseCarryForward,
  excusedReasonForDate,
  inferExcusedReasonFromYesterday,
} from "./excused-period";

describe.concurrent("excusedReasonForDate", () => {
  it("returns null when the day has no excused logs", () => {
    expect(excusedReasonForDate([log("2026-07-03", "fajr", "completed")], "2026-07-03")).toBeNull();
  });

  it("returns the excused reason for the day", () => {
    const logs = [log("2026-07-03", "fajr", "pending", { isExcused: true, excusedReason: "hayd" })];
    expect(excusedReasonForDate(logs, "2026-07-03")).toBe("hayd");
  });

  it("defaults a missing excused reason to sick", () => {
    const logs = [log("2026-07-03", "fajr", "pending", { isExcused: true })];
    expect(excusedReasonForDate(logs, "2026-07-03")).toBe("sick");
  });
});

describe.concurrent("inferExcusedReasonFromYesterday", () => {
  it("reads only yesterday", () => {
    const logs = [
      log("2026-07-01", "fajr", "pending", { isExcused: true, excusedReason: "hayd" }),
      log("2026-07-02", "fajr", "pending", { isExcused: true, excusedReason: "sick" }),
    ];
    expect(inferExcusedReasonFromYesterday(logs, "2026-07-03")).toBe("sick");
  });

  it("returns null when yesterday was not excused", () => {
    const logs = [log("2026-07-02", "fajr", "completed")];
    expect(inferExcusedReasonFromYesterday(logs, "2026-07-03")).toBeNull();
  });
});

describe.concurrent("datesNeedingExcuseCarryForward", () => {
  it("includes only today when there is no prior excused anchor", () => {
    expect(datesNeedingExcuseCarryForward([], "2026-07-03")).toEqual(["2026-07-03"]);
  });

  it("fills empty gap days back to an existing excused day", () => {
    const logs = [log("2026-07-01", "fajr", "pending", { isExcused: true, excusedReason: "hayd" })];
    expect(datesNeedingExcuseCarryForward(logs, "2026-07-03")).toEqual([
      "2026-07-03",
      "2026-07-02",
    ]);
  });

  it("does not backfill past a logged non-excused day", () => {
    const logs = [log("2026-07-02", "fajr", "completed")];
    expect(datesNeedingExcuseCarryForward(logs, "2026-07-03")).toEqual(["2026-07-03"]);
  });

  it("still flags today when today already has non-excuse logs", () => {
    const logs = [log("2026-07-03", "fajr", "completed")];
    expect(datesNeedingExcuseCarryForward(logs, "2026-07-03")).toEqual(["2026-07-03"]);
  });

  it("returns nothing when today is already excused", () => {
    const logs = [log("2026-07-03", "fajr", "pending", { isExcused: true, excusedReason: "hayd" })];
    expect(datesNeedingExcuseCarryForward(logs, "2026-07-03")).toEqual([]);
  });
});
