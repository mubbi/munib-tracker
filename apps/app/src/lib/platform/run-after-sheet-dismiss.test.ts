import { usePlatform } from "@/test-support/platform";

import { runAfterSheetDismiss } from "./run-after-sheet-dismiss";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe.each([
  ["iOS", "ios" as const, 400],
  ["Android", "android" as const, 400],
])("on %s", (_name, OS, delay) => {
  usePlatform({ OS });

  it("waits for the sheet to finish dismissing", () => {
    const action = jest.fn();
    runAfterSheetDismiss(action);
    jest.advanceTimersByTime(delay - 1);
    expect(action).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(action).toHaveBeenCalled();
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });

  it("runs immediately", () => {
    const action = jest.fn();
    runAfterSheetDismiss(action);
    expect(action).toHaveBeenCalled();
  });
});
