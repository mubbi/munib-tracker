import { hijriToGregorian } from "@/lib/hijri";
import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";
import type { PlatformOverrides } from "@/test-support/platform";

type Sync = typeof import("./sync");
type Native = typeof import("./native");

function fakeModule(initial: string | null = null) {
  let current = initial;
  return {
    isSupported: jest.fn(async () => true),
    getIconName: jest.fn(async () => current),
    setIconName: jest.fn(async (name: string | null) => {
      const changed = name !== current;
      current = name;
      return changed;
    }),
  };
}

let restore: () => void = () => {};
afterEach(() => restore());

function load(
  module: ReturnType<typeof fakeModule> | null,
  platform: PlatformOverrides,
): { sync: Sync; native: Native } {
  const loaded = loadOnPlatformWithNativeModules(
    platform,
    module ? { MunibAppIcon: module } : {},
    () => ({ sync: require("./sync") as Sync, native: require("./native") as Native }),
  );
  restore = loaded.restore;
  return loaded.module;
}

function noonOnHijri(year: number, month: number, day: number): Date {
  const d = hijriToGregorian(year, month, day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

const RAMADAN = noonOnHijri(1448, 9, 5);
const RAJAB = noonOnHijri(1448, 7, 10);

describe("syncAppIcon", () => {
  it.each<PlatformOverrides>([{ OS: "web" }, { OS: "android", isTV: true }])(
    "is a no-op without the native module (%o)",
    async (platform) => {
      const { sync, native } = load(fakeModule(), platform);
      expect(native.isAppIconModuleAvailable()).toBe(false);
      await expect(
        sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" }),
      ).resolves.toBe("unsupported");
    },
  );

  it("reports unsupported when the binary predates the module", async () => {
    const { sync } = load(null, { OS: "ios" });
    await expect(sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" })).resolves.toBe(
      "unsupported",
    );
  });

  it("switches to the season's icon once, then leaves it alone on every resume", async () => {
    const mod = fakeModule();
    const { sync } = load(mod, { OS: "ios" });
    await expect(sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" })).resolves.toBe(
      "changed",
    );
    expect(mod.setIconName).toHaveBeenCalledWith("ramadan");
    await expect(sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" })).resolves.toBe(
      "unchanged",
    );
    expect(mod.setIconName).toHaveBeenCalledTimes(1);
  });

  it("goes back to the classic icon when the season ends", async () => {
    const mod = fakeModule("eidAdha");
    const { sync } = load(mod, { OS: "android" });
    await expect(sync.syncAppIcon("seasonal", { now: RAJAB, appState: "active" })).resolves.toBe(
      "changed",
    );
    expect(mod.setIconName).toHaveBeenCalledWith(null);
  });

  it("honours classic and fixed choices", async () => {
    const mod = fakeModule("ramadan");
    const { sync } = load(mod, { OS: "android" });
    await sync.syncAppIcon("classic", { now: RAMADAN, appState: "active" });
    expect(mod.setIconName).toHaveBeenLastCalledWith(null);
    await sync.syncAppIcon("hajj", { now: RAMADAN, appState: "active" });
    expect(mod.setIconName).toHaveBeenLastCalledWith("hajj");
  });

  it("serialises racing calls so the last preference wins without a duplicate request", async () => {
    const mod = fakeModule();
    const { sync } = load(mod, { OS: "android" });
    const results = await Promise.all([
      sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" }),
      sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" }),
      sync.syncAppIcon("eidFitr", { now: RAMADAN, appState: "active" }),
    ]);
    expect(results).toEqual(["changed", "unchanged", "changed"]);
    expect(mod.setIconName.mock.calls).toEqual([["ramadan"], ["eidFitr"]]);
  });

  it("waits for the foreground on iOS (setAlternateIconName needs an active app)", async () => {
    const mod = fakeModule();
    const { sync } = load(mod, { OS: "ios" });
    await expect(
      sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "background" }),
    ).resolves.toBe("deferred");
    expect(mod.setIconName).not.toHaveBeenCalled();
  });

  it("queues the Android swap from the background too (the module applies it there)", async () => {
    const mod = fakeModule();
    const { sync } = load(mod, { OS: "android" });
    await expect(
      sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "background" }),
    ).resolves.toBe("changed");
  });

  it("never surfaces a native failure", async () => {
    const mod = fakeModule();
    mod.setIconName.mockRejectedValueOnce(new Error("ERR_APP_ICON_INACTIVE"));
    const { sync } = load(mod, { OS: "ios" });
    await expect(sync.syncAppIcon("seasonal", { now: RAMADAN, appState: "active" })).resolves.toBe(
      "failed",
    );
  });
});
