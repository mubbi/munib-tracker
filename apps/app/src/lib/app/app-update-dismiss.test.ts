import { setAppVersionInfo } from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMemoryStorage, installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

import {
  dismissSoftUpdate,
  isSoftUpdateDismissed,
  isSoftUpdateDismissedSync,
  markWebSoftUpdateDismissedSync,
  SOFT_UPDATE_DISMISSED_KEY,
} from "./app-update-dismiss";

beforeEach(async () => {
  await AsyncStorage.clear();
  setAppVersionInfo("1.0.0", "ios");
});

describe("on native", () => {
  it("is not dismissed for an empty version", async () => {
    expect(await isSoftUpdateDismissed("")).toBe(false);
    expect(isSoftUpdateDismissedSync("")).toBe(false);
  });

  it("remembers a dismissal per platform and version", async () => {
    await dismissSoftUpdate("1.2.0");
    expect(await isSoftUpdateDismissed("1.2.0")).toBe(true);
    expect(await isSoftUpdateDismissed("1.3.0")).toBe(false);
    expect(JSON.parse((await AsyncStorage.getItem(SOFT_UPDATE_DISMISSED_KEY)) as string)).toEqual({
      "ios:1.2.0": "1",
    });
  });

  it("keeps earlier dismissals", async () => {
    await dismissSoftUpdate("1.2.0");
    await dismissSoftUpdate("1.3.0");
    expect(await isSoftUpdateDismissed("1.2.0")).toBe(true);
  });

  it("ignores an empty version", async () => {
    await dismissSoftUpdate("");
    expect(await AsyncStorage.getItem(SOFT_UPDATE_DISMISSED_KEY)).toBeNull();
  });

  it("treats corrupt storage as not dismissed", async () => {
    await AsyncStorage.setItem(SOFT_UPDATE_DISMISSED_KEY, "{bad");
    expect(await isSoftUpdateDismissed("1.2.0")).toBe(false);
    await expect(dismissSoftUpdate("1.2.0")).resolves.toBeUndefined();
  });

  it("does not use the synchronous web store", () => {
    markWebSoftUpdateDismissedSync("1.2.0");
    expect(isSoftUpdateDismissedSync("1.2.0")).toBe(false);
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });
  let storage: ReturnType<typeof createMemoryStorage>;
  let restore: () => void = () => {};

  beforeEach(() => {
    setAppVersionInfo("1.0.0", "web");
    storage = createMemoryStorage();
    restore = installBrowser({ window: { localStorage: storage } });
  });
  afterEach(() => restore());

  it("persists the dismissal synchronously in localStorage", () => {
    markWebSoftUpdateDismissedSync("1.2.0");
    expect(JSON.parse(storage.data.get(SOFT_UPDATE_DISMISSED_KEY) as string)).toEqual({
      "web:1.2.0": "1",
    });
    expect(isSoftUpdateDismissedSync("1.2.0")).toBe(true);
  });

  it("answers from localStorage before AsyncStorage", async () => {
    markWebSoftUpdateDismissedSync("1.2.0");
    jest.mocked(AsyncStorage.getItem).mockClear();
    expect(await isSoftUpdateDismissed("1.2.0")).toBe(true);
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });

  it("tolerates corrupt localStorage", () => {
    storage.data.set(SOFT_UPDATE_DISMISSED_KEY, "{bad");
    expect(isSoftUpdateDismissedSync("1.2.0")).toBe(false);
  });

  it("ignores an empty version", () => {
    markWebSoftUpdateDismissedSync("");
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
