import {
  normalizeWidgetInfo,
  refreshRegisteredAndroidWidgets,
  registerAndroidWidgetTaskHandler,
} from "@/lib/appSurfaces/widgets/androidTaskHandler";
import { normalizeWidgetInfo as direct } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";
import { usePlatform } from "@/test-support/platform";

jest.mock("@/lib/external-commands/native-bridge", () => ({
  nativeSendWidgetMarkBroadcast: jest.fn(),
}));

it("re-exports normalizeWidgetInfo", () => {
  expect(normalizeWidgetInfo).toBe(direct);
});

describe.each([
  ["iOS", { OS: "ios" as const }],
  ["Android TV", { OS: "android" as const, isTV: true }],
])("on %s", (_name, platform) => {
  usePlatform(platform);

  it("does not register a task handler", () => {
    expect(registerAndroidWidgetTaskHandler()).toBeUndefined();
  });

  it("does not refresh widgets", async () => {
    await expect(refreshRegisteredAndroidWidgets()).resolves.toBeUndefined();
  });
});

describe("on Android phones without the widget runtime", () => {
  usePlatform({ OS: "android", isTV: false });

  it("registers without throwing", async () => {
    expect(() => registerAndroidWidgetTaskHandler()).not.toThrow();
    await new Promise((r) => setImmediate(r));
  });

  it("swallows refresh failures", async () => {
    await expect(refreshRegisteredAndroidWidgets()).resolves.toBeUndefined();
  });
});
