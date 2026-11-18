import { usePlatform } from "@/test-support/platform";

import {
  hasExactAlarmPermission,
  requestExactAlarmPermission,
  supportsPreciseAdhan,
} from "./exact-alarm";

describe.each([
  ["iOS", { OS: "ios" as const }],
  ["Android TV", { OS: "android" as const, isTV: true }],
])("on %s", (_name, platform) => {
  usePlatform(platform);

  it("does not support precise adhan", async () => {
    expect(supportsPreciseAdhan()).toBe(false);
    expect(await hasExactAlarmPermission()).toBe(false);
    expect(await requestExactAlarmPermission()).toBe(false);
  });
});

describe("on Android phones", () => {
  usePlatform({ OS: "android", isTV: false });

  it("supports precise adhan", () => {
    expect(supportsPreciseAdhan()).toBe(true);
  });

  it("reports no permission when the notifications module cannot load", async () => {
    expect(await hasExactAlarmPermission()).toBe(false);
    expect(await requestExactAlarmPermission()).toBe(false);
  });
});
