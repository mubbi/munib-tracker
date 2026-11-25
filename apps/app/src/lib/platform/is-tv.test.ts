import { isAndroidTV, isFireTV, isTV } from "@/lib/platform/is-tv";
import { usePlatformSwitch } from "@/test-support/platform";

describe("TV platform detection", () => {
  const onPlatform = usePlatformSwitch();

  it("is not TV on a phone", () => {
    onPlatform({
      OS: "android",
      isTV: false,
      constants: { Manufacturer: "Amazon", Model: "KFTRWI" },
    });
    expect(isTV()).toBe(false);
    expect(isFireTV()).toBe(false);
    expect(isAndroidTV()).toBe(false);
  });

  it.each([
    [{ Manufacturer: "Amazon", Model: "AFTKA" }],
    [{ Manufacturer: "amazon", Model: "AFTSSS" }],
    [{ Manufacturer: "Toshiba", Model: "AFTDCT31" }],
  ])("detects Fire TV from %j", (constants) => {
    onPlatform({ OS: "android", isTV: true, constants });
    expect(isFireTV()).toBe(true);
    expect(isAndroidTV()).toBe(false);
  });

  it("treats other Leanback devices as Android TV", () => {
    onPlatform({
      OS: "android",
      isTV: true,
      constants: { Manufacturer: "Google", Model: "Chromecast" },
    });
    expect(isFireTV()).toBe(false);
    expect(isAndroidTV()).toBe(true);
  });

  it("never reports Fire TV / Android TV on Apple TV", () => {
    onPlatform({ OS: "ios", isTV: true });
    expect(isTV()).toBe(true);
    expect(isFireTV()).toBe(false);
    expect(isAndroidTV()).toBe(false);
  });
});
