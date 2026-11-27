import { INITIAL_CHECK, isBusy, reduceCheck } from "./session";

describe("reduceCheck (pronunciation take state machine)", () => {
  it("runs idle → preparing → listening → assessing → result", () => {
    let s = reduceCheck(INITIAL_CHECK, { type: "prepare" });
    expect(s.status).toBe("preparing");
    s = reduceCheck(s, { type: "listening", at: 5 });
    expect(s).toMatchObject({ status: "listening", startedAt: 5 });
    expect(isBusy(s)).toBe(true);
    s = reduceCheck(s, { type: "stop", capped: true });
    expect(s).toMatchObject({ status: "assessing", capped: true });
    s = reduceCheck(s, { type: "assessed", verdicts: [{ index: 0, state: "clear" }] });
    expect(s.status).toBe("result");
    expect(isBusy(s)).toBe(false);
  });

  it("ends in no-fit instead of marks when the take doesn't fit", () => {
    let s = reduceCheck(INITIAL_CHECK, { type: "prepare" });
    s = reduceCheck(s, { type: "listening", at: 1 });
    s = reduceCheck(s, { type: "stop" });
    s = reduceCheck(s, { type: "no-fit", reason: "different-passage" });
    expect(s).toMatchObject({ status: "no-fit", noFit: "different-passage", verdicts: null });
  });

  it("stopping while preparing goes back to idle", () => {
    const s = reduceCheck(reduceCheck(INITIAL_CHECK, { type: "prepare" }), { type: "stop" });
    expect(s).toEqual(INITIAL_CHECK);
  });

  it("ignores out-of-order events and records failures", () => {
    expect(reduceCheck(INITIAL_CHECK, { type: "assessed", verdicts: [] })).toBe(INITIAL_CHECK);
    expect(reduceCheck(INITIAL_CHECK, { type: "stop" })).toBe(INITIAL_CHECK);
    const failed = reduceCheck(INITIAL_CHECK, { type: "failed", code: "mic-denied" });
    expect(failed).toMatchObject({ status: "error", error: "mic-denied" });
    expect(reduceCheck(failed, { type: "reset" })).toEqual(INITIAL_CHECK);
  });
});
